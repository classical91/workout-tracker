import { describe, expect, it } from "vitest";
import { quickActivities } from "../data/quickActivities.js";

describe("quick activities", () => {
  it("does not offer walking as a manual workout shortcut", () => {
    expect(quickActivities.some((activity) => activity.id === "walk")).toBe(false);
    expect(quickActivities.some((activity) => activity.name === "Walking")).toBe(false);
  });
});
