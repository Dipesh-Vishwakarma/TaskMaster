import axios from 'axios';
import type { User, Task, TaskCreate, TaskUpdate, ChecklistItem, Attachment } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: async (data: { username: string; email: string; full_name: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Tasks
export const tasksAPI = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    is_pinned?: boolean;
    is_archived?: boolean;
    search?: string;
  }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  
  getOne: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  create: async (data: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  
  update: async (id: number, data: TaskUpdate): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  
  updateStatus: async (id: number, status: string): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },
  
  togglePin: async (id: number, is_pinned: boolean): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/pin`, { is_pinned });
    return response.data;
  },
  
  toggleArchive: async (id: number, is_archived: boolean): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/archive`, { is_archived });
    return response.data;
  }
};

// Checklists
export const checklistAPI = {
  create: async (taskId: number, text: string, position: number = 0): Promise<ChecklistItem> => {
    const response = await api.post(`/checklist/tasks/${taskId}/checklist`, { text, position });
    return response.data;
  },
  
  update: async (id: number, data: { text?: string; is_completed?: boolean; position?: number }): Promise<ChecklistItem> => {
    const response = await api.put(`/checklist/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/checklist/${id}`);
  }
};

// Attachments
export const attachmentAPI = {
  upload: async (taskId: number, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/attachments/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/attachments/${id}`);
  }
};

export default api;