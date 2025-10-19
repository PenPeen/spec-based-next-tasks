'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { loadTasks, saveTasks } from '@/lib/storage';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

export default function Home() {
  // 7.1: 状態管理の実装
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // 7.1: 初回レンダリング時にローカルストレージからタスクを読み込む
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // 7.2: タスク作成機能
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // 7.3: タスク編集機能
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // 7.2 & 7.3: タスク保存機能（作成と編集の両方）
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      // 編集の場合
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
            ...task,
            ...taskData,
            updatedAt: Date.now(),
          }
          : task
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } else {
      // 新規作成の場合
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...taskData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // 7.4: タスク削除機能
  const handleDeleteTask = (id: string) => {
    setDeletingTaskId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingTaskId) {
      const updatedTasks = tasks.filter((task) => task.id !== deletingTaskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setDeletingTaskId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingTaskId(null);
  };

  // 7.5: タスク完了状態切り替え機能
  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
          ...task,
          completed: !task.completed,
          updatedAt: Date.now(),
        }
        : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-[800px] mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">タスク管理アプリ</h1>
          <button
            onClick={handleCreateTask}
            className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + 新しいタスク
          </button>
        </div>

        {/* 7.6: すべてのコンポーネントを統合 */}
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* タスクフォーム */}
        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={handleCancelForm}
          />
        )}

        {/* 削除確認ダイアログ */}
        <DeleteConfirmDialog
          isOpen={deletingTaskId !== null}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </main>
  );
}
