import { describe, expect, it } from "vitest";
import { mergeActivityLogs, syncEntryId, syncEntryUpdatedAt } from "./mergeActivityLog.js";

const entry = (overrides) => ({ id: "a", ts: 1000, updatedAt: 1000, name: "One", ...overrides });

describe("mergeActivityLogs", () => {
  it("unions entries from both devices, newest ts first", () => {
    const desktop = [entry({ id: "a", ts: 2000 })];
    const mobile = [entry({ id: "b", ts: 3000, name: "Two" })];
    const merged = mergeActivityLogs(desktop, mobile);
    expect(merged.map((e) => e.id)).toEqual(["b", "a"]);
  });

  it("keeps the most recently updated copy of a conflicting entry", () => {
    const older = [entry({ id: "a", name: "old", updatedAt: 1000 })];
    const newer = [entry({ id: "a", name: "new", updatedAt: 5000 })];
    expect(mergeActivityLogs(older, newer)[0].name).toBe("new");
    expect(mergeActivityLogs(newer, older)[0].name).toBe("new");
  });

  it("propagates a deletion via tombstone when the tombstone is newer", () => {
    const kept = [entry({ id: "a", updatedAt: 1000 })];
    const deleted = [{ id: "a", ts: 1000, deleted: true, updatedAt: 2000 }];
    const merged = mergeActivityLogs(kept, deleted);
    expect(merged).toHaveLength(1);
    expect(merged[0].deleted).toBe(true);
  });

  it("does not resurrect a deletion when a stale edit is older than the tombstone", () => {
    const deleted = [{ id: "a", ts: 1000, deleted: true, updatedAt: 5000 }];
    const staleEdit = [entry({ id: "a", updatedAt: 1000 })];
    expect(mergeActivityLogs(deleted, staleEdit)[0].deleted).toBe(true);
  });

  it("de-duplicates the same legacy entry (no id) across devices by timestamp", () => {
    const legacyA = [{ ts: 1710000000000, name: "Legacy" }];
    const legacyB = [{ ts: 1710000000000, name: "Legacy" }];
    expect(mergeActivityLogs(legacyA, legacyB)).toHaveLength(1);
  });

  it("ignores malformed entries and non-array inputs", () => {
    expect(mergeActivityLogs(null, undefined)).toEqual([]);
    expect(mergeActivityLogs([null, { name: "no id or ts" }], [])).toEqual([]);
  });

  it("derives ids and update times with sensible fallbacks", () => {
    expect(syncEntryId({ id: "x" })).toBe("x");
    expect(syncEntryId({ ts: 42 })).toBe("legacy-42");
    expect(syncEntryId({})).toBe(null);
    expect(syncEntryUpdatedAt({ updatedAt: 5 })).toBe(5);
    expect(syncEntryUpdatedAt({ ts: 9 })).toBe(9);
  });
});
