import { describe, expect, it } from "vitest";
import {
  DEFAULT_REP_COUNT,
  MAX_SET_COUNT,
  clampSetCount,
  normalizeWorkout,
  resolvePlan,
  stepLabel,
  stepProgress,
  stepUnitKeys,
  summarizeWorkoutSession,
  workoutPlanKey,
  workoutUnitKeys,
  workouts,
} from "../data/workouts.js";

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

describe("workout plans", () => {
  it("gives every exercise a sets × reps plan and warm-ups none", () => {
    for (const workout of workouts) {
      workout.steps.forEach((step, index) => {
        const plan = resolvePlan(workout, index, {});
        if (step.type === "exercise") {
          expect(plan.setCount).toBeGreaterThan(0);
          expect(plan.repCount).toBeGreaterThan(0);
          expect(stepLabel(workout, index, {})).toBe(`${plan.setCount} × ${plan.repCount}`);
        } else {
          expect(plan).toBeNull();
          expect(stepLabel(workout, index, {})).toBe(step.reps);
        }
      });
    }
  });

  it("lets a saved plan override the numbers a routine ships with", () => {
    const workout = workouts[0];
    const plans = { [workoutPlanKey(workout.id, 1)]: { setCount: 5, repCount: 8 } };

    expect(resolvePlan(workout, 1, plans)).toEqual({ setCount: 5, repCount: 8 });
    expect(stepUnitKeys(workout, 1, plans)).toHaveLength(5);
    // Other steps keep their own numbers.
    expect(resolvePlan(workout, 2, plans)).toEqual({ setCount: 3, repCount: 12 });
  });

  it("clamps nonsense plans instead of building an unusable routine", () => {
    const workout = workouts[0];
    const plans = { [workoutPlanKey(workout.id, 1)]: { setCount: 0, repCount: "abc" } };

    // Below one falls back to one set; an unparseable rep count keeps the default.
    expect(resolvePlan(workout, 1, plans)).toEqual({ setCount: 1, repCount: 12 });
    expect(clampSetCount(999)).toBe(MAX_SET_COUNT);
  });

  it("checks an exercise off one set at a time", () => {
    const workout = workouts[0];
    const [first, second, third] = stepUnitKeys(workout, 1, {});

    expect(new Set([first, second, third]).size).toBe(3);
    expect(stepProgress(workout, 1, { [first]: true }, {})).toMatchObject({
      doneCount: 1,
      totalCount: 3,
      done: false,
      started: true,
    });
    expect(
      stepProgress(workout, 1, { [first]: true, [second]: true, [third]: true }, {}).done
    ).toBe(true);
  });

  it("summarizes a session by sets done, not steps touched", () => {
    const workout = workouts[0];
    const [first] = stepUnitKeys(workout, 1, {});
    const summary = summarizeWorkoutSession(workout, { [first]: true }, {});

    expect(summary.complete).toBe(false);
    expect(summary.name).toBe(`${workout.title} (Partial)`);
    expect(summary.doneUnits).toBe(1);
    expect(summary.totalUnits).toBe(17);
    expect(summary.doneExercises).toHaveLength(1);
    expect(summary.doneExercises[0]).toMatchObject({ doneCount: 1, plan: { setCount: 3 } });

    const everySet = Object.fromEntries(workoutUnitKeys(workout, {}).map((key) => [key, true]));
    expect(summarizeWorkoutSession(workout, everySet, {}).complete).toBe(true);
  });

  it("reads the sets and reps out of a routine saved before plans existed", () => {
    const legacy = {
      id: "c-legacy",
      title: "Old Routine",
      steps: [
        { phase: "Warm-Up", reps: "5–10 min", type: "warmup" },
        { phase: "Rows", reps: "4 × 10–12 / side", type: "exercise" },
        { phase: "Finisher", reps: "2 rounds", type: "exercise" },
      ],
    };
    const [, rows, finisher] = normalizeWorkout(legacy).steps;

    expect(rows).toMatchObject({ setCount: 4, repCount: 10 });
    expect(rows.reps).toBeUndefined();
    expect(finisher).toMatchObject({ setCount: 2, repCount: DEFAULT_REP_COUNT });
    expect(normalizeWorkout(legacy).steps[0].reps).toBe("5–10 min");
  });
});
