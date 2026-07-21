import { useEffect, useRef, useState } from "react";
import { T, font } from "../theme.js";
import { foamTech } from "../data/foamRoller.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

export function FoamRollerScreen({ onBack, checked, setChecked, onAddActivity, onUpdateActivity }) {
  const color = T.teal;
  const done = foamTech.filter((_, index) => checked[`foam-${index}`]).length;
  const previousDone = useRef(done);
  const [completedActivity, setCompletedActivity] = useState(null);

  useEffect(() => {
    if (done === foamTech.length && previousDone.current < foamTech.length) {
      setCompletedActivity(
        onAddActivity({
          type: ACTIVITY_TYPES.FOAM_ROLLING,
          category: ACTIVITY_CATEGORIES.RECOVERY,
          name: "Foam Rolling",
          emoji: "🧴",
          color,
          duration: "10 min",
          details: { bodyAreas: foamTech.map((technique) => technique.area) },
        })
      );
    }
    previousDone.current = done;
  }, [color, done, onAddActivity]);

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
        {foamTech.map((technique, index) => {
          const isDone = Boolean(checked[`foam-${index}`]);
          return (
            <div
              key={technique.area}
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
                aria-pressed={isDone}
                onClick={() =>
                  setChecked((previous) => ({
                    ...previous,
                    [`foam-${index}`]: !previous[`foam-${index}`],
                  }))
                }
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  cursor: "pointer",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: T.text,
                  font: "inherit",
                  textAlign: "left",
                }}
              >
                <span
                  aria-hidden="true"
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
                    color: "#000",
                    fontWeight: 800,
                  }}
                >
                  {isDone ? "✓" : ""}
                </span>
                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 700,
                      fontSize: 14,
                      color: isDone ? T.muted : T.text,
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {technique.emoji} {technique.area}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: T.muted,
                      lineHeight: 1.5,
                      marginTop: 4,
                    }}
                  >
                    {technique.detail}
                  </span>
                  {!isDone && (
                    <span
                      style={{
                        display: "block",
                        background: `${color}10`,
                        borderLeft: `3px solid ${color}`,
                        borderRadius: 6,
                        padding: "8px 10px",
                        fontSize: 11,
                        color,
                        marginTop: 7,
                      }}
                    >
                      💡 {technique.tip}
                    </span>
                  )}
                </span>
              </button>
            </div>
          );
        })}
        {done === foamTech.length && (
          <CompletionBanner color={color} emoji="✨" text="RECOVERY COMPLETE!" />
        )}
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
      </div>
    </div>
  );
}
