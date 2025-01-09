import React from "react";
import { Paper, Typography, Modal, Box, Button } from "@mui/material";
import DeleteTask from "./DeleteTask";
import { useState } from "react";

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string;
  };
  draggedTaskId: string | null;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: any;
  dragHandleProps: any;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  draggedTaskId,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Paper
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        sx={{
          position:"relative",
          padding: 1,
          backgroundColor:
            draggedTaskId === task.id
              ? "linear-gradient(135deg, #54494b 0%, #54494b 100%)"
              : "#f1dede",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), inset 0px -1px 3px rgba(0, 0, 0, 0.05)",
          cursor: "move",
          borderRadius: 3,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0px 6px 15px rgba(0, 0, 0, 0.2), inset 0px -1px 5px rgba(0, 0, 0, 0.1)",
          },
        }}
        onClick={handleOpen}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            color: "#333",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
             backgroundColor: "#f7d6e0"
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
           
          
          }}
        >
          {task.description}
        </Typography>
        <DeleteTask taskId={task.id}/>
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxWidth: "90%",
            background: "linear-gradient(135deg, #f7d6e0 0%, #f7d6e0 100%)", 
            color: "#333", 
            border: "1px solid #ffa07a", 
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            p: 4,
            borderRadius: 3,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
            <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          ></Box>
          <Typography id="task-title" variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            {task.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#333", mb: 3, textAlign: "center" }}>
            {task.description}
          </Typography>
          <Button variant="contained"  sx={{ backgroundColor: "#f7d6e0",  color: "#333" }} onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TaskCard;
