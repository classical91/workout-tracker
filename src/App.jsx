import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useWorkoutLog } from "./hooks/useWorkoutLog.js";
import { useCustomWorkouts } from "./hooks/useCustomWorkouts.js";
import { STORAGE_KEYS } from "./constants/storageKeys.js";
import { StorageWarning } from "./components/StorageWarning.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { WorkoutSetsScreen } from "./screens/WorkoutSetsScreen.jsx";
import { StretchScreen } from "./screens/StretchScreen.jsx";
import { SimpleWorkoutsScreen } from "./screens/SimpleWorkoutsScreen.jsx";
import { BreathingScreen } from "./screens/BreathingScreen.jsx";
import { FoamRollerScreen } from "./screens/FoamRollerScreen.jsx";
import { TriggerPointsScreen } from "./screens/TriggerPointsScreen.jsx";
import { LogScreen } from "./screens/LogScreen.jsx";
import { TimerScreen } from "./screens/TimerScreen.jsx";
import { BenefitsScreen } from "./screens/BenefitsScreen.jsx";
import { CalmScreen } from "./screens/CalmScreen.jsx";
import { CalmingFoodsScreen } from "./screens/CalmingFoodsScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [timerActivity, setTimerActivity] = useState(null);
  const [checked, setChecked, checkedSaveError] = useLocalStorage(STORAGE_KEYS.checked, {});
  const { log, addLog, clearLog, clearToday, setNote, saveError: logSaveError } = useWorkoutLog();
  const {
    customWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    saveError: customSaveError,
  } = useCustomWorkouts();

  const goHome = () => setScreen("home");
  const goCalm = () => setScreen("calm");

  const timerDone = (name, emoji, color, duration) => addLog({ name, emoji, color, duration });

  // Launch a timer for a tapped quick activity; it logs itself on completion.
  const startQuickTimer = (activity) => {
    setTimerActivity(activity);
    setScreen("quick-timer");
  };

  const renderScreen = () => {
    switch (screen) {
      case "workout-sets":
        return (
          <WorkoutSetsScreen
            onBack={goHome}
            checked={checked}
            setChecked={setChecked}
            onLog={addLog}
            customWorkouts={customWorkouts}
            onAddWorkout={addWorkout}
            onUpdateWorkout={updateWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        );
      case "stretch":
        return <StretchScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
      case "simple":
        return <SimpleWorkoutsScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
      case "calm":
        return <CalmScreen onBack={goHome} onNavigate={setScreen} />;
      case "breathing":
        return <BreathingScreen onBack={goCalm} />;
      case "calming-foods":
        return <CalmingFoodsScreen onBack={goCalm} />;
      case "cold-shower":
        return (
          <TimerScreen
            title="Cold Shower"
            subtitle="RESET · 2 MIN"
            emoji="🚿"
            color="#378ADD"
            defaultMins={2}
            onBack={goCalm}
            onComplete={() => timerDone("Cold Shower", "🚿", "#378ADD", "2 min")}
            note="Start warm, then turn cold for the timer. Breathe slowly through the shock — long exhales. Step out, don't tough it out, if you feel unwell. Avoid if you have heart problems."
          />
        );
      case "body-scan":
        return (
          <TimerScreen
            title="Body Scan"
            subtitle="WIND-DOWN · 10 MIN"
            emoji="🛌"
            color="#2ECC71"
            defaultMins={10}
            onBack={goCalm}
            onComplete={() => timerDone("Body Scan", "🛌", "#2ECC71", "10 min")}
            note="Lie down, close your eyes. Bring attention to your toes and slowly move upward — feet, legs, hips, belly, chest, hands, arms, shoulders, neck, face. At each stop, notice the tension and let it soften on the exhale."
          />
        );
      case "foam-roller":
        return <FoamRollerScreen onBack={goHome} checked={checked} setChecked={setChecked} />;
      case "trigger-points":
        return <TriggerPointsScreen onBack={goHome} />;
      case "log":
        return (
          <LogScreen
            onBack={goHome}
            log={log}
            onClear={clearLog}
            onClearToday={clearToday}
            onSetNote={setNote}
          />
        );
      case "benefits":
        return <BenefitsScreen onBack={goHome} />;
      case "ohming":
        return (
          <TimerScreen
            title="Ohming"
            subtitle="MEDITATION · 5 MIN"
            emoji="🕉️"
            color="#C77DFF"
            defaultMins={5}
            onBack={goCalm}
            onComplete={() => timerDone("Ohming", "🕉️", "#C77DFF", "5 min")}
            note="Sit comfortably, close eyes. Inhale deeply, exhale with a low Ohhhmm sound. Let thoughts pass."
          />
        );
      case "quick-timer":
        if (!timerActivity) return <HomeScreen onNavigate={setScreen} onStartTimer={startQuickTimer} />;
        return (
          <TimerScreen
            title={timerActivity.name}
            subtitle={`${timerActivity.name.toUpperCase()} · ${timerActivity.duration.toUpperCase()}`}
            emoji={timerActivity.emoji}
            color={timerActivity.color}
            defaultMins={parseInt(timerActivity.duration, 10) || 20}
            onBack={goHome}
            onComplete={() =>
              timerDone(
                timerActivity.name,
                timerActivity.emoji,
                timerActivity.color,
                timerActivity.duration
              )
            }
          />
        );
      case "home":
      default:
        return <HomeScreen onNavigate={setScreen} onStartTimer={startQuickTimer} />;
    }
  };

  return (
    <>
      {renderScreen()}
      {(checkedSaveError || logSaveError || customSaveError) && <StorageWarning />}
    </>
  );
}
