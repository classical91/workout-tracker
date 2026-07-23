import { describe, expect, it } from "vitest";
import { classifyDay } from "./relativeDay.js";

const NOON_TODAY = new Date("2026-07-23T12:00:00").getTime();
const HOUR = 60 * 60 * 1000;

describe("classifyDay", () => {
  it("marks entries from today as emphasized green", () => {
    const result = classifyDay(NOON_TODAY - 2 * HOUR, NOON_TODAY);
    expect(result).toMatchObject({ kind: "today", label: "Today", emphasized: true });
  });

  it("marks entries from yesterday as emphasized red", () => {
    const result = classifyDay(NOON_TODAY - 26 * HOUR, NOON_TODAY);
    expect(result).toMatchObject({ kind: "yesterday", label: "Yesterday", emphasized: true });
  });

  it("leaves older entries unlabeled and de-emphasized", () => {
    const result = classifyDay(NOON_TODAY - 3 * 24 * HOUR, NOON_TODAY);
    expect(result).toMatchObject({ kind: "older", label: null, emphasized: false });
  });

  it("uses calendar day, not a 24h window (early today is still today)", () => {
    const earlyToday = new Date("2026-07-23T00:30:00").getTime();
    const nowLateToday = new Date("2026-07-23T23:30:00").getTime();
    expect(classifyDay(earlyToday, nowLateToday).kind).toBe("today");
  });
});
