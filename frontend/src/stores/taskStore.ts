import { create } from 'zustand';
import { tasksAPI, checklistAPI, attachmentAPI } from '../services/api';
import type { Task, TaskCreate, TaskUpdate } from '../types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  fetchTasks: (params?: any) => Promise<void>;
  fetchTask: (id: number) => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task>;
  updateTask: (id: number, data: TaskUpdate) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  togglePin: (id: number, is_pinned: boolean) => Promise<void>;
  toggleArchive: (id: number, is_archived: boolean) => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  addChecklistItem: (taskId: number, text: string) => Promise<void>;
  updateChecklistItem: (id: number, data: any) => Promise<void>;
  deleteChecklistItem: (id: number) => Promise<void>;
  uploadAttachment: (taskId: number, file: File) => Promise<void>;
  deleteAttachment: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,

  fetchTasks: async (params) => {
    set({ loading: true });
    try {
      const tasks = await tasksAPI.getAll(params);
      set({ tasks, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTask: async (id) => {
    set({ loading: true });
    try {
      const task = await tasksAPI.getOne(id);
      set({ currentTask: task, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    const task = await tasksAPI.create(data);
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  updateTask: async (id, data) => {
    const updatedTask = await tasksAPI.update(id, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask
    }));
  },

  deleteTask: async (id) => {
    await tasksAPI.delete(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      currentTask: state.currentTask?.id === id ? null : state.currentTask
    }));
  },

  togglePin: async (id, is_pinned) => {
    const updatedTask = await tasksAPI.togglePin(id, is_pinned);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t))
    }));
  },

  toggleArchive: async (id, is_archived) => {
    const updatedTask = await tasksAPI.toggleArchive(id, is_archived);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t))
    }));
  },

  updateStatus: async (id, status) => {
    const updatedTask = await tasksAPI.updateStatus(id, status);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask
    }));
  },

  addChecklistItem: async (taskId, text) => {
    await checklistAPI.create(taskId, text);
    await get().fetchTask(taskId);
  },

  updateChecklistItem: async (id, data) => {
    await checklistAPI.update(id, data);
    if (get().currentTask) {
      await get().fetchTask(get().currentTask!.id);
    }
  },

  deleteChecklistItem: async (id) => {
    await checklistAPI.delete(id);
    if (get().currentTask) {
      await get().fetchTask(get().currentTask!.id);
    }
  },

  uploadAttachment: async (taskId, file) => {
    await attachmentAPI.upload(taskId, file);
    await get().fetchTask(taskId);
  },

  deleteAttachment: async (id) => {
    await attachmentAPI.delete(id);
    if (get().currentTask) {
      await get().fetchTask(get().currentTask!.id);
    }
  }
}));