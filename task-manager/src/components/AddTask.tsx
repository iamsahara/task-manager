import { Box, TextField, Button } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";
import axios from "axios";

function AddTask() {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert(" Please fill out all fields. ");
      return;
    }

    const newTask = {
      id: Math.random(),
      title,
      description,
      completed: false,
      status: "To Do" as const,
    };

    const response = await axios.post("http://localhost:5001/tasks", newTask);
    dispatch({ type: "ADD-TASK", payload: response.data });
    setTitle("");
    setDescription("");
  };

  return (
    <Box>
      <form onSubmit={handleAddTask}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={1}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary">
          {" "}
          Add Task{" "}
        </Button>
        {/* <Button onClick={() => dispatch({ type: "DELETE-TASK", payload: "Task.id" })}>
  Delete
</Button> */}
      </form>
    </Box>
  );
}

export default AddTask;
