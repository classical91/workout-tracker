import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { getActivityDefinition } from "../data/activityDefinitions.js";

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

export function normalizeActivityEntry(entry = {}, index = 0) {
  const safeEntry = isPlainObject(entry) ? entry : {};
  const ts = Number.isFinite(Number(safeEntry.ts)) ? Number(safeEntry.ts) : Date.now();
  const type = safeEntry.type || ACTIVITY_TYPES.GENERAL;
  const definition = getActivityDefinition(type);

  const updatedAt = Number.isFinite(Number(safeEntry.updatedAt)) ? Number(safeEntry.updatedAt) : ts;

  return {
    id: safeEntry.id || `legacy-${ts}-${index}`,
    ts,
    // When this entry was last changed. Used to resolve conflicts when the same
    // log is synced across devices (newest edit wins).
    updatedAt,
    // Tombstone flag: a deleted entry is kept (not removed) so the deletion can
    // propagate across devices instead of the entry reappearing from a stale
    // copy. The UI filters these out; only the sync layer sees them.
    deleted: safeEntry.deleted === true,
    type,
    category: safeEntry.category || definition.category || ACTIVITY_CATEGORIES.GENERAL,
    name: safeEntry.name || definition.label || "Activity",
    emoji: safeEntry.emoji || definition.emoji || "✅",
    color: safeEntry.color || definition.color || "#FFD93D",
    duration: safeEntry.duration || "",
    completed: safeEntry.completed ?? true,
    note: typeof safeEntry.note === "string" ? safeEntry.note : "",
    details: isPlainObject(safeEntry.details) ? safeEntry.details : {},
  };
}

export function normalizeActivityLog(log) {
  return Array.isArray(log) ? log.map(normalizeActivityEntry) : [];
}

export function createActivityId(ts = Date.now()) {
  const suffix = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `activity-${ts}-${suffix}`;
}

export function createActivity(entry = {}) {
  const ts = Number.isFinite(Number(entry.ts)) ? Number(entry.ts) : Date.now();
  const updatedAt = Number.isFinite(Number(entry.updatedAt)) ? Number(entry.updatedAt) : Date.now();
  const normalized = normalizeActivityEntry({
    ...entry,
    ts,
    updatedAt,
    id: entry.id || createActivityId(ts),
  });
  return { ...normalized, note: normalized.note.trim() };
}
