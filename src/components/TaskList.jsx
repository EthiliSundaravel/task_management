import React, { useState, useRef, useLayoutEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const listEndRef = useRef();

  useLayoutEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks.length]);

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) onEdit(id, editText.trim());
    setEditingId(null);
    setEditText("");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, idx) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                      />
                      {editingId === task.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onBlur={() => saveEdit(task.id)}
                          onKeyDown={e => {
                            if (e.key === "Enter") saveEdit(task.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          style={{ fontSize: "1.1rem", marginLeft: 8 }}
                        />
                      ) : (
                        <span
                          style={{
                            textDecoration: task.completed ? "line-through" : "none",
                            marginLeft: 8,
                            cursor: "pointer"
                          }}
                          onDoubleClick={() => startEdit(task)}
                          title="Double-click to edit"
                        >
                          {task.text}
                        </span>
                      )}
                    </label>
                    <div>
                      <button onClick={() => startEdit(task)} disabled={editingId === task.id}>
                        Edit
                      </button>
                      <button onClick={() => onDelete(task.id)}>Delete</button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div ref={listEndRef} />
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}