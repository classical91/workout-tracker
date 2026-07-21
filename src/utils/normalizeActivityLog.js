import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { getActivityDefinition } from "../data/activityDefinitions.js";

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

export function normalizeActivityEntry(entry = {}, index = 0) {
  const safeEntry = isPlainObject(entry) ? entry : {};
  const ts = Number.isFinite(Number(safeEntry.ts)) ? Number(safeEntry.ts) : Date.now();
  const type = safeEntry.type || ACTIVITY_TYPES.GENERAL;
  const definition = getActivityDefinition(type);

  return {
    id: safeEntry.id || `legacy-${ts}-${index}`,
    ts,
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
  const normalized = normalizeActivityEntry({ ...entry, ts, id: entry.id || createActivityId(ts) });
  return { ...normalized, note: normalized.note.trim() };
}
