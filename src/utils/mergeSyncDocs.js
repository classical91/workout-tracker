// Pure, dependency-free merge logic for the small documents that ride along
// with the activity log — the sets/reps plans and the custom routines. It has
// no imports so the exact same code runs in the browser bundle and in the Node
// sync server, guaranteeing both sides resolve conflicts identically.
//
// A document is `{ value, updatedAt }`. Unlike the log there is nothing to
// merge field by field: the whole document is one edit, so the most recently
// edited copy wins. Ties keep the copy already stored, so a device that just
// pulled and pushed back an identical document can't flip the winner.

export const SYNC_DOC_NAMES = ["plans", "customWorkouts"];

export function normalizeSyncDoc(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return null;
  if (doc.value === undefined) return null;
  const updatedAt = Number(doc.updatedAt);
  return { value: doc.value, updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0 };
}

export function mergeSyncDoc(stored, incoming) {
  const a = normalizeSyncDoc(stored);
  const b = normalizeSyncDoc(incoming);
  if (!a) return b;
  if (!b) return a;
  return b.updatedAt > a.updatedAt ? b : a;
}

// Merge the whole `{ plans, customWorkouts }` bag, keeping only the documents
// this version knows about so an unexpected key can't grow the stored payload.
export function mergeSyncDocs(stored = {}, incoming = {}) {
  const merged = {};
  for (const name of SYNC_DOC_NAMES) {
    const doc = mergeSyncDoc(stored?.[name], incoming?.[name]);
    if (doc) merged[name] = doc;
  }
  return merged;
}
