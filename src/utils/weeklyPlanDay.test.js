import { describe, expect, it } from "vitest";
import { weeklyPlan } from "../data/weeklyPlan.js";
import { parseCalendarDay, planForDate, planIndexForDate } from "./weeklyPlanDay.js";

describe("planIndexForDate", () => {
  it("puts Monday first, not Sunday", () => {
    // 2026-09-14 is a Monday; the week runs from there.
    const monday = new Date(2026, 8, 14);
    expect(planIndexForDate(monday)).toBe(0);
    expect(planForDate(monday).day).toBe("Monday");

    const sunday = new Date(2026, 8, 13);
    expect(planIndexForDate(sunday)).toBe(6);
    expect(planForDate(sunday).day).toBe("Sunday");
  });

  it("names every day of the week in order", () => {
    const days = weeklyPlan.map((_, offset) => planForDate(new Date(2026, 8, 14 + offset)).day);
    expect(days).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });
});

describe("parseCalendarDay", () => {
  it("reads a date as the caller's calendar day, not UTC midnight", () => {
    const date = parseCalendarDay("2026-09-14");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(14);
  });

  it("refuses anything that is not one", () => {
    for (const value of ["", "today", "2026-9-14", "14-09-2026", "2026-02-31", null, undefined]) {
      expect(parseCalendarDay(value)).toBeNull();
    }
  });
});
