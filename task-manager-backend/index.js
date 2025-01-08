import express from "express";
import cors from "cors";
let tasks = [];

const app = express();
app.use(cors());
app.use(express.json());
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  if (!newTask.id || !newTask.title || !newTask.position) {
    console.error("Invalid task data:", newTask);
    return res.status(400).json({ error: "Invalid task data" });
  }
  tasks.push(newTask); // Add the new task to the global array
  console.log("Task added:", newTask);
  res.status(201).json(newTask); // Respond with the added task
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.filter((task) => task.id !== taskId);
  res.status(200).json({ message: "Task deleted" });
});

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, ...updatedTask } : task
  );
  console.log(updatedTask);
  res.status(200).json(updatedTask);
});

app.put("/tasks", (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, ...updatedTask } : task
  );
  res
    .status(200)
    .json({ message: "Task updated successfully", task: updatedTask });
});
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
