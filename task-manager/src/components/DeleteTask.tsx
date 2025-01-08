import axios from "axios";
import { IconButton } from "@mui/material";
import { useTaskContext } from "../context/TaskContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


type DeleteTaskProps = {
  taskId: string
}

function DeleteTask({taskId} : DeleteTaskProps ) {
  const { dispatch } = useTaskContext();

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:5001/tasks/${taskId}`);
      dispatch({ type: "DELETE-TASK", payload: taskId });
      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
    }
  };
  
  return (
<IconButton
  onClick={handleDeleteTask}
  sx={{
    "&:hover": { backgroundColor: "#ffebee" }, // Light red background on hover
  }}
>
  <DeleteOutlineIcon sx={{ fontSize: 24 }} />
</IconButton>
  );
}
export default DeleteTask;
