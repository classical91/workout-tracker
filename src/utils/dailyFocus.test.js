import { describe, expect, it } from "vitest";
import {
  addDailyFocusToState,
  dailyFocusesFromState,
  removeDailyFocusFromState,
  simpleExerciseDailyFocus,
  stretchDailyFocus,
  triggerPointDailyFocus,
} from "./dailyFocus.js";

const upperTraps = { key: "upper-traps", name: "Upper Trapezius" };
const upperTrapsHotspot = { id: "upper-traps-left-1", side: "left" };

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

  it("keeps a trigger-point focus as a trigger rather than folding it into a stretch", () => {
    const trigger = triggerPointDailyFocus(upperTraps, upperTrapsHotspot);

    expect(dailyFocusesFromState({ day: "today", focuses: [trigger] })).toEqual([
      {
        id: "trigger:upper-traps-left-1",
        name: "Upper Trapezius",
        source: "trigger",
        triggerPointKey: "upper-traps",
        hotspotId: "upper-traps-left-1",
        side: "left",
      },
    ]);
  });

  it("keeps all three kinds of focus side by side", () => {
    const today = "today";
    const neck = stretchDailyFocus({ key: "neck", name: "Neck" });
    const pushUps = simpleExerciseDailyFocus({ slug: "push-ups", name: "Push-Ups" });
    const trigger = triggerPointDailyFocus(upperTraps, upperTrapsHotspot);

    let state = addDailyFocusToState({ day: today, focuses: [] }, neck, today);
    state = addDailyFocusToState(state, pushUps, today);
    state = addDailyFocusToState(state, trigger, today);

    expect(dailyFocusesFromState(state).map((focus) => focus.source)).toEqual([
      "stretch",
      "simple",
      "trigger",
    ]);
  });

  it("adds one focus per hotspot, so the same dot twice is a no-op", () => {
    const today = "today";
    const trigger = triggerPointDailyFocus(upperTraps, upperTrapsHotspot);
    const otherSide = triggerPointDailyFocus(upperTraps, {
      id: "upper-traps-right-1",
      side: "right",
    });

    let state = addDailyFocusToState({ day: today, focuses: [] }, trigger, today);
    state = addDailyFocusToState(state, otherSide, today);
    state = addDailyFocusToState(state, trigger, today);

    expect(state.focuses).toEqual([trigger, otherSide]);
  });

  it("removes a trigger focus without touching the others", () => {
    const today = "today";
    const neck = stretchDailyFocus({ key: "neck", name: "Neck" });
    const trigger = triggerPointDailyFocus(upperTraps, upperTrapsHotspot);

    expect(
      removeDailyFocusFromState({ day: today, focuses: [neck, trigger] }, trigger.id, today)
    ).toEqual({ day: today, focuses: [neck] });
  });

  it("clears trigger focuses when the local day changes", () => {
    const trigger = triggerPointDailyFocus(upperTraps, upperTrapsHotspot);
    const neck = stretchDailyFocus({ key: "neck", name: "Neck" });

    expect(addDailyFocusToState({ day: "yesterday", focuses: [trigger] }, neck, "today")).toEqual({
      day: "today",
      focuses: [neck],
    });
  });

  it("still reads an unknown source back as a stretch", () => {
    expect(
      dailyFocusesFromState({
        day: "today",
        focuses: [{ id: "mystery:1", name: "Mystery", source: "mystery" }],
      })
    ).toEqual([
      { id: "mystery:1", name: "Mystery", source: "stretch", imageQuery: "Mystery stretch" },
    ]);
  });
});
