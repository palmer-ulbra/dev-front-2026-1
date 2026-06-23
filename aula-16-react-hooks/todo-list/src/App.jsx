import { useState } from "react";
import "./App.css";
import TaskList from "./TaskList";
import { playAdd, playToggle, playClear, playHover } from "./sounds";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => [
    {
      text: "jogar voley",
      done: false,
    },
  ]);

  function addTask() {
    if (task.trim() === "") {
      return;
    }

    setTasks([...tasks, { text: task, done: false }]);

    setTask("");
    playAdd();
  }

  function toggleTask(index) {
    const newTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, done: !item.done };
      }
      return item;
    });

    setTasks(newTasks);
    playToggle();
  }

  function editTask(index, newText) {
    const newTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, text: newText };
      }
      return item;
    });

    setTasks(newTasks);
  }

  function clearTasks() {
    setTasks([]);
    playClear();
  }

  return (
    <>
      <main>
        <h1>Minhas tarefas de hoje</h1>

        <div className="form">
          <input
            type="text"
            placeholder="Digite uma tarefa"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addTask();
              }
            }}
          />
          <div className="actions">
            <button onClick={addTask} onMouseEnter={playHover}>
              Adicionar
            </button>
            <button onClick={clearTasks} onMouseEnter={playHover}>
              Limpar tudo
            </button>
          </div>
        </div>
        <TaskList tasks={tasks} onToggle={toggleTask} onEdit={editTask} />
      </main>
    </>
  );
}

export default App;
