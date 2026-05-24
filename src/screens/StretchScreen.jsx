import { T, font } from "../theme.js";
import { stretchSections, StretchIllus } from "../data/stretches.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";

export function StretchScreen({ onBack, checked, setChecked }) {
  const allItems = stretchSections.flatMap((s) => s.items);
  const done = allItems.filter((item) => checked[`str-${item.key}`]).length;
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
                done={!!checked[`str-${item.key}`]}
                onToggle={() =>
                  setChecked((p) => ({ ...p, [`str-${item.key}`]: !p[`str-${item.key}`] }))
                }
                illusKey={item.name}
                IllusMap={StretchIllus}
              />
            ))}
          </div>
        ))}
        {done === allItems.length && (
          <CompletionBanner color={T.green} emoji="🌿" text="FULLY STRETCHED!" />
        )}
      </div>
    </div>
  );
}
