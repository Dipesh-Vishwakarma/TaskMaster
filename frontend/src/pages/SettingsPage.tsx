import ThemeSwitcher from '../components/ThemeSwitcher';
import { useThemeStore, themes } from '../stores/themeStore';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';

const SettingsPage = () => {
  const { theme, mode, setTheme, setMode } = useThemeStore();

  const themeNames: Record<string, string> = {
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
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
          <p className="text-text-secondary">Customize your TaskMaster experience</p>
        </div>
        <ThemeSwitcher />
      </div>

      <div className="space-y-6">
        {/* Appearance Mode */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sun size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Appearance Mode</h2>
              <p className="text-sm text-text-secondary">Choose your preferred display mode</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setMode('light')}
              className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                mode === 'light'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Sun size={32} className={mode === 'light' ? 'text-primary' : 'text-text-secondary'} />
              <span className="font-semibold text-text">Light</span>
            </button>

            <button
              onClick={() => setMode('dark')}
              className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                mode === 'dark'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Moon size={32} className={mode === 'dark' ? 'text-primary' : 'text-text-secondary'} />
              <span className="font-semibold text-text">Dark</span>
            </button>

            <button
              onClick={() => setMode('system')}
              className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                mode === 'system'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Monitor size={32} className={mode === 'system' ? 'text-primary' : 'text-text-secondary'} />
              <span className="font-semibold text-text">System</span>
            </button>
          </div>
        </div>

        {/* Color Theme */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Palette size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Color Theme</h2>
              <p className="text-sm text-text-secondary">Select your favorite color scheme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-4 rounded-xl border-2 transition text-center font-semibold ${
                  theme === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-text hover:border-primary/50'
                }`}
              >
                {themeNames[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;