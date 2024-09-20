let taskIdCounter = 1;

export const addTask = (dueDate) => {
  const newTask = {
    id: taskIdCounter++,
    dueDate: dueDate.toISOString(),
  };
  return newTask;
};