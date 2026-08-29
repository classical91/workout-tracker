import { useEffect, useState } from "react";
import { T, font } from "../theme.js";
import { triggerPointSections } from "../data/triggerPoints.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { TriggerPointOverview } from "../components/TriggerPointOverview.jsx";
import { TriggerPointCard } from "../components/TriggerPointCard.jsx";
import { DailyFocusPrompt } from "../components/DailyFocusPrompt.jsx";
import { ManualActivityLog } from "../components/ManualActivityLog.jsx";
import { triggerPointDailyFocus } from "../utils/dailyFocus.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";

const itemsByKey = new Map(
  triggerPointSections.flatMap((section) =>
    section.items.map((item) => [item.key, { item, section }])
  )
);

export function TriggerPointsScreen({
  onBack,
  onAddActivity,
  onUpdateActivity,
  onAddDailyFocus,
  onRemoveDailyFocus,
}) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [pendingFocus, setPendingFocus] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const selectPoint = (key) => {
    setSelectedPoint(key);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`trigger-point-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const showOnMap = (key) => {
    setSelectedPoint(key);
    document
      .getElementById("trigger-point-map")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectHotspot = (hotspot) => {
    const entry = itemsByKey.get(hotspot.triggerPointKey);
    if (!entry) return;
    setSelectedHotspot(hotspot);
    setPendingFocus({
      hotspot,
      item: entry.item,
      color: entry.section.color,
      focus: triggerPointDailyFocus(entry.item, hotspot),
    });
  };

  const dismissPrompt = () => {
    setPendingFocus(null);
    setSelectedHotspot(null);
  };

  // Adding the same hotspot twice is a no-op: the focus id is derived from the
  // hotspot id, and the daily-focus state drops a focus it already holds.
  const confirmFocus = () => {
    onAddDailyFocus?.(pendingFocus.focus);
    setConfirmation({
      message: `✓ ${pendingFocus.item.name} added to Today's Focus`,
      focusId: pendingFocus.focus.id,
    });
    dismissPrompt();
  };

  const undoFocus = () => {
    onRemoveDailyFocus?.(confirmation.focusId);
    setConfirmation(null);
  };

  const viewDetails = () => {
    const key = pendingFocus.item.key;
    dismissPrompt();
    selectPoint(key);
  };

  useEffect(() => {
    if (!confirmation) return undefined;
    const timer = window.setTimeout(() => setConfirmation(null), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmation]);

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
        <TriggerPointOverview
          onSelect={selectPoint}
          onHotspotSelect={selectHotspot}
          selectedHotspotId={selectedHotspot?.id ?? null}
          highlightedKey={selectedPoint}
        />
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
              <TriggerPointCard
                key={item.key}
                item={item}
                section={section}
                requestedOpen={selectedPoint === item.key}
                highlighted={selectedPoint === item.key}
                onShowOnMap={() => showOnMap(item.key)}
              />
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

      <DailyFocusPrompt
        focus={pendingFocus?.focus}
        color={pendingFocus?.color || T.red}
        title={pendingFocus ? `Focus on ${pendingFocus.item.name} today?` : ""}
        description={
          pendingFocus
            ? `This hotspot is in the ${pendingFocus.item.name.toLowerCase()} region (${
                pendingFocus.hotspot.side
              } side). Add it to today's focuses?`
            : ""
        }
        confirmLabel="Yes, focus today"
        secondaryLabel={pendingFocus ? `View ${pendingFocus.item.name} details` : ""}
        onSecondary={viewDetails}
        onConfirm={confirmFocus}
        onDismiss={dismissPrompt}
      />

      {confirmation && (
        <div
          role="status"
          style={{
            position: "fixed",
            zIndex: 25,
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            maxWidth: "calc(100vw - 32px)",
            padding: "10px 16px",
            borderRadius: 999,
            border: `1px solid ${T.red}55`,
            background: T.surface2,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
            color: T.red,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {confirmation.message}
          <button
            type="button"
            onClick={undoFocus}
            style={{
              border: 0,
              padding: 0,
              background: "transparent",
              color: T.muted,
              fontFamily: font,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            UNDO
          </button>
        </div>
      )}
    </div>
  );
}
