import axios from "axios";
import { Box, Button } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";


const handleDeleteTask = async ( taskId: string) => {
  const { dispatch } = useTaskContext();

  try {
    await axios.delete(`http://localhost:5001/tasks/${taskId}`);
    dispatch({ type: "DELETE-TASK", payload: taskId });
    console.log(`Task with ID ${taskId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
  }
};

type DeleteTaskProps = {
    taskId: string
}

function DeleteTask({taskId} : DeleteTaskProps ) {
  return (
    <Box>
      <Button onClick={()=>handleDeleteTask(taskId)}>Delete</Button>
    </Box>
  );
}

export default DeleteTask;
