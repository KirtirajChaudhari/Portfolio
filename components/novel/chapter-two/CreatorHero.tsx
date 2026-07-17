"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { chapterTwoMeta } from "@/content/novel";

export function CreatorHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Simple fade up for the hero elements
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={heroRef}
      aria-label="Chapter Two — The Creator"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden pt-12"
    >
      {/* Crayon band behind title */}
      <div 
        data-hero-fade
        className="w-full bg-[var(--crayon-pink)] py-16 md:py-24"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
          <span className="type-serif mb-6 text-lg italic text-text md:text-xl">
            Chapter Two
          </span>
          <h2 
            className="type-heading text-[clamp(3.5rem,10vw,6rem)] leading-[0.9] tracking-tight text-text"
            style={{ textWrap: "balance" }}
          >
            {chapterTwoMeta.title}
          </h2>
        </div>
      </div>

      {/* Clean paper surface beneath */}
      <div className="mx-auto w-full max-w-4xl px-6 text-center mt-12 md:mt-16">
        <p
          data-hero-fade
          className="type-serif mx-auto max-w-md text-xl italic leading-relaxed text-text md:text-2xl"
        >
          {chapterTwoMeta.epigraph}
        </p>

        <span
          data-hero-fade
          className="type-hand mt-16 inline-block animate-bounce text-lg text-text-muted"
        >
          scroll, gently ↓
        </span>
      </div>
    </header>
  );
}
