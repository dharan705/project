import { useState } from "react";
import "./Todo.css"
export default function TaskList() {
  const [value, setValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const handle = (event) => {
    event.preventDefault();

    if (value.trim() === "") return;

    // EDIT MODE
    if (editId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editId ? { ...task, text: value } : task
      );
      setTasks(updatedTasks);
      setEditId(null);
    } else {
      // ADD MODE
      const newTask = {
        id: Date.now(),
        text: value,
      };
      setTasks([...tasks, newTask]);
    }

    setValue("");
  };

  // DELETE
  const handleDelete = (id) => {
    const filtered = tasks.filter((task) => task.id !== id);
    setTasks(filtered);
  };

  // EDIT
  const handleEdit = (task) => {
    setValue(task.text);
    setEditId(task.id);
  };

  return (
    <>
      <form onSubmit={handle}>
        <label>Tasks </label>
        <input
          type="text"
          placeholder="tasks..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">
          {editId !== null ? "Update" : "Submit"}
        </button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>tasks count: {tasks.length}</p>
    </>
  );
}