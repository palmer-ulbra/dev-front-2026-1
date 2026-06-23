import { useState } from "react";
import { playEdit } from "./sounds";

function TaskList({ tasks, onToggle, onEdit }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  if (tasks.length === 0) {
    return <p>Nenhuma tarefa adicionada ainda.</p>;
  }

  function startEditing(index, text) {
    setEditingIndex(index);
    setEditingText(text);
    playEdit();
  }

  function finishEditing() {
    if (editingText.trim() !== "") {
      onEdit(editingIndex, editingText);
    }
    setEditingIndex(null);
    setEditingText("");
  }

  return (
    <ul>
      {tasks.map((task, index) => (
        <li
          key={index}
          className={task.done ? "done" : ""}
          onClick={() => editingIndex !== index && onToggle(index)}
          onDoubleClick={() => startEditing(index, task.text)}
        >
          {editingIndex === index ? (
            <input
              type="text"
              value={editingText}
              autoFocus
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setEditingText(event.target.value)}
              onBlur={finishEditing}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  finishEditing();
                }
                if (event.key === "Escape") {
                  setEditingIndex(null);
                  setEditingText("");
                }
              }}
            />
          ) : (
            task.text
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
