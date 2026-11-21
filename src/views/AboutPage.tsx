import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Page from '../components/site/Page';
import PinnedCard from '../components/about/PinnedCard';
import ToolsKeyboard from '../components/about/ToolsKeyboard';
import OutLink from '../components/site/OutLink';
import { glance } from '../content/facts';
import { tools } from '../content/tools';
import { educationJourney } from '../content/journey';
import {
  aboutBio,
  professionalAchievementCards as recognition,
  professionalCertifications as certifications,
  professionalSkills as skills,
} from '../content/professional';

const range = (dates: string) => dates.replace(' – ', ' to ');

const TIERS = [
  { tier: 'program', label: 'Programmes' },
  { tier: 'platform', label: 'Cloud platforms' },
  { tier: 'simulation', label: 'Job simulations' },
] as const;

/** One numbered chapter: the big outlined numeral beside its title, as in f03c96b. */
function Chapter({ n, id, title, note, children }: { n: string; id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rule-top py-16 lg:py-20" aria-labelledby={`${id}-title`}>
      <div className="flex items-end gap-5">
        <span className="t-numeral" aria-hidden="true">{n}</span>
        <div className="pb-1">
          <h2 id={`${id}-title`} className="t-h2">{title}</h2>
          {note && <p className="t-data mt-2">{note}</p>}
        </div>
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <Page>
      <div className="wrap page-top grid gap-x-16 lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* The ID card hangs beside every chapter on desktop. */}
        <aside className="mx-auto w-full max-w-[17rem] lg:sticky lg:top-20 lg:self-start">
          <PinnedCard priority />
        </aside>

        <div className="min-w-0">
          <header className="intro pb-14 pt-6 lg:pt-10">
            <p className="t-kicker" style={{ '--i': 0 } as React.CSSProperties}>About</p>
            <h1 className="t-display mt-6 max-w-[12em]" style={{ '--i': 1 } as React.CSSProperties}>
              Machine learning that shows its reasoning.
            </h1>
            <div className="mt-8 grid gap-4" style={{ '--i': 2 } as React.CSSProperties}>
              <p className="t-lede">{aboutBio[0]}</p>
              {aboutBio.slice(1).map((p) => <p key={p} className="t-body">{p}</p>)}
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-8 xl:grid-cols-4" style={{ '--i': 3 } as React.CSSProperties}>
              {glance.map((f) => (
                <div key={f.label}>
                  <dt className="t-kicker !gap-0 before:!hidden">{f.label}</dt>
                  <dd className="mt-2 font-[560]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <Chapter n="01" id="education" title="Education">
            <ol className="timeline">
              {educationJourney.map((e) => (
                <li key={e.id} className="relative pb-12 pl-9 last:pb-0">
                  <span aria-hidden="true" className="timeline-dot" />
                  <p className="font-data text-xs uppercase tracking-[0.14em] text-signal">{range(e.dateRange)}</p>
                  <div className="mt-3 flex items-start gap-4">
                    {e.logo && <span className="logo-tile"><img src={encodeURI(e.logo)} alt="" loading="lazy" /></span>}
                    <div className="min-w-0">
                      <h3 className="t-h3">{e.heading}</h3>
                      <p className="mt-1 text-[0.9375rem] text-fg-2"><OutLink href={e.url}>{e.organization}</OutLink></p>
                      <p className="t-body mt-3 text-[0.9375rem]">{e.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter n="02" id="tools" title="Tools I use" note="Typed out on the keyboard, then sorted below.">
            <ToolsKeyboard />
            <ul aria-label="Tool logos" className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-3">
              {tools.map((t) => (
                <li key={t.name} title={t.name} className="logo-tile !h-12 !w-12">
                  <img src={encodeURI(t.icon)} alt={t.name} loading="lazy" />
                </li>
              ))}
            </ul>
            <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {skills.map((g) => (
                <div key={g.category}>
                  <dt className="font-[600]">{g.category}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-fg-2">{g.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </Chapter>

          <Chapter n="03" id="certifications" title="Certifications" note={`${certifications.length} courses and simulations.`}>
            <div className="grid gap-10">
              {TIERS.map(({ tier, label }) => (
                <div key={tier}>
                  <h3 className="t-kicker">{label}</h3>
                  <ul className="mt-4">
                    {certifications.filter((c) => c.tier === tier).map((c) => (
                      <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-4">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[560]">
                          {c.title}
                          {c.status && <span className="tag-status">{c.status}</span>}
                        </p>
                        <p className="text-[0.875rem] text-fg-3">{c.provider}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Chapter>

          <Chapter n="04" id="recognition" title="Recognition">
            <ol className="grid gap-4">
              {recognition.map((r) => (
                <li key={r.id} className="card grid gap-x-8 gap-y-3 p-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-8">
                  <div className="flex items-start gap-3 sm:flex-col">
                    <p className="font-data text-sm text-signal">{r.year}</p>
                    {r.status && <span className="tag-status">{r.status}</span>}
                  </div>
                  <div>
                    <h3 className="t-h3">{r.title}</h3>
                    <p className="mt-1.5 text-[0.875rem] text-fg-3">{r.institution}</p>
                    <p className="t-body mt-3 text-[0.9375rem]">{r.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>
        </div>
      </div>

      <section className="band-tight">
        <div className="wrap grid justify-items-center gap-4 text-center">
          <p className="t-kicker">There's more than the CV</p>
          <Link to="/creator" viewTransition className="button button-line button-disc max-w-full !whitespace-normal !py-1.5 text-left !leading-snug">
            Apart from the academics: know the real me
            <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
          </Link>
          <p className="t-data">Photography, music and writing, on their own page.</p>
        </div>
      </section>
    </Page>
  );
}
