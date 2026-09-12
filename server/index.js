// Tiny zero-dependency server for the Wellness Tracker.
//
// It does three jobs:
//   1. Serves the built static app from ../dist (single-page app).
//   2. Exposes a small "sync by code" API so a person can see the same activity
//      log, sets/reps plans, and custom routines on their phone and their
//      desktop. There are no accounts: anyone who knows a code shares that
//      code's data. Pick something unguessable.
//   3. Publishes the fixed weekly schedule at GET /api/weekly-plan, so another
//      app can show what today's workout is without keeping a second copy of
//      the plan that quietly drifts from this one.
//
// Storage is Postgres when DATABASE_URL is set, and one JSON file per code under
// DATA_DIR otherwise (see server/store.js). Prefer Postgres in production: on a
// platform with an ephemeral filesystem (e.g. Railway without a volume) the file
// store survives while the container is alive but resets on redeploy.

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeActivityLogs } from "../src/utils/mergeActivityLog.js";
import { mergeSyncDocs } from "../src/utils/mergeSyncDocs.js";
import { weeklyPlan } from "../src/data/weeklyPlan.js";
import { parseCalendarDay, planForDate } from "../src/utils/weeklyPlanDay.js";
import { createStore } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB — generous for a personal log.

// Postgres when DATABASE_URL is set, JSON files under DATA_DIR otherwise.
const store = await createStore({ dataDir: DATA_DIR });

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

// Codes are user-chosen shared secrets used verbatim as filenames, so restrict
// them to a safe character set and length to prevent path traversal.
function normalizeCode(raw) {
  const code = String(raw || "").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{3,63}$/.test(code) ? code : null;
}

function sendJson(res, status, body, headers = {}) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// A PUT body may be a bare log array or `{ log }` (what older app versions
// sent), or `{ log, docs }` — docs being the sets/reps plans and the custom
// routines, each `{ value, updatedAt }`.
function parseSyncBody(raw) {
  const parsed = raw ? JSON.parse(raw) : {};
  if (Array.isArray(parsed)) return { log: parsed, docs: {} };
  if (!parsed || typeof parsed !== "object") return null;
  if (!Array.isArray(parsed.log)) return null;
  return {
    log: parsed.log,
    docs: parsed.docs && typeof parsed.docs === "object" ? parsed.docs : {},
  };
}

async function handleSync(req, res, code) {
  if (req.method === "GET") {
    const record = await store.read(code);
    sendJson(res, 200, record);
    return;
  }

  if (req.method === "PUT" || req.method === "POST") {
    const raw = await readBody(req);
    let incoming;
    try {
      incoming = parseSyncBody(raw);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body" });
      return;
    }
    if (!incoming) {
      sendJson(res, 400, { error: "Body must be a log array or { log: [...], docs: {...} }" });
      return;
    }

    const merged = await store.update(code, (stored) => ({
      log: mergeActivityLogs(stored.log, incoming.log),
      docs: mergeSyncDocs(stored.docs, incoming.docs),
    }));
    sendJson(res, 200, merged);
    return;
  }

  res.writeHead(405, { Allow: "GET, PUT" });
  res.end();
}

// ─── The weekly plan, published ─────────────────────────────────────────────
//
// The schedule is this app's to decide, and it is read straight out of
// src/data/weeklyPlan.js so there is exactly one copy of it. Everything here is
// a fixed rota — no log, no code, nothing personal — which is why it answers
// without a token and carries an open CORS header: the Main Hub dashboard reads
// it from its own server, and a browser page may read it too.
//
// `screen` is the app's own route name; `path` is that route as a link into
// this app, so a caller can send someone straight to the exercise rather than
// having to know how the hash routing is spelled.
function publicPlanDay(plan) {
  return {
    day: plan.day,
    short: plan.short,
    theme: plan.theme,
    emoji: plan.emoji,
    color: plan.color,
    focus: plan.focus,
    items: plan.items.map((item) => ({
      emoji: item.emoji,
      name: item.name,
      detail: item.detail,
      screen: item.screen,
      path: item.screen ? `/#/${item.screen}` : null,
    })),
  };
}

function handleWeeklyPlan(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET" });
    res.end();
    return;
  }

  // A caller may ask for its own calendar day rather than this container's —
  // the hub asking is in Vancouver and this server is on UTC, so "today" is a
  // question only the caller can answer for itself.
  const requested = url.searchParams.get("date");
  const date = requested === null ? new Date() : parseCalendarDay(requested);
  if (!date) {
    sendJson(res, 400, { error: "date must be YYYY-MM-DD." });
    return;
  }

  const dateKey = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  sendJson(
    res,
    200,
    {
      date: dateKey,
      today: publicPlanDay(planForDate(date)),
      week: weeklyPlan.map(publicPlanDay),
    },
    { "Access-Control-Allow-Origin": "*" },
  );
}

async function serveStatic(req, res) {
  // Hash-based routing means every non-file request should return index.html.
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relative = urlPath.replace(/^\/+/, "");
  const candidate = relative ? path.join(DIST_DIR, relative) : path.join(DIST_DIR, "index.html");
  const resolved = path.resolve(candidate);

  // Never serve anything outside dist, regardless of the request path.
  if (resolved !== DIST_DIR && !resolved.startsWith(DIST_DIR + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(resolved);
    const filePath = stat.isDirectory() ? path.join(resolved, "index.html") : resolved;
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    // Unknown path → let the SPA handle routing.
    try {
      const fallback = await fs.readFile(path.join(DIST_DIR, "index.html"));
      res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
      res.end(fallback);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const { pathname } = url;

    if (pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname === "/api/weekly-plan") {
      handleWeeklyPlan(req, res, url);
      return;
    }

    const syncMatch = pathname.match(/^\/api\/sync\/([^/]+)\/?$/);
    if (syncMatch) {
      const code = normalizeCode(decodeURIComponent(syncMatch[1]));
      if (!code) {
        sendJson(res, 400, {
          error: "Code must be 4–64 characters: letters, numbers or hyphens.",
        });
        return;
      }
      await handleSync(req, res, code);
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(res, 404, { error: "Unknown endpoint" });
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    const status = error.statusCode || 500;
    if (!res.headersSent) sendJson(res, status, { error: error.message || "Server error" });
    else res.end();
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Wellness Tracker listening on :${PORT} (storage: ${store.description})`);
});
