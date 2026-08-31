import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecoveryFlow } from "./RecoveryFlow.jsx";

const workoutActivity = {
  id: "workout-activity-1",
  details: {
    workoutId: "builtin-3",
    exercises: [{ name: "Dumbbell Squats" }, { name: "Chest Press" }],
  },
};

describe("RecoveryFlow", () => {
  it("lets the user skip optional recovery without logging an empty session", () => {
    const onAddActivity = vi.fn();
    render(
      <RecoveryFlow
        workoutActivity={workoutActivity}
        onAddActivity={onAddActivity}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip check-in" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(onAddActivity).not.toHaveBeenCalled();
    expect(screen.getByText("Nice work — keep it easy")).toBeTruthy();
  });

  it("records knot location and stops aggressive suggestions after a worse response", () => {
    const onAddActivity = vi.fn();
    render(
      <RecoveryFlow
        workoutActivity={workoutActivity}
        onAddActivity={onAddActivity}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Stretch complete" }));
    fireEvent.click(screen.getByRole("button", { name: "I have a muscle knot" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, help me" }));
    fireEvent.click(screen.getByRole("button", { name: "Traps" }));
    fireEvent.click(screen.getByRole("button", { name: "Treatment complete" }));
    fireEvent.click(screen.getByRole("button", { name: "Worse" }));

    expect(screen.getByText("Don’t add more pressure")).toBeTruthy();
    expect(screen.queryByText("Want some extra recovery?")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Complete recovery" }));
    expect(onAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "recovery",
        details: expect.objectContaining({
          problemArea: "traps",
          bodyCheckIn: "muscle_knot",
          knotTreatmentCompleted: true,
          afterState: "worse",
          relatedWorkoutId: "builtin-3",
        }),
      })
    );
  });

  it("logs one selected optional tool with the recovery history", () => {
    const onAddActivity = vi.fn();
    render(
      <RecoveryFlow
        workoutActivity={workoutActivity}
        onAddActivity={onAddActivity}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Stretch complete" }));
    fireEvent.click(screen.getByRole("button", { name: "Feeling good" }));
    fireEvent.click(screen.getByRole("button", { name: /RECOMMENDED/i }));
    fireEvent.click(screen.getByRole("button", { name: "Tool complete" }));

    expect(onAddActivity).toHaveBeenCalledTimes(1);
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "recovery",
      category: "recovery",
      details: {
        stretchingCompleted: true,
        bodyCheckIn: "feeling_good",
        relatedWorkoutActivityId: "workout-activity-1",
      },
    });
    expect(onAddActivity.mock.calls[0][0].details.recoveryToolsUsed).toHaveLength(1);
  });
});
