import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { simpleEx } from "../data/simpleExercises.js";
import { SimpleExerciseScreen } from "./SimpleExerciseScreen.jsx";

function Harness({ onAddDailyFocus = vi.fn() }) {
  const [checked, setChecked] = useState({});
  const onAddActivity = vi.fn((activity) => ({ id: "activity-1", ...activity }));
  return (
    <SimpleExerciseScreen
      slug={simpleEx[0].slug}
      onBack={vi.fn()}
      onOpen={vi.fn()}
      checked={checked}
      setChecked={setChecked}
      onAddActivity={onAddActivity}
      onUpdateActivity={vi.fn()}
      onAddDailyFocus={onAddDailyFocus}
    />
  );
}

describe("SimpleExerciseScreen focus selection", () => {
  it("offers today's focus after the exercise is marked done", () => {
    const onAddDailyFocus = vi.fn();
    render(<Harness onAddDailyFocus={onAddDailyFocus} />);

    fireEvent.click(screen.getByRole("button", { name: "MARK AS DONE" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, add focus" }));

    expect(onAddDailyFocus).toHaveBeenCalledWith({
      id: `simple:${simpleEx[0].slug}`,
      name: simpleEx[0].name,
      source: "simple",
      imageQuery: `${simpleEx[0].name} exercise`,
    });
    expect(screen.getByRole("button", { pressed: true })).toHaveTextContent("DONE");
  });
});
