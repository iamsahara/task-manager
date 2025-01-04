import { createContext, useReducer, ReactNode, useContext, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
}

interface TaskWithPriority extends Task {
  priority: "Low" | "Medium" | "High";
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
  | { type: "DELETE-TASK"; payload: number }
  | { type: "UPDATE-STATUS"; payload: { id: number; status: TaskStatus } };

const TaskReducer = (state: TaskState, action: TaskActions): TaskState => {
  switch (action.type) {
    case "SET-TASKS":
      return { tasks:action.payload};
    case "ADD-TASK":
      return { tasks: [...state.tasks, action.payload] };
    case "DELETE-TASK":
      return {
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "UPDATE-STATUS":
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    default:
      return state;
  }
};

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskActions>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(TaskReducer, initialState);
  
  useEffect(() => {
    axios.get('http://localhost:5001/tasks')
    .then((response)=>{ dispatch({ type: "SET-TASKS", payload: response.data });
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
