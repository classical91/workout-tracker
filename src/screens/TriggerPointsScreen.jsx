import { T, font } from "../theme.js";
import { triggerPointSections } from "../data/triggerPoints.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { TriggerPointCard } from "../components/TriggerPointCard.jsx";

export function TriggerPointsScreen({ onBack, checked, setChecked }) {
  const allItems = triggerPointSections.flatMap((section) => section.items);
  const done = allItems.filter((item) => checked[`tp-${item.key}`]).length;
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
        title="Trigger Points"
        subtitle="RELEASE · MOBILITY · PAIN MAP"
        emoji="🎯"
        color={T.red}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={allItems.length} color={T.red} />
        <div
          style={{
            background: `${T.red}12`,
            border: `1px solid ${T.red}35`,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: T.text,
            lineHeight: 1.6,
          }}
        >
          Trigger points are tight, tender spots in muscles that can refer pain somewhere else. Tap
          each one as you work through it.
        </div>
        {triggerPointSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 18 }}>
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
            {section.items.map((item) => {
              const key = `tp-${item.key}`;
              return (
                <TriggerPointCard
                  key={item.key}
                  item={item}
                  section={section}
                  isDone={!!checked[key]}
                  onToggle={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              );
            })}
          </div>
        ))}
        {done === allItems.length && (
          <CompletionBanner color={T.red} emoji="🎯" text="TRIGGER POINTS COMPLETE!" />
        )}
      </div>
    </div>
  );
}
