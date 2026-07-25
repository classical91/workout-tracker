import { describe, expect, it } from "vitest";
import { localDay, msUntilNextLocalDay } from "./localDay.js";

describe("localDay", () => {
  it("labels a day by its local calendar date", () => {
    expect(localDay(new Date(2024, 0, 2, 23, 59))).toBe(localDay(new Date(2024, 0, 2, 0, 1)));
    expect(localDay(new Date(2024, 0, 2, 23, 59))).not.toBe(localDay(new Date(2024, 0, 3, 0, 1)));
  });
});

describe("msUntilNextLocalDay", () => {
  it("counts down to the next local midnight", () => {
    expect(msUntilNextLocalDay(new Date(2024, 0, 2, 23, 59, 0))).toBe(60 * 1000);
    expect(msUntilNextLocalDay(new Date(2024, 0, 2, 0, 0, 0))).toBe(24 * 60 * 60 * 1000);
  });

  it("never returns a non-positive delay", () => {
    expect(msUntilNextLocalDay(new Date(2024, 0, 2, 23, 59, 59, 999))).toBeGreaterThan(0);
  });
});
