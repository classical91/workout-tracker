import { T, font } from "../theme.js";
import { calmingFoodSections } from "../data/calmingFoods.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

export function CalmingFoodsScreen({ onBack }) {
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
        title="Calming Foods"
        subtitle="FRUITS · FOODS · HERBS"
        emoji="🍵"
        color={T.yellow}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 16 }}>
          What you eat and sip shapes how settled you feel. These are everyday options that support
          a calmer nervous system — general wellness info, not medical advice.
        </p>
        {calmingFoodSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: section.color,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {section.label.toUpperCase()}
            </p>
            {section.items.map((item) => (
              <div
                key={item.name}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: section.color,
                      background: `${section.color}18`,
                      borderRadius: 99,
                      padding: "3px 9px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.how}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0 }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
