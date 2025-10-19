'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';

interface TaskFormProps {
  task: Task | null;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setError(null);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション: タイトル必須
    if (!title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    setError(null);
    onSave({
      title: title.trim(),
      description: description.trim(),
      completed: task?.completed || false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 animate-slideUp">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {task ? 'タスクを編集' : '新しいタスクを作成'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="タスクのタイトルを入力"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="タスクの説明を入力（任意）"
              rows={4}
              maxLength={500}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md animate-shake">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
