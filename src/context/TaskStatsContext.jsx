import React, { createContext, useContext, useMemo, useState } from "react";

const TaskStatsContext = createContext();
const ThemeContext = createContext();

export function TaskStatsProvider({ tasks, children }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  }, [tasks]);

  return (
    <TaskStatsContext.Provider value={stats}>
      {children}
    </TaskStatsContext.Provider>
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTaskStats() {
  return useContext(TaskStatsContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}