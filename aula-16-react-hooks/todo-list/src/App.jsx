import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (task.trim() === "") {
      return;
    }

    setTasks([...tasks, { text: task, done: false }]);

    setTask("");
  }

  function toggleTask(index) {
    const newTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, done: !item.done };
      }
      return item;
    });

    setTasks(newTasks);
  }

  function clearTasks() {
    setTasks([]);
  }

  return (
    <main>
      <h1>Minhas tarefas de hoje</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Digite uma tarefa"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        <div className="actions">
          <button onClick={addTask}>Adicionar</button>
          <button onClick={clearTasks}>Limpar tudo</button>
        </div>
      </div>

      <TaskList tasks={tasks} onToggle={toggleTask} />
    </main>
  );
}

export default App;
