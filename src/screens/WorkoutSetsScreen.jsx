import { useState, useEffect, useRef, useCallback } from "react";
import { T, font, display } from "../theme.js";
import {
  workouts as builtInWorkouts,
  tsStyle,
  workoutStepKey,
  summarizeWorkoutSession,
} from "../data/workouts.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { BackButton } from "../components/BackButton.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { WorkoutBuilder } from "../components/WorkoutBuilder.jsx";

// The user's current local calendar day, used to reset checkmarks at midnight.
const localDay = () => new Date().toDateString();

function buildWorkoutActivity(workout, summary) {
  return {
    type: ACTIVITY_TYPES.WORKOUT,
    category: ACTIVITY_CATEGORIES.STRENGTH,
    name: summary.name,
    emoji: workout.emoji,
    color: workout.color,
    duration: summary.complete ? "~30 min" : "",
    completed: summary.complete,
    details: {
      workoutId: workout.id,
      completedSteps: summary.doneCount,
      totalSteps: summary.totalCount,
      exercises: summary.doneExercises.map((step) => ({ name: step.phase, planned: step.reps })),
    },
  };
}

export function WorkoutSetsScreen({
  onBack,
  checked,
  setChecked,
  onAddActivity,
  onUpdateActivity,
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
  const stepKey = (si) => workoutStepKey(w.id, si);
  const doneSteps = w.steps.filter((_, si) => checked[stepKey(si)]).length;
  const doneEx = w.steps.filter((s, si) => s.type === "exercise" && checked[stepKey(si)]).length;
  const totalEx = w.steps.filter((s) => s.type === "exercise").length;
  const pct = Math.round((doneSteps / w.steps.length) * 100);
  const allDone = workouts.map((wk) =>
    wk.steps.every((_, si) => checked[workoutStepKey(wk.id, si)])
  );
  const isCustom = safeAw >= builtInWorkouts.length;

  const [completedActivity, setCompletedActivity] = useState(null);

  // Which local day the current checkmarks belong to, and which workout steps
  // have already been logged that day. Checkmarks persist until the day rolls
  // over; `logged` prevents re-logging a step that's still checked.
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.workoutSession, {
    day: "",
    logged: {},
  });
  // Checked-but-unlogged steps for the active workout, so a partial routine can
  // be logged from the button and the button hides when nothing is new.
  const unloggedCount = w.steps.filter(
    (_, si) => checked[stepKey(si)] && !session.logged?.[stepKey(si)]
  ).length;

  // Track the previous done-count per workout id so a routine is logged once
  // when it crosses into fully complete, without re-logging when switching away
  // and back. A workout's first appearance seeds its prior value with the
  // current count so navigating straight to an already-complete routine doesn't
  // auto-log it.
  const prevDone = useRef({});

  // Latest values captured for logic that runs outside render (the leave-time
  // auto-log and the once-per-day reset), so it never uses stale props.
  const checkedRef = useRef(checked);
  checkedRef.current = checked;
  const addActivityRef = useRef(onAddActivity);
  addActivityRef.current = onAddActivity;
  const workoutsRef = useRef(workouts);
  workoutsRef.current = workouts;
  const setSessionRef = useRef(setSession);
  setSessionRef.current = setSession;
  // Source of truth for "already logged today", mirrored into state for render.
  const loggedRef = useRef(session.logged || {});

  // Log the checked-but-unlogged steps of one workout as a single session
  // activity, mark those steps logged, and leave the checkmarks in place.
  // Returns the created activity, or null when nothing new needed logging.
  const logWorkout = useCallback((workout) => {
    const current = checkedRef.current || {};
    const logged = loggedRef.current;
    const pendingKeys = [];
    workout.steps.forEach((_, si) => {
      const key = workoutStepKey(workout.id, si);
      if (current[key] && !logged[key]) pendingKeys.push(key);
    });
    if (pendingKeys.length === 0) return null;
    const pendingChecked = Object.fromEntries(pendingKeys.map((key) => [key, true]));
    const summary = summarizeWorkoutSession(workout, pendingChecked);
    const activity = addActivityRef.current(buildWorkoutActivity(workout, summary));
    const nextLogged = { ...logged };
    for (const key of pendingKeys) nextLogged[key] = true;
    loggedRef.current = nextLogged;
    setSessionRef.current({ day: localDay(), logged: nextLogged });
    return activity;
  }, []);

  // Log any checked-but-unlogged steps across every workout — used when leaving
  // the screen so a partial routine is never lost by forgetting to log it.
  const logAllPending = useCallback(() => {
    for (const workout of workoutsRef.current) logWorkout(workout);
  }, [logWorkout]);

  const logSession = useCallback(() => {
    const activity = logWorkout(w);
    if (activity) setCompletedActivity(activity);
  }, [logWorkout, w]);

  // Closing the details form keeps the checkmarks — they stay until the new day.
  const dismissForm = useCallback(() => setCompletedActivity(null), []);

  // Auto-log the moment a workout is finished, unless a form is already open
  // (which would double-fire on checks made while it's up).
  useEffect(() => {
    const prior = w.id in prevDone.current ? prevDone.current[w.id] : doneSteps;
    if (!completedActivity && doneSteps === w.steps.length && prior < w.steps.length) {
      const activity = logWorkout(w);
      if (activity) setCompletedActivity(activity);
    }
    prevDone.current[w.id] = doneSteps;
  }, [doneSteps, w, completedActivity, logWorkout]);

  // Roll the checkmarks over at local midnight: on the first render of a new
  // day, clear the workout checkmarks and forget what was logged. On first-ever
  // use (no stored day) we adopt today without clearing, so existing checks and
  // other screens' checkmarks are left alone.
  useEffect(() => {
    const today = localDay();
    if (session.day && session.day !== today) {
      loggedRef.current = {};
      setChecked((previous) => {
        const next = { ...previous };
        for (const key of Object.keys(next)) {
          if (key.startsWith("w-")) delete next[key];
        }
        return next;
      });
      setSession({ day: today, logged: {} });
    } else {
      loggedRef.current = session.logged || {};
      if (session.day !== today) setSession({ day: today, logged: session.logged || {} });
    }
    // Runs once on mount; refs/state read inside are intentionally not deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When leaving the screen, record any checked-but-unlogged steps across all
  // workouts so a partial routine is never lost. Checkmarks are kept (they reset
  // at midnight, not on leave).
  const logAllPendingRef = useRef(logAllPending);
  logAllPendingRef.current = logAllPending;
  useEffect(() => {
    return () => {
      logAllPendingRef.current();
    };
  }, []);

  // Cancel a pending delete confirmation and close the details form when the
  // active routine changes.
  useEffect(() => {
    setConfirmingDelete(false);
    setCompletedActivity(null);
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
              key={`${w.id}-${si}`}
              label={step.phase}
              detail={step.detail}
              reps={step.reps}
              done={done}
              color={ac}
              onToggle={() => setChecked((p) => ({ ...p, [key]: !p[key] }))}
              illusKey={step.phase}
              image={step.image}
              link={
                step.type === "exercise" && !step.image
                  ? `https://www.google.com/search?udm=2&q=${encodeURIComponent(
                      `${step.phase} ${isCustom ? "exercise" : "dumbbell exercise"}`
                    )}`
                  : undefined
              }
            />
          );
        })}
        {pct === 100 && <CompletionBanner color={w.color} emoji="🎉" text="WORKOUT COMPLETE!" />}
        {unloggedCount > 0 && !completedActivity && (
          <button
            type="button"
            onClick={logSession}
            style={{
              width: "100%",
              marginTop: 4,
              background: w.color,
              border: "none",
              borderRadius: 12,
              padding: 14,
              color: "#000",
              fontFamily: font,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Log this session ({unloggedCount} of {w.steps.length})
          </button>
        )}
        {completedActivity && (
          <div style={{ marginTop: 12 }}>
            <ActivityCompletionForm
              activity={completedActivity}
              onSave={(updates) => {
                onUpdateActivity(completedActivity.id, updates);
                dismissForm();
              }}
              onSkip={dismissForm}
            />
          </div>
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
