import { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StretchScreen } from "./StretchScreen.jsx";
import { stretchCheckKey, stretchSections } from "../data/stretches.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

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

describe("StretchScreen logging", () => {
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

  it("auto-logs checked-but-unlogged stretches when leaving the screen", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={checkItems([upperBody.items[0]])} onAddActivity={onAddActivity} />
    );

    // Nothing logged while on the screen — the user never tapped the button.
    expect(onAddActivity).not.toHaveBeenCalled();

    unmount();

    expect(onAddActivity).toHaveBeenCalledTimes(1);
    expect(onAddActivity.mock.calls[0][0]).toMatchObject({ type: "stretch", completed: false });
    expect(onAddActivity.mock.calls[0][0].details.bodyAreas).toEqual([upperBody.items[0].name]);
  });

  it("does not re-log on leave when the session was just logged manually", () => {
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={checkItems(upperBody.items)} onAddActivity={onAddActivity} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Log this session/i }));
    expect(onAddActivity).toHaveBeenCalledTimes(1);

    // Leaving with the completion form still open must not double-log the same
    // stretches (they're already recorded).
    unmount();
    expect(onAddActivity).toHaveBeenCalledTimes(1);
  });

  it("keeps a logged stretch checked and does not re-log it on the same day", () => {
    // A stretch checked and already logged earlier today, restored from storage.
    const today = new Date().toDateString();
    const loggedKey = stretchCheckKey(upperBody.items[0]);
    localStorage.setItem(
      STORAGE_KEYS.stretchSession,
      JSON.stringify({ day: today, logged: { [loggedKey]: true } })
    );
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={checkItems([upperBody.items[0]])} onAddActivity={onAddActivity} />
    );

    // Already logged today → still checked, but no button and no re-log.
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    unmount();
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("clears stretch checkmarks on a new local day without logging them", () => {
    // Checks belong to a previous day; opening the screen today resets them.
    localStorage.setItem(
      STORAGE_KEYS.stretchSession,
      JSON.stringify({ day: "Mon Jan 01 2001", logged: {} })
    );
    const onAddActivity = vi.fn((entry) => entry);
    const { unmount } = render(
      <Harness initialChecked={checkItems(upperBody.items)} onAddActivity={onAddActivity} />
    );

    // Stale-day checks are wiped: nothing is pressed, no button, nothing logged.
    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    unmount();
    expect(onAddActivity).not.toHaveBeenCalled();
  });

  it("clears stretch checkmarks when midnight passes with the screen open", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 11:59pm, one minute before the day rolls over.
    vi.setSystemTime(new Date(2024, 0, 1, 23, 59, 0));
    const onAddActivity = vi.fn((entry) => entry);
    render(
      <Harness initialChecked={checkItems(upperBody.items)} onAddActivity={onAddActivity} />
    );
    expect(screen.getAllByRole("button", { pressed: true }).length).toBe(upperBody.items.length);

    // Cross midnight without remounting: the scheduled reset wipes the checks.
    await act(async () => {
      vi.setSystemTime(new Date(2024, 0, 2, 0, 0, 2));
      await vi.advanceTimersByTimeAsync(2 * 60 * 1000);
    });
    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
    expect(screen.queryByRole("button", { name: /Log this session/i })).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.stretchSession))).toEqual({
      day: new Date(2024, 0, 2).toDateString(),
      logged: {},
    });
    vi.useRealTimers();
  });

  it("clears stretch checkmarks when the app is reopened after midnight", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2024, 0, 1, 23, 59, 0));
    render(<Harness initialChecked={checkItems(upperBody.items)} />);
    expect(screen.getAllByRole("button", { pressed: true }).length).toBe(upperBody.items.length);

    // The device slept through midnight, so the timer never fired on time —
    // refocusing the app is what notices the new day.
    vi.setSystemTime(new Date(2024, 0, 3, 9, 0, 0));
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
    vi.useRealTimers();
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
