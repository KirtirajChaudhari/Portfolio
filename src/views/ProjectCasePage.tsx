import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projectCases, getProjectCase } from '../content/projects';
import PageShell from '../components/shell/PageShell';
import Section from '../components/shell/Section';
import Reveal from '../components/shell/Reveal';

const pill =
  'inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function ProjectCasePage() {
  const { slug } = useParams();
  const project = slug ? getProjectCase(slug) : undefined;
  const index = projectCases.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? projectCases[index - 1] : null;
  const next = index > -1 && index < projectCases.length - 1 ? projectCases[index + 1] : null;

  /* Unknown slug: say so instead of rendering a blank page. */
  if (!project) {
    return (
      <PageShell title="Project not found">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">That project doesn't exist.</h1>
        <p className="mt-6 text-[#f7ece7]/75">Nothing matches &ldquo;{slug}&rdquo;.</p>
        <Link to="/work" className={`${pill} mt-8 bg-white text-neutral-900`}>Back to work</Link>
      </PageShell>
    );
  }

  return (
    <PageShell title={project.title}>
      <Link to="/work#projects" className="inline-flex items-center gap-2 text-sm text-[#f7ece7]/70 hover:text-white">
        <ArrowLeft size={16} strokeWidth={1.75} />
        All projects
      </Link>

      <header className="mt-8 pb-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#ff7a66]">{project.techLine}</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-[#f7ece7]/80">{project.oneLiner}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener" className={`${pill} bg-white text-neutral-900 hover:bg-white/90`}>
              Visit the site <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener" className={`${pill} border border-white/30 text-white hover:bg-white/10`}>
              Code on GitHub
            </a>
          )}
          {(project.extraLinks || []).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className={`${pill} border border-white/30 text-white hover:bg-white/10`}>
              {l.label}
            </a>
          ))}
        </div>
      </header>

      {project.screenshot && (
        <Reveal>
          <figure className="rounded-[2rem] border border-white/15 bg-white/[0.06] p-2">
            <img src={project.screenshot} alt={`${project.title} interface`} className="w-full rounded-[1.5rem]" />
          </figure>
        </Reveal>
      )}

      <Section title="The problem">
        <p className="max-w-[62ch] text-lg leading-relaxed text-[#f7ece7]/85">{project.problem}</p>
      </Section>

      <Section title="The approach">
        <p className="max-w-[62ch] text-lg leading-relaxed text-[#f7ece7]/85">{project.approach}</p>
      </Section>

      {project.stack?.length ? (
        <Section title="Stack">
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {project.stack.map((s) => (
              <div key={s.name} className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-medium text-white">{s.name}</dt>
                <dd className="text-[#f7ece7]/70">{s.role}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {project.decisions?.length ? (
        <Section title="Decisions along the way">
          <ol className="space-y-6">
            {project.decisions.map((d, i) => (
              <li key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4">
                <span className="pt-0.5 font-mono text-sm text-[#ff7a66]">{String(i + 1).padStart(2, '0')}</span>
                <p className="max-w-[62ch] leading-relaxed text-[#f7ece7]/80">{d}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {project.outcome && (
        <Section title="What came out of it">
          <p className="max-w-[62ch] text-xl leading-snug text-white">{project.outcome}</p>
        </Section>
      )}

      <nav aria-label="More projects" className="grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
        {prev ? (
          <Link to={`/projects/${prev.slug}`} className="rounded-2xl border border-white/12 p-5 transition-colors hover:bg-white/5">
            <span className="text-sm text-[#f7ece7]/55">Previous</span>
            <span className="mt-1 block text-lg font-semibold text-white">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/projects/${next.slug}`} className="rounded-2xl border border-white/12 p-5 text-left transition-colors hover:bg-white/5 sm:text-right">
            <span className="text-sm text-[#f7ece7]/55">Next</span>
            <span className="mt-1 block text-lg font-semibold text-white">{next.title}</span>
          </Link>
        )}
      </nav>
    </PageShell>
  );
}
