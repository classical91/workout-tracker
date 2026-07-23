import { describe, expect, it } from "vitest";
import { workouts } from "../data/workouts.js";

describe("built-in workout images", () => {
  it("maps a local form image to every exercise in Workouts 1, 2, and 3", () => {
    const exerciseSteps = workouts.flatMap((workout) =>
      workout.steps.filter((step) => step.type === "exercise")
    );

    expect(exerciseSteps).toHaveLength(14);
    expect(exerciseSteps.every((step) => step.image?.startsWith("/workouts/workout-"))).toBe(true);
    expect(new Set(exerciseSteps.map((step) => step.image))).toHaveLength(14);
  });

  it("does not attach exercise images to warm-up or cool-down steps", () => {
    const transitionSteps = workouts.flatMap((workout) =>
      workout.steps.filter((step) => step.type !== "exercise")
    );

    expect(transitionSteps.every((step) => !step.image)).toBe(true);
  });
});
