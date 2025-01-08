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
import DeleteTask from "./DeleteTask";

function TaskList() {
  const { state, dispatch } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  if (!state.tasks || state.tasks.length === 0) {
    return <p>No tasks available</p>;
  }
  const tasksByStatus = (status: string) =>
    state.tasks.filter((task) => task.status === status);
  const handleDragStart = (start: DragStart) => {
    const { draggableId } = start;
    setDraggedTaskId(draggableId); // Store the ID of the dragged task
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Task dropped outside the list
    if (!destination) {
      setDraggedTaskId(null); // Clear the dragged task ID
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      setDraggedTaskId(null);
      return;
    }
    // Find the dragged task

    const draggedTask = state.tasks.find(
      (task) => String(task.id) === draggableId
    );
    if (!draggedTask) {
      console.error("Dragged task not found");
      setDraggedTaskId(null);
      return;
    }
    // Update the task's status and reorder tasks
    const updatedTask = { ...draggedTask, status: destination.droppableId };
    const updatedTasks = Array.from(
      state.tasks.filter((task) => task.id !== draggedTask.id)
    );

    // Insert the updated task in the correct position
    updatedTasks.splice(destination.index, 0, updatedTask);

    // Update state
    dispatch({ type: "SET-TASKS", payload: updatedTasks });

    try {
      // Update backend
      await axios.put(
        `http://localhost:5001/tasks/${draggedTask.id}`,
        updatedTask
      );
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }

    // Clear the dragged task ID
    setDraggedTaskId(null);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
          padding: 2,
        }}
      >
        {["To Do", "In Progress", "Done"].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor:
                    status === "To Do"
                      ? "lightblue"
                      : status === "In Progress"
                      ? "lightgreen"
                      : "lightgray",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  minWidth: 200,
                  maxHeight: "80vh", // Limit column height
                  overflow: "auto",
                }}
              >
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  {status}
                </Typography>
                {tasksByStatus(status).map((task, index) => (
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
                          backgroundColor:
                            draggedTaskId === task.id ? "lightblue" : "#f5f5f5",
                          boxShadow: 3,
                          cursor: "move",
                          marginBottom: 2,
                        }}
                        elevation={3}
                      >
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {task.description}
                        </Typography>
                        <DeleteTask taskId={task.id} />
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
}

export default TaskList;
