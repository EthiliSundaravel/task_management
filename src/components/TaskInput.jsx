import React, { useRef } from "react";

export default function TaskInput({ onAdd }) {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (value) {
      onAdd(value);
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" placeholder="Add a new task..." />
      <button type="submit">Add</button>
    </form>
  );
}