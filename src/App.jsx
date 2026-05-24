import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { WorkoutSetsScreen } from "./screens/WorkoutSetsScreen.jsx";
import { StretchScreen } from "./screens/StretchScreen.jsx";
import { SimpleWorkoutsScreen } from "./screens/SimpleWorkoutsScreen.jsx";
import { BreathingScreen } from "./screens/BreathingScreen.jsx";
import { FoamRollerScreen } from "./screens/FoamRollerScreen.jsx";
import { TriggerPointsScreen } from "./screens/TriggerPointsScreen.jsx";
import { LogScreen } from "./screens/LogScreen.jsx";
import { TimerScreen } from "./screens/TimerScreen.jsx";

const LOG_KEY = "wellness_log";
const CHK_KEY = "wellness_checked";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [checked, setChecked] = useLocalStorage(CHK_KEY, {});
  const [log, setLog] = useLocalStorage(LOG_KEY, []);

  const goHome = () => setScreen("home");

  const addLog = (entry) =>
    setLog((prev) => {
      const key = `${entry.name}-${new Date(entry.ts).toDateString()}`;
      if (prev.some((e) => `${e.name}-${new Date(e.ts).toDateString()}` === key)) return prev;
      return [entry, ...prev];
    });

  const timerDone = (name, emoji, color, duration) =>
    addLog({ name, emoji, color, duration, ts: Date.now() });

  switch (screen) {
    case "workout-sets":
      return (
        <WorkoutSetsScreen
          onBack={goHome}
          checked={checked}
          setChecked={setChecked}
          onLog={addLog}
        />
      );
    case "stretch":
      return <StretchScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
    case "simple":
      return <SimpleWorkoutsScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
    case "breathing":
      return <BreathingScreen onBack={goHome} />;
    case "foam-roller":
      return <FoamRollerScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
    case "trigger-points":
      return <TriggerPointsScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
    case "log":
      return <LogScreen onBack={goHome} log={log} onClear={() => setLog([])} />;
    case "bike":
      return (
        <TimerScreen
          title="Bike"
          subtitle="CARDIO · 20 MIN"
          emoji="🚴"
          color="#378ADD"
          defaultMins={20}
          onBack={goHome}
          onComplete={() => timerDone("Bike", "🚴", "#378ADD", "20 min")}
          note="Steady pace cardio. Aim for 60–70% max heart rate. Stay hydrated."
        />
      );
    case "sauna":
      return (
        <TimerScreen
          title="Sauna"
          subtitle="RECOVERY · 20 MIN"
          emoji="🧖"
          color="#E74C3C"
          defaultMins={20}
          onBack={goHome}
          onComplete={() => timerDone("Sauna", "🧖", "#E74C3C", "20 min")}
          note="Hydrate well before and after. Exit if you feel dizzy or uncomfortable."
        />
      );
    case "ohming":
      return (
        <TimerScreen
          title="Ohming"
          subtitle="MEDITATION · 5 MIN"
          emoji="🕉️"
          color="#C77DFF"
          defaultMins={5}
          onBack={goHome}
          onComplete={() => timerDone("Ohming", "🕉️", "#C77DFF", "5 min")}
          note="Sit comfortably, close eyes. Inhale deeply, exhale with a low Ohhhmm sound. Let thoughts pass."
        />
      );
    case "home":
    default:
      return <HomeScreen onNavigate={setScreen} />;
  }
}
