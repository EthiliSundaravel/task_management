import { useReducer, useRef, useCallback } from "react";

const initialState = {
  secondsLeft: 1500, // 25 minutes
  isRunning: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, isRunning: true };
    case "PAUSE":
      return { ...state, isRunning: false };
    case "RESET":
      return { ...state, secondsLeft: 1500, isRunning: false };
    case "TICK":
      return {
        ...state,
        secondsLeft: state.secondsLeft > 0 ? state.secondsLeft - 1 : 0,
      };
    default:
      return state;
  }
}

// Custom hook for Pomodoro timer logic
export function usePomodoroTimer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (!state.isRunning) dispatch({ type: "START" });
  }, [state.isRunning]);

  const pause = useCallback(() => {
    if (state.isRunning) dispatch({ type: "PAUSE" });
  }, [state.isRunning]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Control timer interval
  const tick = useCallback(() => {
    dispatch({ type: "TICK" });
  }, []);

  return {
    secondsLeft: state.secondsLeft,
    isRunning: state.isRunning,
    start,
    pause,
    reset,
    tick,
    intervalRef,
  };
}