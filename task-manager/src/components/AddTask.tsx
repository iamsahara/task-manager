import { Box, TextField, Button, Typography } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function AddTask() {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert(" Please fill out all fields. ");
      return;
    }

    const newTask = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      status: "To Do" as const,
      position: { x: 0, y: 0 },
    };

    const response = await axios.post("http://localhost:5001/tasks", newTask);
    dispatch({ type: "ADD-TASK", payload: response.data });
    setTitle("");
    setDescription("");
  };
  // const handleDeleteTask = async (taskId) => {
  //   await axios.delete(`http://localhost:5001/tasks/${taskId}`);
  // dispatch({ type: "DELETE-TASK", payload: taskId });
  // };
  return (
    <Box>
    <Box
  sx={{
    padding: 3,
    maxWidth: 400,
    margin: "0 auto",
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  }}
>
  <Typography variant="h5" sx={{ textAlign: "center", mb: 3, color: "#333" }}>
    Add a New Task
  </Typography>
  <form onSubmit={handleAddTask}>
    <TextField
      label="Task Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      fullWidth
      margin="normal"
      variant="outlined"
      sx={{
        marginBottom: 2,
        ".MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
    <TextField
      label="Task Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      fullWidth
      margin="normal"
      variant="outlined"
      multiline
      rows={4}
      sx={{
        marginBottom: 2,
        ".MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      sx={{
        padding: 1.5,
        borderRadius: 2,
        fontWeight: "bold",
        textTransform: "none",
      }}
    >
      Add Task
    </Button>
  </form>
</Box>
      <Button>Delete</Button>
    </Box>
  );
}

export default AddTask;
