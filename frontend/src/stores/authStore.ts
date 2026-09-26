import { create } from 'zustand';
import { authAPI } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; full_name: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,

  login: async (username: string, password: string) => {
    try {
      const data = await authAPI.login(username, password);
      console.log('Login response:', data); // Debug
      
      localStorage.setItem('token', data.access_token);
      
      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken); // Debug
      
      const user = await authAPI.me();
      console.log('User data:', user); // Debug
      
      set({ user, token: data.access_token, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data) => {
    await authAPI.register(data);
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    console.log('Check auth - token:', token); // Debug
    
    if (!token) {
      set({ loading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await authAPI.me();
      console.log('Check auth - user:', user); // Debug
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      console.error('Check auth error:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  }
}));