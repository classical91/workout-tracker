import { triggerPointSections } from "../data/triggerPoints.js";
import {
  MAP_IMAGE_HEIGHT,
  MAP_IMAGE_WIDTH,
  hotspotPanelX,
  triggerPointHotspots,
} from "../data/triggerPointHotspots.js";
import "./triggerPointOverview.css";

const regions = triggerPointSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, color: section.color }))
);

// The artwork is one image holding both figures side by side. Splitting it into
// two panels lets them stack on a phone, where a single half-width figure would
// leave the dots too close together to tap apart.
const panels = [
  {
    view: "anterior",
    label: "Front",
    alt: "Front view of the muscular anatomy, marked with trigger-point hotspots",
  },
  {
    view: "posterior",
    label: "Back",
    alt: "Back view of the muscular anatomy, marked with trigger-point hotspots",
  },
];

export function TriggerPointOverview({
  onSelect,
  onHotspotSelect,
  selectedHotspotId = null,
  highlightedKey = null,
}) {
  return (
    <section
      id="trigger-point-map"
      className="trigger-point-overview"
      aria-labelledby="trigger-point-map-title"
    >
      <div className="trigger-point-overview__heading">
        <div>
          <span className="trigger-point-overview__eyebrow">
            {regions.length} MYOFASCIAL REGIONS
          </span>
          <h2 id="trigger-point-map-title">Trigger-point hotspot map</h2>
        </div>
        <span className="trigger-point-overview__hint">Tap a dot</span>
      </div>

      <p className="trigger-point-overview__intro">
        Dots show commonly described tender/trigger-point locations within each muscle region.
        Locations vary between people.
      </p>

      <div className="trigger-point-overview__views">
        {panels.map((panel) => (
          <div key={panel.view} className="trigger-point-overview__view">
            <span className="trigger-point-overview__view-label">{panel.label}</span>
            <div className="trigger-point-overview__figure">
              <picture>
                <source srcSet="/trigger-points/body-map-overview.avif" type="image/avif" />
                <source srcSet="/trigger-points/body-map-overview.webp" type="image/webp" />
                <img
                  className={`trigger-point-overview__art trigger-point-overview__art--${panel.view}`}
                  src="/trigger-points/body-map-overview.png"
                  width={MAP_IMAGE_WIDTH}
                  height={MAP_IMAGE_HEIGHT}
                  alt={panel.alt}
                />
              </picture>
              {triggerPointHotspots
                .filter((hotspot) => hotspot.view === panel.view)
                .map((hotspot) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    data-testid="trigger-point-hotspot"
                    className="trigger-point-overview__hotspot"
                    aria-label={hotspot.label}
                    aria-pressed={selectedHotspotId === hotspot.id}
                    data-highlighted={hotspot.triggerPointKey === highlightedKey || undefined}
                    title={`${hotspot.name} — ${hotspot.muscle}`}
                    onClick={() => onHotspotSelect?.(hotspot)}
                    style={{
                      left: `${hotspotPanelX(hotspot)}%`,
                      top: `${hotspot.y}%`,
                      "--hotspot-color": hotspot.color,
                      "--hotspot-target": `${hotspot.targetSize}%`,
                    }}
                  >
                    <span aria-hidden="true" className="trigger-point-overview__dot" />
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <ul className="trigger-point-overview__legend" aria-label="Muscle regions on the map">
        {regions.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              aria-label={`Open details for ${item.name}`}
              onClick={() => onSelect(item.key)}
            >
              <span style={{ background: item.color }} />
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="trigger-point-overview__note">
        Tap a dot to add that region to today&apos;s focuses, or pick a region from the list to jump
        straight to its release and stretching guide.
      </p>
    </section>
  );
}
