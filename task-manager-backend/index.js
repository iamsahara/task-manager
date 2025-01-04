import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});
app.post("/tasks", (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.status(200).json({ message: "Task deleted" });
});
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  tasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
  res.status(200).json(updatedTasks);
});
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
