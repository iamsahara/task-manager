import { useTaskContext } from "../context/TaskContext";
import { Box, Paper, Typography } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";
import axios from "axios";
import { useState } from "react";

function TaskList() {
  const { state, dispatch } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  if (!state.tasks || state.tasks.length === 0) {
    return <p>No tasks available</p>;
  }

  const handleDragStart = (start: DragStart) => {
    const { draggableId } = start;
    console.log("Dragging task with ID:", draggableId);
    setDraggedTaskId(draggableId); // Store the ID of the dragged task
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // Task dropped outside the list
    if (!destination) {
      setDraggedTaskId(null); // Clear the dragged task ID
      return;
    }

    // Validate indices
    if (
      source.index < 0 ||
      destination.index < 0 ||
      source.index >= state.tasks.length ||
      destination.index >= state.tasks.length
    ) {
      console.error("Invalid drag indices:", { source, destination });
      setDraggedTaskId(null);
      return;
    }

    // Reorder tasks
    const reorderedTasks = Array.from(state.tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    // Update state
    dispatch({ type: "SET-TASKS", payload: reorderedTasks });

    try {
      // Update backend
      await axios.put("http://localhost:5001/tasks", reorderedTasks);
      console.log("Tasks reordered successfully");
    } catch (error) {
      console.error("Error saving reordered tasks:", error);
    }

    // Clear the dragged task ID
    setDraggedTaskId(null);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "lightgreen",
              width: "100%",
              height: "100%",
              padding: 2,
              borderRadius: 2,
              color: "white",
            }}
          >
            {state.tasks.map((task, index) => (
              <Draggable
                key={String(task.id)}
                draggableId={String(task.id)}
                index={index}
              >
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      padding: 2,
                      marginBottom: 2,
                      backgroundColor:
                        draggedTaskId === task.id
                          ? "lightblue" // Highlight the currently dragged task
                          : "#f5f5f5",
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      
    </DragDropContext>
  );
}

export default TaskList;