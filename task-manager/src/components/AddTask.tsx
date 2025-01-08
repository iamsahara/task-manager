import { Box, TextField, Button, Typography } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";
import axios from "axios";

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
      title,
      description,
      status: "To Do",
      position: { x: 0, y: 0 },
    };

  console.log("Sending task to backend:", newTask);
    try {
      const response = await axios.post("http://localhost:5001/tasks", newTask);
      dispatch({ type: "ADD-TASK", payload: response.data });
      console.log("Task added successfully:", response.data);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };
  return (
 
    <Box
    sx={{
      padding: 3,
      maxWidth: 450,
      margin: "0 auto",
      borderRadius: 3,
      background: "linear-gradient(135deg, #6a11cb, #2576fc)",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
      color: "#fff",
      animation: "float 3s ease-in-out infinite",
    }}
  >
    <Typography
      variant="h4"
      sx={{
        textAlign: "center",
        mb: 3,
        fontWeight: "bold",
        letterSpacing: 1,
        textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
        fontSize: "1.2rem"
      }}
    >
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
          backgroundColor: "#ffffff",
          borderRadius: 2,
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
          backgroundColor: "#ffffff",
          borderRadius: 2,
          ".MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          padding: 1.5,
          borderRadius: 3,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1,
          backgroundColor: "#ff7eb3",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#ff4e8a",
          },
        }}
      >
        Add Task
      </Button>
    </form>
  </Box>
  );
}

export default AddTask;
