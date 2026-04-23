'use client';

import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, isLoading }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
        <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
