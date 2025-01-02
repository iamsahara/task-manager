import { Box, TextField} from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";

function AddTask() {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleAddTask = () => {
    if (!title.trim() || !description.trim()) {
      alert(" Please fill out all fields. ");
    }
  };
  return (
    <Box >
    <form onSubmit={handleAddTask}>
      <title></title>
      <TextField></TextField>
    </form>
    </Box>
  );
}

export default AddTask;
