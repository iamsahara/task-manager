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
  sx={{ position: "absolute",
    top: "70%", 
    right: 0, 
     transition: "transform 0.2s ease, color 0.2s ease",
    "&:hover": { backgroundColor: "#f7d6e0",transform: "scale(1.1)"}, 
    "&:active": {
      transform: "scale(1.1)", 
    },
  }}
>
  <DeleteOutlineIcon sx={{ fontSize: 24 }} />
</IconButton>
  );
}
export default DeleteTask;
