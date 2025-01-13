import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import { useTaskContext } from "../context/TaskContext";

type EditTaskProps = {
  taskId: string;
  initialTitle: string;
  initialDescription: string;
};

function EditTask({ taskId, initialTitle, initialDescription }: EditTaskProps) {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setTitle(initialTitle), setDescription(initialDescription), setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleEditTask = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const updatedTask = { title, description };
      const response = await axios.patch(
        `http://localhost:5001/tasks/${taskId}`,
        updatedTask
      );

      dispatch({
        type: "EDIT-TASK",
        payload: { id: taskId, updatedFields: updatedTask },
      });
      console.log("Task edited successfully:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error editing task", error);
      alert("Failed to edit task. Please try again.");
    }
  };

  return (
    <Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          "&:hover": { backgroundColor: "#db2955" },
        }}
      >
        <EditOutlinedIcon sx={{ fontSize: 24 }} />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "#2c2f33",
            color: "#fff",
            padding: 4,
            borderRadius: 3,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 3,
              textTransform: "uppercase",
              color: "#b0a084",
            }}
          >
            Edit Task
          </Typography>
          <form onSubmit={handleEditTask}>
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
              variant="filled"
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
              onClick={(e) => e.stopPropagation()}
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
                backgroundColor: "#73683b",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#73683b",
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default EditTask;
