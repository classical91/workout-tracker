import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeeklyPlanScreen, monthGrid } from "./WeeklyPlanScreen.jsx";

describe("monthGrid", () => {
  it("pads November 2026 to whole Mon–Sun weeks", () => {
    const cells = monthGrid(2026, 10);
    // Nov 1 2026 is a Sunday, so six leading blanks.
    expect(cells.slice(0, 6).every((c) => c === null)).toBe(true);
    expect(cells[6].getDate()).toBe(1);
    expect(cells.length % 7).toBe(0);
    expect(cells.filter(Boolean)).toHaveLength(30);
  });
});

describe("WeeklyPlanScreen month view", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 3, 10, 0)); // Tue Nov 3 2026
  });
  afterEach(() => vi.useRealTimers());

  it("shows every day of the month with its workout, defaulting to month view", () => {
    render(<WeeklyPlanScreen onBack={() => {}} onNavigate={() => {}} />);
    expect(screen.getByText("November 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Monday, November 30: Strength/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tuesday, November 3/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("moves to the next month and selects a day's plan", () => {
    render(<WeeklyPlanScreen onBack={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Show next month" }));
    expect(screen.getByText("December 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Monday, December 14/ }));
    expect(screen.getByText(/MON, DEC 14 ·/)).toBeInTheDocument();
    expect(screen.getByText("Workout 1 — Upper & Lower Dumbbell")).toBeInTheDocument();
  });

  it("still offers the week list", () => {
    render(<WeeklyPlanScreen onBack={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole("tab", { name: "Week" }));
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getAllByText(/day$/).length).toBeGreaterThanOrEqual(7);
  });
});

describe("WeeklyPlanScreen stretching day", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 5, 10, 0)); // Thu Nov 5 2026
  });
  afterEach(() => vi.useRealTimers());

  it("pairs the stretch with one add-on, linking the ones that have a screen", () => {
    const onNavigate = vi.fn();
    render(<WeeklyPlanScreen onBack={() => {}} onNavigate={onNavigate} />);
    const group = screen.getByRole("group", { name: "Pair It With One" });
    for (const name of [
      "Breathing",
      "Sauna",
      "Swimming",
      "Running",
      "Biking",
      "Paddle Boarding",
      "Massage Gun",
    ]) {
      expect(group).toHaveTextContent(name);
    }

    fireEvent.click(screen.getByRole("button", { name: /Sauna/ }));
    expect(onNavigate).toHaveBeenCalledWith("sauna");
    fireEvent.click(screen.getByRole("button", { name: /Breathing/ }));
    expect(onNavigate).toHaveBeenCalledWith("breathing");
    // Logged from the home screen, so nothing to jump to.
    expect(screen.queryByRole("button", { name: /Paddle Boarding/ })).toBeNull();
  });
});
