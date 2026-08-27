// @vitest-environment node
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SERVER = fileURLToPath(new URL("./index.js", import.meta.url));
const PORT = 4173 + Math.floor(Math.random() * 200);
const BASE = `http://127.0.0.1:${PORT}`;

let child;
let dataDir;

// Boot the real server against a throwaway data directory (no DATABASE_URL, so
// it uses the JSON file store) and talk to it over HTTP.
beforeAll(async () => {
  dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "wellness-sync-"));
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
    if (Date.now() > deadline) throw new Error("sync server did not start");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}, 30000);

afterAll(async () => {
  child?.kill();
  if (dataDir) await fs.rm(dataDir, { recursive: true, force: true });
});

const put = (code, body) =>
  fetch(`${BASE}/api/sync/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("sync API", () => {
  it("stores the sets/reps plans and custom routines alongside the log", async () => {
    const code = "plans-round-trip";
    const plans = { "builtin-1::1": { setCount: 4, repCount: 8 } };

    const saved = await put(code, {
      log: [{ id: "a1", ts: 1000, updatedAt: 1000, name: "Workout" }],
      docs: {
        plans: { value: plans, updatedAt: 50 },
        customWorkouts: { value: [{ id: "c1", title: "Mine" }], updatedAt: 50 },
      },
    });
    expect(saved.status).toBe(200);

    // A second device pulls and sees both the log and the plans.
    const pulled = await (await fetch(`${BASE}/api/sync/${code}`)).json();
    expect(pulled.log).toHaveLength(1);
    expect(pulled.docs.plans.value).toEqual(plans);
    expect(pulled.docs.customWorkouts.value[0].title).toBe("Mine");
  });

  it("keeps the newest edit of a plan when two devices disagree", async () => {
    const code = "plans-conflict";
    await put(code, { log: [], docs: { plans: { value: { a: 1 }, updatedAt: 200 } } });

    // A stale device pushes an older copy: the newer one survives.
    const stale = await (
      await put(code, { log: [], docs: { plans: { value: { a: 0 }, updatedAt: 100 } } })
    ).json();
    expect(stale.docs.plans).toEqual({ value: { a: 1 }, updatedAt: 200 });

    const fresher = await (
      await put(code, { log: [], docs: { plans: { value: { a: 2 }, updatedAt: 300 } } })
    ).json();
    expect(fresher.docs.plans).toEqual({ value: { a: 2 }, updatedAt: 300 });
  });

  it("still accepts a bare log from an older app version", async () => {
    const code = "legacy-body";
    const response = await put(code, [{ id: "a1", ts: 1, updatedAt: 1 }]);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.log).toHaveLength(1);
    expect(body.docs).toEqual({});
  });

  it("rejects a body that is neither a log nor a sync payload", async () => {
    const response = await put("bad-body", { nope: true });
    expect(response.status).toBe(400);
  });

  it("rejects a code that could escape the data directory", async () => {
    const response = await fetch(`${BASE}/api/sync/${encodeURIComponent("../etc")}`);
    expect(response.status).toBe(400);
  });
});
