import Page from '../components/site/Page';
import ProjectIndex from '../components/work/ProjectIndex';
import InternshipTimeline from '../components/work/InternshipTimeline';
import { ResearchBentoGrid } from '../components/ui/research-bento-grid';
import { projectCases } from '../content/projects';
import { workJourney } from '../content/journey';
import { professionalExpertise as expertise } from '../content/professional';

export default function WorkPage() {
  return (
    <Page>
      <header className="wrap intro page-top pb-6">
        <p className="t-kicker" style={{ '--i': 0 } as React.CSSProperties}>Work</p>
        <h1 className="t-display mt-6 max-w-[13em]" style={{ '--i': 1 } as React.CSSProperties}>
          What I've built, and where I've worked.
        </h1>
        <p className="t-lede mt-7" style={{ '--i': 2 } as React.CSSProperties}>
          The projects come first. Open one for the problem, the approach and what came out of it. My experience
          and what I'm good at are below them.
        </p>
      </header>

      <section className="band" aria-labelledby="projects-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="projects-title" className="t-h2">Projects</h2>
            <p className="t-data">{projectCases.length} builds. RasaCare is live at rasacare.app.</p>
          </div>
          <ProjectIndex />
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="internships-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="internships-title" className="t-h2">Experience</h2>
            <p className="t-data">{workJourney.length} roles, most recent first.</p>
          </div>
          <InternshipTimeline />
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="expertise-title">
        <div className="wrap">
          <h2 id="expertise-title" className="t-h2">What I'm good at</h2>
          <ResearchBentoGrid areas={expertise} className="mt-12" />
        </div>
      </section>
    </Page>
  );
}
