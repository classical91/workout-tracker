import { T, buttonReset } from "../theme.js";

export function ActivityCard({ activity, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(activity.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = activity.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
      }}
      style={{
        ...buttonReset,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "18px 16px",
        gridColumn: activity.id === "log" ? "1 / -1" : undefined,
        display: "block",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 32 }}>{activity.emoji}</span>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{activity.label}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{activity.desc}</div>
          </div>
        </div>
        {activity.duration && (
          <div
            style={{
              background: `${activity.color}18`,
              color: activity.color,
              borderRadius: 99,
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {activity.duration}
          </div>
        )}
      </div>
    </button>
  );
}
