// @vitest-environment node
//
// Today's focuses, read back over HTTP. The Main Hub dashboard shows them at
// the top of its morning page, so what this answers is a contract: only to a
// sync code, only for the day the caller asked about, and only the few fields
// a pill needs.
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localDay } from "../src/utils/localDay.js";

const SERVER = fileURLToPath(new URL("./index.js", import.meta.url));
const PORT = 4700 + Math.floor(Math.random() * 200);
const BASE = `http://127.0.0.1:${PORT}`;
const CODE = "focus-test-code";

let child;
let dataDir;

/** Put a focus document on the server the way a device's sync push would. */
async function sync(value, code = CODE) {
  const response = await fetch(`${BASE}/api/sync/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ log: [], docs: { dailyFocus: { value, updatedAt: Date.now() } } }),
  });
  expect(response.status).toBe(200);
}

// The app stamps a focus list with `localDay()` — "Sun Sep 20 2026" — not with
// the "2026-09-20" a caller asks in. Every fixture below is built through the
// same function the app uses, so the two spellings can never quietly drift
// apart again: a route that compared the raw strings answered "nothing picked
// today" forever, and a fixture written in the caller's spelling agreed with it.
const APP_DAY = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return localDay(new Date(year, month - 1, day));
};

const read = (query = "", headers = { "x-sync-code": CODE }) =>
  fetch(`${BASE}/api/daily-focus${query}`, { headers });

const today = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

beforeAll(async () => {
  dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "wellness-focus-"));
  child = spawn(process.execPath, [SERVER], {
    env: { ...process.env, PORT: String(PORT), DATA_DIR: dataDir, DATABASE_URL: "" },
    stdio: "ignore",
  });
  const deadline = Date.now() + 15000;
  for (;;) {
    try {
      const response = await fetch(`${BASE}/api/health`);
      if (response.ok) break;
    } catch {
      // not listening yet
    }
    if (Date.now() > deadline) throw new Error("focus server did not start");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}, 30000);

afterAll(async () => {
  child?.kill();
  if (dataDir) await fs.rm(dataDir, { recursive: true, force: true });
});

describe("GET /api/daily-focus", () => {
  it("answers with what was picked for the day the caller asked about", async () => {
    await sync({
      day: APP_DAY("2026-09-16"),
      focuses: [
        { id: "stretch:hips", name: "Hips", source: "stretch" },
        { id: "simple:wall-sit", name: "Wall Sit", source: "simple" },
        { id: "trigger:upper-trap-left", name: "Upper Trapezius", source: "trigger" },
      ],
    });

    const response = await read("?date=2026-09-16");
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.date).toBe("2026-09-16");
    expect(payload.focuses.map((focus) => focus.name)).toEqual([
      "Hips",
      "Wall Sit",
      "Upper Trapezius",
    ]);
    // Each one carries the way into the app it came from, so the pill can be
    // tapped straight through to the stretch, the exercise or the body map.
    expect(payload.focuses.map((focus) => focus.path)).toEqual([
      "/#/stretch",
      "/#/simple/wall-sit",
      "/#/trigger-points",
    ]);
  });

  it("does not show another day's picks as today's", async () => {
    await sync({ day: APP_DAY("2026-09-16"), focuses: [{ id: "stretch:hips", name: "Hips" }] });

    const payload = await (await read("?date=2026-09-17")).json();
    expect(payload.date).toBe("2026-09-17");
    expect(payload.focuses).toEqual([]);
  });

  it("says plainly that nothing was picked today", async () => {
    await sync({ day: APP_DAY("2026-09-16"), focuses: [] });

    const response = await read("?date=2026-09-16");
    expect(response.status).toBe(200);
    expect((await response.json()).focuses).toEqual([]);
  });

  it("finds a focus stored the way the app stores it", async () => {
    // The regression this route shipped with: the app stamps the list with
    // `localDay()` and the route compared that to "YYYY-MM-DD", so a focus
    // picked on the phone never came back. Stored here through the app's own
    // function, for today, and asked for the same way the hub asks.
    await sync({ day: localDay(), focuses: [{ id: "stretch:neck", name: "Neck", source: "stretch" }] });

    const payload = await (await read(`?date=${today()}`)).json();
    expect(payload.focuses.map((focus) => focus.name)).toEqual(["Neck"]);
  });

  it("falls back to this server's day when no date is given", async () => {
    const payload = await (await read()).json();
    expect(payload.date).toBe(today());
  });

  it("refuses to answer without a sync code", async () => {
    const response = await read("", {});
    expect(response.status).toBe(401);
    expect((await response.json()).error).toMatch(/sync code/i);
  });

  it("refuses a sync code that is not one", async () => {
    const response = await read("", { "x-sync-code": "../etc" });
    expect(response.status).toBe(401);
  });

  it("says a code that has never synced a focus is not set up rather than empty", async () => {
    const response = await read("", { "x-sync-code": "never-synced-code" });
    expect(response.status).toBe(404);
  });

  it("refuses a date it cannot read rather than guessing one", async () => {
    const response = await read("?date=not-a-day");
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/YYYY-MM-DD/);
  });

  it("is read-only", async () => {
    const response = await fetch(`${BASE}/api/daily-focus`, {
      method: "POST",
      headers: { "x-sync-code": CODE },
    });
    expect(response.status).toBe(405);
  });

  it("publishes the picks and nothing else", async () => {
    // The document also holds an image search term per focus, and the muscle
    // and side of a trigger point. None of that is a pill's business, so the
    // fields are named here: anything new on a focus is a decision rather than
    // something that leaks out on the next edit.
    await sync({
      day: APP_DAY("2026-09-16"),
      focuses: [
        {
          id: "trigger:upper-trap-left",
          name: "Upper Trapezius",
          source: "trigger",
          triggerPointKey: "upper-trap",
          hotspotId: "upper-trap-left",
          side: "left",
        },
      ],
    });

    const payload = await (await read("?date=2026-09-16")).json();
    expect(Object.keys(payload).sort()).toEqual(["date", "focuses", "updatedAt"]);
    expect(Object.keys(payload.focuses[0]).sort()).toEqual(["id", "name", "path", "source"]);
  });
});
