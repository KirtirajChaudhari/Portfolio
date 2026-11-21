import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { contactInvite, siteMeta } from '../../content/shared';
import Email from './Email';
import FooterBand from '../contact/FooterBand';

const SOCIAL = [
  { label: 'GitHub', href: siteMeta.socials.github },
  { label: 'LinkedIn', href: siteMeta.socials.linkedin },
  { label: 'Instagram', href: siteMeta.socials.instagram },
  { label: 'YouTube', href: siteMeta.socials.youtube },
];

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
  { to: '/creator', label: 'Artistic' },
];

/** Site footer. `close` adds the contact card above it; `band` adds the ASCII
 *  avatars with the name set large (Home and Contact). */
export default function Footer({ close = true, band = false }: { close?: boolean; band?: boolean }) {
  return (
    <footer className="relative">
      {close && (
        <section className="band" aria-labelledby="close-title">
          <div className="wrap">
            <div className="card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
              <h2 id="close-title" className="t-kicker">Contact</h2>
              <p className="t-h2 mt-5 max-w-[16em]">Have a problem worth reasoning through? Let's talk.</p>
              <a href={`mailto:${siteMeta.email}`} className="t-email link mt-6 inline-block max-w-full">
                <Email address={siteMeta.email} />
              </a>
              <p className="t-lede mt-5">{contactInvite} I usually reply within a day.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact" viewTransition className="button button-disc">
                  Write to me
                  <span className="disc"><ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
                </Link>
                <a href={siteMeta.resumeUrl} target="_blank" rel="noopener" className="button button-line">
                  Résumé
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {band && <FooterBand />}

      <div className="rule-top">
        <div className="wrap grid gap-x-10 gap-y-6 py-10 text-[0.875rem] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <p className="text-fg-2">
            <span className="font-[600] text-fg">{siteMeta.fullName}</span>. {siteMeta.role}, Pune, India.
          </p>
          <div className="grid gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5">
              {PAGES.map((p) => (
                <Link key={p.to} to={p.to} viewTransition className="link inline-flex min-h-11 items-center text-fg-2">{p.label}</Link>
              ))}
            </nav>
            <ul aria-label="Elsewhere" className="flex flex-wrap gap-x-5">
              {SOCIAL.filter((s) => s.href).map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center gap-1 text-fg-2">
                    {s.label}
                    <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
