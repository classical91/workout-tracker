import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useActivityLog } from "./useActivityLog.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

describe("useActivityLog", () => {
  beforeEach(() => localStorage.clear());

  it("adds basic and structured activities newest first", () => {
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.addActivity({ name: "Walk", duration: "20 min" });
      result.current.addActivity({
        type: "sauna",
        name: "Sauna",
        details: { rounds: 3, temperature: 80 },
      });
    });
    expect(result.current.log).toHaveLength(2);
    expect(result.current.log[0]).toMatchObject({
      type: "sauna",
      category: "heat",
      details: { rounds: 3, temperature: 80 },
    });
    expect(result.current.log[1].name).toBe("Walk");
  });

  it("generates unique IDs for activities created in the same millisecond", () => {
    vi.spyOn(Date, "now").mockReturnValue(1710000000000);
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.addActivity({ name: "One" });
      result.current.addActivity({ name: "Two" });
    });
    expect(result.current.log[0].id).not.toBe(result.current.log[1].id);
    expect(new Set(result.current.log.map((entry) => entry.id)).size).toBe(2);
  });

  it("updates details, notes, and deletes one entry", () => {
    const { result } = renderHook(() => useActivityLog());
    let activity;
    act(() => {
      activity = result.current.addActivity({ type: "breathing", name: "Box" });
    });
    act(() => {
      result.current.updateActivity(activity.id, { details: { rounds: 5 } });
      result.current.setNote(activity.id, "  Calm session  ");
    });
    expect(result.current.log[0]).toMatchObject({ note: "Calm session", details: { rounds: 5 } });
    act(() => result.current.deleteActivity(activity.id));
    expect(result.current.log).toEqual([]);
  });

  it("clears today without deleting older history and can clear all", () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.addActivity({ name: "Old", ts: yesterday });
      result.current.addActivity({ name: "Today" });
    });
    act(() => result.current.clearToday());
    expect(result.current.log.map((entry) => entry.name)).toEqual(["Old"]);
    act(() => result.current.clearLog());
    expect(result.current.log).toEqual([]);
  });

  it("normalizes legacy entries without rewriting the storage key on read", async () => {
    const legacy = [{ ts: 1710000000000, name: "Legacy Workout", emoji: "💪", duration: "30 min" }];
    localStorage.setItem(STORAGE_KEYS.log, JSON.stringify(legacy));
    const { result } = renderHook(() => useActivityLog());
    expect(result.current.log[0]).toMatchObject({
      name: "Legacy Workout",
      type: "general",
      category: "general",
      completed: true,
      note: "",
      details: {},
    });
    expect(result.current.log[0].id).toMatch(/^legacy-/);
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.log))).toEqual(legacy));
  });
});
