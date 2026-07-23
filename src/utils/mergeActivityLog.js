// Pure, dependency-free merge logic for syncing activity logs across devices.
// It has no imports so the exact same code can run in the browser bundle and in
// the Node sync server, guaranteeing both sides resolve conflicts identically.

// A stable id for an entry. New entries always carry `id`; older ("legacy")
// entries predate ids, so we derive one from their timestamp. Deriving from `ts`
// (rather than an array index) keeps the id identical on every device, so the
// same legacy entry de-duplicates instead of appearing twice after a sync.
export function syncEntryId(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.id) return String(entry.id);
  const ts = Number(entry.ts);
  return Number.isFinite(ts) ? `legacy-${ts}` : null;
}

// When an entry was last changed, in ms. Falls back to `ts` (creation time) for
// entries written before we tracked `updatedAt`.
export function syncEntryUpdatedAt(entry) {
  const updatedAt = Number(entry?.updatedAt);
  if (Number.isFinite(updatedAt)) return updatedAt;
  const ts = Number(entry?.ts);
  return Number.isFinite(ts) ? ts : 0;
}

// Merge two activity logs by entry id, keeping whichever copy of each entry was
// modified most recently. Deletions are represented as tombstones
// (`deleted: true`) rather than removals, so a delete on one device propagates
// to the others instead of the entry resurrecting from a stale copy. Result is
// sorted newest-first by `ts`, matching how the app stores and renders the log.
export function mergeActivityLogs(a = [], b = []) {
  const byId = new Map();
  const consider = Array.isArray(a) ? a : [];
  const consider2 = Array.isArray(b) ? b : [];

  for (const entry of [...consider, ...consider2]) {
    const id = syncEntryId(entry);
    if (!id) continue;
    const existing = byId.get(id);
    if (!existing || syncEntryUpdatedAt(entry) >= syncEntryUpdatedAt(existing)) {
      byId.set(id, entry);
    }
  }

  return [...byId.values()].sort((x, y) => Number(y?.ts ?? 0) - Number(x?.ts ?? 0));
}
