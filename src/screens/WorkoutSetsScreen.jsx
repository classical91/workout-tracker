import { useState, useEffect, useRef } from "react";
import { T, font, display } from "../theme.js";
import { workouts as builtInWorkouts, tsStyle } from "../data/workouts.js";
import { BackButton } from "../components/BackButton.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { WorkoutBuilder } from "../components/WorkoutBuilder.jsx";

export function WorkoutSetsScreen({
  onBack,
  checked,
  setChecked,
  onAddActivity,
  customWorkouts,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
}) {
  const workouts = [...builtInWorkouts, ...customWorkouts];
  const [aw, setAw] = useState(0);
  const [building, setBuilding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Keep the active index in range if the list shrinks (e.g. a routine is deleted).
  const safeAw = Math.min(aw, workouts.length - 1);
  const w = workouts[safeAw];
  const stepKey = (si) => `w-${w.id}-${si}`;
  const doneSteps = w.steps.filter((_, si) => checked[stepKey(si)]).length;
  const doneEx = w.steps.filter((s, si) => s.type === "exercise" && checked[stepKey(si)]).length;
  const totalEx = w.steps.filter((s) => s.type === "exercise").length;
  const pct = Math.round((doneSteps / w.steps.length) * 100);
  const allDone = workouts.map((wk) => wk.steps.every((_, si) => checked[`w-${wk.id}-${si}`]));
  const isCustom = safeAw >= builtInWorkouts.length;
  // Track the previous progress per workout id. A single shared ref would re-log a
  // completed routine when switching away to an incomplete one and back, because
  // its pct would appear to jump from <100 to 100 again. A workout's first
  // appearance seeds its prior value with the current pct so navigating straight to
  // an already-complete routine doesn't log it.
  const prevPct = useRef({});

  useEffect(() => {
    const prior = w.id in prevPct.current ? prevPct.current[w.id] : pct;
    if (pct === 100 && prior < 100) {
      onAddActivity({
        type: "workout",
        category: "strength",
        name: w.title,
        emoji: w.emoji,
        color: w.color,
        duration: "~30 min",
        completed: true,
        details: {
          workoutId: w.id,
          exercises: w.steps
            .filter((step) => step.type === "exercise")
            .map((step) => ({ name: step.phase, planned: step.reps })),
        },
      });
    }
    prevPct.current[w.id] = pct;
  }, [onAddActivity, pct, w.id, w.color, w.emoji, w.steps, w.title]);

  // Cancel a pending delete confirmation when the active routine changes.
  useEffect(() => {
    setConfirmingDelete(false);
  }, [w.id]);

  // Clear any saved checklist progress for a routine (its steps may have changed).
  const clearProgress = (workout) =>
    setChecked((prev) => {
      const next = { ...prev };
      workout.steps.forEach((_, si) => delete next[`w-${workout.id}-${si}`]);
      return next;
    });

  const handleSave = (workout) => {
    onAddWorkout(workout);
    setBuilding(false);
    setAw(workouts.length); // select the newly added routine
  };

  const handleUpdate = (workout) => {
    const original = customWorkouts.find((cw) => cw.id === editingId);
    if (original) clearProgress(original);
    onUpdateWorkout(editingId, workout);
    setEditingId(null);
  };

  const handleDelete = () => {
    clearProgress(w);
    onDeleteWorkout(w.id);
    setConfirmingDelete(false);
    setAw(0);
  };

  if (editingId) {
    const initial = customWorkouts.find((cw) => cw.id === editingId);
    // Guard against the routine vanishing (e.g. cleared elsewhere).
    if (initial) {
      return (
        <WorkoutBuilder
          initial={initial}
          onSave={handleUpdate}
          onCancel={() => setEditingId(null)}
        />
      );
    }
  }

  if (building) {
    return (
      <WorkoutBuilder
        onSave={handleSave}
        onCancel={() => setBuilding(false)}
        count={customWorkouts.length}
      />
    );
  }

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
            <button
              type="button"
              key={wk.id}
              aria-pressed={safeAw === i}
              onClick={() => setAw(i)}
              style={{
                padding: "14px 10px",
                background: safeAw === i ? `${wk.color}18` : T.surface,
                border: `2px solid ${safeAw === i ? wk.color : T.border}`,
                borderRadius: 14,
                textAlign: "center",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 5 }}>{allDone[i] ? "✅" : wk.emoji}</div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: safeAw === i ? wk.color : T.muted,
                }}
              >
                {wk.tag.toUpperCase()}
              </div>
            </button>
          ))}
          <button
            type="button"
            aria-label="Create new workout"
            onClick={() => setBuilding(true)}
            style={{
              padding: "14px 10px",
              background: T.surface,
              border: `2px dashed ${T.border}`,
              borderRadius: 14,
              textAlign: "center",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 5 }}>➕</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: T.muted }}>
              NEW
            </div>
          </button>
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
          const key = stepKey(si);
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
                      `${step.phase} ${isCustom ? "exercise" : "dumbbell exercise"}`
                    )}`
                  : undefined
              }
            />
          );
        })}
        {pct === 100 && <CompletionBanner color={w.color} emoji="🎉" text="WORKOUT COMPLETE!" />}
        {isCustom &&
          (confirmingDelete ? (
            <div
              style={{
                marginTop: 12,
                background: `${T.red}10`,
                border: `1px solid ${T.red}55`,
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 13, color: T.text, marginBottom: 12 }}>
                Delete <strong>{w.title}</strong>? This can&apos;t be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    background: T.red,
                    border: "none",
                    borderRadius: 10,
                    padding: "11px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: font,
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px",
                    color: T.muted,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: font,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setEditingId(w.id)}
                style={{
                  flex: 1,
                  background: "none",
                  border: `1px solid ${w.color}55`,
                  borderRadius: 10,
                  padding: "11px",
                  color: w.color,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: font,
                }}
              >
                Edit this workout
              </button>
              <button
                onClick={() => setConfirmingDelete(true)}
                style={{
                  flex: 1,
                  background: "none",
                  border: `1px solid ${T.red}55`,
                  borderRadius: 10,
                  padding: "11px",
                  color: T.red,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: font,
                }}
              >
                Delete this workout
              </button>
            </div>
          ))}
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
