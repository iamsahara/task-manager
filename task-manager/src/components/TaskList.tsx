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
            alignItems: "center",
            gap: 2,
            margin:1,
            width: "100%",
            height: "100vh",
            padding: 3,
            // background: "white",
            borderRadius: 4,
            // boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
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
                    gap: 3,
                    backgroundColor:
                      status === "To Do"
                        ? "#ffebee"
                        : status === "In Progress"
                        ? "#e8f5e9"
                        : "#ede7f6",
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: "inset 0px 2px 6px rgba(0, 0, 0, 0.1)",
                    minWidth: 150,
                    height: "70vh",
                    textAlign: "center",
                    width:"100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                     letterSpacing: 1,
                   
                      color:
                        status === "To Do"
                          ? "#d32f2f"
                          : status === "In Progress"
                          ? "#388e3c"
                          : "#512da8",
                    }}
                  >
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
                            padding: 3,
                            backgroundColor:
                              draggedTaskId === task.id ? "#f3f4f6" : "white",
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
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              overflow: "hidden",
                              color: "#333",
                              marginBottom: 1,
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
                            }}
                          >
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
