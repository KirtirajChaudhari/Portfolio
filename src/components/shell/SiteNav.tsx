import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/** One floating glass pill for every page. The second profile (Creator) sits at
 *  the end as its own chip, so the two sides of the site are always one click apart. */
export default function SiteNav() {
  const { pathname } = useLocation();
  const onCreator = pathname.startsWith('/creator');
  /* Profile 2 is a paper-white page; the pill flips to dark ink there. */
  const light = onCreator;

  const shell = light
    ? 'border-black/10 bg-white/60 text-neutral-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_14px_34px_-18px_rgb(60_40_30/0.45)]'
    : 'border-white/20 bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_14px_34px_-14px_rgb(0_0_0/0.55)]';
  const idle = light ? 'hover:bg-black/5' : 'hover:bg-white/12';
  const active = light ? 'bg-black/10' : 'bg-white/20';
  const ring = light ? 'focus-visible:outline-neutral-900' : 'focus-visible:outline-white';

  const item = `whitespace-nowrap rounded-full px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4 ${idle} ${ring}`;

  return (
    <header className="fixed left-1/2 top-4 -translate-x-1/2 sm:top-6" style={{ zIndex: 'var(--z-nav)' }}>
      <nav
        aria-label="Primary"
        className={`flex items-center gap-0.5 rounded-full border p-1.5 backdrop-blur-[20px] ${shell}`}
      >
        {pathname !== '/' && (
          <Link to="/" aria-label="Home" className={`${item} hidden font-semibold sm:inline-flex`}>
            KC
          </Link>
        )}
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `${item} ${isActive ? active : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
        <span aria-hidden="true" className={`mx-1 h-4 w-px ${light ? 'bg-black/15' : 'bg-white/25'}`} />
        <Link
          to={onCreator ? '/' : '/creator'}
          className={`${item} inline-flex items-center gap-1 ${onCreator ? '' : active}`}
          title={onCreator ? 'Back to the engineering profile' : 'See the other side: music, photography, poems'}
        >
          {onCreator ? 'Profile 1' : 'Profile 2'}
          <ArrowUpRight size={12} strokeWidth={1.75} />
        </Link>
      </nav>
    </header>
  );
}
