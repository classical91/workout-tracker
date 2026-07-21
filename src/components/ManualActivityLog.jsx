import { useState } from "react";
import { ActivityCompletionForm } from "./ActivityCompletionForm.jsx";
import { font } from "../theme.js";

export function ManualActivityLog({ activity, onAddActivity, onUpdateActivity }) {
  const [loggedActivity, setLoggedActivity] = useState(null);

  if (loggedActivity) {
    return (
      <ActivityCompletionForm
        activity={loggedActivity}
        onSave={(updates) => {
          onUpdateActivity(loggedActivity.id, updates);
          setLoggedActivity(null);
        }}
        onSkip={() => setLoggedActivity(null)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoggedActivity(onAddActivity(activity))}
      style={{
        width: "100%",
        marginTop: 12,
        background: `${activity.color}18`,
        border: `1px solid ${activity.color}66`,
        borderRadius: 11,
        padding: 12,
        color: activity.color,
        fontFamily: font,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Log completed session
    </button>
  );
}
