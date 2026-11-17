import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const pinnedTheme = () => document.documentElement.dataset.theme as Theme | undefined;

/** Flips between light and dark. With nothing saved the site follows the system;
 *  choosing here pins it (index.html reads the saved value before first paint). */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const sync = () => setTheme(pinnedTheme() ?? systemTheme());
    sync();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    window.addEventListener('themechange', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('themechange', sync);
    };
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
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[6px] text-fg-2 transition-[color,transform] duration-150 ease-out hover:text-fg active:scale-[0.94] ${className}`}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
