import {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
  position: { x: 0; y: 0 };
}

type TaskStatus = "To Do" | "In Progress" | "Completed";
interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

type TaskActions =
  | { type: "SET-TASKS"; payload: Task[] }
  | { type: "ADD-TASK"; payload: Task }
  | { type: "DELETE-TASK"; payload: string }
  | { type: "UPDATE-STATUS"; payload: { id: string; status: TaskStatus } }
  | { type: "EDIT-TASK"; payload: { id: string; updatedFields: { title?: string; description?: string } } }

const TaskReducer = (state: TaskState, action: TaskActions): TaskState => {
  switch (action.type) {
    case "SET-TASKS":
      return { tasks: action.payload };
    case "ADD-TASK":
      return { tasks: [...state.tasks, action.payload] };
    case "DELETE-TASK":
      return {
        tasks: state.tasks.filter((task) => task.id !== String(action.payload)),
      };
    case "UPDATE-STATUS":
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };

     case "EDIT-TASK":
        return {
          tasks: state.tasks.map((task) =>
            task.id === action.payload.id
              ? { ...task, ...action.payload.updatedFields }
              : task
          ),
        };
    default:
      // console.warn("Unhandled action type:", action.type);
      return state;
  }
};

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(TaskReducer, initialState);

  useEffect(() => {
    axios
      .get("http://localhost:5001/tasks")
      .then((response) => {
        dispatch({ type: "SET-TASKS", payload: response.data });
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export default TaskContext;
