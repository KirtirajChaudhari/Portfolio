import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const PRO = [
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
];

const CREATOR = [
  { id: 'photos', label: 'Photos' },
  { id: 'music', label: 'Music' },
  { id: 'poetry', label: 'Writing' },
];

/** Marks <html data-over="hero"> while the red home hero is under the pill, so the
 *  pill reads as light glass on crimson there and as theme glass everywhere else. */
function useOverHero(pathname: string) {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector('.hero');
    if (!hero) {
      delete root.dataset.over;
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) root.dataset.over = 'hero';
      else delete root.dataset.over;
    }, { rootMargin: '0px 0px -100% 0px' });
    io.observe(hero);
    return () => {
      io.disconnect();
      delete root.dataset.over;
    };
  }, [pathname]);
}

/** The floating glass pill from f03c96b, on every professional page and Creator.
 *  Every destination and the theme control fit at 320px; there is no disclosure. */
export default function Header() {
  const { pathname } = useLocation();
  const creator = pathname.startsWith('/creator') || pathname.startsWith('/profile-2');
  useOverHero(pathname);

  return (
    <>
      <a href="#main" className="skip button">Skip to content</a>
      <header className="site-header">
        <nav aria-label="Primary" className="navpill">
          <Link to="/" viewTransition className="nav-link nav-home" aria-label="Home">
            <img src="/favicon-64.png" alt="" width={28} height={28} />
          </Link>
          {creator
            ? CREATOR.map((s) => <a key={s.id} href={`#${s.id}`} className="nav-link">{s.label}</a>)
            : PRO.map((l) => <NavLink key={l.to} to={l.to} viewTransition className="nav-link">{l.label}</NavLink>)}
          <span aria-hidden="true" className="nav-divider" />
          <Link
            to={creator ? '/' : '/creator'}
            viewTransition
            className="nav-link nav-chip"
            title={creator ? 'Back to the professional profile' : 'The other side: photography, music, writing'}
          >
            {creator ? 'Pro' : 'Artistic'}
            <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <ThemeToggle />
        </nav>
      </header>
    </>
  );
}
