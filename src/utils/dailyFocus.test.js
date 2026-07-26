import { describe, expect, it } from "vitest";
import {
  addDailyFocusToState,
  dailyFocusesFromState,
  removeDailyFocusFromState,
  simpleExerciseDailyFocus,
  stretchDailyFocus,
} from "./dailyFocus.js";

describe("daily focus helpers", () => {
  it("migrates the original single-stretch value", () => {
    expect(dailyFocusesFromState({ day: "today", name: "Neck" })).toEqual([
      {
        id: "stretch:neck",
        name: "Neck",
        source: "stretch",
        imageQuery: "Neck stretch",
      },
    ]);
  });

  it("adds multiple focuses without duplicating one", () => {
    const today = "today";
    const neck = stretchDailyFocus({ key: "neck", name: "Neck" });
    const pushUps = simpleExerciseDailyFocus({ slug: "push-ups", name: "Push-Ups" });

    const one = addDailyFocusToState({ day: today, focuses: [] }, neck, today);
    const two = addDailyFocusToState(one, pushUps, today);
    const duplicate = addDailyFocusToState(two, neck, today);

    expect(duplicate.focuses).toEqual([neck, pushUps]);
  });

  it("starts a new list when the local day changes", () => {
    const pushUps = simpleExerciseDailyFocus({ slug: "push-ups", name: "Push-Ups" });
    expect(
      addDailyFocusToState(
        { day: "yesterday", focuses: [stretchDailyFocus({ key: "neck", name: "Neck" })] },
        pushUps,
        "today"
      )
    ).toEqual({ day: "today", focuses: [pushUps] });
  });

  it("removes only the unchecked focus", () => {
    const today = "today";
    const neck = stretchDailyFocus({ key: "neck", name: "Neck" });
    const pushUps = simpleExerciseDailyFocus({ slug: "push-ups", name: "Push-Ups" });

    expect(
      removeDailyFocusFromState({ day: today, focuses: [neck, pushUps] }, neck.id, today)
    ).toEqual({ day: today, focuses: [pushUps] });
  });

  it("can remove a focus stored in the original single-focus format", () => {
    expect(
      removeDailyFocusFromState({ day: "today", name: "Neck" }, "stretch:neck", "today")
    ).toEqual({ day: "today", focuses: [] });
  });
});
