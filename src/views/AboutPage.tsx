import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import Tilt from '../components/site/Tilt';
import { siteMeta } from '../content/shared';
import { educationJourney } from '../content/journey';
import {
  aboutBio,
  professionalAchievementCards as recognition,
  professionalCertifications as certifications,
  professionalSkills as skills,
} from '../content/professional';

const range = (dates: string) => dates.replace(' – ', ' to ');

const FACTS = [
  { label: 'Based', value: 'Pune, India' },
  { label: 'Studying', value: 'M.Tech, AI & ML, MIT-WPU' },
  { label: 'Focus', value: 'Health tech, computer vision, generative AI' },
  { label: 'Currently', value: 'Building RasaCare' },
];

const TIERS = [
  { tier: 'program', label: 'Programmes' },
  { tier: 'platform', label: 'Cloud platforms' },
  { tier: 'simulation', label: 'Job simulations' },
] as const;

/* Degrees carry their description; the two school entries are a line each. */
const DEGREES = new Set(['mtech', 'be']);

export default function AboutPage() {
  return (
    <Page title="About" description="About Kirtiraj Nitin Chaudhari: AI/ML engineer, M.Tech student at MIT-WPU Pune, builder of RasaCare.">
      <header className="wrap grid items-end gap-x-16 gap-y-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="intro">
          <h1 className="t-display" style={{ '--i': 0 } as React.CSSProperties}>{siteMeta.fullName}</h1>
          <p className="t-lede mt-8" style={{ '--i': 1 } as React.CSSProperties}>{aboutBio[0]}</p>
          <div className="mt-6" style={{ '--i': 2 } as React.CSSProperties}>
            {aboutBio.slice(1).map((p) => <p key={p} className="t-body">{p}</p>)}
          </div>
        </div>
        <Tilt className="w-full max-w-[22rem] justify-self-start lg:justify-self-end" max={7}>
          <figure className="plate">
            <img
              src="/avatars/id-photo.webp"
              srcSet="/avatars/id-photo-320.webp 320w, /avatars/id-photo.webp 640w"
              sizes="(min-width: 640px) 352px, 92vw"
              width={640}
              height={640}
              alt="Kirtiraj Chaudhari in a dark suit and glasses, photographed against a red background"
              fetchPriority="high"
            />
          </figure>
        </Tilt>
      </header>

      <section aria-label="At a glance" className="wrap">
        <dl className="rule-top grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="py-7">
              <dt className="t-data">{f.label}</dt>
              <dd className="mt-2 font-[560]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="band rule-top" aria-labelledby="recognition-title">
        <div className="wrap">
          <h2 id="recognition-title" className="t-h2">Recognition</h2>
          <ol className="ledger mt-12">
            {recognition.map((r) => (
              <li key={r.id} className="grid gap-x-10 gap-y-3 py-7 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.5fr)]">
                <p className="t-data flex items-start gap-3 lg:flex-col lg:pt-1.5">
                  {r.year}
                  {r.status && <span className="tag-status">{r.status}</span>}
                </p>
                <div>
                  <h3 className="t-h3">{r.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-fg-2">{r.institution}</p>
                </div>
                <p className="t-body">{r.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="education-title">
        <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <h2 id="education-title" className="t-h2 lg:sticky lg:top-24 lg:self-start">Education</h2>
          <ol className="ledger">
            {educationJourney.map((e) => (
              <li key={e.id} className="py-7">
                <p className="t-data">{range(e.dateRange)}</p>
                <h3 className="t-h3 mt-2">{e.heading}</h3>
                <a href={e.url} target="_blank" rel="noopener" className="link mt-1.5 inline-flex items-center gap-1 text-[0.9375rem] text-fg-2">
                  {e.organization}
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {DEGREES.has(e.id) && <p className="t-body mt-3">{e.description}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="tools-title">
        <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <h2 id="tools-title" className="t-h2 lg:sticky lg:top-24 lg:self-start">Tools</h2>
          <dl className="ledger">
            {skills.map((g) => (
              <div key={g.category} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <dt className="font-[600]">{g.category}</dt>
                <dd className="font-data text-[0.9375rem] text-fg-2">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="certifications-title">
        <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <h2 id="certifications-title" className="t-h2 lg:sticky lg:top-24 lg:self-start">Certifications</h2>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {TIERS.map(({ tier, label }) => (
              <div key={tier}>
                <h3 className="t-data">{label}</h3>
                <ul className="mt-3">
                  {certifications.filter((c) => c.tier === tier).map((c) => (
                    <li key={c.id} className="border-t border-rule py-4">
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[560]">
                        {c.title}
                        {c.status && <span className="tag-status">{c.status}</span>}
                      </p>
                      <p className="mt-1 text-[0.9375rem] text-fg-2">{c.provider}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-tight rule-top">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <p className="t-h3 max-w-[26em] text-fg-2">
            Off the clock I play tabla, take photographs and write. That side has its own page.
          </p>
          <Link to="/creator" className="go">
            Artistic profile
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </Page>
  );
}
