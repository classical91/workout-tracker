import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

export function LogScreen({ onBack, log, onClear, onClearToday }) {
  const color = T.yellow;
  const today = new Date().toDateString();
  const hasToday = log.some((e) => new Date(e.ts).toDateString() === today);
  const grouped = log.reduce((acc, e) => {
    const d = new Date(e.ts).toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});
  const days = Object.keys(grouped).reverse();
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
        title="Exercise Log"
        subtitle="HISTORY"
        emoji="📋"
        color={color}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        {log.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p>
              No activities logged yet.
              <br />
              Complete a session to see it here.
            </p>
          </div>
        ) : (
          <>
            {days.map((day) => (
              <div key={day} style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: T.muted,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {day.toUpperCase()}
                </p>
                {grouped[day].map((e, i) => (
                  <div
                    key={i}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {e.emoji} {e.name}
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{e.duration}</div>
                    </div>
                    <div style={{ fontFamily: display, fontSize: 20, color: e.color || color }}>
                      ✓
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {hasToday && (
                <button
                  onClick={onClearToday}
                  style={{
                    background: "none",
                    border: `1px solid ${color}55`,
                    borderRadius: 10,
                    padding: "10px 20px",
                    color,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: font,
                  }}
                >
                  Reset Today
                </button>
              )}
              <button
                onClick={onClear}
                style={{
                  background: "none",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "10px 20px",
                  color: T.muted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: font,
                }}
              >
                Clear Log
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
