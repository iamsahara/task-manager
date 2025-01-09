import { useTaskContext } from "../context/TaskContext";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import "react-toastify/dist/ReactToastify.css";
import { Box, Typography } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";
import axios from "axios";
import { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList() {
  const { state, dispatch } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const tasksByStatus = (status: string) =>
    state.tasks.filter((task) => task.status === status);
  const handleDragStart = (start: DragStart) => {
    const { draggableId } = start;
    setDraggedTaskId(draggableId); // Store the ID of the dragged task
  };
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      setDraggedTaskId(null); 
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
      if (destination.droppableId === "Done") {
        setShowConfetti(true);
        toast.success("🎉 Congrats on completing a task!");
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }

    // Clear the dragged task ID
    setDraggedTaskId(null);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {showConfetti && <Confetti width={width} height={height} />}
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <AddTask />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            width: "90%",
            height: "85vh",
            padding: 3,
            borderRadius: 4,
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
                    overflowY: "auto",
                    position: "relative",
                    backgroundColor:
                      status === "To Do"
                        ? "#faf9f9"
                        : status === "In Progress"
                        ? "#d5b9b2"
                        : "#bfb5af",
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: "inset 0px 2px 6px rgba(0, 0, 0, 0.1)",
                    width: "30%",
                    height: "70%",
                    textAlign: "center",
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
                          ? "#38352e"
                          : status === "In Progress"
                          ? "#38352e"
                          : "#38352e",
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
                        <TaskCard
                          task={task}
                          draggedTaskId={draggedTaskId} // string | null
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </Box>
    </DragDropContext>
  );
}

export default TaskList;
