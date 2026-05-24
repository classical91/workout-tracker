import { T, font, buttonReset } from "../theme.js";
import { foamTech } from "../data/foamRoller.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";

export function FoamRollerScreen({ onBack, checked, setChecked }) {
  const color = T.teal;
  const done = foamTech.filter((_, i) => checked[`foam-${i}`]).length;
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
        title="Foam Roller"
        subtitle="RECOVERY · 10 MIN"
        emoji="🧴"
        color={color}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={foamTech.length} color={color} />
        {foamTech.map((t, i) => {
          const isDone = !!checked[`foam-${i}`];
          return (
            <div
              key={i}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setChecked((p) => ({ ...p, [`foam-${i}`]: !p[`foam-${i}`] }))}
                aria-pressed={isDone}
                style={{
                  ...buttonReset,
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    border: `2px solid ${color}`,
                    background: isDone ? color : "transparent",
                    flexShrink: 0,
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDone && (
                    <span style={{ fontSize: 13, color: "#000", fontWeight: 800 }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: isDone ? T.muted : T.text,
                        textDecoration: isDone ? "line-through" : "none",
                      }}
                    >
                      {t.emoji} {t.area}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 6 }}>
                    {t.detail}
                  </p>
                  {!isDone && (
                    <div
                      style={{
                        background: `${color}10`,
                        borderLeft: `3px solid ${color}`,
                        borderRadius: 6,
                        padding: "8px 10px",
                        fontSize: 11,
                        color,
                      }}
                    >
                      💡 {t.tip}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
        {done === foamTech.length && (
          <CompletionBanner color={color} emoji="✨" text="RECOVERY COMPLETE!" />
        )}
      </div>
    </div>
  );
}
