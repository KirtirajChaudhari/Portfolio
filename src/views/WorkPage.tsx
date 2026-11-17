import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import Stack from '../components/site/Stack';
import Shot from '../components/site/Shot';
import Tilt from '../components/site/Tilt';
import FormationFigure from '../components/site/FormationFigure';
import { caseFigures, leadCases, otherCases, type ProjectCase } from '../content/projects';
import { workJourney } from '../content/journey';
import { professionalExpertise as expertise } from '../content/professional';

const range = (dates: string) => dates.replace(' – ', ' to ');

function LeadCopy({ c }: { c: ProjectCase }) {
  return (
    <div>
      <h3 className="t-h2">
        <Link to={`/projects/${c.slug}`} viewTransition className="lead-link">{c.title}</Link>
      </h3>
      <p className="t-lede mt-4">{c.oneLiner}</p>
      <ul className="mt-6 grid gap-1.5 border-l border-rule-2 pl-4 font-data text-[0.9375rem]">
        {caseFigures(c.slug).map((f) => <li key={f}>{f}</li>)}
      </ul>
      <Stack line={c.techLine} className="mt-5" />
      <Link to={`/projects/${c.slug}`} viewTransition className="go mt-7" aria-label={`Read the ${c.title} case`}>
        Read the case
        <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function WorkPage() {
  const [first, ...rest] = leadCases;

  return (
    <Page>
      <header className="wrap intro pb-16 pt-14 sm:pt-20">
        <h1 className="t-display" style={{ '--i': 0 } as React.CSSProperties}>Work</h1>
        <p className="t-lede mt-6" style={{ '--i': 1 } as React.CSSProperties}>
          Nine builds. Three carry most of what I know: a clinical diet engine, a retinal classifier written by hand,
          and a railway safety detector.
        </p>
      </header>

      <section aria-labelledby="projects-title" className="wrap">
        <h2 id="projects-title" className="sr-only">Projects</h2>

        {/* The lead project gets the full width and its real screenshot. */}
        <article className="rule-top grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16 lg:py-20">
          {first.shot && (
            <Tilt>
              <Link to={`/projects/${first.slug}`} viewTransition tabIndex={-1} aria-hidden="true" className="plate block">
                <Shot shot={first.shot} name={first.slug} sizes="(min-width: 1024px) 52vw, 92vw" eager />
              </Link>
            </Tilt>
          )}
          <LeadCopy c={first} />
        </article>

        <div className="rule-top grid gap-x-16 md:grid-cols-2">
          {rest.map((c) => (
            <article key={c.slug} className="py-14 lg:py-20">
              {c.figure && (
                <Tilt className="enter mb-16">
                  <div className="plate aspect-[4/3]" style={{ viewTransitionName: `shot-${c.slug}` }}>
                    <FormationFigure formation={c.figure} />
                  </div>
                </Tilt>
              )}
              <LeadCopy c={c} />
            </article>
          ))}
        </div>

        <div className="rule-top py-14 lg:py-20">
          <h3 className="t-h3 text-fg-2">Also built</h3>
          <ul className="mt-8 grid gap-x-16 md:grid-cols-2">
            {otherCases.map((c) => (
              <li key={c.slug} className="border-t border-rule">
                <Link to={`/projects/${c.slug}`} viewTransition className="row-link group block py-6">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="t-h3">{c.title}</span>
                    <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" className="row-arrow shrink-0 translate-y-0.5 text-fg-3" />
                  </span>
                  <span className="mt-2 block text-fg-2">{c.oneLiner}</span>
                  <Stack line={c.techLine} className="mt-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="internships-title">
        <div className="wrap">
          <h2 id="internships-title" className="t-h2">Internships</h2>
          <ol className="ledger mt-12">
            {workJourney.map((j) => (
              <li key={j.id} className="grid gap-x-10 gap-y-3 py-7 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.5fr)]">
                <p className="t-data lg:pt-1.5">{range(j.dateRange)}</p>
                <div>
                  <h3 className="t-h3">{j.heading}</h3>
                  <a href={j.url} target="_blank" rel="noopener" className="link mt-1.5 inline-flex items-center gap-1 text-[0.9375rem] text-fg-2">
                    {j.organization}
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
                <div>
                  <p className="t-body">{j.description}</p>
                  <Stack line={j.skills.join(' · ')} className="mt-3" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="expertise-title">
        <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <h2 id="expertise-title" className="t-h2 lg:sticky lg:top-24 lg:self-start">What I'm good at</h2>
          <dl className="ledger">
            {expertise.map((e) => (
              <div key={e.id} className="py-7">
                <dt className="t-h3">{e.title}</dt>
                <dd className="t-body mt-3">{e.description}</dd>
                <dd className="mt-3"><Stack line={e.tools.join(' · ')} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Page>
  );
}
