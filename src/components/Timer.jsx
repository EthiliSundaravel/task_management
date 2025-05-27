import React, { useEffect } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";

export default function Timer() {
  const {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    tick,
    intervalRef,
  } = usePomodoroTimer();

  // Handle timer interval
  useEffect(() => {
    if (isRunning && intervalRef.current == null) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick, intervalRef]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div>
      <h3>Pomodoro Timer</h3>
      <div style={{ fontSize: "2em" }}>
        {minutes}:{seconds}
      </div>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={pause} disabled={!isRunning}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}