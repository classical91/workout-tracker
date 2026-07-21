import { useState } from "react";
import { T, font, display } from "../theme.js";
import { simpleEx, findSimpleEx } from "../data/simpleExercises.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";

export function SimpleExerciseScreen({
  slug,
  onBack,
  onOpen,
  checked,
  setChecked,
  onAddActivity,
  onUpdateActivity,
}) {
  const color = T.blue;
  const match = findSimpleEx(slug);
  const [completedActivity, setCompletedActivity] = useState(null);

  // Unknown slug — send the visitor back to the full list.
  if (!match) {
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
          title="Not Found"
          subtitle="SIMPLE EXERCISES"
          emoji="🏃"
          color={color}
          onBack={onBack}
        />
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
            That exercise doesn&apos;t exist. Head back to the list to pick one.
          </p>
        </div>
      </div>
    );
  }

  const { exercise, index } = match;
  const key = `sim-${index}`;
  const isDone = !!checked[key];
  const toggle = () => {
    if (!isDone) {
      setCompletedActivity(
        onAddActivity({
          type: ACTIVITY_TYPES.EXERCISE,
          category: ACTIVITY_CATEGORIES.STRENGTH,
          name: exercise.name,
          emoji: "🏃",
          color,
          duration: "",
          details: { exercises: [{ name: exercise.name, planned: exercise.reps }] },
        })
      );
    }
    setChecked((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  const prev = index > 0 ? simpleEx[index - 1] : null;
  const next = index < simpleEx.length - 1 ? simpleEx[index + 1] : null;

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
        title={exercise.name}
        subtitle="SIMPLE EXERCISE"
        emoji="🏃"
        color={color}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "20px 18px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              color,
              background: `${color}18`,
              borderRadius: 99,
              padding: "5px 12px",
              marginBottom: 14,
            }}
          >
            {exercise.reps}
          </div>
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.6 }}>{exercise.detail}</p>
          <button
            type="button"
            aria-pressed={isDone}
            onClick={toggle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
              padding: "12px 16px",
              width: "100%",
              cursor: "pointer",
              borderRadius: 12,
              border: `2px solid ${color}`,
              background: isDone ? color : "transparent",
              color: isDone ? "#000" : color,
              font: "inherit",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              justifyContent: "center",
            }}
          >
            {isDone ? "✓ DONE" : "MARK AS DONE"}
          </button>
        </div>

        {completedActivity && (
          <ActivityCompletionForm
            activity={completedActivity}
            onSave={(updates) => {
              onUpdateActivity(completedActivity.id, updates);
              setCompletedActivity(null);
            }}
            onSkip={() => setCompletedActivity(null)}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 16 }}>
          {prev ? (
            <a
              href={`#/simple/${prev.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen(prev.slug);
              }}
              style={navLinkStyle(color, "left")}
            >
              ← {prev.name}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={`#/simple/${next.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen(next.slug);
              }}
              style={navLinkStyle(color, "right")}
            >
              {next.name} →
            </a>
          ) : (
            <span />
          )}
        </div>

        <p
          style={{
            marginTop: 24,
            fontSize: 11,
            color: T.muted,
            textAlign: "center",
            fontFamily: display,
            letterSpacing: 2,
          }}
        >
          EXERCISE {index + 1} OF {simpleEx.length}
        </p>
      </div>
    </div>
  );
}

const navLinkStyle = (color, align) => ({
  flex: 1,
  maxWidth: "48%",
  textDecoration: "none",
  color: T.muted,
  fontSize: 12,
  fontWeight: 600,
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 12,
  padding: "12px 14px",
  textAlign: align,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  borderColor: `${color}33`,
});
