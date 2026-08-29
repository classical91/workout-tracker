import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "../screens/HomeScreen.jsx";
import { TriggerPointsScreen } from "../screens/TriggerPointsScreen.jsx";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { useDailyReset } from "../hooks/useDailyReset.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { localDay } from "./localDay.js";
import {
  addDailyFocusToState,
  dailyFocusesFromState,
  removeDailyFocusFromState,
} from "./dailyFocus.js";

beforeAll(() => {
  window.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
  };
  Element.prototype.scrollIntoView = vi.fn();
});

// Mirrors how App.jsx wires the daily-focus state, so this exercises the same
// storage key, the same reducers and the same midnight reset the app uses.
function Harness({ screen: which = "home" }) {
  const [dailyFocusState, setDailyFocusState] = useLocalStorage(STORAGE_KEYS.dailyStretchFocus, {
    day: "",
    focuses: [],
  });
  useDailyReset(dailyFocusState.day, (today) => {
    setDailyFocusState({ day: today, focuses: [] });
  });
  const activeDailyFocuses =
    dailyFocusState.day === localDay() ? dailyFocusesFromState(dailyFocusState) : [];
  const addDailyFocus = (focus) =>
    setDailyFocusState((previous) => addDailyFocusToState(previous, focus, localDay()));
  const removeDailyFocus = (focusId) =>
    setDailyFocusState((previous) => removeDailyFocusFromState(previous, focusId, localDay()));

  const [route, setRoute] = useState(which);

  return route === "home" ? (
    <HomeScreen
      onNavigate={() => setRoute("trigger-points")}
      onStartTimer={vi.fn()}
      dailyFocuses={activeDailyFocuses}
    />
  ) : (
    <TriggerPointsScreen
      onBack={() => setRoute("home")}
      onAddActivity={vi.fn()}
      onUpdateActivity={vi.fn()}
      onAddDailyFocus={addDailyFocus}
      onRemoveDailyFocus={removeDailyFocus}
    />
  );
}

const storedFocuses = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.dailyStretchFocus)).focuses;

describe("trigger-point focuses in the shared daily-focus store", () => {
  it("saves a tapped hotspot under the existing key and shows it on Home", () => {
    const { unmount } = render(<Harness screen="trigger-points" />);

    fireEvent.click(screen.getByRole("button", { name: "Piriformis, right hotspot 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));

    expect(storedFocuses()).toEqual([
      {
        id: "trigger:piriformis-right-1",
        name: "Piriformis",
        source: "trigger",
        triggerPointKey: "piriformis",
        hotspotId: "piriformis-right-1",
        side: "right",
      },
    ]);

    // A fresh mount reads it back out of storage, still a trigger focus.
    unmount();
    render(<Harness />);
    expect(screen.getByText(/Piriformis/)).toHaveTextContent("🎯 Piriformis");
    expect(screen.getByText("Right side")).toBeInTheDocument();
  });

  it("does not add the same hotspot twice across separate visits", () => {
    const { unmount } = render(<Harness screen="trigger-points" />);
    fireEvent.click(screen.getByRole("button", { name: "Calves, left hotspot 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));
    unmount();

    render(<Harness screen="trigger-points" />);
    fireEvent.click(screen.getByRole("button", { name: "Calves, left hotspot 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));

    expect(storedFocuses()).toHaveLength(1);
  });

  it("clears trigger focuses left over from a previous day", () => {
    localStorage.setItem(
      STORAGE_KEYS.dailyStretchFocus,
      JSON.stringify({
        day: "Mon Jan 01 2024",
        focuses: [
          {
            id: "trigger:piriformis-right-1",
            name: "Piriformis",
            source: "trigger",
            triggerPointKey: "piriformis",
            hotspotId: "piriformis-right-1",
            side: "right",
          },
        ],
      })
    );

    render(<Harness />);

    expect(screen.queryByText(/Piriformis/)).toBeNull();
    expect(storedFocuses()).toEqual([]);
  });

  it("still restores a stretch focus stored in the original single-focus shape", () => {
    localStorage.setItem(
      STORAGE_KEYS.dailyStretchFocus,
      JSON.stringify({ day: localDay(), name: "Neck" })
    );

    render(<Harness />);

    expect(screen.getByRole("link", { name: "View images for Neck" })).toHaveAttribute(
      "href",
      "https://www.google.com/search?udm=2&q=Neck%20stretch"
    );
  });

  it("keeps a stretch and a trigger focus apart in one day's list", () => {
    localStorage.setItem(
      STORAGE_KEYS.dailyStretchFocus,
      JSON.stringify({
        day: localDay(),
        focuses: [
          { id: "stretch:neck", name: "Neck", source: "stretch", imageQuery: "Neck stretch" },
        ],
      })
    );

    const { unmount } = render(<Harness screen="trigger-points" />);
    fireEvent.click(screen.getByRole("button", { name: "Upper Trapezius, left hotspot 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));
    unmount();

    render(<Harness />);
    expect(screen.getByRole("link", { name: "View images for Neck" })).toBeInTheDocument();
    expect(screen.getByText(/Upper Trapezius/)).toHaveTextContent("🎯 Upper Trapezius");
    expect(storedFocuses().map((focus) => focus.source)).toEqual(["stretch", "trigger"]);
  });
});
