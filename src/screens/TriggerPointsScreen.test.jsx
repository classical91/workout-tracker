import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TriggerPointsScreen } from "./TriggerPointsScreen.jsx";
import { addDailyFocusToState, dailyFocusesFromState } from "../utils/dailyFocus.js";

beforeAll(() => {
  // The screen scrolls to a card after a selection; jsdom has neither.
  window.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
  };
  Element.prototype.scrollIntoView = vi.fn();
});

const renderScreen = (props = {}) =>
  render(
    <TriggerPointsScreen
      onBack={vi.fn()}
      onAddActivity={vi.fn()}
      onUpdateActivity={vi.fn()}
      onAddDailyFocus={vi.fn()}
      onRemoveDailyFocus={vi.fn()}
      {...props}
    />
  );

const tapHotspot = (name) => fireEvent.click(screen.getByRole("button", { name }));

describe("TriggerPointsScreen hotspots", () => {
  it("opens the focus prompt for the muscle the tapped hotspot belongs to", () => {
    renderScreen();

    tapHotspot("Upper Trapezius, left hotspot 1");

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Focus on Upper Trapezius today?");
    expect(dialog).toHaveTextContent(/upper trapezius region \(left side\)/i);
    expect(screen.getByRole("button", { name: "Yes, focus today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Not today" })).toBeInTheDocument();
  });

  it("marks the tapped hotspot as selected while the prompt is up", () => {
    renderScreen();

    tapHotspot("Piriformis, right hotspot 1");

    expect(screen.getByRole("button", { name: "Piriformis, right hotspot 1" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("adds a trigger focus carrying the muscle, hotspot and side", () => {
    const onAddDailyFocus = vi.fn();
    renderScreen({ onAddDailyFocus });

    tapHotspot("Piriformis, right hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));

    expect(onAddDailyFocus).toHaveBeenCalledWith({
      id: "trigger:piriformis-right-1",
      name: "Piriformis",
      source: "trigger",
      triggerPointKey: "piriformis",
      hotspotId: "piriformis-right-1",
      side: "right",
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Piriformis added to Today's Focus");
  });

  it("adds nothing when the prompt is dismissed", () => {
    const onAddDailyFocus = vi.fn();
    renderScreen({ onAddDailyFocus });

    tapHotspot("Calves, left hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));

    expect(onAddDailyFocus).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Calves, left hotspot 1" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("closes the prompt on Escape without adding a focus", () => {
    const onAddDailyFocus = vi.fn();
    renderScreen({ onAddDailyFocus });

    tapHotspot("Calves, left hotspot 1");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onAddDailyFocus).not.toHaveBeenCalled();
  });

  it("does not add a second focus when the same hotspot is chosen twice", () => {
    // The screen hands the same focus back each time; the daily-focus state is
    // what refuses the duplicate, so this drives the real reducer.
    let state = { day: "today", focuses: [] };
    const onAddDailyFocus = vi.fn((focus) => {
      state = addDailyFocusToState(state, focus, "today");
    });
    renderScreen({ onAddDailyFocus });

    tapHotspot("Piriformis, right hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));
    tapHotspot("Piriformis, right hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));

    expect(onAddDailyFocus).toHaveBeenCalledTimes(2);
    expect(state.focuses).toHaveLength(1);
    expect(dailyFocusesFromState(state)).toEqual([
      {
        id: "trigger:piriformis-right-1",
        name: "Piriformis",
        source: "trigger",
        triggerPointKey: "piriformis",
        hotspotId: "piriformis-right-1",
        side: "right",
      },
    ]);
  });

  it("keeps the left and right hotspot of one muscle as separate focuses", () => {
    let state = { day: "today", focuses: [] };
    const onAddDailyFocus = vi.fn((focus) => {
      state = addDailyFocusToState(state, focus, "today");
    });
    renderScreen({ onAddDailyFocus });

    tapHotspot("Piriformis, right hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));
    tapHotspot("Piriformis, left hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));

    expect(state.focuses.map((focus) => focus.id)).toEqual([
      "trigger:piriformis-right-1",
      "trigger:piriformis-left-1",
    ]);
  });

  it("takes back the focus it just added when the confirmation is undone", () => {
    const onRemoveDailyFocus = vi.fn();
    renderScreen({ onRemoveDailyFocus });

    tapHotspot("Piriformis, right hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "Yes, focus today" }));
    fireEvent.click(screen.getByRole("button", { name: "UNDO" }));

    expect(onRemoveDailyFocus).toHaveBeenCalledWith("trigger:piriformis-right-1");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("opens the matching guide card from View details", () => {
    renderScreen();

    tapHotspot("Latissimus Dorsi, left hotspot 1");
    fireEvent.click(screen.getByRole("button", { name: "View Latissimus Dorsi details" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    const card = document.getElementById("trigger-point-lats");
    expect(card.querySelector("[aria-expanded]")).toHaveAttribute("aria-expanded", "true");
    expect(card).toHaveTextContent("Ball or foam roller on side body under armpit area.");
    expect(card.scrollIntoView).toBeDefined();
  });
});

describe("TriggerPointsScreen guide cards", () => {
  it("points back at the curated map instead of a Google image search", () => {
    renderScreen();

    fireEvent.click(screen.getByRole("button", { name: "Open details for Piriformis" }));

    expect(screen.getAllByRole("button", { name: /SHOW ON BODY MAP/ }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: /VIEW IMAGES/i })).toBeNull();
    expect(
      [...document.querySelectorAll("a")].filter((link) =>
        (link.getAttribute("href") || "").includes("google.com")
      )
    ).toHaveLength(0);
  });

  it("highlights a region's hotspots when its card asks to show them on the map", () => {
    renderScreen();

    fireEvent.click(screen.getByRole("button", { name: "Open details for Latissimus Dorsi" }));
    fireEvent.click(
      document
        .getElementById("trigger-point-lats")
        .querySelector("button[type='button']:not([aria-expanded])")
    );

    const highlighted = screen
      .getAllByTestId("trigger-point-hotspot")
      .filter((button) => button.hasAttribute("data-highlighted"));
    expect(highlighted).toHaveLength(2);
    highlighted.forEach((button) => {
      expect(button.getAttribute("aria-label")).toMatch(/^Latissimus Dorsi/);
    });
  });

  it("keeps the instructional video link", () => {
    renderScreen();

    fireEvent.click(screen.getByRole("button", { name: "Open details for Piriformis" }));

    expect(screen.getByRole("link", { name: /WATCH DEMO/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=1Ei-c9pXlIY"
    );
  });
});

describe("TriggerPointsScreen naming", () => {
  it("uses the anatomical names and does not call the plantar fascia a muscle", () => {
    renderScreen();

    expect(
      screen.getByRole("button", { name: "Open details for Posterior Deltoid" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open details for Rear Deltoid" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Open details for Iliopsoas / Hip Flexors" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Sole of foot (fascia)").length).toBeGreaterThan(0);
  });

  it("marks the plantar fascia on the sole side of the foot, not the top", () => {
    renderScreen();

    [
      "Plantar Fascia, right hotspot 1",
      "Plantar Fascia, right hotspot 2",
      "Plantar Fascia, right hotspot 3",
    ].forEach((name) => {
      const button = screen.getByRole("button", { name });
      expect(button.closest(".trigger-point-overview__view")).toHaveTextContent(
        "Foot / Plantar"
      );
    });
  });
});
