import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import Shot from '../components/site/Shot';
import FormationFigure from '../components/site/FormationFigure';
import { caseFigures, getProjectCase, projectCases } from '../content/projects';
import NotFoundPage from './NotFoundPage';

const FIGURE_NOTE = {
  graph: '23,756 points, the node count of RasaCare\'s knowledge graph. The layout is illustrative.',
  network: 'The network at its real layer sizes: 2,788 inputs, 256 hidden units, 4 classes. Connections are sampled.',
  track: 'An illustration, not model output: a length of track and the frame a detector draws round an obstacle.',
};

/** A labelled row: the title in the left column, the content in the right (f03c96b). */
function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rule-top grid gap-x-16 gap-y-5 py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-16">
      <h2 className="t-h3">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function ProjectCasePage() {
  const { slug = '' } = useParams();
  const c = getProjectCase(slug);
  if (!c) return <NotFoundPage />;

  const at = projectCases.findIndex((p) => p.slug === c.slug);
  const next = projectCases[(at + 1) % projectCases.length];
  const figures = caseFigures(c.slug);
  const outcomes = c.outcome?.split(' · ') ?? [];
  const links = [
    c.live && { label: 'Visit the site', href: c.live },
    c.github && { label: 'Code on GitHub', href: c.github },
    ...(c.extraLinks ?? []).map((l) => ({ label: l.label, href: l.href })),
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Page>
      <article className="wrap">
        <header className="intro page-top pb-12">
          <Link to="/work" viewTransition className="go text-[0.875rem] text-fg-2" style={{ '--i': 0 } as React.CSSProperties}>
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" className="back-arrow" />
            All projects
          </Link>
          <p className="mt-8 font-data text-xs uppercase tracking-[0.14em] text-signal" style={{ '--i': 1 } as React.CSSProperties}>
            {c.techLine.split(' · ').join('  ·  ')}
          </p>
          <h1 className="t-display mt-4" style={{ '--i': 2 } as React.CSSProperties}>{c.title}</h1>
          <p className="t-lede mt-6" style={{ '--i': 3 } as React.CSSProperties}>{c.oneLiner}</p>
          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3" style={{ '--i': 4 } as React.CSSProperties}>
              {links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className={`button ${i > 0 ? 'button-line' : ''}`}>
                  {l.label}
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          )}
        </header>

        {c.shot ? (
          <figure className="plate plate-settle">
            <Shot shot={c.shot} name={c.slug} sizes="(min-width: 1260px) 1216px, 92vw" eager />
          </figure>
        ) : c.figure ? (
          <figure>
            <div className="plate plate-settle aspect-[4/3] sm:aspect-[21/9]" style={{ viewTransitionName: `shot-${c.slug}` }}>
              <FormationFigure formation={c.figure} />
            </div>
            <figcaption className="t-data mt-3">{FIGURE_NOTE[c.figure]}</figcaption>
          </figure>
        ) : null}

        {figures.length > 0 && (
          <ul aria-label="Key figures" className="mt-10 grid gap-4 sm:grid-cols-3">
            {figures.map((f) => (
              <li key={f} className="card px-6 py-5 font-data text-[0.9375rem] text-fg">{f}</li>
            ))}
          </ul>
        )}

        <div className="mt-14">
          <Row title="The problem"><p className="t-body">{c.problem}</p></Row>
          <Row title="The approach"><p className="t-body">{c.approach}</p></Row>
          <Row title="Stack">
            <dl className="divide-y divide-rule border-y border-rule">
              {c.stack.map((s) => (
                <div key={s.name} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <dt className="font-[600]">{s.name}</dt>
                  <dd className="text-[0.9375rem] text-fg-2">{s.role}</dd>
                </div>
              ))}
            </dl>
          </Row>
          <Row title="Decisions along the way">
            <ol className="grid gap-5">
              {c.decisions.map((d, i) => (
                <li key={d} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2">
                  <span className="font-data pt-1 text-sm text-signal" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <p className="t-body">{d}</p>
                </li>
              ))}
            </ol>
          </Row>
          {outcomes.length > 0 && (
            <Row title="What came out of it">
              <ul className="flex flex-wrap gap-2">
                {outcomes.map((o) => <li key={o} className="chip !min-h-9 max-w-full !whitespace-normal !px-4 !py-1.5 !text-[0.875rem] !leading-snug">{o}</li>)}
              </ul>
            </Row>
          )}
        </div>

        <nav aria-label="Next project" className="rule-top flex justify-end py-12 lg:py-16">
          <Link to={`/projects/${next.slug}`} viewTransition className="row-link card group flex w-full max-w-md items-end justify-between gap-6 px-6 py-6 sm:px-8">
            <span className="min-w-0">
              <span className="t-data block">Next</span>
              <span className="t-h2 mt-2 block">{next.title}</span>
            </span>
            <ArrowRight size={28} strokeWidth={1.5} aria-hidden="true" className="row-arrow mb-1 shrink-0 text-fg-3" />
          </Link>
        </nav>
      </article>
    </Page>
  );
}
