import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeScreen } from "./HomeScreen.jsx";

describe("HomeScreen daily stretch focus", () => {
  it("shows the selected stretch as a small daily focus reminder", () => {
    render(
      <HomeScreen
        onNavigate={vi.fn()}
        onStartTimer={vi.fn()}
        dailyStretchFocus="Shoulder"
      />
    );

    expect(screen.getByLabelText("Today's focus: Shoulder")).toBeInTheDocument();
  });

  it("does not show a focus reminder when none is selected", () => {
    render(<HomeScreen onNavigate={vi.fn()} onStartTimer={vi.fn()} />);

    expect(screen.queryByLabelText(/Today's focus:/)).toBeNull();
  });
});
