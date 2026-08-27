-- Cross-device sync storage. The server creates this table on first use, so
-- running this by hand is optional — it's here to document the shape and to let
-- a database be provisioned ahead of the first deploy.
--
-- One row per sync code. The code itself is never stored: it is a shared secret
-- the user picked, so only its SHA-256 hash is kept. `record` holds
-- { log: [...], docs: { plans: {...}, customWorkouts: {...} } }.
CREATE TABLE IF NOT EXISTS wellness_sync (
  code_hash TEXT PRIMARY KEY,
  record JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
