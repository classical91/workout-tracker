// Where a sync code's data lives.
//
// Two interchangeable backends:
//   * Postgres, used when DATABASE_URL is set. This is what keeps a log, the
//     sets/reps plans, and custom routines around across redeploys and across
//     devices — the app's own filesystem on a platform like Railway is
//     ephemeral, so a file store quietly loses everything on the next deploy.
//   * A JSON file per code under DATA_DIR, used when there is no DATABASE_URL,
//     which keeps local development and offline-ish self-hosting dependency-free.
//
// Both expose the same tiny interface: read(code) and update(code, mutate),
// where `mutate` gets the stored record and returns the record to save. The
// update is serialized per code so two devices pushing at once can't clobber
// each other with a read-modify-write race.

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export const EMPTY_RECORD = { log: [], docs: {} };

function normalizeRecord(record) {
  return {
    log: Array.isArray(record?.log) ? record.log : [],
    docs: record?.docs && typeof record.docs === "object" ? record.docs : {},
  };
}

// Serialize work for a given code so near-simultaneous writes queue up.
function createLocks() {
  const locks = new Map();
  return function withLock(code, task) {
    const previous = locks.get(code) || Promise.resolve();
    const next = previous.then(task, task);
    // Keep the chain alive but don't let a rejection poison later callers.
    locks.set(
      code,
      next.catch(() => {})
    );
    return next;
  };
}

function createFileStore({ dataDir }) {
  const withLock = createLocks();
  const fileFor = (code) => path.join(dataDir, `${code}.json`);

  async function read(code) {
    try {
      const raw = await fs.readFile(fileFor(code), "utf8");
      return normalizeRecord(JSON.parse(raw));
    } catch (error) {
      if (error.code === "ENOENT") return { ...EMPTY_RECORD };
      throw error;
    }
  }

  async function write(code, record) {
    await fs.mkdir(dataDir, { recursive: true });
    const payload = JSON.stringify({ ...record, updatedAt: Date.now() });
    const target = fileFor(code);
    const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
    // Write to a temp file then rename so a crash mid-write can't corrupt data.
    await fs.writeFile(tmp, payload);
    await fs.rename(tmp, target);
  }

  return {
    kind: "file",
    description: `JSON files in ${dataDir}`,
    read,
    update: (code, mutate) =>
      withLock(code, async () => {
        const stored = await read(code);
        const next = normalizeRecord(await mutate(stored));
        await write(code, next);
        return next;
      }),
    close: async () => {},
  };
}

// The sync code is a shared secret the user picked, so store only its hash —
// a leaked database dump then doesn't hand out access to anyone's log.
const hashCode = (code) => createHash("sha256").update(String(code)).digest("hex");

async function createPostgresStore({ databaseUrl }) {
  // Imported lazily so the server still starts (on the file store) in an
  // install without the pg dependency.
  const { default: pg } = await import("pg");
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl);
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    // Managed Postgres (Railway, Neon, Supabase…) terminates TLS with a cert
    // chain the container doesn't carry; local databases speak plain TCP.
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: Number(process.env.PGPOOL_MAX) || 5,
  });

  let ready;
  const ensureSchema = () =>
    (ready ||= pool.query(`CREATE TABLE IF NOT EXISTS wellness_sync (
      code_hash TEXT PRIMARY KEY,
      record JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`));

  async function read(code) {
    await ensureSchema();
    const result = await pool.query("SELECT record FROM wellness_sync WHERE code_hash = $1", [
      hashCode(code),
    ]);
    return result.rowCount ? normalizeRecord(result.rows[0].record) : { ...EMPTY_RECORD };
  }

  async function update(code, mutate) {
    await ensureSchema();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const hash = hashCode(code);
      // Take the row lock first (creating the row if this code is new) so a
      // concurrent push waits rather than overwriting what we just read.
      await client.query(
        `INSERT INTO wellness_sync (code_hash, record) VALUES ($1, $2::jsonb)
         ON CONFLICT (code_hash) DO NOTHING`,
        [hash, JSON.stringify(EMPTY_RECORD)]
      );
      const current = await client.query(
        "SELECT record FROM wellness_sync WHERE code_hash = $1 FOR UPDATE",
        [hash]
      );
      const stored = normalizeRecord(current.rows[0]?.record);
      const next = normalizeRecord(await mutate(stored));
      await client.query(
        "UPDATE wellness_sync SET record = $2::jsonb, updated_at = NOW() WHERE code_hash = $1",
        [hash, JSON.stringify(next)]
      );
      await client.query("COMMIT");
      return next;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  return {
    kind: "postgres",
    description: "Postgres (DATABASE_URL)",
    read,
    update,
    close: () => pool.end(),
  };
}

// Pick a backend. Falls back to the file store — with a loud warning — if a
// DATABASE_URL is set but Postgres can't be reached, so a database hiccup
// degrades to local-only sync instead of taking the whole app down.
export async function createStore({
  databaseUrl = process.env.DATABASE_URL,
  dataDir = path.resolve(process.env.DATA_DIR || "data"),
} = {}) {
  if (databaseUrl) {
    try {
      const store = await createPostgresStore({ databaseUrl });
      // Fail fast here rather than on the user's first sync request.
      await store.read("connection-check");
      return store;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Postgres unavailable (${error.message}); falling back to file storage.`);
    }
  }
  return createFileStore({ dataDir });
}
