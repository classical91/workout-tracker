import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { triggerPointSections } from "../data/triggerPoints.js";
import { TriggerPointOverview } from "./TriggerPointOverview.jsx";

describe("TriggerPointOverview", () => {
  const points = triggerPointSections.flatMap((section) => section.items);

  it("shows a marker and exact legend entry for every website trigger point", () => {
    render(<TriggerPointOverview onSelect={() => {}} />);

    expect(screen.getAllByTestId("trigger-point-marker")).toHaveLength(points.length);
    expect(screen.getByText(`COMPLETE MAP · ${points.length} POINTS`)).toBeInTheDocument();

    points.forEach((point) => {
      expect(
        screen.getByRole("button", { name: `Open details for ${point.name}` })
      ).toBeInTheDocument();
    });
  });

  it("opens the matching website detail from the map", () => {
    const onSelect = vi.fn();
    render(<TriggerPointOverview onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "Open details for Piriformis" }));

    expect(onSelect).toHaveBeenCalledWith("piriformis");
  });

  it("uses the project anatomy artwork", () => {
    render(<TriggerPointOverview onSelect={() => {}} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "/trigger-points/body-map-overview.png");
  });
});
