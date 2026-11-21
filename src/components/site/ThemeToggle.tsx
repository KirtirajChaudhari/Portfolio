import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const pinnedTheme = () => document.documentElement.dataset.theme as Theme | undefined;

/** Flips between crimson (dark, the default) and the blush light variant. The
 *  choice is saved and pinned before first paint by index.html. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const sync = () => setTheme(pinnedTheme() ?? 'dark');
    sync();
    window.addEventListener('themechange', sync);
    return () => window.removeEventListener('themechange', sync);
  }, []);

  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode: the choice lasts for this visit */ }
    window.dispatchEvent(new Event('themechange'));
  };

  const Icon = theme === 'dark' ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`nav-icon shrink-0 active:scale-[0.94] ${className}`}
    >
      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
