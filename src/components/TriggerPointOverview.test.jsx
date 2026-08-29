import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { triggerPointSections } from "../data/triggerPoints.js";
import {
  MAP_PANELS,
  NON_INTERACTIVE_BAKED_DOTS,
  hotspotPanelPosition,
  triggerPointHotspots,
} from "../data/triggerPointHotspots.js";
import { TriggerPointOverview } from "./TriggerPointOverview.jsx";

const regions = triggerPointSections.flatMap((section) => section.items);

describe("TriggerPointOverview", () => {
  it("renders a button for every hotspot and a legend entry for every region", () => {
    render(<TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />);

    expect(screen.getAllByTestId("trigger-point-hotspot")).toHaveLength(
      triggerPointHotspots.length
    );
    expect(triggerPointHotspots).toHaveLength(54);
    expect(screen.getByText(`${regions.length} MYOFASCIAL REGIONS`)).toBeInTheDocument();
    expect(screen.getByText("Trigger-point hotspot map")).toBeInTheDocument();

    regions.forEach((region) => {
      expect(
        screen.getByRole("button", { name: `Open details for ${region.name}` })
      ).toBeInTheDocument();
    });
  });

  it("describes the dots as approximate rather than exact coordinates", () => {
    render(<TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />);

    expect(
      screen.getByText(/commonly described tender\/trigger-point locations/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Locations vary between people/i)).toBeInTheDocument();
    expect(screen.queryByText(/COMPLETE MAP/i)).toBeNull();
  });

  it("gives every hotspot a label naming its muscle, side and number", () => {
    render(<TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />);

    expect(
      screen.getByRole("button", { name: "Upper Trapezius, left hotspot 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Posterior Deltoid, right hotspot 2" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Piriformis, right hotspot 1" })).toBeInTheDocument();
  });

  it("reports the hotspot that was tapped", () => {
    const onHotspotSelect = vi.fn();
    render(<TriggerPointOverview onSelect={() => {}} onHotspotSelect={onHotspotSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "Piriformis, right hotspot 1" }));

    expect(onHotspotSelect).toHaveBeenCalledTimes(1);
    expect(onHotspotSelect.mock.calls[0][0]).toMatchObject({
      triggerPointKey: "piriformis",
      side: "right",
      view: "posterior",
    });
  });

  it("still opens a region's details from the legend", () => {
    const onSelect = vi.fn();
    render(<TriggerPointOverview onSelect={onSelect} onHotspotSelect={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Open details for Piriformis" }));

    expect(onSelect).toHaveBeenCalledWith("piriformis");
  });

  it("marks the selected hotspot as pressed and leaves the rest alone", () => {
    render(
      <TriggerPointOverview
        onSelect={() => {}}
        onHotspotSelect={() => {}}
        selectedHotspotId="piriformis-right-1"
      />
    );

    expect(screen.getByRole("button", { name: "Piriformis, right hotspot 1" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Piriformis, left hotspot 1" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(
      screen
        .getAllByTestId("trigger-point-hotspot")
        .filter((button) => button.getAttribute("aria-pressed") === "true")
    ).toHaveLength(1);
  });

  it("highlights every hotspot of the region a card asked to show", () => {
    render(
      <TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} highlightedKey="lats" />
    );

    const highlighted = screen
      .getAllByTestId("trigger-point-hotspot")
      .filter((button) => button.hasAttribute("data-highlighted"));

    expect(highlighted).toHaveLength(
      triggerPointHotspots.filter((hotspot) => hotspot.triggerPointKey === "lats").length
    );
  });

  it("serves modern image formats with the PNG as the fallback", () => {
    const { container } = render(
      <TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />
    );

    const images = screen.getAllByRole("img");
    images.forEach((image) => {
      expect(image).toHaveAttribute("src", "/trigger-points/body-map-overview.png");
      // Intrinsic size on the tag plus a fixed aspect ratio in CSS: the dots
      // have somewhere to sit before the artwork arrives, so nothing shifts.
      expect(image).toHaveAttribute("width", "971");
      expect(image).toHaveAttribute("height", "1619");
    });

    const types = [...container.querySelectorAll("source")].map((source) =>
      source.getAttribute("type")
    );
    expect(types).toContain("image/avif");
    expect(types).toContain("image/webp");
  });

  it("positions hotspots in percentages so they hold at any map size", () => {
    render(<TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />);

    screen.getAllByTestId("trigger-point-hotspot").forEach((button) => {
      expect(button.style.left).toMatch(/%$/);
      expect(button.style.top).toMatch(/%$/);
    });
  });

  it("uses stacked front, back and dedicated plantar panels", () => {
    const { container } = render(
      <TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />
    );

    expect(container.querySelectorAll(".trigger-point-overview__view")).toHaveLength(3);
    expect(screen.getByText("Front")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Foot / Plantar")).toBeInTheDocument();

    // Each panel holds only its own figure's hotspots, so no dot is rendered
    // twice and every one lands inside the half it belongs to.
    const panels = [...container.querySelectorAll(".trigger-point-overview__figure")];
    const perPanel = panels.map(
      (panel) => panel.querySelectorAll("[data-testid='trigger-point-hotspot']").length
    );
    expect(perPanel.reduce((total, count) => total + count, 0)).toBe(
      triggerPointHotspots.length
    );
    expect(perPanel[0]).toBe(
      triggerPointHotspots.filter((hotspot) => hotspot.view === "anterior").length
    );
    expect(perPanel[2]).toBe(3);
  });

  it("does not draw a second visible dot over the baked artwork", () => {
    const { container } = render(
      <TriggerPointOverview onSelect={() => {}} onHotspotSelect={() => {}} />
    );

    expect(container.querySelector(".trigger-point-overview__dot")).toBeNull();
    screen.getAllByTestId("trigger-point-hotspot").forEach((button) => {
      expect(button).toBeEmptyDOMElement();
    });
  });

  it("keeps every circular target short of every other baked-dot centre", () => {
    const allBakedDots = [...triggerPointHotspots, ...NON_INTERACTIVE_BAKED_DOTS];

    [278, 348, 458, 486].forEach((panelWidth) => {
      triggerPointHotspots.forEach((hotspot) => {
        const panel = MAP_PANELS.find((entry) => entry.view === hotspot.view);
        const point = hotspotPanelPosition(hotspot);
        const targetRadius = Math.min((panelWidth * hotspot.targetSize) / 100, 44) / 2;

        allBakedDots.forEach((other) => {
          if (other === hotspot || other.view !== hotspot.view) return;
          const otherPoint = hotspotPanelPosition(other);
          const dx = ((point.x - otherPoint.x) * panelWidth) / 100;
          const dy =
            ((point.y - otherPoint.y) * panelWidth * (panel.height / panel.width)) / 100;
          expect(targetRadius).toBeLessThan(Math.hypot(dx, dy));
        });
      });
    });
  });
});
