import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import Stack from '../components/site/Stack';
import Shot from '../components/site/Shot';
import FormationFigure from '../components/site/FormationFigure';
import { getProjectCase, projectCases } from '../content/projects';
import NotFoundPage from './NotFoundPage';

const FIGURE_NOTE = {
  graph: '',
  network: 'The network at its real layer sizes: 2,788 inputs, 256 hidden units, 4 classes. Connections are sampled.',
  track: 'An illustration, not model output: a length of track and the frame a detector draws round an obstacle.',
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rule-top py-12 lg:py-16">
      <h2 className="t-h3">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ProjectCasePage() {
  const { slug = '' } = useParams();
  const c = getProjectCase(slug);
  if (!c) return <NotFoundPage />;

  const at = projectCases.findIndex((p) => p.slug === c.slug);
  const next = projectCases[(at + 1) % projectCases.length];
  const outcomes = c.outcome?.split(' · ') ?? [];
  const links = [
    c.live && { label: 'Visit the site', href: c.live },
    c.github && { label: 'Code on GitHub', href: c.github },
    ...(c.extraLinks ?? []).map((l) => ({ label: l.label, href: l.href })),
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Page>
      <article className="wrap">
        <header className="intro pb-12 pt-10 sm:pt-14">
          <Link to="/work" viewTransition className="go text-[0.9375rem] text-fg-2" style={{ '--i': 0 } as React.CSSProperties}>
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" className="back-arrow" />
            All work
          </Link>
          <h1 className="t-display mt-8" style={{ '--i': 1 } as React.CSSProperties}>{c.title}</h1>
          <p className="t-lede mt-6" style={{ '--i': 2 } as React.CSSProperties}>{c.oneLiner}</p>
          <div className="mt-5" style={{ '--i': 3 } as React.CSSProperties}><Stack line={c.techLine} /></div>
          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3" style={{ '--i': 4 } as React.CSSProperties}>
              {links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className={`button ${i > 0 ? 'button-line' : ''}`}>
                  {l.label}
                  <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          )}
        </header>

        {c.shot ? (
          <figure className="plate plate-settle">
            <Shot shot={c.shot} name={c.slug} sizes="(min-width: 1400px) 1312px, 92vw" eager />
          </figure>
        ) : c.figure ? (
          <figure>
            <div className="plate plate-settle aspect-[4/3] sm:aspect-[21/9]" style={{ viewTransitionName: `shot-${c.slug}` }}>
              <FormationFigure formation={c.figure} />
            </div>
            <figcaption className="t-data mt-3">{FIGURE_NOTE[c.figure]}</figcaption>
          </figure>
        ) : null}

        <div className="mt-16 grid gap-x-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <Block title="The problem">
              <p className="t-body">{c.problem}</p>
            </Block>
            <Block title="The approach">
              <p className="t-body">{c.approach}</p>
            </Block>
            <Block title="Decisions along the way">
              <ol className="grid gap-5">
                {c.decisions.map((d, i) => (
                  <li key={d} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                    <span className="t-data pt-1 text-signal" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <p className="t-body">{d}</p>
                  </li>
                ))}
              </ol>
            </Block>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {outcomes.length > 0 && (
              <section className="rule-top py-12 lg:py-16">
                <h2 className="t-h3">What came out of it</h2>
                <ul className="mt-5 grid gap-2 font-data text-[0.9375rem]">
                  {outcomes.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </section>
            )}
            <section className="rule-top py-12 lg:py-16">
              <h2 className="t-h3">Stack</h2>
              <dl className="mt-5 grid gap-5">
                {c.stack.map((s) => (
                  <div key={s.name}>
                    <dt className="font-[600]">{s.name}</dt>
                    <dd className="mt-1 text-[0.9375rem] text-fg-2">{s.role}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>

        <nav aria-label="Next project" className="rule-top">
          <Link to={`/projects/${next.slug}`} viewTransition className="row-link group flex items-end justify-between gap-6 py-12 lg:py-16">
            <span>
              <span className="t-data block">Next</span>
              <span className="t-h2 mt-2 block">{next.title}</span>
            </span>
            <ArrowRight size={32} strokeWidth={1.5} aria-hidden="true" className="row-arrow mb-1 shrink-0 text-fg-3" />
          </Link>
        </nav>
      </article>
    </Page>
  );
}
