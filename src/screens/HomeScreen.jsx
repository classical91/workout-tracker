import { T, font, display } from "../theme.js";
import { activities } from "../data/activities.js";
import { ActivityCard } from "../components/ActivityCard.jsx";
import { QuickLog } from "../components/QuickLog.jsx";

// Each kind of focus keeps the colour of the screen it was chosen on, so a
// glance at Home says where it came from.
const focusColor = (focus) => {
  if (focus.source === "simple") return T.blue;
  if (focus.source === "trigger") return T.red;
  return T.green;
};

const sideLabel = (side) => (side === "left" ? "Left side" : side === "right" ? "Right side" : "");

export function HomeScreen({ onNavigate, onStartTimer, dailyFocuses = [] }) {
  // The panel takes its accent from the focuses inside it when they all come
  // from the same place, and falls back to green for a mixed day.
  const sources = new Set(dailyFocuses.map((focus) => focus.source));
  const focusAccent = sources.size === 1 ? focusColor(dailyFocuses[0]) : T.green;

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
        className="home-header"
        style={{
          padding: "36px 20px 20px",
          borderBottom: `1px solid ${T.border}`,
          marginBottom: 20,
        }}
      >
        <div className="home-header-inner" style={{ maxWidth: 500, margin: "0 auto" }}>
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
      <div
        className="home-content"
        style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}
      >
        {dailyFocuses.length > 0 && (
          <div
            aria-label={dailyFocuses.length === 1 ? "Today's focus" : "Today's focuses"}
            style={{
              margin: "0 0 14px",
              padding: "10px 12px",
              border: `1px solid ${focusAccent}66`,
              borderRadius: 12,
              background: `${focusAccent}0D`,
              color: T.muted,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 2 }}>
              {dailyFocuses.length === 1 ? "TODAY'S FOCUS" : "TODAY'S FOCUSES"}
            </div>
            {dailyFocuses.map((focus, index) => {
              const color = focusColor(focus);
              // Trigger points have a curated map and guide of their own, so
              // they show which side was tapped instead of an image search.
              const side = focus.source === "trigger" ? sideLabel(focus.side) : "";
              const imagesUrl = focus.imageQuery
                ? `https://www.google.com/search?udm=2&q=${encodeURIComponent(focus.imageQuery)}`
                : "";
              return (
                <div
                  key={focus.id}
                  style={{
                    paddingTop: 8,
                    marginTop: index === 0 ? 0 : 8,
                    borderTop: index === 0 ? "none" : `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ color, fontSize: 12 }}>
                    {focus.source === "trigger" ? "🎯 " : ""}
                    {focus.name}
                  </div>
                  {side && (
                    <div style={{ marginTop: 3, color: T.muted, fontSize: 10, fontWeight: 600 }}>
                      {side}
                    </div>
                  )}
                  {imagesUrl && (
                    <a
                      href={imagesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View images for ${focus.name}`}
                      style={{
                        display: "inline-block",
                        marginTop: 6,
                        color,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textDecoration: "none",
                      }}
                    >
                      🔍 VIEW IMAGES
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div
          className="home-activity-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} onSelect={onNavigate} />
          ))}
        </div>
        <QuickLog onStart={onStartTimer} />
        <a
          href="https://nutri-mind-production-d054.up.railway.app/work-meals"
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
          🥗 View Daily Meal Plan
        </a>
      </div>
    </div>
  );
}
