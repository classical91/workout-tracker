import { useEffect, useState } from "react";
import { T, font } from "../theme.js";
import { MAX_REP_COUNT, MAX_SET_COUNT } from "../data/workouts.js";

// One tappable pill per planned set. Tapping a pill confirms that set is
// finished — three planned sets means three taps, one after each set, instead
// of a single check for the whole exercise.
function SetPill({ index, label, unit, done, color, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={`${label} ${unit} ${index + 1}`}
      onClick={onToggle}
      style={{
        minWidth: 54,
        padding: "8px 10px",
        borderRadius: 10,
        cursor: "pointer",
        fontFamily: font,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 1,
        color: done ? "#000" : T.muted,
        background: done ? color : "transparent",
        border: `2px solid ${done ? color : `${color}45`}`,
      }}
    >
      {done ? "✓ " : ""}
      {unit.toUpperCase()} {index + 1}
    </button>
  );
}

const numberInputStyle = (color) => ({
  width: "100%",
  boxSizing: "border-box",
  background: T.bg,
  border: `1px solid ${color}55`,
  borderRadius: 8,
  color: T.text,
  fontFamily: font,
  fontSize: 13,
  padding: "8px 10px",
});

// The sets/reps a user intends to do for one exercise, plus a check per set.
// The plan is set up front — nothing here asks what was done after the fact.
export function ExerciseSets({
  label,
  plan,
  doneSets,
  color,
  unit = "set",
  onToggleSet,
  onChangePlan,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ setCount: plan.setCount, repCount: plan.repCount });

  // Re-seed the draft whenever the plan changes underneath (another device
  // syncing it, or switching routines while the editor is open).
  useEffect(() => {
    setDraft({ setCount: plan.setCount, repCount: plan.repCount });
  }, [plan.setCount, plan.repCount]);

  const doneCount = doneSets.filter(Boolean).length;
  const commit = (next) => {
    setDraft(next);
    if (next.setCount !== "" && next.repCount !== "") onChangePlan(next);
  };

  return (
    <div style={{ padding: "0 16px 14px 54px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {doneSets.map((done, index) => (
          <SetPill
            key={index}
            index={index}
            label={label}
            unit={unit}
            done={done}
            color={color}
            onToggle={() => onToggleSet(index)}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 8,
        }}
      >
        <span style={{ fontSize: 11, color: T.muted }}>
          {doneCount} of {plan.setCount} {unit}
          {plan.setCount === 1 ? "" : "s"} · {plan.repCount} rep
          {plan.repCount === 1 ? "" : "s"} each
        </span>
        <button
          type="button"
          aria-expanded={editing}
          aria-label={`${editing ? "Close" : "Edit"} ${label} sets and reps`}
          onClick={() => setEditing((open) => !open)}
          style={{
            border: "none",
            background: "transparent",
            color,
            cursor: "pointer",
            fontFamily: font,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          {editing ? "▲ DONE" : "✎ SETS & REPS"}
        </button>
      </div>
      {editing && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 10,
            paddingTop: 10,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <label style={{ display: "grid", gap: 5, fontSize: 11, color: T.muted }}>
            How many sets?
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max={MAX_SET_COUNT}
              value={draft.setCount}
              onChange={(event) => commit({ ...draft, setCount: event.target.value })}
              style={numberInputStyle(color)}
            />
          </label>
          <label style={{ display: "grid", gap: 5, fontSize: 11, color: T.muted }}>
            Reps per set
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max={MAX_REP_COUNT}
              value={draft.repCount}
              onChange={(event) => commit({ ...draft, repCount: event.target.value })}
              style={numberInputStyle(color)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
