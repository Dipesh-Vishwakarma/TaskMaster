import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore, themes, type Theme } from '../stores/themeStore';

const ThemeSwitcher = () => {
  const { theme, mode, setTheme, setMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const themeNames: Record<Theme, string> = {
    ocean: 'Ocean',
    midnight: 'Midnight',
    purple: 'Purple',
    emerald: 'Emerald',
    cyber: 'Cyber',
    sunset: 'Sunset',
    rose: 'Rose',
    lavender: 'Lavender',
    arctic: 'Arctic',
    forest: 'Forest',
    neon: 'Neon',
    crimson: 'Crimson',
    amber: 'Amber',
    aqua: 'Aqua',
    indigo: 'Indigo',
    mint: 'Mint',
    coral: 'Coral',
    violet: 'Violet',
    sky: 'Sky',
    cosmic: 'Cosmic',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-surface border border-border rounded-xl hover:shadow-lg transition-all text-text"
      >
        <Palette size={24} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl z-50 p-4">
            <h3 className="text-lg font-bold text-text mb-4">Theme Settings</h3>

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text mb-2">Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode('light')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    mode === 'light' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <Sun size={20} />
                  <span className="text-xs">Light</span>
                </button>
                <button
                  onClick={() => setMode('dark')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    mode === 'dark' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <Moon size={20} />
                  <span className="text-xs">Dark</span>
                </button>
                <button
                  onClick={() => setMode('system')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    mode === 'system' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <Monitor size={20} />
                  <span className="text-xs">System</span>
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Color Theme</label>
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-2 rounded-lg border transition text-xs ${
                      theme === t ? 'border-primary bg-primary/10 font-bold' : 'border-border'
                    }`}
                  >
                    {themeNames[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;