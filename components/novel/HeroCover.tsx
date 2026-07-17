"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useSwipe } from "@/hooks/useSwipe";
import { novelHero } from "@/content/novel";
import { avatarSet } from "@/content/shared";

/*
 * Chapter One hero — a pinned four-phase identity sequence scrubbed by
 * scroll, drawn from pre-split WebP frames on a <canvas> (video.currentTime
 * seeking stutters; decoded-frame swaps don't). The name sits in an
 * animated lower-third so the identity clips own the screen, and the
 * explainer phase is trimmed before the hand gesture, blink-cutting into
 * the closer.
 */

const STRIDE = 2; // every 2nd source frame — visually continuous at half the bytes

/* Canvas filter settings for frames — adjust to taste. */
const FRAME_FILTERS = {
  contrast: 1.25, // 1 = unchanged; > 1 = higher contrast (aids perceived sharpness)
  saturation: 1.2, // 1 = unchanged; > 1 = more vivid
  brightness: 1.05, // slight boost adds clarity without washing out
  sharpness: 1.1, // via filter-brightness (> 1 creates definition)
};

/* Loaded-frame count per phase (source frames / STRIDE).
 * explainer: trimmed at source frame 44 — the hand gesture starts ~48. */
const PHASE_FRAME_COUNTS: Record<string, number> = {
  boot: 120,
  builder: 120,
  explainer: 22,
  closer: 120,
};

const frameSrc = (dir: string, i: number) =>
  `${dir}/frame_${String(i * STRIDE).padStart(4, "0")}.webp`;

export function HeroCover() {
  const router = useRouter();
  const sectionRef = useSwipe<HTMLElement>({
    onSwipeLeft: () => router.push("/creator"),
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[][]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const phaseCount = novelHero.phases.length;
  const counts = novelHero.phases.map((p) => PHASE_FRAME_COUNTS[p.id] ?? 120);
  // Cumulative frame offsets: phase i spans [offsets[i], offsets[i+1]).
  const offsets = counts.reduce<number[]>((acc, c) => [...acc, acc[acc.length - 1] + c], [0]);
  const totalFrames = offsets[phaseCount];

  /* ——— Frame loading: concurrency-limited, coarse-to-fine ——— */
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = novelHero.phases.map(() => []);

    const queue: [number, number][] = [];
    const queued = new Set<string>();
    const push = (p: number, i: number) => {
      const key = `${p}:${i}`;
      if (!queued.has(key)) {
        queued.add(key);
        queue.push([p, i]);
      }
    };
    push(0, 0);
    for (let p = 0; p < phaseCount; p++) {
      for (let i = 0; i < counts[p]; i += 8) push(p, i);
    }
    for (let p = 0; p < phaseCount; p++) {
      for (let i = 0; i < counts[p]; i++) push(p, i);
    }

    const loadNext = () => {
      if (cancelled) return;
      const next = queue.shift();
      if (!next) return;
      const [p, i] = next;
      const img = new window.Image();
      img.src = frameSrc(novelHero.phases[p].frames, i);
      const done = () => {
        if (cancelled) return;
        loadNext();
      };
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[p][i] = img;
        if (p === 0 && i === 0) setFirstFrameReady(true);
        done();
      };
      img.onerror = done;
    };

    for (let c = 0; c < 6; c++) loadNext();

    return () => {
      cancelled = true;
    };
    // counts derive from static content — stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseCount]);

  /* ——— Canvas draw loop: lerped frame index, cover-fit, boundary dip ——— */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let smooth = 0;
    let lastDrawn = -1;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      lastDrawn = -1; // force redraw at new size
    };
    resize();
    window.addEventListener("resize", resize);

    const nearestLoaded = (phase: number, idx: number): HTMLImageElement | null => {
      const store = imagesRef.current[phase] ?? [];
      for (let d = 0; d < counts[phase]; d++) {
        if (store[idx - d]) return store[idx - d];
        if (store[idx + d]) return store[idx + d];
      }
      return null;
    };

    const draw = () => {
      const target = progressRef.current * (totalFrames - 1);
      smooth += (target - smooth) * 0.14;
      const global = Math.round(smooth);
      if (global === lastDrawn) return;

      let phase = phaseCount - 1;
      for (let p = 0; p < phaseCount; p++) {
        if (global < offsets[p + 1]) {
          phase = p;
          break;
        }
      }
      const local = Math.min(global - offsets[phase], counts[phase] - 1);
      const img = nearestLoaded(phase, local);
      if (!img) return;

      lastDrawn = global;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;

      ctx.filter = `contrast(${FRAME_FILTERS.contrast}) saturate(${FRAME_FILTERS.saturation}) brightness(${FRAME_FILTERS.brightness})`;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      ctx.filter = "none";

      // Blink-cut between clips: brief dark dip near interior phase boundaries.
      let toBoundary = Infinity;
      for (let k = 1; k < phaseCount; k++) {
        toBoundary = Math.min(toBoundary, Math.abs(global - offsets[k]));
      }
      if (toBoundary < 4) {
        ctx.fillStyle = `rgba(4, 6, 10, ${(1 - toBoundary / 4) * 0.7})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    };

    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
    // offsets/counts derive from static content — stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseCount, totalFrames]);

  /* ——— Pin + scrub timeline: captions and the lower-third title ——— */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Timeline spans 1 unit == full pin scroll; positions are proportions.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Phase captions crossfade at each phase's PROPORTIONAL boundary
      // (the trimmed explainer occupies less scroll than the others).
      const captions = gsap.utils.toArray<HTMLElement>("[data-phase-caption]");
      captions.forEach((cap, i) => {
        const inPos = offsets[i] / totalFrames;
        const outPos = offsets[i + 1] / totalFrames;
        if (i === 0) {
          tl.to(cap, { autoAlpha: 0, duration: 0.04 }, outPos - 0.04);
        } else {
          tl.fromTo(cap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, inPos - 0.02);
          if (i < captions.length - 1) {
            tl.to(cap, { autoAlpha: 0, duration: 0.04 }, outPos - 0.04);
          }
        }
      });

      /* Lower-third title choreography:
       * letters rise on entry; on scroll the block drifts up with a slow
       * parallax, tracking widens, and the scrim thins so the closer's
       * final frame reads almost clean. */
      gsap.from("[data-hero-letter]", {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.2,
      });
      gsap.from("[data-hero-sub]", {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.9,
      });

      const letterCount = novelHero.name.length;
      tl.to(
        "[data-hero-letter]",
        { x: (i) => (i - (letterCount - 1) / 2) * 7, ease: "none", duration: 1 },
        0
      );
      tl.to("[data-hero-title]", { yPercent: -22, ease: "none", duration: 1 }, 0);
      tl.to(".hero-fade-out", { opacity: 0, ease: "none", duration: 0.35 }, 0.5);
    }, section);

    return () => ctx.revert();
    // sectionRef is a stable ref from useSwipe; offsets derive from static content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseCount, totalFrames]);

  const letters = novelHero.name.split("");

  return (
    <section
      ref={sectionRef}
      id="cover"
      aria-label="Kirtiraj Chaudhari — cinematic hero"
      className="relative h-svh overflow-hidden bg-bg"
      onTouchStart={() => setHintDismissed(true)}
    >
      {/* Pulse placeholder until the first frame is decoded */}
      {!firstFrameReady && (
        <div className="absolute inset-0 animate-pulse bg-surface-2">
          <span className="absolute bottom-6 right-6 rounded border border-border px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-text-muted">
            LOADING FRAMES · HIGGSFIELD
          </span>
        </div>
      )}

      {/* Frame-scrub canvas — the star of the frame */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          firstFrameReady ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Whisper-light global veil — the avatar stays bright */}
      <div className="absolute inset-0 bg-black/10" />
      {/* Lower-third scrim for type readability & smooth transition into next section */}
      <div
        data-hero-scrim
        className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-bg via-bg/60 to-transparent"
      />

      {/* Phase captions */}


      {/* Lower-third: name left, subtitle right — the face stays clear */}
      <div
        data-hero-title
        className="pointer-events-none absolute inset-x-0 bottom-24 z-20 px-6 md:bottom-28 md:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1 aria-label={`${novelHero.name} ${novelHero.surname}`} className="type-heading leading-[0.9] text-text">
            <span aria-hidden className="block overflow-hidden text-[clamp(2.75rem,8vw,6rem)]">
              {letters.map((ch, i) => (
                <span key={i} data-hero-letter className="inline-block will-change-transform">
                  {ch}
                </span>
              ))}
            </span>
            <span aria-hidden className="block text-[clamp(1.1rem,3vw,2.2rem)] tracking-[0.42em] text-text/75">
              {novelHero.surname}
            </span>
          </h1>
          <p
            data-hero-sub
            className="max-w-md border-l-2 border-accent pl-4 text-sm leading-relaxed text-white/75 md:pb-2 md:text-base"
          >
            {novelHero.subtitle}
          </p>
        </div>
      </div>

      {/* Chapter toggle pill */}
      <div className="hero-fade-out absolute bottom-8 left-1/2 z-30 -translate-x-1/2 md:bottom-9">
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => scrollToTarget("#chapter-one")}
            className="group flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
            <span className="type-heading whitespace-nowrap">CH. 1</span>
          </button>
          <span className="h-4 w-px bg-white/20" />
          <button
            type="button"
            onClick={() => router.push("/creator")}
            className="group flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="type-serif italic whitespace-nowrap">Ch. 2</span>
            <span className="h-2 w-2 rounded-full bg-white/40 transition-transform duration-300 group-hover:scale-125" />
          </button>
        </div>
      </div>

      {/* Swipe hint — touch only, first load */}
      {!hintDismissed && (
        <div className="hero-fade-out pointer-events-none absolute bottom-2.5 left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] tracking-[0.25em] text-white/50 md:hidden">
          <span className="swipe-hint-arrow">←</span>
          {novelHero.swipeHint}
        </div>
      )}

      <div className="hero-fade-out pointer-events-none absolute right-6 top-6 z-20 hidden text-[10px] tracking-[0.4em] text-white/40 md:right-10 md:top-10 md:block">
        SCROLL TO OPEN
      </div>
    </section>
  );
}
