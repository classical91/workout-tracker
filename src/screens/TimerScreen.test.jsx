import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TimerScreen } from "./TimerScreen.jsx";

const activity = {
  id: "activity-1",
  type: "cold_shower",
  category: "cold",
  name: "Cold Shower",
  emoji: "🚿",
  color: "#378ADD",
  duration: "1 sec",
  details: { completedTimer: true },
};

describe("TimerScreen logging", () => {
  afterEach(() => vi.useRealTimers());

  it("logs only after the timer completes", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn(() => activity);
    render(
      <TimerScreen
        title="Cold Shower"
        subtitle="TEST"
        emoji="🚿"
        color="#378ADD"
        defaultMins={1 / 60}
        onBack={() => {}}
        onComplete={onComplete}
        onUpdateActivity={() => {}}
      />
    );
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "START" }));
    act(() => vi.advanceTimersByTime(1000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.results[0].value).toMatchObject({
      type: "cold_shower",
      duration: "1 sec",
    });
  });

  it("does not log when reset or cancelled", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn(() => activity);
    const onBack = vi.fn();
    render(
      <TimerScreen
        title="Cold Shower"
        subtitle="TEST"
        emoji="🚿"
        color="#378ADD"
        defaultMins={1 / 60}
        onBack={onBack}
        onComplete={onComplete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "START" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole("button", { name: /Back/i }));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
