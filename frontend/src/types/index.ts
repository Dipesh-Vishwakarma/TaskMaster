export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface ChecklistItem {
  id: number;
  task_id: number;
  text: string;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface Attachment {
  id: number;
  task_id: number;
  filename: string;
  original_filename: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  points: number;
  due_date?: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  checklists: ChecklistItem[];
  attachments: Attachment[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  status: string;
  priority: string;
  points: number;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  points?: number;
  due_date?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export const TaskStatuses = [
  'Active',
  'To Do',
  'In Progress',
  'Hold',
  'Backlog',
  'Closed'
] as const;

export const TaskPriorities = [
  'Low',
  'Medium',
  'High',
  'Critical'
] as const;

export type TaskStatus = typeof TaskStatuses[number];
export type TaskPriority = typeof TaskPriorities[number];