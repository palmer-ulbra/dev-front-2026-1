function TaskList({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return <p>Nenhuma tarefa adicionada ainda.</p>;
  }

  return (
    <ul>
      {tasks.map((task, index) => (
        <li
          key={index}
          className={task.done ? "done" : ""}
          onClick={() => onToggle(index)}
        >
          {task.text}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
