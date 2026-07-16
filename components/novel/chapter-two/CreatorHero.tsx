"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { KineticText } from "../Reveal";
import { chapterTwoMeta, musicSection } from "@/content/novel";

/*
 * The Creator — artistic cover page. A scrapbook spread rather than a
 * plain title: scattered taped snapshots drifting at different scroll
 * speeds, a hand-drawn ink swash beneath the serif title, handwritten
 * margin notes, coffee-ring and ink-blot stains. Same motion timing and
 * easing as the rest of the site — only the material is paper.
 */
export function CreatorHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Snapshots settle in with the chapter's tilt-settle grammar…
      gsap.utils.toArray<HTMLElement>("[data-hero-snap]").forEach((snap, i) => {
        const tilt = parseFloat(snap.dataset.tilt ?? "0");
        gsap.fromTo(
          snap,
          { opacity: 0, y: 60, rotate: tilt * 3 },
          { opacity: 1, y: 0, rotate: tilt, duration: 0.9, delay: 0.25 + i * 0.15, ease: "back.out(1.4)" }
        );
        // …then drift apart at individual speeds as the reader scrolls on.
        gsap.to(snap, {
          y: -40 - i * 45,
          rotate: tilt * 1.6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });

      // Ink swash draws itself under the title.
      const swash = el.querySelector<SVGPathElement>("[data-swash]");
      if (swash) {
        const len = swash.getTotalLength();
        gsap.fromTo(
          swash,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.1, delay: 0.7, ease: "power2.inOut" }
        );
      }

      gsap.from("[data-hero-note]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        delay: 1,
        stagger: 0.18,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={heroRef}
      aria-label="Chapter Two — The Creator"
      className="relative flex min-h-[88vh] items-center overflow-hidden"
    >
      {/* Stains */}
      <span className="coffee-ring" style={{ top: "12%", right: "14%" }} />
      <span className="coffee-ring" style={{ bottom: "18%", left: "8%", transform: "scale(0.7)" }} />
      <span className="ink-blot" style={{ top: "30%", left: "12%" }} />

      {/* Scattered snapshots — real fetched artwork, taped down */}
      <div
        data-hero-snap
        data-tilt="-7"
        className="polaroid absolute right-[6%] top-[10%] hidden w-40 md:block lg:w-48"
        style={{ "--tilt": "-7deg" } as React.CSSProperties}
      >
        <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-3" />
        <img
          src={musicSection.youtubeImage}
          alt="Stylized portrait of Kirtiraj against a sunset sky"
          className="block aspect-square w-full object-cover"
        />
        <span className="type-hand block py-2 text-center text-base text-[#44403c]">
          golden hour, once
        </span>
      </div>
      <div
        data-hero-snap
        data-tilt="5"
        className="polaroid absolute bottom-[14%] right-[16%] hidden w-36 lg:block"
        style={{ "--tilt": "5deg" } as React.CSSProperties}
      >
        <span className="tape -top-3 left-[16%] -rotate-6" />
        <img
          src={musicSection.artistImage}
          alt="Cover artwork from the debut single"
          className="block aspect-square w-full object-cover"
        />
        <span className="type-hand block py-2 text-center text-base text-[#44403c]">
          the first record
        </span>
      </div>
      <div
        data-hero-snap
        data-tilt="-4"
        className="polaroid absolute bottom-[10%] left-[4%] hidden w-32 md:block"
        style={{ "--tilt": "-4deg" } as React.CSSProperties}
      >
        <span className="tape -top-3 right-[14%] rotate-6" />
        {/* TODO(kirtiraj): swap for a notebook/poem photo when supplied */}
        <div className="polaroid-photo relative !aspect-square">
          <div className="film-placeholder" />
          <span className="type-hand absolute inset-x-0 bottom-2 text-center text-sm text-[#e9d6a0]">
            the notebook, soon
          </span>
        </div>
      </div>

      {/* Title block */}
      <div className="relative mx-auto w-full max-w-4xl px-6 text-center">
        <span data-hero-note className="type-hand block text-2xl text-accent md:text-3xl">
          chapter two, off the clock…
        </span>

        <KineticText
          as="h2"
          text={chapterTwoMeta.title}
          className="type-serif mt-4 text-[clamp(3.5rem,12vw,9rem)] font-light italic leading-[1.02] text-text"
        />

        {/* Hand-drawn ink swash */}
        <svg
          viewBox="0 0 420 28"
          aria-hidden
          className="mx-auto -mt-2 h-6 w-64 md:w-96"
          fill="none"
        >
          <path
            data-swash
            d="M8 18 C 90 6, 150 24, 215 14 S 350 8, 412 16"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>

        <p
          data-hero-note
          className="type-hand mx-auto mt-8 max-w-md text-xl leading-relaxed text-text-muted md:text-2xl"
        >
          {chapterTwoMeta.epigraph}
        </p>

        <span
          data-hero-note
          className="type-hand mt-14 inline-block animate-bounce text-lg text-text-muted"
        >
          scroll, gently ↓
        </span>
      </div>
    </header>
  );
}
