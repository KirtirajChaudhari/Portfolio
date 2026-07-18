"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import { professionalAbout, professionalPrinciples } from "@/content/professional";
import { avatarSet } from "@/content/shared";

/*
 * About Me — karolinahess.com mechanics (extraction spec):
 * one type family at one weight doing the hierarchy through size alone
 * (statement ≈ 2.7× support), portrait anchored beside the statement,
 * then a numbered 01–03 principles row with hairline rules.
 * Copy comes verbatim from content/professional.ts.
 */
export function EngineerStory() {
  return (
    <section id="about" aria-label="About Me" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <h2 className="type-heading text-4xl uppercase text-text md:text-5xl">About Me</h2>
      </Reveal>

      {/* Statement + portrait — statement leads, portrait grounds it */}
      <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-[minmax(0,1fr)_320px] md:gap-16">
        <div>
          <Reveal>
            <p className="max-w-[24ch] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.15] tracking-[-0.01em] text-text">
              {professionalAbout.lede}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-md text-base leading-relaxed text-text-muted md:ml-[38%]">
              {professionalAbout.detail}
            </p>
          </Reveal>
        </div>

        <Reveal className="md:pt-2">
          {/* Portrait slot — stands in with the site's identity render until a real photo is supplied */}
          <div className="relative aspect-[4/5] w-64 overflow-hidden rounded-lg border border-border md:w-full">
            <Image
              src={avatarSet.professional.hero}
              alt={avatarSet.professional.alt}
              fill
              sizes="(min-width: 768px) 320px, 256px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      {/* Principles — numbered blocks over hairline rules */}
      <div className="mt-24 grid grid-cols-1 gap-10 md:mt-28 md:grid-cols-3 md:gap-10">
        {professionalPrinciples.map((p, i) => (
          <Reveal key={p.num} delay={i * 0.08}>
            <span className="text-sm text-text-muted transition-colors duration-500">{p.num}</span>
            <div className="glass-panel group relative mt-2 overflow-hidden rounded-xl border border-border p-5 transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(var(--color-accent),0.15)]">
              {/* Changing Animation Motion Background */}
              <div className="pointer-events-none absolute -inset-[100%] z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-accent/15 to-transparent blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-medium text-text">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
