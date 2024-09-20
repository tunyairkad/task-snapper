import React from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add a task to get started!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">{task.description}</p>
              <p className="text-sm text-gray-600">
                Due: {format(new Date(task.dueDate), 'PPP')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
