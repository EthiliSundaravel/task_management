import React, { useCallback, useReducer, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { TaskStatsProvider } from "./context/TaskStatsContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import TaskStats from "./components/TaskStats";
import Timer from "./components/Timer";

function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: Date.now(), text: action.text, completed: false },
      ];
    case "TOGGLE":
      return state.map((task) =>
        task.id === action.id
          ? { ...task, completed: !task.completed }
          : task
      );
    case "DELETE":
      return state.filter((task) => task.id !== action.id);
    case "SET":
      return action.tasks;
    default:
      return state;
  }
}

function AppContent() {
  const [storedTasks, setStoredTasks] = useLocalStorage("tasks", []);
  const [tasks, dispatch] = useReducer(tasksReducer, storedTasks);

  // Sync tasks to localStorage
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    dispatch({ type: "SET", tasks: storedTasks });
    // eslint-disable-next-line
  }, []);

  const handleAdd = useCallback(
    (text) => dispatch({ type: "ADD", text }),
    []
  );
  const handleToggle = useCallback(
    (id) => dispatch({ type: "TOGGLE", id }),
    []
  );
  const handleDelete = useCallback(
    (id) => dispatch({ type: "DELETE", id }),
    []
  );

  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Smart Task Manager</h1>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>
      <TaskStatsProvider tasks={tasks}>
        <TaskInput onAdd={handleAdd} />
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        <TaskStats />
        <Timer />
      </TaskStatsProvider>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </ThemeProvider>
  );
}