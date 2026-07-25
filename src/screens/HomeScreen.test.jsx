import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeScreen } from "./HomeScreen.jsx";

describe("HomeScreen daily stretch focus", () => {
  it("shows the selected stretch as a small daily focus reminder", () => {
    render(
      <HomeScreen
        onNavigate={vi.fn()}
        onStartTimer={vi.fn()}
        dailyFocuses={[
          {
            id: "stretch:shoulder",
            name: "Shoulder",
            source: "stretch",
            imageQuery: "Shoulder stretch",
          },
        ]}
      />
    );

    expect(screen.getByLabelText("Today's focus")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View images for Shoulder" })).toHaveAttribute(
      "href",
      "https://www.google.com/search?udm=2&q=Shoulder%20stretch"
    );
  });

  it("shows multiple stretch and simple-exercise focuses with image links", () => {
    render(
      <HomeScreen
        onNavigate={vi.fn()}
        onStartTimer={vi.fn()}
        dailyFocuses={[
          {
            id: "stretch:neck",
            name: "Neck",
            source: "stretch",
            imageQuery: "Neck stretch",
          },
          {
            id: "simple:push-ups",
            name: "Push-Ups",
            source: "simple",
            imageQuery: "Push-Ups exercise",
          },
        ]}
      />
    );

    expect(screen.getByLabelText("Today's focuses")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View images for Neck" })).toHaveAttribute(
      "href",
      "https://www.google.com/search?udm=2&q=Neck%20stretch"
    );
    expect(screen.getByRole("link", { name: "View images for Push-Ups" })).toHaveAttribute(
      "href",
      "https://www.google.com/search?udm=2&q=Push-Ups%20exercise"
    );
  });

  it("does not show a focus reminder when none is selected", () => {
    render(<HomeScreen onNavigate={vi.fn()} onStartTimer={vi.fn()} />);

    expect(screen.queryByLabelText(/Today's focus/)).toBeNull();
    expect(screen.queryByRole("link", { name: /View images for/i })).toBeNull();
  });
});
