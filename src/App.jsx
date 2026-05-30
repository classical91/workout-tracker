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
import { StatsScreen } from "./screens/StatsScreen.jsx";
import { TimerScreen } from "./screens/TimerScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [checked, setChecked, checkedSaveError] = useLocalStorage(STORAGE_KEYS.checked, {});
  const { log, addLog, clearLog, clearToday, setNote, saveError: logSaveError } = useWorkoutLog();
  const {
    customWorkouts,
    addWorkout,
    deleteWorkout,
    saveError: customSaveError,
  } = useCustomWorkouts();

  const goHome = () => setScreen("home");

  const timerDone = (name, emoji, color, duration) => addLog({ name, emoji, color, duration });

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
            onDeleteWorkout={deleteWorkout}
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
        return (
          <LogScreen
            onBack={goHome}
            log={log}
            onClear={clearLog}
            onClearToday={clearToday}
            onSetNote={setNote}
          />
        );
      case "stats":
        return <StatsScreen onBack={goHome} log={log} />;
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
  };

  return (
    <>
      {renderScreen()}
      {(checkedSaveError || logSaveError || customSaveError) && <StorageWarning />}
    </>
  );
}
