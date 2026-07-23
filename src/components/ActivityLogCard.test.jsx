import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityLogCard } from "./ActivityLogCard.jsx";
import { stretchSections } from "../data/stretches.js";

const [upperBody, core] = stretchSections;

const baseEntry = {
  id: "e1",
  ts: Date.now(),
  type: "stretch",
  category: "mobility",
  emoji: "🧘",
  color: "#2ECC71",
  duration: "",
  completed: false,
  note: "",
  details: {},
};

const holdFor = (item, section) => ({
  name: item.name,
  planned: item.hold,
  region: section.label,
  color: section.color,
});

describe("ActivityLogCard name highlighting", () => {
  it("colors a named body part to match its region", () => {
    const neck = upperBody.items[0];
    const entry = {
      ...baseEntry,
      name: `Partial Stretch (${neck.name})`,
      details: { holds: [holdFor(neck, upperBody)] },
    };
    render(<ActivityLogCard entry={entry} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    const highlighted = screen.getByText(neck.name);
    expect(highlighted.style.color).not.toBe("");
    expect(highlighted).toHaveStyle({ color: upperBody.color });
  });

  it("colors each body part independently when multiple regions are involved", () => {
    const neck = upperBody.items[0];
    const abs = core.items[0];
    const entry = {
      ...baseEntry,
      name: `Partial Stretch (${neck.name}, ${abs.name})`,
      details: { holds: [holdFor(neck, upperBody), holdFor(abs, core)] },
    };
    render(<ActivityLogCard entry={entry} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(neck.name)).toHaveStyle({ color: upperBody.color });
    expect(screen.getByText(abs.name)).toHaveStyle({ color: core.color });
  });

  it("colors a whole-region title using the region's own color", () => {
    const entry = {
      ...baseEntry,
      name: "Upper Body Stretch",
      details: { holds: upperBody.items.map((item) => holdFor(item, upperBody)) },
    };
    render(<ActivityLogCard entry={entry} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Upper Body")).toHaveStyle({ color: upperBody.color });
  });

  it("leaves non-stretch activity names uncolored, even with a matching word", () => {
    const entry = {
      ...baseEntry,
      type: "workout",
      name: "Core Blast",
      details: {},
    };
    render(<ActivityLogCard entry={entry} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    const title = screen.getByText("Core Blast");
    expect(title.querySelector("span")).toBeNull();
  });
});
