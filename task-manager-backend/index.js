import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());
let tasks = [];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  console.log("Received request body:", req.body);
  const { title, description, status } = req.body;
  const task = {
    id: uuidv4(), 
    title,
    description,
    status: status || "To Do",
    // position: position || { x: 0, y: 0 },
  };

  tasks.push(task);
  console.log("Task added:", task);
  res.status(201).json(task);
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

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  console.log(id)
  const updatedFields = req.body;
  console.log(updatedFields)
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" }); 
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedFields };

  res.status(200).json(tasks[taskIndex]);
});


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
