import React from 'react';
import { Task } from '../services/api';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  isCompleting: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, isCompleting }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-slide-up">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(task.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        
        <button
          onClick={() => onComplete(task.id)}
          disabled={isCompleting}
          className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCompleting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          ) : (
            'Done'
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;