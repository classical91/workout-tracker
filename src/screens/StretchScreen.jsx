import { useEffect, useRef, useState } from "react";
import { T, font } from "../theme.js";
import { stretchSections, StretchIllus } from "../data/stretches.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

const allItems = stretchSections.flatMap((section) => section.items);

export function StretchScreen({ onBack, checked, setChecked, onAddActivity, onUpdateActivity }) {
  const done = allItems.filter((item) => checked[`str-${item.key}`]).length;
  const previousDone = useRef(done);
  const [completedActivity, setCompletedActivity] = useState(null);

  useEffect(() => {
    if (done === allItems.length && previousDone.current < allItems.length) {
      setCompletedActivity(
        onAddActivity({
          type: ACTIVITY_TYPES.STRETCH,
          category: ACTIVITY_CATEGORIES.MOBILITY,
          name: "Full Body Stretch",
          emoji: "🧘",
          color: T.green,
          duration: "10 min",
          details: { holds: allItems.map((item) => ({ name: item.name, planned: item.hold })) },
        })
      );
    }
    previousDone.current = done;
  }, [done, onAddActivity]);

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
                done={Boolean(checked[`str-${item.key}`])}
                onToggle={() =>
                  setChecked((previous) => ({
                    ...previous,
                    [`str-${item.key}`]: !previous[`str-${item.key}`],
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
