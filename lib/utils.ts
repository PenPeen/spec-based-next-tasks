import { Task } from './types';

export function sortTasksByCreatedAt(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => b.createdAt - a.createdAt);
}
