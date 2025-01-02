import { useTaskContext } from "../context/TaskContext";


function TaskList(){
  const { state } = useTaskContext();
  if (!state.tasks || state.tasks.length === 0) {
    return <p>No tasks available</p>;
  }
  return (
    <div color="red">
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
