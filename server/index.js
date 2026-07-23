// Tiny zero-dependency server for the Wellness Tracker.
//
// It does two jobs:
//   1. Serves the built static app from ../dist (single-page app).
//   2. Exposes a small "sync by code" API so a person can see the same activity
//      log on their phone and their desktop. There are no accounts: anyone who
//      knows a code shares that code's log. Pick something unguessable.
//
// Storage is one JSON file per code under DATA_DIR. On a platform with an
// ephemeral filesystem (e.g. Railway without a volume) the data survives while
// the container is alive but resets on redeploy — mount a persistent volume at
// DATA_DIR to keep logs across deploys.

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeActivityLogs } from "../src/utils/mergeActivityLog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB — generous for a personal log.

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

// Serialize writes for a given code so two near-simultaneous PUTs can't
// clobber each other (read-modify-write race).
const codeLocks = new Map();
function withCodeLock(code, task) {
  const previous = codeLocks.get(code) || Promise.resolve();
  const next = previous.then(task, task);
  // Keep the chain alive but don't let a rejection poison later callers.
  codeLocks.set(
    code,
    next.catch(() => {})
  );
  return next;
}

function dataFileFor(code) {
  return path.join(DATA_DIR, `${code}.json`);
}

async function readStoredLog(code) {
  try {
    const raw = await fs.readFile(dataFileFor(code), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.log) ? parsed.log : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeStoredLog(code, log) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload = JSON.stringify({ log, updatedAt: Date.now() });
  const target = dataFileFor(code);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  // Write to a temp file then rename so a crash mid-write can't corrupt data.
  await fs.writeFile(tmp, payload);
  await fs.rename(tmp, target);
}

function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
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

async function handleSync(req, res, code) {
  if (req.method === "GET") {
    const log = await readStoredLog(code);
    sendJson(res, 200, { log });
    return;
  }

  if (req.method === "PUT" || req.method === "POST") {
    const raw = await readBody(req);
    let incoming;
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      incoming = Array.isArray(parsed) ? parsed : parsed.log;
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body" });
      return;
    }
    if (!Array.isArray(incoming)) {
      sendJson(res, 400, { error: "Body must be a log array or { log: [...] }" });
      return;
    }

    const merged = await withCodeLock(code, async () => {
      const stored = await readStoredLog(code);
      const result = mergeActivityLogs(stored, incoming);
      await writeStoredLog(code, result);
      return result;
    });
    sendJson(res, 200, { log: merged });
    return;
  }

  res.writeHead(405, { Allow: "GET, PUT" });
  res.end();
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
    const { pathname } = new URL(req.url, "http://localhost");

    if (pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
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
  console.log(`Wellness Tracker listening on :${PORT} (data dir: ${DATA_DIR})`);
});
