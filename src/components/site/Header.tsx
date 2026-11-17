import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
  { to: '/creator', label: 'Artistic' },
];

export default function Header() {
  const menu = useRef<HTMLDetailsElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname, hash]);
  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.open) {
        event.preventDefault();
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      }
    };
    const desktop = matchMedia('(min-width: 640px)');
    const closeOnDesktop = () => { if (desktop.matches && menu.current) menu.current.open = false; };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      document.removeEventListener('keydown', escape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip button">Skip to content</a>
      <header className="site-header">
        <div className="wrap flex h-full items-center justify-between gap-3">
          <Link
            to="/"
            viewTransition
            className="-ml-1 inline-flex min-h-11 items-center px-1 text-[1.0625rem] font-[700] tracking-[-0.01em] [font-stretch:116%]"
          >
            Kirtiraj<span className="hidden sm:inline">&nbsp;Chaudhari</span>
          </Link>
          <div className="flex items-center gap-1">
            <nav aria-label="Primary" className="desktop-nav">
              {LINKS.map((link) => <NavLink key={link.to} to={link.to} viewTransition className="nav-link">{link.label}</NavLink>)}
            </nav>
            <details ref={menu} className="mobile-nav">
              <summary><Menu size={18} strokeWidth={1.75} aria-hidden="true" />Menu</summary>
              <nav aria-label="Primary">
                {LINKS.map((link) => <NavLink
                  key={link.to} to={link.to} viewTransition className="nav-link"
                  onClick={() => { if (menu.current) menu.current.open = false; }}
                >{link.label}</NavLink>)}
              </nav>
            </details>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
