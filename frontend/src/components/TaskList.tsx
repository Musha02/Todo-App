import React from 'react';
import { Task } from '../services/api';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: number) => void;
  completingTaskId: number | null;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, completingTaskId, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-600 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full p-6 mb-6">
          <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet!</h3>
        <p className="text-gray-600 text-center max-w-md">
          Start by creating your first task above. Keep track of what needs to be done!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
          Your Tasks
          <span className="relative inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 rounded-full shadow-md animate-bounce">
             {tasks.length}
          </span>
        </h2>

      </div>
      
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            isCompleting={completingTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;