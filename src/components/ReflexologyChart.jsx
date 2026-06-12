import { T } from "../theme.js";
import { reflexRegions } from "../data/reflexology.js";

// Stylised palm-up hand: palm panel, four finger capsules and a thumb.
function HandSilhouette({ skin, stroke }) {
  const finger = { stroke: skin, strokeWidth: 21, strokeLinecap: "round", fill: "none" };
  return (
    <g>
      {/* palm */}
      <path
        d="M64 130 Q60 118 78 116 H150 Q156 124 152 150 Q150 200 130 222 Q108 240 86 222 Q66 204 64 168 Z"
        fill={skin}
        stroke={stroke}
        strokeWidth="2"
      />
      {/* fingers */}
      <line x1="78" y1="120" x2="78" y2="50" {...finger} />
      <line x1="100" y1="120" x2="100" y2="32" {...finger} />
      <line x1="122" y1="120" x2="122" y2="42" {...finger} />
      <line x1="144" y1="122" x2="144" y2="62" {...finger} />
      {/* thumb */}
      <line
        x1="66"
        y1="158"
        x2="36"
        y2="108"
        stroke={skin}
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

// Stylised sole: rounded body with a slight arch indent, plus five toes.
function FootSilhouette({ skin, stroke }) {
  return (
    <g>
      <path
        d="M70 92 C54 98 50 122 56 150 C60 176 50 196 56 226 C62 272 82 296 105 296
           C130 296 150 270 150 234 C150 200 158 180 152 150 C148 120 150 100 128 92
           C108 84 90 84 70 92 Z"
        fill={skin}
        stroke={stroke}
        strokeWidth="2"
      />
      {/* toes */}
      <circle cx="60" cy="42" r="16" fill={skin} stroke={stroke} strokeWidth="2" />
      <circle cx="95" cy="50" r="10" fill={skin} stroke={stroke} strokeWidth="2" />
      <circle cx="118" cy="48" r="10" fill={skin} stroke={stroke} strokeWidth="2" />
      <circle cx="138" cy="52" r="9" fill={skin} stroke={stroke} strokeWidth="2" />
      <circle cx="156" cy="61" r="8" fill={skin} stroke={stroke} strokeWidth="2" />
    </g>
  );
}

// Palm plus wrist and forearm, used for the targeted acupressure "relief" points
// (several of which sit on the wrist and forearm rather than the palm).
function ReliefSilhouette({ skin, stroke }) {
  const finger = { stroke: skin, strokeWidth: 21, strokeLinecap: "round", fill: "none" };
  return (
    <g>
      <path
        d="M64 130 Q60 118 78 116 H150 Q156 124 152 150 Q150 195 136 216 Q120 230 100 230 Q80 230 66 216 Q64 200 64 168 Z"
        fill={skin}
        stroke={stroke}
        strokeWidth="2"
      />
      <rect x="76" y="214" width="48" height="84" rx="18" fill={skin} stroke={stroke} strokeWidth="2" />
      <line x1="78" y1="120" x2="78" y2="50" {...finger} />
      <line x1="100" y1="120" x2="100" y2="32" {...finger} />
      <line x1="122" y1="120" x2="122" y2="42" {...finger} />
      <line x1="144" y1="122" x2="144" y2="62" {...finger} />
      <line
        x1="66"
        y1="158"
        x2="36"
        y2="108"
        stroke={skin}
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />
      {/* wrist crease */}
      <line x1="80" y1="220" x2="124" y2="220" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3" />
    </g>
  );
}

export function ReflexologyChart({ type, side, zones, selectedKey, onSelect }) {
  const viewBox =
    type === "hand" ? "0 0 200 250" : type === "foot" ? "0 0 200 320" : "0 0 200 300";
  const skin = "#1C1C20";
  const stroke = T.border;
  // Canonical silhouettes are drawn right-handed/right-footed; flip for the left
  // side so the thumb / big toe land on the correct edge. Zone coordinates are
  // already mirrored in the data, so only the silhouette is transformed here.
  const mirror = side === "left";

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={`${side || ""} ${type} reflexology chart`.trim()}
      style={{ width: "100%", maxWidth: 320, height: "auto", display: "block", margin: "0 auto" }}
    >
      <g transform={mirror ? "translate(200,0) scale(-1,1)" : undefined}>
        {type === "hand" && <HandSilhouette skin={skin} stroke={stroke} />}
        {type === "foot" && <FootSilhouette skin={skin} stroke={stroke} />}
        {type === "relief" && <ReliefSilhouette skin={skin} stroke={stroke} />}
      </g>

      {zones.map((zone, i) => {
        const color = zone.color || reflexRegions[zone.region].color;
        const selected = zone.key === selectedKey;
        const r = zone.r || 8.5;
        return (
          <g
            key={zone.key}
            onClick={() => onSelect(zone.key)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={zone.name}
          >
            <title>{zone.name}</title>
            {selected && (
              <circle cx={zone.x} cy={zone.y} r={r + 4} fill="none" stroke={color} strokeWidth="2" />
            )}
            <circle
              cx={zone.x}
              cy={zone.y}
              r={r}
              fill={color}
              fillOpacity={selected ? 1 : 0.78}
              stroke={selected ? T.text : color}
              strokeWidth={selected ? 1.5 : 1}
            />
            <text
              x={zone.x}
              y={zone.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fontWeight="700"
              fill="#0A0A0C"
              style={{ pointerEvents: "none" }}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
