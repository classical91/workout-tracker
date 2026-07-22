import { useCallback, useEffect, useRef, useState } from "react";
import { T, font } from "../theme.js";
import {
  StretchIllus,
  stretchCheckKey,
  stretchSections,
  summarizeStretchSession,
} from "../data/stretches.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

const allItems = stretchSections.flatMap((section) => section.items);

function buildStretchActivity(summary) {
  return {
    type: ACTIVITY_TYPES.STRETCH,
    category: ACTIVITY_CATEGORIES.MOBILITY,
    name: summary.name,
    emoji: "🧘",
    color: T.green,
    duration: summary.fullBody ? "10 min" : "",
    completed: summary.fullBody,
    details: {
      bodyAreas: summary.doneItems.map((item) => item.name),
      completedSections: summary.completedSections,
      holds: summary.doneItems.map((item) => ({
        name: item.name,
        planned: item.hold,
        region: item.region,
        color: item.color,
      })),
    },
  };
}

export function StretchScreen({ onBack, checked, setChecked, onAddActivity, onUpdateActivity }) {
  const done = allItems.filter((item) => checked[stretchCheckKey(item)]).length;
  const previousDone = useRef(done);
  const [completedActivity, setCompletedActivity] = useState(null);

  const clearStretchChecks = useCallback(() => {
    setChecked((previous) => {
      const next = { ...previous };
      for (const item of allItems) delete next[stretchCheckKey(item)];
      return next;
    });
    previousDone.current = 0;
  }, [setChecked]);

  const logSession = useCallback(() => {
    const summary = summarizeStretchSession(checked);
    if (summary.doneCount === 0) return;
    previousDone.current = summary.doneCount;
    setCompletedActivity(onAddActivity(buildStretchActivity(summary)));
  }, [checked, onAddActivity]);

  const dismissForm = useCallback(() => {
    clearStretchChecks();
    setCompletedActivity(null);
  }, [clearStretchChecks]);

  // Auto-log the moment the full routine is finished. A form is never open at
  // that point (finishing clears the checks), so this can't double-fire.
  useEffect(() => {
    if (!completedActivity && done === allItems.length && previousDone.current < allItems.length) {
      setCompletedActivity(onAddActivity(buildStretchActivity(summarizeStretchSession(checked))));
    }
    previousDone.current = done;
  }, [done, checked, completedActivity, onAddActivity]);

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
        title="Stretch"
        subtitle="FLEXIBILITY · 10 MIN"
        emoji="🧘"
        color={T.green}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={allItems.length} color={T.green} />
        {stretchSections.map((section) => (
          <div key={section.label}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: section.color,
                fontWeight: 700,
                marginBottom: 10,
                marginTop: 8,
              }}
            >
              {section.label.toUpperCase()}
            </p>
            {section.items.map((item) => (
              <IllusCard
                key={item.key}
                label={item.name}
                muscles={item.muscles}
                detail={item.detail}
                reps={item.hold}
                color={section.color}
                done={Boolean(checked[stretchCheckKey(item)])}
                onToggle={() =>
                  setChecked((previous) => ({
                    ...previous,
                    [stretchCheckKey(item)]: !previous[stretchCheckKey(item)],
                  }))
                }
                illusKey={item.name}
                IllusMap={StretchIllus}
                link={`https://www.google.com/search?udm=2&q=${encodeURIComponent(`${item.name} stretch`)}`}
              />
            ))}
          </div>
        ))}
        {done === allItems.length && (
          <CompletionBanner color={T.green} emoji="🌿" text="FULLY STRETCHED!" />
        )}
        {done > 0 && done < allItems.length && !completedActivity && (
          <button
            type="button"
            onClick={logSession}
            style={{
              width: "100%",
              marginTop: 4,
              background: T.green,
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
            Log this session ({done} of {allItems.length})
          </button>
        )}
        {completedActivity && (
          <ActivityCompletionForm
            activity={completedActivity}
            onSave={(updates) => {
              onUpdateActivity(completedActivity.id, updates);
              dismissForm();
            }}
            onSkip={dismissForm}
          />
        )}
      </div>
    </div>
  );
}
