// @vitest-environment node
//
// The published weekly plan, over HTTP. Another app (the Main Hub dashboard)
// shows today's workout from this route, so what it answers is a contract now:
// a caller's own calendar day, the plan as this app decides it, and no personal
// data of any kind.
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SERVER = fileURLToPath(new URL("./index.js", import.meta.url));
const PORT = 4500 + Math.floor(Math.random() * 200);
const BASE = `http://127.0.0.1:${PORT}`;

let child;
let dataDir;

beforeAll(async () => {
  dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "wellness-plan-"));
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
    if (Date.now() > deadline) throw new Error("plan server did not start");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}, 30000);

afterAll(async () => {
  child?.kill();
  if (dataDir) await fs.rm(dataDir, { recursive: true, force: true });
});

describe("GET /api/weekly-plan", () => {
  it("answers for the day the caller asked about", async () => {
    // 2026-09-16 is a Wednesday.
    const response = await fetch(`${BASE}/api/weekly-plan?date=2026-09-16`);
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.date).toBe("2026-09-16");
    expect(payload.today.day).toBe("Wednesday");
    expect(payload.today.theme).toBe("Strength");
    expect(payload.today.focus).toBe("Core & Lower Body Burn");
    expect(payload.today.items[0].name).toBe("Workout 2 — Core & Lower Body Burn");
    // The route name as a link into this app, so a caller need not know how the
    // hash routing is spelled.
    expect(payload.today.items[0].path).toBe("/#/workout-sets");
    expect(payload.week).toHaveLength(7);
    expect(payload.week[0].day).toBe("Monday");
  });

  it("falls back to this server's day when no date is given", async () => {
    const payload = await (await fetch(`${BASE}/api/weekly-plan`)).json();
    const now = new Date();
    const expected = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    expect(payload.date).toBe(expected);
  });

  it("is readable from a browser page on another origin", async () => {
    const response = await fetch(`${BASE}/api/weekly-plan`);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("refuses a date it cannot read rather than guessing one", async () => {
    const response = await fetch(`${BASE}/api/weekly-plan?date=not-a-day`);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/YYYY-MM-DD/);
  });

  it("is read-only", async () => {
    const response = await fetch(`${BASE}/api/weekly-plan`, { method: "POST" });
    expect(response.status).toBe(405);
  });

  it("publishes the rota and nothing else", async () => {
    // A route that answers without a token has to stay a rota: the fields are
    // named here so that anything new on a plan entry is a decision rather than
    // something that leaks out on the next edit to the data file.
    const payload = await (await fetch(`${BASE}/api/weekly-plan`)).json();
    expect(Object.keys(payload).sort()).toEqual(["date", "today", "week"]);

    for (const day of payload.week) {
      expect(Object.keys(day).sort()).toEqual([
        "color",
        "day",
        "emoji",
        "focus",
        "items",
        "short",
        "theme",
      ]);
      for (const item of day.items) {
        expect(Object.keys(item).sort()).toEqual(["detail", "emoji", "name", "path", "screen"]);
      }
    }
  });
});
