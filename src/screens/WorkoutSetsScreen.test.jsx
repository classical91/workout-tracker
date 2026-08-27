import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkoutSetsScreen } from "./WorkoutSetsScreen.jsx";
import {
  clampRepCount,
  clampSetCount,
  workoutPlanKey,
  workoutSetKey,
  workoutUnitKeys,
  workouts,
} from "../data/workouts.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

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

// Every set of every step checked — a fully finished routine.
const checkAll = (workout, plans = {}) =>
  Object.fromEntries(workoutUnitKeys(workout, plans).map((key) => [key, true]));

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

describe("WorkoutSetsScreen logging", () => {
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

  it("logs once when the last set of the routine is checked", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    const allButCoolDown = { ...checkAll(firstWorkout) };
    delete allButCoolDown[`w-${firstWorkout.id}-6`];
    render(<Harness initialChecked={allButCoolDown} onAddActivity={onAddActivity} />);

    fireEvent.click(screen.getByRole("button", { name: /Cool-Down/i }));
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "workout",
      category: "strength",
      completed: true,
      name: firstWorkout.title,
      details: { workoutId: firstWorkout.id, completedSets: 17 },
    });
    // Each logged exercise carries the sets done and the reps they were planned
    // at, so nothing has to be typed in afterwards.
    expect(onAddActivity.mock.calls[0][0].details.exercises[0]).toEqual({
      name: firstExercise.phase,
      setCount: 3,
      plannedSets: 3,
      reps: 12,
    });

    fireEvent.click(screen.getByRole("button", { name: /Workout 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /Workout 1/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("does not log an already-completed workout on first render", () => {
    const onAddActivity = vi.fn((entry) => entry);
    render(<Harness initialChecked={checkAll(firstWorkout)} onAddActivity={onAddActivity} />);
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("logs a custom workout with the sets it actually ticked off", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    const custom = {
      id: "custom-1",
      title: "Custom Strength",
      tag: "Custom",
      emoji: "🏋️",
      color: "#378ADD",
      steps: [{ phase: "Rows", setCount: 3, repCount: 10, detail: "Pull", type: "exercise" }],
    };
    render(<Harness onAddActivity={onAddActivity} customWorkouts={[custom]} />);
    fireEvent.click(screen.getByRole("button", { name: /Custom/i }));

    fireEvent.click(screen.getByRole("button", { name: "Rows set 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Rows set 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Rows set 3" }));

    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0].details.exercises[0]).toEqual({
      name: "Rows",
      setCount: 3,
      plannedSets: 3,
      reps: 10,
    });
  });

  it("logs a half-finished exercise as the sets that were done", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    render(
      <Harness
        initialChecked={{ [workoutSetKey(firstWorkout.id, 1, 0)]: true }}
        onAddActivity={onAddActivity}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Log this session \(1 of 17\)/i }));

    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "workout",
      completed: false,
      name: `${firstWorkout.title} (Partial)`,
    });
    expect(onAddActivity.mock.calls[0][0].details.exercises[0]).toEqual({
      name: firstExercise.phase,
      setCount: 1,
      plannedSets: 3,
      reps: 12,
    });
  });

  it("hides the manual button until at least one set is checked", () => {
    render(<Harness />);
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
  });

  it("auto-logs checked-but-unlogged sets when leaving the screen", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness
        initialChecked={{ [workoutSetKey(firstWorkout.id, 1, 0)]: true }}
        onAddActivity={onAddActivity}
      />
    );

    // Nothing logged while on the screen — the user never tapped the button.
    expect(onAddActivity).not.toHaveBeenCalled();

    unmount();

    expect(onAddActivity).toHaveBeenCalledTimes(1);
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({ type: "workout", completed: false });
  });

  it("does not re-log on leave when the session was just logged manually", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness
        initialChecked={{ [workoutSetKey(firstWorkout.id, 1, 0)]: true }}
        onAddActivity={onAddActivity}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Log this session/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);

    unmount();
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("keeps a logged set checked and does not re-log it on the same day", () => {
    const today = new Date().toDateString();
    const loggedKey = workoutSetKey(firstWorkout.id, 1, 0);
    localStorage.setItem(
      STORAGE_KEYS.workoutSession,
      JSON.stringify({ day: today, logged: { [loggedKey]: true } })
    );
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={{ [loggedKey]: true }} onAddActivity={onAddActivity} />
    );

    // Already logged today → still checked, but no button and no re-log.
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    unmount();
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("clears workout checkmarks on a new local day without logging them", () => {
    localStorage.setItem(
      STORAGE_KEYS.workoutSession,
      JSON.stringify({ day: "Mon Jan 01 2001", logged: {} })
    );
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={checkAll(firstWorkout)} onAddActivity={onAddActivity} />
    );

    // Stale-day checks are wiped: no manual button, and nothing is logged.
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    unmount();
    expect(onAddActivity).not.toHaveBeenCalled();
  });
});
