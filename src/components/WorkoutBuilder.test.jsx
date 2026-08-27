import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkoutBuilder } from "./WorkoutBuilder.jsx";

describe("WorkoutBuilder", () => {
  it("asks only for a name, how many sets, and how many reps per set", () => {
    const onSave = vi.fn();
    render(<WorkoutBuilder onSave={onSave} onCancel={() => {}} count={0} />);

    fireEvent.change(screen.getByPlaceholderText("My Routine"), {
      target: { value: "Push Day" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Exercise name")[0], {
      target: { value: "Chest Press" },
    });
    fireEvent.change(screen.getByLabelText("sets for exercise 1"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("reps per set for exercise 1"), {
      target: { value: "8" },
    });
    fireEvent.click(screen.getByRole("button", { name: /SAVE WORKOUT/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const saved = onSave.mock.calls[0][0];
    expect(saved.title).toBe("Push Day");
    // Warm-up, the exercise, cool-down.
    expect(saved.steps).toHaveLength(3);
    expect(saved.steps[1]).toMatchObject({
      phase: "Chest Press",
      type: "exercise",
      setCount: 4,
      repCount: 8,
    });
    // No free-text target is stored any more — the plan is the numbers.
    expect(saved.steps[1].reps).toBeUndefined();
  });

  it("falls back to a usable plan when the numbers are left blank or nonsense", () => {
    const onSave = vi.fn();
    render(<WorkoutBuilder onSave={onSave} onCancel={() => {}} count={0} />);

    fireEvent.change(screen.getByPlaceholderText("My Routine"), { target: { value: "Quick" } });
    fireEvent.change(screen.getAllByPlaceholderText("Exercise name")[0], {
      target: { value: "Curls" },
    });
    fireEvent.change(screen.getByLabelText("sets for exercise 1"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /SAVE WORKOUT/i }));

    expect(onSave.mock.calls[0][0].steps[1]).toMatchObject({ setCount: 3, repCount: 12 });
  });

  it("pre-fills the plan of a routine being edited", () => {
    render(
      <WorkoutBuilder
        onSave={() => {}}
        onCancel={() => {}}
        initial={{
          id: "c-1",
          title: "Back Day",
          emoji: "🏋️",
          color: "#378ADD",
          tag: "Custom 1",
          steps: [
            { phase: "Warm-Up", reps: "5–10 min", type: "warmup" },
            { phase: "Rows", setCount: 5, repCount: 6, type: "exercise" },
          ],
        }}
      />
    );

    expect(screen.getByLabelText("sets for exercise 1")).toHaveValue(5);
    expect(screen.getByLabelText("reps per set for exercise 1")).toHaveValue(6);
  });
});
