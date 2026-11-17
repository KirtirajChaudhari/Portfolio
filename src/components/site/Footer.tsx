import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { siteMeta } from '../../content/shared';
import ThemeToggle from './ThemeToggle';

const SOCIAL = [
  { label: 'GitHub', href: siteMeta.socials.github },
  { label: 'LinkedIn', href: siteMeta.socials.linkedin },
  { label: 'Instagram', href: siteMeta.socials.instagram },
  { label: 'YouTube', href: siteMeta.socials.youtube },
];

function Out({ href, children }: { href?: string; children: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center gap-1">
      {children}
      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Site footer. `close` adds the contact band above it; the Contact page turns it off. */
export default function Footer({ close = true }: { close?: boolean }) {
  return (
    <footer>
      {close && (
        <section className="band rule-top" aria-labelledby="close-title">
          <div className="wrap">
            <h2 id="close-title" className="t-data">Contact</h2>
            <a
              href={`mailto:${siteMeta.email}`}
              className="t-h2 link mt-4 block max-w-full break-all [text-decoration-thickness:2px] sm:break-normal"
            >
              {siteMeta.email}
            </a>
            <p className="t-lede mt-6">
              I'm open to AI/ML roles, and happy to work on research or product problems with other people. I usually
              reply within a day.
            </p>
          </div>
        </section>
      )}

      <div className="rule-top">
        <div className="wrap grid gap-10 py-12 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-[650] [font-stretch:112%]">{siteMeta.fullName}</p>
            <p className="mt-1 text-fg-2">{siteMeta.role}. Pune, India.</p>
            <ThemeToggle className="-ml-3 mt-3" />
          </div>
          <nav aria-label="Footer" className="flex flex-col items-start">
            <Link to="/work" viewTransition className="link inline-flex min-h-11 items-center">Work</Link>
            <Link to="/about" viewTransition className="link inline-flex min-h-11 items-center">About</Link>
            <Link to="/contact" viewTransition className="link inline-flex min-h-11 items-center">Contact</Link>
            <Out href={siteMeta.resumeUrl}>Résumé</Out>
          </nav>
          <div className="flex flex-col items-start">
            {SOCIAL.map((s) => <Out key={s.label} href={s.href}>{s.label}</Out>)}
          </div>
          <div className="flex flex-col items-start">
            <Link to="/creator" className="link inline-flex min-h-11 items-center">Artistic profile</Link>
            <Link to="/xray" className="link inline-flex min-h-11 items-center">Experiment: lens</Link>
            <Link to="/character" className="link inline-flex min-h-11 items-center">Experiment: head-tracker</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
