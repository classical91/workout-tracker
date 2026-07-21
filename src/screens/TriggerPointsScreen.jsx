import { T, font } from "../theme.js";
import { triggerPointSections } from "../data/triggerPoints.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { TriggerPointCard } from "../components/TriggerPointCard.jsx";
import { ManualActivityLog } from "../components/ManualActivityLog.jsx";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";

export function TriggerPointsScreen({ onBack, onAddActivity, onUpdateActivity }) {
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
          a card to expand it and view details.
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
            {section.items.map((item) => (
              <TriggerPointCard key={item.key} item={item} section={section} />
            ))}
          </div>
        ))}
        <ManualActivityLog
          activity={{
            type: ACTIVITY_TYPES.TRIGGER_POINTS,
            category: ACTIVITY_CATEGORIES.RECOVERY,
            name: "Trigger-Point Session",
            emoji: "🎯",
            color: T.red,
            duration: "10–15 min",
            details: {},
          }}
          onAddActivity={onAddActivity}
          onUpdateActivity={onUpdateActivity}
        />
      </div>
    </div>
  );
}
