import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StretchScreen } from "./StretchScreen.jsx";
import { stretchCheckKey, stretchSections } from "../data/stretches.js";

const [upperBody] = stretchSections;
const allItems = stretchSections.flatMap((section) => section.items);

function Harness({ initialChecked = {}, onAddActivity = vi.fn(), onUpdateActivity = vi.fn() }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <StretchScreen
      onBack={() => {}}
      checked={checked}
      setChecked={setChecked}
      onAddActivity={(entry) => onAddActivity({ id: `activity-${onAddActivity.mock.calls.length}`, ...entry })}
      onUpdateActivity={onUpdateActivity}
    />
  );
}

const checkItems = (items) =>
  Object.fromEntries(items.map((item) => [stretchCheckKey(item), true]));

describe("StretchScreen logging", () => {
  it("auto-logs a full body stretch when the last item is checked", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    const initialChecked = checkItems(allItems.slice(0, -1));
    render(<Harness initialChecked={initialChecked} onAddActivity={onAddActivity} />);

    // Exactly one stretch toggle is still unchecked (aria-pressed=false).
    fireEvent.click(screen.getByRole("button", { pressed: false }));

    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "stretch",
      category: "mobility",
      name: "Full Body Stretch",
      completed: true,
    });
    expect(onAddActivity.mock.calls[0][0].details.bodyAreas).toHaveLength(allItems.length);
  });

  it("does not log an already-complete routine on first render", () => {
    const onAddActivity = vi.fn((entry) => entry);
    render(<Harness initialChecked={checkItems(allItems)} onAddActivity={onAddActivity} />);
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("logs a partial session via the manual button, named by completed region", async () => {
    const onAddActivity = vi.fn((entry) => entry);
    render(<Harness initialChecked={checkItems(upperBody.items)} onAddActivity={onAddActivity} />);

    fireEvent.click(screen.getByRole("button", { name: /Log this session/i }));

    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({
      type: "stretch",
      name: "Upper Body Stretch",
      completed: false,
    });
    expect(onAddActivity.mock.calls[0][0].details.completedSections).toEqual(["Upper Body"]);
  });

  it("hides the manual button until at least one stretch is checked", () => {
    render(<Harness />);
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
  });

  it("keeps a stretch checked after the form when it was added post-log", async () => {
    // Log Neck, then check Shoulder while the details form is still open, then
    // dismiss. Shoulder must survive (only the logged Neck is cleared).
    const onAddActivity = vi.fn((entry) => entry);
    render(<Harness initialChecked={checkItems([upperBody.items[0]])} onAddActivity={onAddActivity} />);

    fireEvent.click(screen.getByRole("button", { name: /Log this session/i }));
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1));
    expect(onAddActivity.mock.calls[0][0].name).toBe(`Partial Stretch (${upperBody.items[0].name})`);

    // With Neck checked, the first unchecked toggle in DOM order is Shoulder.
    // Check it while the "Skip" form is showing, then dismiss.
    fireEvent.click(screen.getAllByRole("button", { pressed: false })[0]);
    fireEvent.click(screen.getByRole("button", { name: /^Skip$/ }));

    // Shoulder is still checked, so the manual button is back and Neck was the
    // only thing logged.
    expect(screen.getByRole("button", { name: /Log this session/i })).toBeInTheDocument();
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });
});
