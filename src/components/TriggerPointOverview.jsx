import { triggerPointSections } from "../data/triggerPoints.js";
import "./triggerPointOverview.css";

const markerPositions = {
  suboccipitals: { left: 74.5, top: 11.5 },
  "upper-traps": { left: 80, top: 18.6 },
  "levator-scapulae": { left: 70.5, top: 20.8 },
  "pec-major": { left: 29, top: 23.8 },
  "pec-minor": { left: 39, top: 24.8 },
  "rear-delt": { left: 88.5, top: 24 },
  rhomboids: { left: 75.2, top: 28.2 },
  infraspinatus: { left: 67.4, top: 26.8 },
  lats: { left: 62.4, top: 34.2 },
  ql: { left: 68.5, top: 42.2 },
  "glute-max": { left: 78, top: 51.3 },
  "glute-med": { left: 67.2, top: 48.4 },
  piriformis: { left: 70.5, top: 54.5 },
  "hip-flexors": { left: 30.8, top: 46.8 },
  quads: { left: 30.8, top: 59.2 },
  hamstrings: { left: 80.2, top: 64.3 },
  calves: { left: 80.5, top: 77 },
  tibialis: { left: 30.5, top: 76 },
  plantar: { left: 32.4, top: 91.5 },
};

const overviewPoints = triggerPointSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    color: section.color,
    position: markerPositions[item.key],
  }))
);

export function TriggerPointOverview({ onSelect }) {
  return (
    <section className="trigger-point-overview" aria-labelledby="trigger-point-map-title">
      <div className="trigger-point-overview__heading">
        <div>
          <span className="trigger-point-overview__eyebrow">
            COMPLETE MAP · {overviewPoints.length} POINTS
          </span>
          <h2 id="trigger-point-map-title">Full-body trigger point guide</h2>
        </div>
        <span className="trigger-point-overview__hint">Tap a number</span>
      </div>

      <div className="trigger-point-overview__figure">
        <img
          src="/trigger-points/body-map-overview.png"
          alt="Front and back muscular anatomy views used to locate the trigger points listed below"
        />
        {overviewPoints.map((item, index) => (
          <button
            key={item.key}
            type="button"
            data-testid="trigger-point-marker"
            className="trigger-point-overview__marker"
            aria-label={`${index + 1}. ${item.name} — ${item.muscle}`}
            title={`${item.name} — ${item.muscle}`}
            onClick={() => onSelect(item.key)}
            style={{
              left: `${item.position.left}%`,
              top: `${item.position.top}%`,
              background: item.color,
              animationDelay: `${Math.min(index * 35, 500)}ms`,
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <ol className="trigger-point-overview__legend" aria-label="Trigger point map legend">
        {overviewPoints.map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              aria-label={`Open details for ${item.name}`}
              onClick={() => onSelect(item.key)}
            >
              <span style={{ background: item.color }}>{index + 1}</span>
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <p className="trigger-point-overview__note">
        Use the map to locate the muscle region, then open its guide below for release and
        stretching instructions.
      </p>
    </section>
  );
}
