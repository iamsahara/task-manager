import { Paper, Typography, Modal, Box, Button } from "@mui/material";
import DeleteTask from "./DeleteTask";
import { useState } from "react";
import EditTask from "./EditTask";

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
          position: "relative",
          padding: 2,
          flexShrink: 0,
          backgroundColor:
            draggedTaskId === task.id
              ? "white"
              : "linear-gradient(-45deg, black, #2c5364, #0f2027, black)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), inset 0px -1px 3px rgba(0, 0, 0, 0.05)",
          cursor: "move",
          overflow: "hidden", 
          flexDirection: "column",
          display: "flex",
          borderRadius: 3,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0px 6px 15px rgba(0, 0, 0, 0.2), inset 0px -1px 5px rgba(0, 0, 0, 0.1)",
          },
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          handleOpen();
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            color: "#333",
            flexShrink: 0,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            margin: 2,
            mb: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexShrink: 0,
            whiteSpace: "nowrap",
            backgroundColor: "#e2dee5",
            borderRadius: 4,
            p: 2,
          }}
        >
          {task.description}
        </Typography>
        <DeleteTask taskId={task.id} />
        <EditTask
          taskId={task.id}
          initialDescription={task.description}
          initialTitle={task.title}
        />
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
            background: "linear-gradient(135deg, #fff 0%, #e2dee5 100%)",
            color: "#BLACK",
            border: "1px solid #e2dee5",
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
          <Typography
            id="task-title"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            {task.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#333", backgroundColor: "#e2dee5",
              borderRadius: 4,
              p: 2, padding: 3, textAlign: "center", mb:"2" }}
          >
            {task.description}
          </Typography>
          <Button
            variant="contained"
          
            sx={{ backgroundColor: "#f7d6e0", color: "#333", mt:2 }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TaskCard;
