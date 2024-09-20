let taskIdCounter = 1;

export const addTask = (dueDate, description) => {
  const newTask = {
    id: taskIdCounter++,
    description,
    dueDate: dueDate.toISOString(),
  };
  return newTask;
};
