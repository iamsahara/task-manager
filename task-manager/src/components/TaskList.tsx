import { useTaskContext } from "../context/TaskContext";
import { Box, Paper, Typography } from "@mui/material";
import Draggable from "react-draggable";

function TaskList() {
  const { state } = useTaskContext();
  if (!state.tasks || state.tasks.length === 0) {
    return <p>No tasks available</p>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        backgroundColor: "lightgreen",
        width: "20%",
        height: "100%",
        padding: 2,
        borderRadius: 2,
        color: "white",
      }}
    >
      {state.tasks.map((task) => (
        <Draggable key={task.id}>
          <Paper
            sx={{
              padding: 2,
              marginBottom: 2,
              backgroundColor: "#f5f5f5",
              minWidth: "200px",
              cursor: "move",
              boxShadow: 3,
            }}
            elevation={3}
          >
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {task.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {task.status}
            </Typography>
          </Paper>
        </Draggable>
      ))}
    </Box>
  );
}
export default TaskList;
