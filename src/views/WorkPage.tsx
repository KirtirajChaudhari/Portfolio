import type { ReactNode } from 'react';
import { professionalExpertise } from '../content/professional';
import { projectCases } from '../content/projects';
import { workJourney } from '../content/journey';
import PageShell from '../components/shell/PageShell';
import Reveal from '../components/shell/Reveal';
import ProjectIndex from '../components/work/ProjectIndex';
import InternshipTimeline from '../components/work/InternshipTimeline';
import ResearchBentoGrid from '../components/ui/research-bento-grid';

function Part({ id, title, note, children }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-dashed border-white/20 py-14 sm:py-20">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
        {note && <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#f7ece7]/65">{note}</p>}
      </Reveal>
      {children}
    </section>
  );
}

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

      <Part
        id="projects"
        title="Projects"
        note={`${projectCases.length} builds. RasaCare leads, and it's live at rasacare.app. Pick one from the list.`}
      >
        <ProjectIndex />
      </Part>

      <Part id="internships" title="Internships" note={`${workJourney.length} roles, most recent first.`}>
        <InternshipTimeline />
      </Part>

      <Part id="expertise" title="What I'm good at">
        <div className="mt-10">
          <ResearchBentoGrid areas={professionalExpertise} />
        </div>
      </Part>
    </PageShell>
  );
}
