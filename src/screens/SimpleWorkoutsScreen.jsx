import { T, font } from "../theme.js";
import { simpleEx } from "../data/simpleExercises.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";

export function SimpleWorkoutsScreen({ onBack, onOpen, checked, setChecked }) {
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
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                marginBottom: 8,
                padding: "14px 16px",
              }}
            >
              <button
                type="button"
                aria-pressed={isDone}
                aria-label={`Mark ${s.name} as done`}
                onClick={toggle}
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
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {isDone && <span style={{ fontSize: 13, color: "#000", fontWeight: 800 }}>✓</span>}
              </button>
              <a
                href={`#/simple/${s.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen(s.slug);
                }}
                style={{
                  flex: 1,
                  textDecoration: "none",
                  color: T.text,
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14, color: isDone ? T.muted : T.text }}>
                    {s.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
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
                    <span style={{ color, fontSize: 18, lineHeight: 1 }}>›</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{s.detail}</p>
              </a>
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
