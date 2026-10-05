import {
  professionalAbout as about,
  professionalSkills as skillGroups,
  professionalCertifications as certs,
  professionalAchievementCards as achievements,
} from '../content/professional';
import { educationJourney } from '../content/journey';
import { tools } from '../content/tools';
import { Link } from 'react-router-dom';
import PageShell from '../components/shell/PageShell';
import Section from '../components/shell/Section';
import LineReveal from '../components/shell/LineReveal';
import WordReveal from '../components/shell/WordReveal';
import IdCardBand from '../components/shell/IdCardBand';

/* The author's own paragraph, verbatim, split only at sentence ends:
   1-2 together, then 3, then 4. */
const sentences = about.detail.split(/(?<=\.)\s+/);
const PARAGRAPHS = [sentences.slice(0, 2).join(' '), sentences[2], sentences[3]].filter(Boolean);

const LEDGER = [
  { label: 'Based', value: 'Pune, India' },
  { label: 'Studying', value: 'M.Tech, AI & ML — MIT-WPU' },
  { label: 'Focus', value: 'HealthTech, computer vision, generative AI' },
  { label: 'Currently', value: 'RasaCare' },
];


const tierLabel = { program: 'Programs', platform: 'Cloud platforms', simulation: 'Job simulations' } as const;
const tiers = ['program', 'platform', 'simulation'] as const;

const tag = 'rounded-full border border-white/25 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[#f7ece7]/80';

export default function AboutPage() {
  return (
    <PageShell title="About">
      <header className="grid gap-12 pb-14 lg:grid-cols-12 lg:gap-x-12 lg:pb-20">
        <div className="lg:col-span-7">
          {/* The eyebrow is the page's h1: one line, one label. */}
          <h1 className="flex items-center gap-4 text-xs font-normal uppercase tracking-[0.2em] text-[#f7ece7]/80">
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            About
          </h1>
          <LineReveal
            as="h2"
            text="Machine learning that shows its reasoning."
            className="mt-8 max-w-[20ch] text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl"
          />
        </div>

        <div className="space-y-5 lg:col-span-5 lg:pt-14">
          {PARAGRAPHS.map((p, i) => (
            <WordReveal key={i} text={p} delay={i * 0.12} className="max-w-[52ch] text-[15px] leading-relaxed text-[#f7ece7]/80" />
          ))}
        </div>
      </header>

      <IdCardBand />

      <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-b border-dashed border-white/20 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {LEDGER.map((l) => (
          <div key={l.label}>
            <dt className="text-xs uppercase tracking-[0.18em] text-[#f7ece7]/55">{l.label}</dt>
            <dd className="mt-2 text-[15px] leading-snug text-white">{l.value}</dd>
          </div>
        ))}
      </dl>


      <Section dashed id="education" title="Education">
        <ul className="divide-y divide-dashed divide-white/20">
          {educationJourney.map((e) => (
            <li key={e.id} className="grid gap-4 py-7 first:pt-0 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-6">
              {e.logo
                ? <img src={e.logo} alt="" className="h-12 w-12 rounded-xl bg-white object-contain p-1.5" />
                : <span className="h-12 w-12 rounded-xl bg-white/10" />}
              <div>
                <h3 className="text-lg font-semibold leading-snug text-white">{e.heading}</h3>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-0.5 inline-block text-[#f7ece7]/70 underline-offset-4 hover:text-white hover:underline"
                >
                  {e.organization}
                </a>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[#f7ece7]/75">{e.description}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#f7ece7]/55 sm:text-right">{e.dateRange}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section dashed id="skills" title="Tools I use" note="These are the logos I have actually shipped something with.">
        <ul className="flex flex-wrap gap-3">
          {tools.map((t) => (
            <li key={t.name} title={t.name} className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-2.5">
              <img src={t.icon} alt={t.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.category}>
              <dt className="text-sm font-medium text-white">{g.category}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-[#f7ece7]/70">{g.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section dashed id="certifications" title="Certifications" note={`${certs.length} courses and simulations.`}>
        <div className="space-y-9">
          {tiers.map((tier) => (
            <div key={tier}>
              <h3 className="text-sm font-medium text-[#f7ece7]/55">{tierLabel[tier]}</h3>
              <ul className="mt-3 divide-y divide-dashed divide-white/20 border-y border-dashed border-white/20">
                {certs.filter((c) => c.tier === tier).map((c) => (
                  <li key={c.id} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-medium text-white">
                      {c.title}
                      {c.status && <span className={tag}>{c.status}</span>}
                    </span>
                    <span className="text-sm text-[#f7ece7]/60">{c.provider}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section dashed id="achievements" title="Achievements">
        <ul className="space-y-10">
          {achievements.map((a) => (
            <li key={a.id} className="grid gap-x-8 gap-y-2 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
              <p className="flex flex-wrap items-start gap-2 font-mono text-sm text-[#ff7a66]">
                {a.year}
                {a.status && <span className={`${tag} font-sans`}>{a.status}</span>}
              </p>
              <div>
                <h3 className="text-lg font-semibold leading-snug text-white">{a.title}</h3>
                <p className="mt-0.5 text-sm text-[#f7ece7]/60">{a.institution}</p>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#f7ece7]/75">{a.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Profile-2 portal ── */}
      <div className="relative mt-20 flex flex-col items-center gap-6 py-16">
        {/* decorative dashed top rule */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <p className="text-[11px] uppercase tracking-[0.25em] text-[#f7ece7]/75">There's more than the CV</p>

        <Link
          to="/creator"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,122,102,0.18)]"
        >
          {/* animated gradient pill background */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff7a66]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />

          <span className="relative text-base font-semibold tracking-wide text-white">
            Apart from the academics &amp; professionalism —{' '}
            <span className="bg-gradient-to-r from-[#ff7a66] to-[#ffb347] bg-clip-text text-transparent">
              know the real me
            </span>
          </span>

          {/* arrow */}
          <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff7a66]/15 text-[#ff7a66] transition-transform duration-300 group-hover:translate-x-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>

        <p className="max-w-[38ch] text-center text-[13px] leading-relaxed text-[#f7ece7]/75">
          Passions, interests &amp; the person behind the projects.
        </p>

        {/* decorative dashed bottom rule */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>
    </PageShell>
  );
}
