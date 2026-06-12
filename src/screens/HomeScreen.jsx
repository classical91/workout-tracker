import { T, font, display } from "../theme.js";
import { activities } from "../data/activities.js";
import { ActivityCard } from "../components/ActivityCard.jsx";
import { QuickLog } from "../components/QuickLog.jsx";

export function HomeScreen({ onNavigate, onStartTimer }) {
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
      <div
        style={{
          padding: "36px 20px 20px",
          borderBottom: `1px solid ${T.border}`,
          marginBottom: 20,
        }}
      >
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: 3,
              color: T.muted,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            DAILY PRACTICE
          </p>
          <h1 style={{ fontFamily: display, fontSize: 44, letterSpacing: 1, lineHeight: 1 }}>
            WELLNESS TRACKER
          </h1>
        </div>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} onSelect={onNavigate} />
          ))}
        </div>
        <QuickLog onStart={onStartTimer} />
        <a
          href="https://diet-plan-production-30bd.up.railway.app"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            margin: "16px auto 0",
            padding: "12px 24px",
            borderRadius: "12px",
            background: "rgba(200,146,42,0.12)",
            border: "1px solid rgba(200,146,42,0.4)",
            color: "#c8922a",
            textDecoration: "none",
            fontFamily: font,
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            maxWidth: "260px",
          }}
        >
          🥗 Go to Diet Plan
        </a>
      </div>
    </div>
  );
}
