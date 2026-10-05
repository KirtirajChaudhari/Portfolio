import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { workJourney } from '../content/journey';
import { projectCases } from '../content/projects';
import { professionalExpertise } from '../content/professional';
import PageShell from '../components/shell/PageShell';
import Section from '../components/shell/Section';
import Reveal from '../components/shell/Reveal';

/* Bento spans on the 6-column desktop grid. The pattern repeats by index so a
   new project drops in without anyone touching the layout. */
const SPANS = [
  'lg:col-span-4 lg:row-span-2 min-h-[22rem] lg:min-h-[30rem]',
  'lg:col-span-2 min-h-[16rem]',
  'lg:col-span-2 min-h-[16rem]',
  'lg:col-span-3 min-h-[16rem]',
  'lg:col-span-3 min-h-[16rem]',
  'lg:col-span-2 min-h-[16rem]',
  'lg:col-span-2 min-h-[16rem]',
  'lg:col-span-2 min-h-[16rem]',
  'lg:col-span-6 min-h-[16rem]',
];

export default function WorkPage() {
  return (
    <PageShell title="Work">
      <header className="pb-14 lg:pb-20">
        <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          What I've built, and where I've worked.
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-[#f7ece7]/75">
          The projects come first. Open one for the problem, the approach and what came out of it. The internships are below them.
        </p>
      </header>

      <section id="projects" className="scroll-mt-28 border-t border-white/10 py-14 sm:py-20">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Projects</h2>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[#f7ece7]/65">
            RasaCare leads, and it's live at rasacare.app. The rest follow.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-6">
          {projectCases.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06} className={`flex ${SPANS[i % SPANS.length]}`}>
              <Link
                to={`/projects/${p.slug}`}
                className="group relative flex w-full flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#1d0e10] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {p.screenshot
                  ? (
                    <img
                      src={p.screenshot}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                    />
                  )
                  : <span className="absolute inset-0 grid place-items-center text-7xl font-semibold text-white/10">{p.title.charAt(0)}</span>}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#12090a] via-[#12090a]/55 to-transparent" />
                <span className="relative flex items-end justify-between gap-4 p-5 sm:p-6">
                  <span>
                    <span className="block text-xl font-semibold leading-tight text-white">{p.title}</span>
                    <span className="mt-1 block max-w-[44ch] text-sm leading-snug text-[#f7ece7]/75">{p.oneLiner}</span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={16} strokeWidth={1.75} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Section id="internships" title="Internships" note="Most recent first.">
        <ul className="divide-y divide-white/10">
          {workJourney.map((r) => (
            <li key={r.id} className="grid gap-4 py-8 first:pt-0 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-6">
              {r.logo
                ? <img src={r.logo} alt="" className="h-12 w-12 rounded-xl bg-white object-contain p-1.5" />
                : <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 font-semibold">{r.organization.charAt(0)}</span>}
              <div>
                <h3 className="text-lg font-semibold leading-snug text-white">{r.heading}</h3>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-0.5 inline-flex items-center gap-1 text-[#f7ece7]/70 underline-offset-4 hover:text-white hover:underline"
                >
                  {r.organization}
                  <ArrowUpRight size={14} strokeWidth={1.75} />
                </a>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#f7ece7]/75">{r.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.skills.map((s) => (
                    <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs text-[#f7ece7]/80">{s}</li>
                  ))}
                </ul>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#f7ece7]/55 sm:text-right">{r.dateRange}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="expertise" title="What I'm good at">
        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {professionalExpertise.map((a) => (
            <div key={a.id}>
              <dt className="text-lg font-semibold text-white">{a.title}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-[#f7ece7]/75">{a.description}</dd>
              <dd className="mt-3 text-sm text-[#f7ece7]/55">{a.tools.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </PageShell>
  );
}
