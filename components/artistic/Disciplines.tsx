"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { artisticDisciplines } from "@/content/artistic";
import { Music, Camera, PenTool, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

const DISCIPLINE_ICON: Record<string, LucideIcon> = {
  music: Music,
  photography: Camera,
  writing: PenTool,
};

export function Disciplines() {
  const [activeTab, setActiveTab] = useState(artisticDisciplines[0]?.id ?? "");
  const activeDiscipline = artisticDisciplines.find((d) => d.id === activeTab);

  return (
    <section id="creative-work" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Creative Work"
          title="Different outlets, same curiosity"
          description="Exploring sound, light, and words as extensions of how I think."
        />
      </AnimeReveal>

      {/* Tabs */}
      <AnimeReveal delay={100}>
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {artisticDisciplines.map((discipline) => {
            const Icon = DISCIPLINE_ICON[discipline.id] || Music;
            const isActive = activeTab === discipline.id;
            return (
              <button
                key={discipline.id}
                onClick={() => setActiveTab(discipline.id)}
                className={`
                  inline-flex items-center gap-2 rounded-full px-6 py-3
                  text-sm font-medium transition-all duration-500
                  motion-reduce:transition-none
                  ${
                    isActive
                      ? "bg-accent text-bg shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-105"
                      : "border border-border bg-surface text-text-muted hover:border-accent/40 hover:text-text hover:bg-surface-2 hover:scale-105"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {discipline.name}
              </button>
            );
          })}
        </div>
      </AnimeReveal>

      {/* Tab content */}
      <div className="min-h-[500px]">
        {activeDiscipline?.id === "music" && (
          <AnimeReveal key="music" direction="up" className="mx-auto max-w-3xl">
            <GlassCard className="relative overflow-hidden p-8 sm:p-12">
              {/* Decorative glow */}
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-accent-glow/20 blur-[80px]" aria-hidden="true" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Headphones className="h-8 w-8 text-accent" />
                </div>
                
                <h3 className="mb-8 font-display text-2xl font-bold text-text">Debut Single</h3>
                
                {/* Spotify Embed */}
                {activeDiscipline.spotifyEmbedUrl ? (
                  <div className="w-full max-w-md overflow-hidden rounded-xl shadow-lg ring-1 ring-border transition-all duration-300 hover:shadow-accent/20">
                    <iframe 
                      src={activeDiscipline.spotifyEmbedUrl} 
                      width="100%" 
                      height="152" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      className="border-0 bg-transparent"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-full max-w-md items-center justify-center rounded-xl border border-dashed border-border bg-surface-2 text-sm text-text-muted">
                    Spotify Embed Placeholder
                  </div>
                )}
                
                {activeDiscipline.spotifyProfile && (
                  <a
                    href={activeDiscipline.spotifyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-6 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-bg hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    View Artist Profile on Spotify
                  </a>
                )}
              </div>
            </GlassCard>
          </AnimeReveal>
        )}

        {activeDiscipline?.id === "photography" && (
          <AnimeReveal key="photography" direction="up" staggerChildren staggerDelay={100} className="relative">
            <div className="mb-10 flex justify-center">
              {activeDiscipline.instaLink && (
                <a
                  href={activeDiscipline.instaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-2 text-sm text-text transition-colors hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400 backdrop-blur-md"
                >
                  <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>{activeDiscipline.instaHandle}</span>
                </a>
              )}
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {activeDiscipline.works.map((work) => (
                <div key={work.id} className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-surface-2">
                  {/* Aspect ratio can vary in masonry, using a default padding trick or just letting the image dictate height */}
                  <div className="relative w-full overflow-hidden" style={{ minHeight: "250px", height: "auto" }}>
                    <Image
                      src={work.media || "/avatars/professional-full.png"}
                      alt={work.title}
                      width={600}
                      height={800}
                      className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bg/90 via-bg/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h4 className="font-display text-lg font-medium text-text">{work.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimeReveal>
        )}

        {activeDiscipline?.id === "writing" && (
          <AnimeReveal key="writing" direction="up" className="mx-auto max-w-2xl">
            <div className="relative">
              {/* Large quote marks in background */}
              <div className="pointer-events-none absolute -top-10 -left-10 text-9xl text-accent/10 font-serif">
                &ldquo;
              </div>
              
              <div className="prose prose-invert prose-lg mx-auto text-center font-serif leading-loose">
                {activeDiscipline.works && activeDiscipline.works.length > 0 && (
                  <div className="mb-8 flex justify-center">
                    <div className="relative h-48 w-48 overflow-hidden rounded-full border border-border shadow-2xl transition-transform duration-500 hover:scale-105">
                      <Image
                        src={activeDiscipline.works[0].media}
                        alt="Writer Profile Screenshot"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {activeDiscipline.poemContent?.split('\n').map((line, i) => (
                  <p key={i} className={`m-0 ${line.trim() === '' ? 'h-6' : 'text-text-muted drop-shadow-sm'}`}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="pointer-events-none absolute -bottom-20 -right-10 text-9xl text-accent/10 font-serif">
                &rdquo;
              </div>

              <div className="mt-16 flex justify-center">
                {activeDiscipline.instaLink && (
                  <a
                    href={activeDiscipline.instaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 border-b border-border pb-1 text-sm text-text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <PenTool className="h-4 w-4" />
                    Read more on {activeDiscipline.instaHandle}
                  </a>
                )}
              </div>
            </div>
          </AnimeReveal>
        )}
      </div>
    </section>
  );
}
