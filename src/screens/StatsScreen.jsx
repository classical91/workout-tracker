import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { computeStats } from "../utils/stats.js";

function StatTile({ value, label, sub, color }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "16px 14px",
      }}
    >
      <div style={{ fontFamily: display, fontSize: 34, color, lineHeight: 1 }}>{value}</div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 1.5,
          color: T.muted,
          fontWeight: 700,
          marginTop: 6,
        }}
      >
        {label}
      </div>
      {sub && <div style={{ fontSize: 10, color: T.dim, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function StatsScreen({ onBack, log }) {
  const color = T.yellow;
  const s = computeStats(log);
  const maxCount = s.breakdown.reduce((m, b) => Math.max(m, b.count), 0);

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
      <ScreenHeader title="Progress" subtitle="STATS" emoji="📊" color={color} onBack={onBack} />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        {log.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p>
              No stats yet.
              <br />
              Complete a session to start building your streak.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 24,
              }}
            >
              <StatTile
                value={`🔥 ${s.currentStreak}`}
                label="CURRENT STREAK"
                sub={s.currentStreak === 1 ? "day" : "days in a row"}
                color={T.orange}
              />
              <StatTile
                value={s.sessionsThisWeek}
                label="THIS WEEK"
                sub={s.sessionsThisWeek === 1 ? "session" : "sessions"}
                color={T.green}
              />
              <StatTile value={s.totalSessions} label="TOTAL SESSIONS" color={color} />
              <StatTile
                value={s.totalMinutes}
                label="TOTAL MINUTES"
                sub={`best streak ${s.longestStreak} ${s.longestStreak === 1 ? "day" : "days"}`}
                color={T.teal}
              />
            </div>

            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: T.muted,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              ACTIVITY BREAKDOWN
            </p>
            {s.breakdown.map((b) => (
              <div key={b.name} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    {b.emoji} {b.name}
                  </span>
                  <span style={{ fontSize: 12, color: T.muted, fontWeight: 700 }}>{b.count}×</span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: T.surface2,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${maxCount ? (b.count / maxCount) * 100 : 0}%`,
                      background: `linear-gradient(90deg,${b.color || color}70,${b.color || color})`,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
