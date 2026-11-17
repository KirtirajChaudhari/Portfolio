import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
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
          <div className="flex items-center">
            <nav aria-label="Primary" className="flex items-center">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} viewTransition className="nav-link">
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/creator" className="nav-link hidden md:inline-flex">Artistic</NavLink>
            </nav>
            <ThemeToggle className="ml-1 hidden min-[380px]:grid" />
          </div>
        </div>
      </header>
    </>
  );
}
