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
import { TaskStatus } from "../context/TaskContext";

function TaskList() {
  const { state, dispatch } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const tasksByStatus = (status: string) =>
    state.tasks.filter((task) => task.status === status);

  const handleDragStart = (start: DragStart) => {
    setDraggedTaskId(start.draggableId);
  };

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

    const draggedTask = state.tasks.find((task) => String(task.id) === draggableId);
    if (!draggedTask) {
      console.error("Dragged task not found");
      setDraggedTaskId(null);
      return;
    }

    const updatedTask = { ...draggedTask, status: destination.droppableId as TaskStatus };
    const updatedTasks = state.tasks.filter((task) => task.id !== draggedTask.id);
    updatedTasks.splice(destination.index, 0, updatedTask);

    dispatch({ type: "SET-TASKS", payload: updatedTasks });

    try {
      await axios.put(`http://localhost:5001/tasks/${draggedTask.id}`, updatedTask);
      if (destination.droppableId === "Done") {
        setShowConfetti(true);
        toast.success("🎉 Congrats on completing a task!");
        setTimeout(() => setShowConfetti(false), 7000);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setDraggedTaskId(null);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {showConfetti && <Confetti width={width} height={height} />}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>
        <AddTask />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            width: "95%",
            mt: 4,
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
                        ? "#e0e0e0"
                        : status === "In Progress"
                        ? "#e3dfe6"
                        : "#e5e5de",
                    padding: 3,
                    borderRadius: 3,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    height: "50vh",
                    overflowY: "auto", 
                    minWidth:"25%",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "#3c3442",
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
                          draggedTaskId={draggedTaskId}
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