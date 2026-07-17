"use client";

import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { FollowCursor } from "./FollowCursor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import {
  professionalAbout,
  professionalPrinciples,
  professionalMyStoryHref,
} from "@/content/professional";
import { siteMeta } from "@/content/shared";

/**
 * About section — karolinahess.com pattern (spec v3).
 * Prominent portrait, short punchy statement, numbered 01-03 list.
 */
export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading title="About Me" />
      </AnimeReveal>

      <div className="grid gap-12 tablet:grid-cols-[1fr_1.5fr] desktop:gap-24">
        {/* Left Col: Portrait Placeholder & Social/Contact */}
        <div className="flex flex-col gap-8">
          <AnimeReveal delay={100}>
            <div className="aspect-[3/4] w-full overflow-hidden bg-surface ring-1 ring-border">
              {/* Photo placeholder (stylized still from hero frames until supplied) */}
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0c1a30] to-[#060a14]">
                <span className="type-heading text-xl text-text-muted">Portrait</span>
              </div>
            </div>
          </AnimeReveal>

          <AnimeReveal delay={150}>
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${siteMeta.email}`}
                className="group flex items-center gap-3 transition-colors duration-200 hover:text-accent"
              >
                <Mail className="h-5 w-5 shrink-0" />
                <span className="text-[15px] font-medium text-text">{siteMeta.email}</span>
              </a>
              
              <div className="flex items-center gap-5 pt-2">
                {siteMeta.socials.github && (
                  <a
                    href={siteMeta.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-text-muted transition-colors duration-200 hover:text-accent"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </a>
                )}
                {siteMeta.socials.linkedin && (
                  <a
                    href={siteMeta.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-text-muted transition-colors duration-200 hover:text-accent"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </AnimeReveal>
        </div>

        {/* Right Col: Punchy statement & principles */}
        <div className="flex flex-col gap-16 pt-4">
          <div className="flex flex-col gap-6">
            <AnimeReveal delay={200}>
              <h3 className="type-heading text-[28px] font-normal leading-[1.2] text-text tablet:text-[36px] desktop:text-[42px]">
                {professionalAbout.lede}
              </h3>
            </AnimeReveal>
            <AnimeReveal delay={250}>
              <p
                className="max-w-[540px] text-[16px] font-light leading-[1.6] text-text-muted desktop:text-[18px]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {professionalAbout.detail}
              </p>
            </AnimeReveal>
          </div>

          {/* Numbered List (How I Work) */}
          <div className="flex flex-col">
            {professionalPrinciples.map((principle, i) => (
              <AnimeReveal key={principle.num} delay={300 + i * 50}>
                <div className="flex items-start gap-6 border-t border-border py-6 group hover:border-accent/40 transition-colors">
                  <span className="type-heading text-sm text-text-muted group-hover:text-accent transition-colors pt-1">
                    {principle.num}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-sans text-lg font-bold text-text">
                      {principle.title}
                    </h4>
                    <p className="font-sans text-base text-text-muted">
                      {principle.text}
                    </p>
                  </div>
                </div>
              </AnimeReveal>
            ))}
            <AnimeReveal delay={300 + professionalPrinciples.length * 50}>
              <div className="border-t border-border" />
            </AnimeReveal>
          </div>

          <AnimeReveal delay={500}>
            <FollowCursor label="My Story" className="self-start">
              <a
                href={professionalMyStoryHref}
                className="type-heading inline-flex items-center gap-2 rounded-full border border-border bg-surface px-8 py-3 text-[14px] font-semibold text-text transition-all duration-200 hover:border-accent/40 hover:bg-surface-2"
              >
                My Story
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </FollowCursor>
          </AnimeReveal>
        </div>
      </div>
    </section>
  );
}
