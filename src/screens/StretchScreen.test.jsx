import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StretchScreen } from "./StretchScreen.jsx";
import { stretchCheckKey, stretchSections } from "../data/stretches.js";

const [upperBody] = stretchSections;
const allItems = stretchSections.flatMap((section) => section.items);

function Harness({
  initialChecked = {},
  onAddActivity = vi.fn(),
  onUpdateActivity = vi.fn(),
  onAddDailyFocus = vi.fn(),
  onRemoveDailyFocus = vi.fn(),
}) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <StretchScreen
      onBack={() => {}}
      checked={checked}
      setChecked={setChecked}
      onAddActivity={(entry) => onAddActivity({ id: `activity-${onAddActivity.mock.calls.length}`, ...entry })}
      onUpdateActivity={onUpdateActivity}
      onAddDailyFocus={onAddDailyFocus}
      onRemoveDailyFocus={onRemoveDailyFocus}
    />
  );
}

const checkItems = (items) =>
  Object.fromEntries(items.map((item) => [stretchCheckKey(item), true]));

describe("StretchScreen", () => {
  it("asks whether a newly checked stretch should be today's focus", () => {
    const onAddDailyFocus = vi.fn();
    render(<Harness onAddDailyFocus={onAddDailyFocus} />);

    fireEvent.click(screen.getAllByRole("button", { pressed: false })[0]);

    expect(
      screen.getByRole("dialog", {
        name: `Add ${upperBody.items[0].name} to today's focuses?`,
      })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Yes, add focus" }));

    expect(onAddDailyFocus).toHaveBeenCalledWith({
      id: `stretch:${upperBody.items[0].key}`,
      name: upperBody.items[0].name,
      source: "stretch",
      imageQuery: `${upperBody.items[0].name} stretch`,
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the stretch checked when today's focus prompt is declined", () => {
    const onAddDailyFocus = vi.fn();
    render(<Harness onAddDailyFocus={onAddDailyFocus} />);

    fireEvent.click(screen.getAllByRole("button", { pressed: false })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));

    expect(onAddDailyFocus).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("removes a stretch from today's focuses when it is unchecked", () => {
    const onRemoveDailyFocus = vi.fn();
    render(
      <Harness
        initialChecked={checkItems([upperBody.items[0]])}
        onRemoveDailyFocus={onRemoveDailyFocus}
      />
    );

    fireEvent.click(screen.getByRole("button", { pressed: true }));

    expect(onRemoveDailyFocus).toHaveBeenCalledWith(`stretch:${upperBody.items[0].key}`);
  });

  it("filters visible stretches by body region without affecting checked state", () => {
    const [, core, lowerBody] = stretchSections;
    render(<Harness initialChecked={checkItems(upperBody.items)} />);

    expect(screen.getByText(upperBody.items[0].name)).toBeInTheDocument();
    expect(screen.getByText(core.items[0].name)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Lower Body" }));

    // Only Lower Body stretches are shown now...
    expect(screen.queryByText(upperBody.items[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(core.items[0].name)).not.toBeInTheDocument();
    expect(screen.getByText(lowerBody.items[0].name)).toBeInTheDocument();

    // ...but Upper Body's checked progress is unaffected by the filter.
    expect(screen.getByText(`${upperBody.items.length}/${allItems.length}`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText(upperBody.items[0].name)).toBeInTheDocument();
  });
});
