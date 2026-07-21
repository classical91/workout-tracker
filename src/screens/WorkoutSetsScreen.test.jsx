import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkoutSetsScreen } from "./WorkoutSetsScreen.jsx";
import { workouts } from "../data/workouts.js";

function Harness({ initialChecked = {}, onAddActivity, customWorkouts = [] }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <WorkoutSetsScreen
      onBack={() => {}}
      checked={checked}
      setChecked={setChecked}
      onAddActivity={onAddActivity}
      customWorkouts={customWorkouts}
      onAddWorkout={() => {}}
      onUpdateWorkout={() => {}}
      onDeleteWorkout={() => {}}
    />
  );
}

describe("WorkoutSetsScreen logging", () => {
  it("logs once when progress crosses from below 100% to 100%", async () => {
    const onAddActivity = vi.fn();
    const initialChecked = Object.fromEntries(
      workouts[0].steps.slice(0, -1).map((_, index) => [`w-${workouts[0].id}-${index}`, true])
    );
    render(<Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />);
    fireEvent.click(screen.getByRole("button", { name: /Cool-Down/i }));
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "workout",
      category: "strength",
      details: { workoutId: workouts[0].id },
    });
    fireEvent.click(screen.getByRole("button", { name: /Workout 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /Workout 1/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("does not log an already-completed workout on first render", () => {
    const onAddActivity = vi.fn();
    const initialChecked = Object.fromEntries(
      workouts[0].steps.map((_, index) => [`w-${workouts[0].id}-${index}`, true])
    );
    render(<Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />);
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("logs a custom workout with its exercise plan", async () => {
    const onAddActivity = vi.fn();
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
});
