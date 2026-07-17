"use client";

import { KineticText, Reveal } from "./Reveal";
import { finale } from "@/content/novel";
import { siteMeta } from "@/content/shared";

/** Epilogue — the recruiter CTA, then the book closes. */
export function Finale() {
  return (
    <footer aria-label="Contact" className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
        <Reveal>
          <span className="type-serif text-lg italic text-accent md:text-xl">
            {finale.kicker}
          </span>
        </Reveal>
        <KineticText
          as="h2"
          text={finale.headline}
          className="type-heading mt-6 text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.95] text-text"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
            {finale.body}
          </p>
        </Reveal>

        <Reveal delay={0.25} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={finale.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-widest text-bg transition-transform duration-300 hover:scale-105"
          >
            {finale.primaryCta.label.toUpperCase()}
          </a>
          {finale.secondaryCtas.map((cta) => (
            <a
              key={cta.label}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-8 py-4 text-sm tracking-widest text-text transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {cta.label.toUpperCase()}
            </a>
          ))}
        </Reveal>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <span className="text-xs tracking-widest text-text-muted">
            © 2026 {siteMeta.fullName}
          </span>
          <div className="flex items-center gap-6 text-xs tracking-widest text-text-muted">
            <a href={siteMeta.socials.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">GITHUB</a>
            <a href={siteMeta.socials.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">LINKEDIN</a>
            <a href={`mailto:${siteMeta.email}`} className="transition-colors hover:text-accent">EMAIL</a>
          </div>
          <span className="type-serif text-xs italic text-text-muted">{finale.closing}</span>
        </div>
      </div>
    </footer>
  );
}
