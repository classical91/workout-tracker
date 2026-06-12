import { T, font } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

const calmItems = [
  {
    id: "breathing",
    label: "Breathing",
    emoji: "🌬️",
    duration: "5–10 min",
    color: "#4ECDC4",
    desc: "Box, 4-7-8, belly breathing",
  },
  {
    id: "ohming",
    label: "Ohming",
    emoji: "🕉️",
    duration: "5 min",
    color: "#C77DFF",
    desc: "Meditation timer",
  },
  {
    id: "cold-shower",
    label: "Cold Shower",
    emoji: "🚿",
    duration: "2 min",
    color: "#378ADD",
    desc: "Timer + technique tips",
  },
  {
    id: "body-scan",
    label: "Body Scan",
    emoji: "🛌",
    duration: "10 min",
    color: "#2ECC71",
    desc: "Progressive wind-down",
  },
  {
    id: "calming-foods",
    label: "Calming Foods",
    emoji: "🍵",
    duration: null,
    color: "#FFD93D",
    desc: "Fruits, foods & herbs",
  },
];

export function CalmScreen({ onBack, onNavigate }) {
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
        title="Calm Down"
        subtitle="RELAX · UNWIND · RESET"
        emoji="🌙"
        color={T.teal}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 16 }}>
          Pick a way to bring your nervous system back down — slow breathing, meditation, a cold
          reset, a full-body wind-down, or what to eat and sip.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {calmItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
                color: T.text,
                font: "inherit",
                textAlign: "left",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 15 }}>
                  {item.label}
                </span>
                <span style={{ display: "block", fontSize: 11, color: T.muted, marginTop: 2 }}>
                  {item.desc}
                </span>
              </span>
              {item.duration && (
                <span
                  style={{
                    background: `${item.color}18`,
                    color: item.color,
                    borderRadius: 99,
                    padding: "4px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.duration}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
