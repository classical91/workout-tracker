import { T } from "../theme.js";
import { quickActivities } from "../data/quickActivities.js";

// A compact list of one-tap activities. Tapping a row starts a timer for that
// activity; finishing the timer records a session to the exercise log.
export function QuickLog({ onStart }) {
  return (
    <div style={{ marginTop: 20 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: T.muted,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        QUICK LOG
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {quickActivities.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onStart(a)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = a.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "10px 14px",
              cursor: "pointer",
              color: T.text,
              font: "inherit",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 22 }}>{a.emoji}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{a.name}</span>
            <span
              style={{
                background: `${a.color}18`,
                color: a.color,
                borderRadius: 99,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {a.duration}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>▶</span>
          </button>
        ))}
      </div>
    </div>
  );
}
