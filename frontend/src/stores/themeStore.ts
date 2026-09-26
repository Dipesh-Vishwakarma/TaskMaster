import { create } from 'zustand';

export const themes = [
  'ocean', 'midnight', 'purple', 'emerald', 'cyber', 
  'sunset', 'rose', 'lavender', 'arctic', 'forest',
  'neon', 'crimson', 'amber', 'aqua', 'indigo',
  'mint', 'coral', 'violet', 'sky', 'cosmic'
] as const;

export type Theme = typeof themes[number];
export type Mode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme, mode: Mode) => {
  const root = document.documentElement;
  
  // Remove all theme classes
  themes.forEach(t => root.classList.remove(t));
  root.classList.remove('dark');
  
  // Apply theme
  root.classList.add(theme);
  
  // Apply mode
  if (mode === 'dark' || (mode === 'system' && getSystemTheme() === 'dark')) {
    root.classList.add('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'ocean',
  mode: (localStorage.getItem('mode') as Mode) || 'light',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    applyTheme(theme, get().mode);
  },

  setMode: (mode) => {
    localStorage.setItem('mode', mode);
    set({ mode });
    applyTheme(get().theme, mode);
  }
}));

// Initialize theme on load
const stored = useThemeStore.getState();
applyTheme(stored.theme, stored.mode);

// Listen to system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const state = useThemeStore.getState();
  if (state.mode === 'system') {
    applyTheme(state.theme, state.mode);
  }
});