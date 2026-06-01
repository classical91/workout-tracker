import { T, font } from "../theme.js";
import { simpleEx } from "../data/simpleExercises.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";

function handleKey(toggle) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };
}

export function SimpleWorkoutsScreen({ onBack, checked, setChecked }) {
  const color = T.blue;
  const done = simpleEx.filter((_, i) => checked[`sim-${i}`]).length;
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
        title="Simple Exercises"
        subtitle="BODYWEIGHT / AT HOME / NO EQUIPMENT"
        emoji="🏃"
        color={color}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={simpleEx.length} color={color} />
        {simpleEx.map((s, i) => {
          const isDone = !!checked[`sim-${i}`];
          const toggle = () => setChecked((p) => ({ ...p, [`sim-${i}`]: !p[`sim-${i}`] }));
          return (
            <div
              key={i}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                marginBottom: 8,
              }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-pressed={isDone}
                onClick={toggle}
                onKeyDown={handleKey(toggle)}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  cursor: "pointer",
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
                      style={{ fontWeight: 700, fontSize: 14, color: isDone ? T.muted : T.text }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color,
                        background: `${color}18`,
                        borderRadius: 99,
                        padding: "3px 9px",
                      }}
                    >
                      {s.reps}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{s.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
        {done === simpleEx.length && (
          <CompletionBanner color={color} emoji="🏅" text="NICE WORK!" />
        )}
      </div>
    </div>
  );
}
