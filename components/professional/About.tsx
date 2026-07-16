"use client";

import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { FollowCursor } from "./FollowCursor";
import { CountUpStat } from "./CountUpStat";
import {
  professionalAbout,
  professionalAchievements,
  professionalMyStoryHref,
} from "@/content/professional";
import { siteMeta } from "@/content/shared";

/**
 * About section — per hero-service-about-spec.md.
 *
 * Absorbs:
 *   - Stat counters (previously Achievements.tsx)
 *   - Contact info cards (previously Contact.tsx)
 *   - Social icons
 *   - "My Story" CTA → anchors to #timeline
 *
 * Full viewport height on desktop. Uses shared FollowCursor for
 * social icons + My Story button (same implementation as Service accordion).
 */
export function About() {
  return (
    <section
      id="about"
      className="flex min-h-dvh items-center py-24"
    >
      <div className="mx-auto flex w-full max-w-[1200px] px-6 tablet:px-10">
        {/* About Wrap — left-aligned, max 600px per spec */}
        <div className="flex w-full max-w-[600px] flex-col gap-10">
          {/* ——— Text wrap ——— */}
          <div className="flex flex-col gap-2.5">
            <h2 className="type-heading text-[42px] font-bold leading-[1.3] text-text tablet:text-[48px] desktop:text-[60px]">
              About
            </h2>
            <p
              className="max-w-[500px] text-[16px] font-light leading-[1.5] text-text-muted desktop:text-[18px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {professionalAbout.description}
            </p>
          </div>

          {/* ——— Number Card Wrap — 3-col grid of count-up stats ——— */}
          {/* TODO(kirtiraj): confirm these numbers before shipping — derived from content data */}
          <div className="grid grid-cols-2 gap-6 tablet:grid-cols-3">
            {professionalAchievements.map((stat) => (
              <CountUpStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </div>

          {/* ——— Contact Info Grid ——— */}
          <div className="grid gap-4 tablet:grid-cols-3">
            {/* Email card */}
            <FollowCursor label="Email" className="tablet:col-span-2">
              <a
                href={`mailto:${siteMeta.email}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors duration-200 hover:border-accent/40 motion-reduce:transition-none"
              >
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="min-w-0 truncate text-[14px] font-medium text-text">
                  {siteMeta.email}
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </FollowCursor>

            {/* Location card */}
            <FollowCursor label="Location">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                <span className="text-[14px] font-medium text-text">
                  {siteMeta.location}
                </span>
              </div>
            </FollowCursor>
          </div>

          {/* ——— Social Icon Wrap ——— */}
          <div className="flex items-center gap-5">
            {siteMeta.socials.github && (
              <FollowCursor label="GitHub">
                <a
                  href={siteMeta.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent motion-reduce:transition-none"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
              </FollowCursor>
            )}
            {siteMeta.socials.linkedin && (
              <FollowCursor label="LinkedIn">
                <a
                  href={siteMeta.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent motion-reduce:transition-none"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </FollowCursor>
            )}
          </div>

          {/* ——— "My Story" CTA ——— */}
          <FollowCursor label="My Story" className="self-start">
            <a
              href={professionalMyStoryHref}
              className="type-heading inline-flex items-center gap-2 rounded-full border border-border bg-surface px-8 py-3 text-[14px] font-semibold text-text transition-all duration-200 hover:border-accent/40 hover:bg-surface-2 motion-reduce:transition-none"
            >
              My Story
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </FollowCursor>
        </div>
      </div>
    </section>
  );
}
