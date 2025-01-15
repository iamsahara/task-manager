import { Box, TextField, Button, Modal, Typography } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import { useState } from "react";
import axios from "axios";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";

function AddTask() {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    const newTask = {
      title,
      description,
      status: "To Do",
      position: { x: 0, y: 0 },
    };

    try {
      const response = await axios.post("http://localhost:5001/tasks", newTask);
      dispatch({ type: "ADD-TASK", payload: response.data });
      console.log("Task added successfully:", response.data);
      setTitle("");
      setDescription("");
      handleClose();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  return (
    <Box>
      <Button
        sx={{
          position: "fixed",
          top: 30,
          left: 30,
          zIndex: 1000,
          fontWeight: "bold",
          fontSize: "1rem",
          color: "#fff",
          borderRadius: "50%",
          padding: "15px",
          width: "60px",
          height: "60px",
          background:
            "radial-gradient(circle, #f7d6e0 0%, #e1a4c7 50%, #b184a9 100%)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
      >
        +
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            background: "linear-gradient(135deg, #2c5364, #0f2027)",
            color: "#fff",
            padding: 4,
            borderRadius: 3,
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.6)",
            animation: "fadeIn 0.3s ease-in-out",
          }}
          
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 3,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <RocketLaunchOutlinedIcon fontSize="large" />
            Add Task
          </Typography>
          <form onSubmit={handleAddTask}>
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              variant="filled"
              sx={{
                marginBottom: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                ".MuiFilledInput-root": {
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
              variant="filled"
              multiline
              rows={4}
              sx={{
                marginBottom: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                ".MuiFilledInput-root": {
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
                background: "linear-gradient(90deg, #f7d6e0, #e2dee5)",
                color: "#333",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  background: "linear-gradient(90deg, #e2dee5, #f7d6e0)",
                },
              }}
            >
              Add Task
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default AddTask;