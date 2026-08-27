import { useState } from "react";
import { T, font, display } from "../theme.js";
import {
  DEFAULT_REP_COUNT,
  DEFAULT_SET_COUNT,
  MAX_REP_COUNT,
  MAX_SET_COUNT,
  clampRepCount,
  clampSetCount,
  stepPlanDefaults,
} from "../data/workouts.js";
import { BackButton } from "./BackButton.jsx";

const COLORS = [T.orange, T.yellow, T.purple, T.teal, T.green, T.blue, T.red];
const EMOJIS = ["🏋️", "💪", "🔥", "🧘", "🏃", "🤸", "⚡", "🎯"];

const inputStyle = (accent) => ({
  width: "100%",
  boxSizing: "border-box",
  background: T.bg,
  border: `1px solid ${accent}55`,
  borderRadius: 8,
  color: T.text,
  fontFamily: font,
  fontSize: 13,
  padding: "9px 11px",
});

function emptyExercise() {
  return { phase: "", setCount: DEFAULT_SET_COUNT, repCount: DEFAULT_REP_COUNT };
}

// Pull the editable exercise rows out of a routine's steps, dropping the auto
// warm-up/cool-down that get re-added on save.
function exercisesFromWorkout(workout) {
  const rows = workout.steps
    .filter((s) => s.type === "exercise")
    .map((s) => {
      const plan = stepPlanDefaults(s);
      return { phase: s.phase, setCount: plan.setCount, repCount: plan.repCount };
    });
  return rows.length ? rows : [emptyExercise(), emptyExercise()];
}

// Form for creating or editing a custom routine. Collects a title, emoji, accent
// color, and a list of exercises — for each exercise only its name, how many
// sets, and how many reps per set — then hands a fully-formed workout (with an
// auto Warm-Up and Cool-Down, matching built-in routines) to onSave. When `initial`
// is provided the form is pre-filled and acts as an editor; otherwise it creates
// a new routine.
export function WorkoutBuilder({ onSave, onCancel, count, initial }) {
  const editing = !!initial;
  const [title, setTitle] = useState(initial ? initial.title : "");
  const [emoji, setEmoji] = useState(initial ? initial.emoji : EMOJIS[0]);
  const [color, setColor] = useState(initial ? initial.color : COLORS[0]);
  const [exercises, setExercises] = useState(
    initial ? exercisesFromWorkout(initial) : [emptyExercise(), emptyExercise()]
  );

  const named = exercises.filter((e) => e.phase.trim());
  const canSave = title.trim() && named.length > 0;

  const updateExercise = (i, field, value) =>
    setExercises((prev) => prev.map((e, j) => (j === i ? { ...e, [field]: value } : e)));
  const addRow = () => setExercises((prev) => [...prev, emptyExercise()]);
  const removeRow = (i) => setExercises((prev) => prev.filter((_, j) => j !== i));
  // Swap a row with its neighbour (dir -1 = up, +1 = down), ignoring out-of-range moves.
  const moveRow = (i, dir) =>
    setExercises((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = () => {
    if (!canSave) return;
    const steps = [
      { phase: "Warm-Up", reps: "5–10 min", detail: "Light cardio to warm up", type: "warmup" },
      ...named.map((e) => ({
        phase: e.phase.trim(),
        setCount: clampSetCount(e.setCount),
        repCount: clampRepCount(e.repCount),
        detail: "",
        type: "exercise",
      })),
      { phase: "Cool-Down", reps: "5–10 min", detail: "Stretch and recover", type: "cooldown" },
    ];
    // Preserve the tag when editing; generate one for a new routine.
    const tag = editing ? initial.tag : `Custom ${count + 1}`;
    onSave({ title: title.trim(), emoji, color, tag, steps });
  };

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
          <BackButton onBack={onCancel} color={color} />
          <h1
            style={{
              fontFamily: display,
              fontSize: 36,
              letterSpacing: 1,
              lineHeight: 1,
              marginTop: 12,
            }}
          >
            {editing ? "EDIT WORKOUT" : "NEW WORKOUT"}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "16px 20px 0" }}>
        <label style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontWeight: 700 }}>
          NAME
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Routine"
          style={{ ...inputStyle(color), margin: "8px 0 18px" }}
        />

        <p style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontWeight: 700 }}>ICON</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 18px" }}>
          {EMOJIS.map((em) => (
            <button
              key={em}
              onClick={() => setEmoji(em)}
              style={{
                fontSize: 22,
                width: 40,
                height: 40,
                borderRadius: 10,
                cursor: "pointer",
                background: emoji === em ? `${color}20` : T.surface,
                border: `2px solid ${emoji === em ? color : T.border}`,
              }}
            >
              {em}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontWeight: 700 }}>COLOR</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "8px 0 18px" }}>
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`color ${c}`}
              onClick={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                background: c,
                border: `3px solid ${color === c ? T.text : "transparent"}`,
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: 10, letterSpacing: 2, color: T.muted, fontWeight: 700 }}>EXERCISES</p>
        <div style={{ margin: "8px 0 0" }}>
          {exercises.map((ex, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={ex.phase}
                  onChange={(e) => updateExercise(i, "phase", e.target.value)}
                  placeholder="Exercise name"
                  style={{ ...inputStyle(color), flex: 1 }}
                />
                <button
                  onClick={() => moveRow(i, -1)}
                  aria-label="move exercise up"
                  disabled={i === 0}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.muted,
                    cursor: i === 0 ? "default" : "pointer",
                    fontSize: 14,
                    opacity: i === 0 ? 0.25 : 1,
                    padding: "0 2px",
                  }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveRow(i, 1)}
                  aria-label="move exercise down"
                  disabled={i === exercises.length - 1}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.muted,
                    cursor: i === exercises.length - 1 ? "default" : "pointer",
                    fontSize: 14,
                    opacity: i === exercises.length - 1 ? 0.25 : 1,
                    padding: "0 2px",
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => removeRow(i)}
                  aria-label="remove exercise"
                  disabled={exercises.length === 1}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.muted,
                    cursor: exercises.length === 1 ? "default" : "pointer",
                    fontSize: 18,
                    opacity: exercises.length === 1 ? 0.3 : 1,
                    padding: "0 4px",
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <label style={{ display: "grid", gap: 4, fontSize: 10, color: T.muted }}>
                  How many sets?
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={MAX_SET_COUNT}
                    aria-label={`sets for exercise ${i + 1}`}
                    value={ex.setCount}
                    onChange={(e) => updateExercise(i, "setCount", e.target.value)}
                    style={inputStyle(color)}
                  />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 10, color: T.muted }}>
                  Reps per set
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={MAX_REP_COUNT}
                    aria-label={`reps per set for exercise ${i + 1}`}
                    value={ex.repCount}
                    onChange={(e) => updateExercise(i, "repCount", e.target.value)}
                    style={inputStyle(color)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          style={{
            background: "none",
            border: `1px dashed ${color}66`,
            borderRadius: 8,
            padding: "9px 14px",
            color,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: font,
            marginTop: 4,
          }}
        >
          + Add exercise
        </button>

        <div style={{ marginTop: 24, fontSize: 11, color: T.dim }}>
          A warm-up and cool-down are added automatically. You&apos;ll tick off each set as you
          finish it — three sets means three checks.
        </div>

        <button
          onClick={save}
          disabled={!canSave}
          style={{
            width: "100%",
            marginTop: 16,
            background: canSave ? color : T.surface2,
            border: "none",
            borderRadius: 12,
            padding: "14px",
            color: canSave ? "#000" : T.dim,
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 1,
            cursor: canSave ? "pointer" : "default",
            fontFamily: font,
          }}
        >
          {editing ? "SAVE CHANGES" : "SAVE WORKOUT"}
        </button>
      </div>
    </div>
  );
}
