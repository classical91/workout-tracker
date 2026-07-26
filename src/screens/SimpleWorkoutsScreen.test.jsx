import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { simpleEx } from "../data/simpleExercises.js";
import { SimpleWorkoutsScreen } from "./SimpleWorkoutsScreen.jsx";

function Harness({ onAddDailyFocus = vi.fn(), onRemoveDailyFocus = vi.fn() }) {
  const [checked, setChecked] = useState({});
  return (
    <SimpleWorkoutsScreen
      onBack={vi.fn()}
      onOpen={vi.fn()}
      checked={checked}
      setChecked={setChecked}
      onAddDailyFocus={onAddDailyFocus}
      onRemoveDailyFocus={onRemoveDailyFocus}
    />
  );
}

describe("SimpleWorkoutsScreen focus selection", () => {
  it("asks to add a newly checked exercise to today's focuses", () => {
    const onAddDailyFocus = vi.fn();
    render(<Harness onAddDailyFocus={onAddDailyFocus} />);

    fireEvent.click(
      screen.getByRole("button", { name: `Mark ${simpleEx[0].name} as done` })
    );
    expect(
      screen.getByRole("dialog", { name: `Add ${simpleEx[0].name} to today's focuses?` })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Yes, add focus" }));
    expect(onAddDailyFocus).toHaveBeenCalledWith({
      id: `simple:${simpleEx[0].slug}`,
      name: simpleEx[0].name,
      source: "simple",
      imageQuery: `${simpleEx[0].name} exercise`,
    });
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("keeps the exercise checked when the focus prompt is declined", () => {
    render(<Harness />);

    fireEvent.click(
      screen.getByRole("button", { name: `Mark ${simpleEx[0].name} as done` })
    );
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));

    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("removes the exercise focus when its checkmark is cleared", () => {
    const onRemoveDailyFocus = vi.fn();
    render(<Harness onRemoveDailyFocus={onRemoveDailyFocus} />);

    fireEvent.click(
      screen.getByRole("button", { name: `Mark ${simpleEx[0].name} as done` })
    );
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));
    fireEvent.click(screen.getByRole("button", { pressed: true }));

    expect(onRemoveDailyFocus).toHaveBeenCalledWith(`simple:${simpleEx[0].slug}`);
  });
});
