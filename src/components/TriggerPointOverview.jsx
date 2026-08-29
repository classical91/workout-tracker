import { triggerPointSections } from "../data/triggerPoints.js";
import {
  MAP_IMAGE_HEIGHT,
  MAP_IMAGE_WIDTH,
  MAP_PANELS,
  hotspotPanelPosition,
  triggerPointHotspots,
} from "../data/triggerPointHotspots.js";
import "./triggerPointOverview.css";

const regions = triggerPointSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, color: section.color }))
);

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
        {MAP_PANELS.map((panel) => (
          <div
            key={panel.view}
            className={`trigger-point-overview__view trigger-point-overview__view--${panel.view}`}
          >
            <span className="trigger-point-overview__view-label">{panel.label}</span>
            <div
              className={`trigger-point-overview__figure trigger-point-overview__figure--${panel.view}`}
              style={{ aspectRatio: `${panel.width} / ${panel.height}` }}
            >
              <picture>
                <source srcSet="/trigger-points/body-map-overview.avif" type="image/avif" />
                <source srcSet="/trigger-points/body-map-overview.webp" type="image/webp" />
                <img
                  className="trigger-point-overview__art"
                  src="/trigger-points/body-map-overview.png"
                  width={MAP_IMAGE_WIDTH}
                  height={MAP_IMAGE_HEIGHT}
                  alt={panel.alt}
                  style={{
                    width: `${(MAP_IMAGE_WIDTH / panel.width) * 100}%`,
                    left: `${(-panel.x / panel.width) * 100}%`,
                    top: `${(-panel.y / panel.height) * 100}%`,
                  }}
                />
              </picture>
              {triggerPointHotspots
                .filter((hotspot) => hotspot.view === panel.view)
                .map((hotspot) => {
                  const position = hotspotPanelPosition(hotspot);
                  return (
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
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        "--hotspot-color": hotspot.color,
                        "--hotspot-target": `${hotspot.targetSize}%`,
                      }}
                    />
                  );
                })}
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
