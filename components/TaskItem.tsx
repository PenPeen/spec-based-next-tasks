'use client';

import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer transition-all"
        />

        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-semibold break-words ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm break-words ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 active:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
