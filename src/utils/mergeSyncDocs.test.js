import { describe, expect, it } from "vitest";
import { mergeSyncDoc, mergeSyncDocs, normalizeSyncDoc } from "./mergeSyncDocs.js";

describe("mergeSyncDocs", () => {
  it("keeps the most recently edited copy of a document", () => {
    const older = { value: { a: 1 }, updatedAt: 100 };
    const newer = { value: { a: 2 }, updatedAt: 200 };

    expect(mergeSyncDoc(older, newer)).toEqual(newer);
    expect(mergeSyncDoc(newer, older)).toEqual(newer);
  });

  it("keeps what is stored when both copies claim the same edit time", () => {
    const stored = { value: "stored", updatedAt: 5 };
    const incoming = { value: "incoming", updatedAt: 5 };

    expect(mergeSyncDoc(stored, incoming)).toEqual(stored);
  });

  it("takes whichever side actually has a document", () => {
    const doc = { value: [], updatedAt: 1 };

    expect(mergeSyncDoc(undefined, doc)).toEqual(doc);
    expect(mergeSyncDoc(doc, undefined)).toEqual(doc);
    expect(mergeSyncDoc(undefined, undefined)).toBeNull();
  });

  it("ignores malformed documents and unknown keys", () => {
    expect(normalizeSyncDoc("nope")).toBeNull();
    expect(normalizeSyncDoc({ updatedAt: 1 })).toBeNull();
    expect(normalizeSyncDoc({ value: 1, updatedAt: "x" })).toEqual({ value: 1, updatedAt: 0 });

    const merged = mergeSyncDocs(
      { plans: { value: { p: 1 }, updatedAt: 1 } },
      { customWorkouts: { value: [], updatedAt: 2 }, mystery: { value: "x", updatedAt: 9 } }
    );
    expect(Object.keys(merged).sort()).toEqual(["customWorkouts", "plans"]);
  });

  it("carries today's focuses between devices, newest pick winning", () => {
    const morning = { value: { day: "2026-09-16", focuses: [{ id: "stretch:hips" }] }, updatedAt: 1 };
    const later = {
      value: { day: "2026-09-16", focuses: [{ id: "stretch:hips" }, { id: "stretch:neck" }] },
      updatedAt: 2,
    };

    const merged = mergeSyncDocs({ dailyFocus: morning }, { dailyFocus: later });
    expect(merged.dailyFocus).toEqual(later);
    // The other direction too: a device pushing an older copy cannot undo a
    // pick made on another one.
    expect(mergeSyncDocs({ dailyFocus: later }, { dailyFocus: morning }).dailyFocus).toEqual(later);
  });
});
