import { useState } from "react";
import { T, font } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ReflexologyChart } from "../components/ReflexologyChart.jsx";
import {
  reflexologyIntro,
  reflexRegions,
  reflexCharts,
  reliefIntro,
  reliefPoints,
  concernColors,
} from "../data/reflexology.js";

const ACCENT = T.teal;

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
      {options.map(([key, label]) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: "11px 0",
              borderRadius: 12,
              border: `1px solid ${active ? ACCENT : T.border}`,
              background: active ? `${ACCENT}1A` : T.surface,
              color: active ? ACCENT : T.muted,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.5,
              cursor: "pointer",
              fontFamily: font,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function NumberBadge({ n, color }) {
  return (
    <span
      style={{
        width: 24,
        height: 24,
        borderRadius: 99,
        background: color,
        color: "#0A0A0C",
        fontSize: 11,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}

function ConcernTags({ concerns }) {
  return (
    <span style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {concerns.map((c) => {
        const color = concernColors[c] || ACCENT;
        return (
          <span
            key={c}
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.5,
              color,
              background: `${color}1A`,
              borderRadius: 99,
              padding: "2px 8px",
            }}
          >
            {c.toUpperCase()}
          </span>
        );
      })}
    </span>
  );
}

export function ReflexologyScreen({ onBack }) {
  const [mode, setMode] = useState("map");
  const [type, setType] = useState("hand");
  const [side, setSide] = useState("right");
  const [selectedKey, setSelectedKey] = useState(null);

  const isRelief = mode === "relief";
  const zones = isRelief ? reliefPoints : reflexCharts[type][side];
  const selected = zones.find((z) => z.key === selectedKey) || null;

  const change = (setter) => (value) => {
    setter(value);
    setSelectedKey(null);
  };

  const partLabel = `${side === "left" ? "Left" : "Right"} ${type === "hand" ? "Hand" : "Foot"}`;
  const viewLabel = type === "hand" ? "palm up" : "sole up";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: font,
        color: T.text,
        paddingBottom: 60,
      }}
    >
      <ScreenHeader
        title="Reflexology"
        subtitle="HANDS · FEET · PRESSURE MAP"
        emoji="🖐️"
        color={ACCENT}
        onBack={onBack}
      />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 12 }}>
          <Toggle
            options={[
              ["map", "🗺️ Organ Map"],
              ["relief", "🎯 Relief Points"],
            ]}
            value={mode}
            onChange={change(setMode)}
          />
        </div>

        <div
          style={{
            background: `${ACCENT}12`,
            border: `1px solid ${ACCENT}35`,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: T.text,
            lineHeight: 1.6,
          }}
        >
          {isRelief ? reliefIntro : reflexologyIntro}
        </div>

        {!isRelief && (
          <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <Toggle
              options={[
                ["hand", "🖐️ Hands"],
                ["foot", "🦶 Feet"],
              ]}
              value={type}
              onChange={change(setType)}
            />
            <Toggle
              options={[
                ["right", "Right"],
                ["left", "Left"],
              ]}
              value={side}
              onChange={change(setSide)}
            />
          </div>
        )}

        {/* Chart */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "14px 12px 18px",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 10,
              letterSpacing: 2,
              color: T.muted,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {isRelief ? "HAND & WRIST · PALM UP" : `${partLabel.toUpperCase()} · ${viewLabel.toUpperCase()}`}
          </p>
          <ReflexologyChart
            type={isRelief ? "relief" : type}
            side={isRelief ? undefined : side}
            zones={zones}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </div>

        {/* Selected point detail */}
        {isRelief ? (
          <ReliefDetail selected={selected} zones={zones} />
        ) : (
          <OrganDetail selected={selected} zones={zones} />
        )}

        {/* List */}
        {isRelief ? (
          <ReliefList zones={zones} selectedKey={selectedKey} onSelect={setSelectedKey} />
        ) : (
          <OrganList zones={zones} selectedKey={selectedKey} onSelect={setSelectedKey} />
        )}

        <p style={{ fontSize: 11, color: T.dim, lineHeight: 1.6, marginTop: 4 }}>
          Reflexology and acupressure are relaxing complementary practices, not a medical treatment
          or diagnosis. See a healthcare professional for any health concern, avoid pressing injured
          areas, and follow the cautions noted on individual points.
        </p>
      </div>
    </div>
  );
}

// ---------- Organ map detail + list ----------
function OrganDetail({ selected, zones }) {
  const color = selected ? reflexRegions[selected.region].color : T.border;
  return (
    <div
      style={{
        background: selected ? `${color}10` : T.surface,
        border: `1px solid ${selected ? color + "50" : T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 20,
        minHeight: 64,
      }}
    >
      {selected ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <NumberBadge n={zones.indexOf(selected) + 1} color={color} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</span>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              color,
              marginBottom: 6,
            }}
          >
            {selected.area.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{selected.benefit}</div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          Tap a numbered point on the chart, or pick one from the list below, to see what it maps to.
        </div>
      )}
    </div>
  );
}

function OrganList({ zones, selectedKey, onSelect }) {
  return Object.entries(reflexRegions).map(([regionKey, region]) => {
    const items = zones.filter((z) => z.region === regionKey);
    if (items.length === 0) return null;
    return (
      <div key={regionKey} style={{ marginBottom: 18 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 2,
            color: region.color,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 8,
          }}
        >
          {region.label.toUpperCase()}
        </p>
        {items.map((zone) => {
          const active = zone.key === selectedKey;
          return (
            <ListRow
              key={zone.key}
              active={active}
              color={region.color}
              n={zones.indexOf(zone) + 1}
              title={zone.name}
              subtitle={zone.area}
              onClick={() => onSelect(active ? null : zone.key)}
            />
          );
        })}
      </div>
    );
  });
}

// ---------- Relief points detail + list ----------
function ReliefDetail({ selected, zones }) {
  const color = selected ? selected.color : T.border;
  return (
    <div
      style={{
        background: selected ? `${color}10` : T.surface,
        border: `1px solid ${selected ? color + "50" : T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 20,
        minHeight: 64,
      }}
    >
      {selected ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <NumberBadge n={zones.indexOf(selected) + 1} color={color} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 0.5 }}>
              {selected.code}
            </span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <ConcernTags concerns={selected.concerns} />
          </div>
          {[
            ["WHERE", selected.location],
            ["HOW TO PRESS", selected.howto],
          ].map(([heading, text]) => (
            <div key={heading} style={{ marginBottom: 8 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  color,
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 3,
                }}
              >
                {heading}
              </span>
              <span style={{ display: "block", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                {text}
              </span>
            </div>
          ))}
          {selected.caution && (
            <div
              style={{
                background: `${T.red}12`,
                borderLeft: `3px solid ${T.red}`,
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 11,
                color: T.red,
                lineHeight: 1.5,
              }}
            >
              ⚠️ {selected.caution}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          Tap a numbered point on the chart, or pick one from the list below, to see where it is and
          how to press it.
        </div>
      )}
    </div>
  );
}

function ReliefList({ zones, selectedKey, onSelect }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 10,
          marginTop: 8,
        }}
      >
        PRESSURE POINTS
      </p>
      {zones.map((zone) => {
        const active = zone.key === selectedKey;
        return (
          <button
            key={zone.key}
            type="button"
            onClick={() => onSelect(active ? null : zone.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              textAlign: "left",
              background: active ? `${zone.color}14` : T.surface,
              border: `1px solid ${active ? zone.color + "55" : T.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 8,
              cursor: "pointer",
              color: T.text,
              fontFamily: font,
            }}
          >
            <NumberBadge n={zones.indexOf(zone) + 1} color={zone.color} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>{zone.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: zone.color }}>{zone.code}</span>
              </span>
              <ConcernTags concerns={zone.concerns} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ListRow({ active, color, n, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        background: active ? `${color}14` : T.surface,
        border: `1px solid ${active ? color + "55" : T.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
        color: T.text,
        fontFamily: font,
      }}
    >
      <NumberBadge n={n} color={color} />
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>{title}</span>
        <span style={{ display: "block", fontSize: 11, color: T.muted }}>{subtitle}</span>
      </span>
    </button>
  );
}
