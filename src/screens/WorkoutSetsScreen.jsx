import { useState, useEffect, useRef } from "react";
import { T, font, display } from "../theme.js";
import { workouts, tsStyle } from "../data/workouts.js";
import { BackButton } from "../components/BackButton.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";

export function WorkoutSetsScreen({ onBack, checked, setChecked, onLog }) {
  const [aw, setAw] = useState(0);
  const w = workouts[aw];
  const doneSteps = w.steps.filter((_, si) => checked[`w${aw}-${si}`]).length;
  const doneEx = w.steps.filter((s, si) => s.type === "exercise" && checked[`w${aw}-${si}`]).length;
  const totalEx = w.steps.filter((s) => s.type === "exercise").length;
  const pct = Math.round((doneSteps / w.steps.length) * 100);
  const allDone = workouts.map((wk, wi) => wk.steps.every((_, si) => checked[`w${wi}-${si}`]));
  const prevPct = useRef(pct);

  useEffect(() => {
    if (pct === 100 && prevPct.current < 100) {
      onLog({ name: w.title, emoji: w.emoji, color: w.color, duration: "~30 min", ts: Date.now() });
    }
    prevPct.current = pct;
  }, [pct]);

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
      <div style={{ padding: "28px 20px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <BackButton onBack={onBack} color={w.color} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  color: T.muted,
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                WORKOUT SETS · 30 MIN
              </p>
              <h1 style={{ fontFamily: display, fontSize: 36, letterSpacing: 1, lineHeight: 1 }}>
                MY WORKOUTS
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}>EXERCISES</p>
              <p style={{ fontFamily: display, fontSize: 28, color: w.color, lineHeight: 1.1 }}>
                {doneEx}/{totalEx}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px 0", maxWidth: 500, margin: "0 auto" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}
        >
          {workouts.map((wk, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={aw === i}
              onClick={() => setAw(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAw(i);
                }
              }}
              style={{
                padding: "14px 10px",
                background: aw === i ? `${wk.color}18` : T.surface,
                border: `2px solid ${aw === i ? wk.color : T.border}`,
                borderRadius: 14,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 5 }}>{allDone[i] ? "✅" : wk.emoji}</div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: aw === i ? wk.color : T.muted,
                }}
              >
                {wk.tag.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: `linear-gradient(135deg,${w.color}15,${w.color}05)`,
            border: `1px solid ${w.color}25`,
            borderRadius: 18,
            padding: "18px 20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div style={{ flex: 1, paddingRight: 12 }}>
              <div
                style={{
                  display: "inline-block",
                  background: `${w.color}20`,
                  color: w.color,
                  borderRadius: 99,
                  padding: "3px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                {w.tag}
              </div>
              <h2
                style={{ fontFamily: display, fontSize: 22, letterSpacing: 0.5, lineHeight: 1.2 }}
              >
                {w.title}
              </h2>
            </div>
            <div style={{ fontSize: 40 }}>{w.emoji}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 1 }}>
                SESSION PROGRESS
              </span>
              <span style={{ fontSize: 11, color: w.color, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div
              style={{ height: 6, background: T.surface2, borderRadius: 99, overflow: "hidden" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: `linear-gradient(90deg,${w.color}70,${w.color})`,
                  borderRadius: 99,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>
        {w.steps.map((step, si) => {
          const key = `w${aw}-${si}`;
          const done = !!checked[key];
          const ts = tsStyle[step.type];
          const ac = ts.ac || w.color;
          return (
            <IllusCard
              key={si}
              label={step.phase}
              detail={step.detail}
              reps={step.reps}
              done={done}
              color={ac}
              onToggle={() => setChecked((p) => ({ ...p, [key]: !p[key] }))}
              illusKey={step.phase}
              link={
                step.type === "exercise"
                  ? `https://www.google.com/search?udm=2&q=${encodeURIComponent(
                      `${step.phase} dumbbell exercise`
                    )}`
                  : undefined
              }
            />
          );
        })}
        {pct === 100 && <CompletionBanner color={w.color} emoji="🎉" text="WORKOUT COMPLETE!" />}
        <div
          style={{
            marginTop: 16,
            background: T.surface,
            borderRadius: 14,
            padding: "14px 16px",
            border: `1px solid ${T.border}`,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: 2,
              color: T.muted,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            ALWAYS REMEMBER
          </p>
          {["Ankle mobility warm-up", "Neck rolls before & after", "Breathing cooldown"].map(
            (item, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: i < arr.length - 1 ? 8 : 0,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: w.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: T.muted }}>{item}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
