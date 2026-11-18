import { useState, useEffect, useRef, useCallback } from "react";
import { T, font, display } from "../theme.js";
import {
  workouts as builtInWorkouts,
  clampSetCount,
  resolvePlan,
  stepLabel,
  stepProgress,
  tsStyle,
  workoutSetKey,
  workoutUnitKeys,
} from "../data/workouts.js";
import { workoutGroupId } from "../data/liveLogGroups.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { BackButton } from "../components/BackButton.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { ExerciseSets } from "../components/ExerciseSets.jsx";
import { WorkoutBuilder } from "../components/WorkoutBuilder.jsx";
import { RecoveryFlow } from "../components/RecoveryFlow.jsx";

// Each checked set is logged the moment it's ticked (see useLiveCheckLog): a
// workout's checks share one log entry for the day that grows and shrinks with
// them. This screen only offers the details form and the recovery suggestions
// once a routine is finished.
export function WorkoutSetsScreen({
  onBack,
  checked,
  setChecked,
  getLiveActivity = () => null,
  onAddActivity,
  onUpdateActivity,
  customWorkouts,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  plans = {},
  onSetPlan,
  onClearPlans,
  activityLog = [],
}) {
  const workouts = [...builtInWorkouts, ...customWorkouts];
  const [aw, setAw] = useState(0);
  const [building, setBuilding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Keep the active index in range if the list shrinks (e.g. a routine is deleted).
  const safeAw = Math.min(aw, workouts.length - 1);
  const w = workouts[safeAw];
  // Progress is counted in sets, not steps: an exercise planned at three sets
  // contributes three checks, so finishing two of them shows as two-thirds.
  const unitKeys = workoutUnitKeys(w, plans);
  const doneUnits = unitKeys.filter((key) => checked[key]).length;
  const totalUnits = unitKeys.length;
  const doneEx = w.steps.filter(
    (step, si) => step.type === "exercise" && stepProgress(w, si, checked, plans).done
  ).length;
  const totalEx = w.steps.filter((s) => s.type === "exercise").length;
  const pct = totalUnits ? Math.round((doneUnits / totalUnits) * 100) : 0;
  const allDone = workouts.map((wk) => workoutUnitKeys(wk, plans).every((key) => checked[key]));
  const isCustom = safeAw >= builtInWorkouts.length;

  // Today's log entry for the active routine, kept in step with its checks.
  const liveActivity = getLiveActivity(workoutGroupId(w.id));
  // Which routine just finished: its details form and recovery suggestions are
  // offered then, against that routine's live log entry.
  const [detailsFor, setDetailsFor] = useState(null);
  const [recoveryFor, setRecoveryFor] = useState(null);
  const completedActivity = detailsFor === w.id ? liveActivity : null;
  const recoveryWorkoutActivity = recoveryFor === w.id ? liveActivity : null;

  // Track the previous done-set count per workout id so finishing a routine is
  // noticed once, without re-firing when switching away and back. A workout's
  // first appearance seeds its prior value with the current count so opening
  // an already-complete routine doesn't pop the form up again.
  const prevDone = useRef({});
  useEffect(() => {
    const prior = w.id in prevDone.current ? prevDone.current[w.id] : doneUnits;
    if (totalUnits > 0 && doneUnits === totalUnits && prior < totalUnits) {
      setDetailsFor(w.id);
      setRecoveryFor(w.id);
    }
    if (doneUnits < totalUnits) setDetailsFor((current) => (current === w.id ? null : current));
    prevDone.current[w.id] = doneUnits;
  }, [doneUnits, totalUnits, w.id]);

  // Closing the details form keeps the checkmarks — they stay until the new day.
  const dismissForm = useCallback(() => setDetailsFor(null), []);

  // Cancel a pending delete confirmation and close the details form when the
  // active routine changes.
  useEffect(() => {
    setConfirmingDelete(false);
    setDetailsFor(null);
    setRecoveryFor(null);
  }, [w.id]);

  // Clear a routine's saved checkmarks and sets/reps plans — its steps may have
  // changed, so neither its progress nor the old line-up's numbers still apply.
  const clearProgress = (workout) => {
    setChecked((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key === `w-${workout.id}` || key.startsWith(`w-${workout.id}-`)) delete next[key];
      }
      return next;
    });
    onClearPlans?.(workout.id);
  };

  const toggleUnit = (key) => setChecked((previous) => ({ ...previous, [key]: !previous[key] }));

  // Changing a plan mid-session must not leave orphaned checkmarks behind: if
  // the set count drops, the checks for the sets that no longer exist go too.
  const changePlan = (stepIndex, nextPlan) => {
    const current = resolvePlan(w, stepIndex, plans);
    const nextSetCount = clampSetCount(nextPlan.setCount, current.setCount);
    onSetPlan?.(w.id, stepIndex, { ...nextPlan, setCount: nextSetCount });
    if (nextSetCount >= current.setCount) return;
    setChecked((previous) => {
      const next = { ...previous };
      for (let index = nextSetCount; index < current.setCount; index += 1) {
        delete next[workoutSetKey(w.id, stepIndex, index)];
      }
      return next;
    });
  };

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
          const ts = tsStyle[step.type];
          const ac = ts.ac || w.color;
          const plan = resolvePlan(w, si, plans);
          const progress = stepProgress(w, si, checked, plans);
          return (
            <IllusCard
              key={`${w.id}-${si}`}
              label={step.phase}
              detail={step.detail}
              reps={stepLabel(w, si, plans)}
              done={progress.done}
              progressLabel={progress.doneCount > 0 ? String(progress.doneCount) : undefined}
              color={ac}
              // Exercises are ticked off set by set below; warm-up and
              // cool-down stay a single check on the card itself.
              onToggle={plan ? undefined : () => toggleUnit(progress.keys[0])}
              illusKey={step.phase}
              image={step.image}
              link={
                step.type === "exercise" && !step.image
                  ? `https://www.google.com/search?udm=2&q=${encodeURIComponent(
                      `${step.phase} ${isCustom ? "exercise" : "dumbbell exercise"}`
                    )}`
                  : undefined
              }
            >
              {plan && (
                <ExerciseSets
                  label={step.phase}
                  plan={plan}
                  unit={step.repUnit || "set"}
                  doneSets={progress.keys.map((key) => Boolean(checked[key]))}
                  color={ac}
                  onToggleSet={(index) => toggleUnit(progress.keys[index])}
                  onChangePlan={(next) => changePlan(si, next)}
                />
              )}
            </IllusCard>
          );
        })}
        {pct === 100 && <CompletionBanner color={w.color} emoji="🎉" text="WORKOUT COMPLETE!" />}
        {doneUnits > 0 && (
          <p style={{ fontSize: 11, color: T.muted, textAlign: "center", margin: "4px 0 12px" }}>
            ✓ Saved to your log as you check
          </p>
        )}
        {completedActivity && (
          <div style={{ marginTop: 12 }}>
            <ActivityCompletionForm
              key={completedActivity.id}
              activity={completedActivity}
              onSave={(updates) => {
                onUpdateActivity(completedActivity.id, updates);
                dismissForm();
              }}
              onSkip={dismissForm}
            />
          </div>
        )}
        {recoveryWorkoutActivity && (
          <RecoveryFlow
            workoutActivity={recoveryWorkoutActivity}
            activityLog={activityLog}
            onAddActivity={onAddActivity}
            onClose={() => setRecoveryFor(null)}
          />
        )}
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
