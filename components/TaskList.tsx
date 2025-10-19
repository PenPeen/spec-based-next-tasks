'use client';

import { Task } from '@/lib/types';
import { sortTasksByCreatedAt } from '@/lib/utils';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">タスクがありません</p>
        <p className="text-gray-400 text-sm mt-2">新しいタスクを作成してください</p>
      </div>
    );
  }

  const sortedTasks = sortTasksByCreatedAt(tasks);

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskItem
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
