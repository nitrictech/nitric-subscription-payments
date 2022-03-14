export interface Task {
  id: string;
  createdAt: number;
  name: string;
  complete: boolean;
  description?: string;
  dueDate?: number;
}

export interface TaskList {
  id: string;
  createdAt: number;
  name: string;
  tasks: Task[];
}

export type TaskListResponse = TaskList;

export type Filters = Partial<Task>;

export type TaskListRequest = Omit<TaskList, "id" | "tasks">;

export type TaskPostRequest = Omit<Task, "id">;

export type TaskListPostRequest = Omit<TaskList, "id" | "complete">;

export type ToggleRequest = { completed: boolean };
