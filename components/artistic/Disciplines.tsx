"use client";

import Image from "next/image";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { artisticDisciplines } from "@/content/artistic";
import type { CreativeDiscipline, CreativeWork } from "@/content/types";

function Banner({ title }: { title: string }) {
  return (
    <div className="w-full overflow-hidden border-y border-border/40 py-8 mix-blend-multiply">
      <h2 className="font-display text-[15vw] font-black uppercase leading-none tracking-tighter text-text/90">
        {title}
      </h2>
    </div>
  );
}

function WorkItem({ work }: { work: CreativeWork }) {
  return (
    <div className="group flex w-[85vw] flex-none flex-col gap-4 sm:w-[500px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
        {work.mediaType === "image" ? (
          <Image
            src={work.media || "/placeholder.jpg"}
            alt={work.title || "Artwork"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-text-muted">
            {work.mediaType === "audio" ? "Audio Player Placeholder" : "Video Embed Placeholder"}
          </div>
        )}
      </div>
      <div className="flex justify-between font-sans text-sm font-medium text-text">
        <span>{work.title || "Untitled"}</span>
        {work.date && <span className="text-text-muted">{work.date}</span>}
      </div>
    </div>
  );
}

function DisciplineSection({ discipline }: { discipline: CreativeDiscipline }) {
  return (
    <div className="flex flex-col mb-32 last:mb-0">
      <AnimeReveal>
        <Banner title={discipline.name} />
      </AnimeReveal>

      {/* Intro details (Spotify/Insta/Poem) */}
      <div className="mx-auto w-full max-w-[2000px] px-6 py-12 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {discipline.poemContent && (
            <AnimeReveal delay={100}>
              <p className="max-w-[40ch] font-display text-2xl font-light italic leading-relaxed text-text lg:text-3xl">
                "{discipline.poemContent}"
              </p>
            </AnimeReveal>
          )}

          <div className="flex flex-col items-start gap-4 lg:col-start-2 lg:items-end">
            {discipline.instaHandle && (
              <a
                href={discipline.instaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium underline underline-offset-4 transition-colors hover:text-accent"
              >
                {discipline.instaHandle} ↗
              </a>
            )}
            {discipline.spotifyProfile && (
              <a
                href={discipline.spotifyProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium underline underline-offset-4 transition-colors hover:text-accent"
              >
                Spotify Profile ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Feed */}
      {discipline.works && discipline.works.length > 0 && (
        <AnimeReveal delay={200}>
          <div className="no-scrollbar mt-4 flex w-full snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-12 lg:px-12">
            {discipline.works.map((work) => (
              <div key={work.id} className="snap-center">
                <WorkItem work={work} />
              </div>
            ))}
          </div>
        </AnimeReveal>
      )}
    </div>
  );
}

export function Disciplines() {
  return (
    <section id="creative-work" className="w-full pt-24 pb-32">
      {artisticDisciplines.map((discipline) => (
        <DisciplineSection key={discipline.id} discipline={discipline} />
      ))}
    </section>
  );
}
