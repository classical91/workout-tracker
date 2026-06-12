import { useState } from "react";
import { T, font } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ReflexologyChart } from "../components/ReflexologyChart.jsx";
import { reflexologyIntro, reflexRegions, reflexCharts } from "../data/reflexology.js";

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

export function ReflexologyScreen({ onBack }) {
  const [type, setType] = useState("hand");
  const [side, setSide] = useState("right");
  const [selectedKey, setSelectedKey] = useState(null);

  const zones = reflexCharts[type][side];
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
          {reflexologyIntro}
        </div>

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
            {partLabel.toUpperCase()} · {viewLabel.toUpperCase()}
          </p>
          <ReflexologyChart
            type={type}
            side={side}
            zones={zones}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </div>

        {/* Selected point detail */}
        <div
          style={{
            background: selected ? `${reflexRegions[selected.region].color}10` : T.surface,
            border: `1px solid ${selected ? reflexRegions[selected.region].color + "50" : T.border}`,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 20,
            minHeight: 64,
          }}
        >
          {selected ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    background: reflexRegions[selected.region].color,
                    color: "#0A0A0C",
                    fontSize: 11,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {zones.indexOf(selected) + 1}
                </span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: reflexRegions[selected.region].color,
                  marginBottom: 6,
                }}
              >
                {selected.area.toUpperCase()}
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{selected.benefit}</div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
              Tap a numbered point on the chart, or pick one from the list below, to see what it maps
              to.
            </div>
          )}
        </div>

        {/* Grouped list */}
        {Object.entries(reflexRegions).map(([regionKey, region]) => {
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
                  <button
                    key={zone.key}
                    type="button"
                    onClick={() => setSelectedKey(active ? null : zone.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      textAlign: "left",
                      background: active ? `${region.color}14` : T.surface,
                      border: `1px solid ${active ? region.color + "55" : T.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      marginBottom: 8,
                      cursor: "pointer",
                      color: T.text,
                      fontFamily: font,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 99,
                        background: region.color,
                        color: "#0A0A0C",
                        fontSize: 11,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {zones.indexOf(zone) + 1}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>
                        {zone.name}
                      </span>
                      <span style={{ display: "block", fontSize: 11, color: T.muted }}>
                        {zone.area}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}

        <p style={{ fontSize: 11, color: T.dim, lineHeight: 1.6, marginTop: 4 }}>
          Reflexology is a relaxing complementary practice, not a medical treatment or diagnosis. See
          a healthcare professional for any health concern, and avoid pressing injured areas.
        </p>
      </div>
    </div>
  );
}
