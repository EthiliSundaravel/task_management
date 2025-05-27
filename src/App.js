import React, { useCallback, useReducer, useEffect, useState, useMemo } from "react";
import './App.css';
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
    case "EDIT":
      return state.map((task) =>
        task.id === action.id
          ? { ...task, text: action.text }
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
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");

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
  const handleEdit = useCallback(
    (id, text) => dispatch({ type: "EDIT", id, text }),
    []
  );
  const handleReorder = useCallback(
    (newTasks) => dispatch({ type: "SET", tasks: newTasks }),
    []
  );

  const { theme, toggleTheme } = useTheme();

  // Filtering and sorting logic
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    if (filter === "completed") filtered = filtered.filter(t => t.completed);
    if (filter === "pending") filtered = filtered.filter(t => !t.completed);
    // Add more filters as needed
    if (sort === "date") filtered.sort((a, b) => a.id - b.id);
    if (sort === "az") filtered.sort((a, b) => a.text.localeCompare(b.text));
    if (sort === "za") filtered.sort((a, b) => b.text.localeCompare(a.text));
    return filtered;
  }, [tasks, filter, sort]);

  // Add this mapping for titles
  const filterTitles = {
    all: "All Tasks",
    completed: "Completed Tasks",
    pending: "Do It Now Tasks"
  };

  return (
    <div className={`dashboard ${theme}`}>
      <aside className="sidebar">
        <div className="app-title">
          <h2>Smart Task Management</h2>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>{filterTitles[filter] || "All Tasks"}</h1>
          <div className="header-controls">
            <button className={filter==="all" ? "active" : ""} onClick={()=>setFilter("all")}>All</button>
            <button className={filter==="completed" ? "active" : ""} onClick={()=>setFilter("completed")}>Completed</button>
            <button className={filter==="pending" ? "active" : ""} onClick={()=>setFilter("pending")}>Do It Now</button>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        </header>
        <div className="partitions">
          <section className="partition tasks-partition">
            <TaskInput onAdd={handleAdd} />
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReorder={handleReorder}
            />
          </section>
          <section className="partition stats-partition">
            <TaskStats />
            <Timer />
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
