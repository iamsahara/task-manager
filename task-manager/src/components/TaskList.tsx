import { useTaskContext } from "../context/TaskContext";

const TaskList = () => {
  const { state } = useTaskContext();
  return (
    <div>
      <h1>Tasks</h1>
      {state.tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
};
export default TaskList;
