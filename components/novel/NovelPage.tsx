import { NovelShell } from "./NovelShell";
import { HeroCover } from "./HeroCover";
import { ChapterTitle } from "./ChapterTitle";
import { ChapterCTA } from "./ChapterCTA";
import { HeroChapterTransition } from "./HeroChapterTransition";
import { EngineerStory } from "./chapter-one/EngineerStory";
import { ProjectsGrid } from "./chapter-one/ProjectsGrid";
import { SkillBalls } from "./chapter-one/SkillBalls";
import { TechMarquee } from "./chapter-one/TechMarquee";
import { Finale } from "./Finale";
import { chapterOneMeta } from "@/content/novel";
import { projectCases } from "@/content/projects";
import { JourneyTimeline } from "../professional/JourneyTimeline";

/*
 * My Life as a Novel — Chapter One (spec v2).
 * Hero flows straight into the chapter (stat strip removed);
 * Chapter Two lives at /creator with its own scroll context.
 * All projects (including RasaCare) appear in the standard grid — no flagship.
 */
export function NovelPage() {
  return (
    <NovelShell>
      <main>
        <HeroCover />
        <HeroChapterTransition />

        <section id="chapter-one" aria-label="Chapter One — The Engineer">
          <ChapterTitle
            kicker={chapterOneMeta.kicker}
            title={chapterOneMeta.title}
            epigraph={chapterOneMeta.epigraph}
          />
          <EngineerStory />
          <JourneyTimeline />
          <ProjectsGrid projects={projectCases} />
          <SkillBalls />
          <TechMarquee />
          <ChapterCTA label="Read the next chapter" target="/creator" />
        </section>
        <Finale />
      </main>
    </NovelShell>
  );
}
