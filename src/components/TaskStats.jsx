import React from "react";
import { useTaskStats } from "../context/TaskStatsContext";

export default function TaskStats() {
  const stats = useTaskStats();

  if (!stats) return null; // Prevents error if context is missing

  return (
    <div>
      <h3>Task Stats</h3>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Pending: {stats.pending}</p>
    </div>
  );
}