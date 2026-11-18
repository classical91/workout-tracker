import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkoutSetsScreen } from "./WorkoutSetsScreen.jsx";
import {
  clampRepCount,
  clampSetCount,
  workoutPlanKey,
  workoutSetKey,
  workouts,
} from "../data/workouts.js";

function Harness({
  initialChecked = {},
  initialPlans = {},
  onAddActivity = vi.fn((entry) => entry),
  onUpdateActivity = vi.fn(),
  customWorkouts = [],
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [plans, setPlans] = useState(initialPlans);
  const setPlan = (workoutId, stepIndex, plan) =>
    setPlans((previous) => ({
      ...previous,
      [workoutPlanKey(workoutId, stepIndex)]: {
        setCount: clampSetCount(plan.setCount),
        repCount: clampRepCount(plan.repCount),
      },
    }));
  const clearPlans = (workoutId) =>
    setPlans((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([key]) => !key.startsWith(`${workoutId}::`))
      )
    );
  return (
    <WorkoutSetsScreen
      onBack={() => {}}
      checked={checked}
      setChecked={setChecked}
      onAddActivity={(entry) => onAddActivity({ id: `activity-${onAddActivity.mock.calls.length}`, ...entry })}
      onUpdateActivity={onUpdateActivity}
      customWorkouts={customWorkouts}
      onAddWorkout={() => {}}
      onUpdateWorkout={() => {}}
      onDeleteWorkout={() => {}}
      plans={plans}
      onSetPlan={setPlan}
      onClearPlans={clearPlans}
    />
  );
}

const firstWorkout = workouts[0];
const firstExercise = firstWorkout.steps[1];

describe("WorkoutSetsScreen sets and reps", () => {
  it("gives an exercise one check per planned set instead of a single check", () => {
    render(<Harness />);

    // Workout 1's exercises are planned at three sets each.
    expect(screen.getByRole("button", { name: `${firstExercise.phase} set 3` })).toBeTruthy();
    expect(screen.queryByRole("button", { name: `${firstExercise.phase} set 4` })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: `${firstExercise.phase} set 1` }));
    expect(
      screen.getByRole("button", { name: `${firstExercise.phase} set 1` })
    ).toHaveAttribute("aria-pressed", "true");
    // One set of three does not finish the exercise.
    expect(
      screen.getByRole("button", { name: `${firstExercise.phase} set 2` })
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(/1 of 3 sets/)).toBeTruthy();
  });

  it("counts progress in sets, so one of three sets is not a finished step", () => {
    render(<Harness />);
    // 5 exercises × 3 sets + warm-up + cool-down = 17 checks.
    fireEvent.click(screen.getByRole("button", { name: `${firstExercise.phase} set 1` }));
    expect(screen.getByText("6%")).toBeTruthy();
  });

  it("shows the planned sets and reps on the step badge", () => {
    render(<Harness initialPlans={{ [workoutPlanKey(firstWorkout.id, 1)]: { setCount: 4, repCount: 8 } }} />);

    expect(screen.getByText("4 × 8")).toBeTruthy();
    expect(screen.getByRole("button", { name: `${firstExercise.phase} set 4` })).toBeTruthy();
  });

  it("lets the user set how many sets and reps an exercise should be", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: `Edit ${firstExercise.phase} sets and reps` }));
    fireEvent.change(screen.getByLabelText("How many sets?"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Reps per set"), { target: { value: "10" } });

    expect(screen.getByRole("button", { name: `${firstExercise.phase} set 5` })).toBeTruthy();
    expect(screen.getByText("5 × 10")).toBeTruthy();
  });

  it("drops the checkmarks of sets removed by a smaller plan", () => {
    render(
      <Harness
        initialChecked={{
          [workoutSetKey(firstWorkout.id, 1, 0)]: true,
          [workoutSetKey(firstWorkout.id, 1, 2)]: true,
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: `Edit ${firstExercise.phase} sets and reps` }));
    fireEvent.change(screen.getByLabelText("How many sets?"), { target: { value: "2" } });

    expect(screen.queryByRole("button", { name: `${firstExercise.phase} set 3` })).toBeNull();
    // Set 1 stays checked; the third set's check went with the set itself.
    expect(
      screen.getByRole("button", { name: `${firstExercise.phase} set 1` })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/1 of 2 sets/)).toBeTruthy();
  });
});

describe("WorkoutSetsScreen images", () => {
  it("shows the supplied form image for exercises in each built-in workout", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /show Bicep Curls form/i }));
    expect(screen.getByRole("img", { name: /Bicep Curls exercise form/i })).toHaveAttribute(
      "src",
      workouts[0].steps[1].image
    );

    fireEvent.click(screen.getByRole("button", { name: /Workout 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /show Standing Calf Raise form/i }));
    expect(
      screen.getByRole("img", { name: /Standing Calf Raise exercise form/i })
    ).toHaveAttribute("src", workouts[1].steps[1].image);

    fireEvent.click(screen.getByRole("button", { name: /Workout 3/i }));
    fireEvent.click(screen.getByRole("button", { name: /show Dumbbell Squats form/i }));
    expect(screen.getByRole("img", { name: /Dumbbell Squats exercise form/i })).toHaveAttribute(
      "src",
      workouts[2].steps[1].image
    );
  });

});
