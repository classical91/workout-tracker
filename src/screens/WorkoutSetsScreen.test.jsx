import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkoutSetsScreen } from "./WorkoutSetsScreen.jsx";
import { workouts, workoutStepKey } from "../data/workouts.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

function Harness({
  initialChecked = {},
  onAddActivity = vi.fn((entry) => entry),
  onUpdateActivity = vi.fn(),
  customWorkouts = [],
}) {
  const [checked, setChecked] = useState(initialChecked);
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
    />
  );
}

const checkAll = (workout) =>
  Object.fromEntries(workout.steps.map((_, index) => [workoutStepKey(workout.id, index), true]));

describe("WorkoutSetsScreen logging", () => {
  it("logs once when progress crosses from below 100% to 100%", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    const initialChecked = Object.fromEntries(
      workouts[0].steps.slice(0, -1).map((_, index) => [workoutStepKey(workouts[0].id, index), true])
    );
    render(<Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />);
    fireEvent.click(screen.getByRole("button", { name: /Cool-Down/i }));
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "workout",
      category: "strength",
      completed: true,
      name: workouts[0].title,
      details: { workoutId: workouts[0].id },
    });
    fireEvent.click(screen.getByRole("button", { name: /Workout 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /Workout 1/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("does not log an already-completed workout on first render", () => {
    const onAddActivity = vi.fn((entry) => entry);
    render(<Harness initialChecked={checkAll(workouts[0])} onAddActivity={onAddActivity} />);
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("logs a custom workout with its exercise plan", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    const custom = {
      id: "custom-1",
      title: "Custom Strength",
      tag: "Custom",
      emoji: "🏋️",
      color: "#378ADD",
      steps: [{ phase: "Rows", reps: "3 × 10", detail: "Pull", type: "exercise" }],
    };
    render(<Harness onAddActivity={onAddActivity} customWorkouts={[custom]} />);
    fireEvent.click(screen.getByRole("button", { name: /Custom/i }));
    fireEvent.click(screen.getByRole("button", { name: /Rows/i }));
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0].details.exercises[0]).toMatchObject({
      name: "Rows",
      planned: "3 × 10",
    });
  });

  it("logs a partial workout via the manual button, marked incomplete", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    // Check the first exercise of workout 1 only (a partial session).
    const initialChecked = { [workoutStepKey(workouts[0].id, 1)]: true };
    render(<Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />);

    fireEvent.click(screen.getByRole("button", { name: /Log this session \(1 of/i }));

    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "workout",
      completed: false,
      name: `${workouts[0].title} (Partial)`,
    });
    expect(onAddActivity.mock.calls[0][0].details).toMatchObject({
      workoutId: workouts[0].id,
      completedSteps: 1,
    });
    expect(onAddActivity.mock.calls[0][0].details.exercises[0]).toMatchObject({
      name: workouts[0].steps[1].phase,
    });
  });

  it("hides the manual button until at least one step is checked", () => {
    render(<Harness />);
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
  });

  it("auto-logs checked-but-unlogged steps when leaving the screen", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const initialChecked = { [workoutStepKey(workouts[0].id, 1)]: true };
    const { unmount } = render(
      <Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />
    );

    // Nothing logged while on the screen — the user never tapped the button.
    expect(onAddActivity).not.toHaveBeenCalled();

    unmount();

    expect(onAddActivity).toHaveBeenCalledTimes(1);
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({ type: "workout", completed: false });
  });

  it("does not re-log on leave when the session was just logged manually", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const initialChecked = { [workoutStepKey(workouts[0].id, 1)]: true };
    const { unmount } = render(
      <Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Log this session/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);

    unmount();
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("keeps a logged step checked and does not re-log it on the same day", () => {
    const today = new Date().toDateString();
    const loggedKey = workoutStepKey(workouts[0].id, 1);
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
      <Harness initialChecked={checkAll(workouts[0])} onAddActivity={onAddActivity} />
    );

    // Stale-day checks are wiped: no manual button, and nothing is logged.
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    unmount();
    expect(onAddActivity).not.toHaveBeenCalled();
  });
});
