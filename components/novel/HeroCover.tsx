"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useSwipe } from "@/hooks/useSwipe";
import { novelHero } from "@/content/novel";
import { avatarSet } from "@/content/shared";
import { ModeToggle } from "@/components/ui/ModeToggle";

/*
 * Chapter One hero — a pinned four-phase identity sequence scrubbed by
 * scroll, drawn from pre-split WebP frames on a <canvas> (video.currentTime
 * seeking stutters; decoded-frame swaps don't). The name sits in an
 * animated lower-third so the identity clips own the screen, and the
 * explainer phase is trimmed before the hand gesture, blink-cutting into
 * the closer.
 */

/*
 * Per-phase frame selection table.
 * getSourceFrame maps a logical frame index to the physical source frame.
 * count is the total number of logical frames.
 */
type PhaseConfig = {
  suffix: string;
  count: number;
  getSourceFrame: (i: number) => number;
};

const PHASE_CONFIG: Record<string, PhaseConfig> = {
  // boot: all 240 src, stride 4 = 60 frames
  boot: { 
    suffix: "", 
    count: 60, 
    getSourceFrame: (i) => i * 4 
  },
  // builder: skip intro (src 40-239), stride 5 = 40 frames
  builder: { 
    suffix: "_out", 
    count: 40, 
    getSourceFrame: (i) => 40 + i * 5 
  },
  // explainer: frames 0-48 (stride 4) then morph to 192-239 (stride 4) -> 25 frames total
  // 0-48 (13 frames: 0, 4, ... 48) | 192-236 (12 frames: 192, 196, ... 236)
  explainer: { 
    suffix: "_out", 
    count: 25, 
    getSourceFrame: (i) => (i < 13 ? i * 4 : 192 + (i - 13) * 4)
  },
  // closer: reduced frames, src 0-239, stride 8 = 30 frames
  closer: { 
    suffix: "_out", 
    count: 30, 
    getSourceFrame: (i) => i * 8 
  },
};

/** Resolve the actual source filename for logical frame i in a given phase. */
const frameSrc = (dir: string, phaseId: string, i: number) => {
  const cfg = PHASE_CONFIG[phaseId] ?? PHASE_CONFIG.boot;
  const src = cfg.getSourceFrame(i);
  return `${dir}/frame_${String(src).padStart(4, "0")}${cfg.suffix}.webp`;
};

/* Canvas filter settings — enhance rendered frames. */
const FRAME_FILTERS = {
  contrast: 1.25,
  saturation: 1.2,
  brightness: 1.05,
};

export function HeroCover() {
  const router = useRouter();
  const sectionRef = useSwipe<HTMLElement>({
    onSwipeLeft: () => router.push("/creator"),
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const imagesRef = useRef<(HTMLImageElement | ImageBitmap)[][]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const phaseCount = novelHero.phases.length;
  const counts = novelHero.phases.map((p) => PHASE_CONFIG[p.id]?.count ?? 60);
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
    // ─── 3-tier load priority ───────────────────────────────────────────
    // Tier 1: first frame of phase 0 → paint something immediately.
    push(0, 0);
    // Tier 2: every 10th frame of every phase → skeleton skeleton in < 1 s.
    for (let p = 0; p < phaseCount; p++) {
      for (let i = 0; i < counts[p]; i += 10) push(p, i);
    }
    // Tier 3: remaining frames — fill gaps for silky scrub.
    for (let p = 0; p < phaseCount; p++) {
      for (let i = 0; i < counts[p]; i++) push(p, i);
    }

    const loadNext = () => {
      if (cancelled) return;
      const next = queue.shift();
      if (!next) return;
      const [p, i] = next;
      const src = frameSrc(novelHero.phases[p].frames, novelHero.phases[p].id, i);
      const done = () => {
        if (cancelled) return;
        loadNext();
      };
      
      // Use createImageBitmap for truly off-thread decoding (bypasses main-thread DOM jank completely)
      fetch(src)
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob))
        .then(bitmap => {
          if (cancelled) return;
          imagesRef.current[p][i] = bitmap;
          if (p === 0 && i === 0) setFirstFrameReady(true);
          done();
        })
        .catch(e => {
          // Fallback: if browser lacks support or network fails, try classic Image
          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            if (cancelled) return;
            imagesRef.current[p][i] = img;
            done();
          };
          img.onerror = done;
        });
    };

    // 20 concurrent loaders — fills frames rapidly
    for (let c = 0; c < 20; c++) loadNext();

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

    const nearestLoaded = (phase: number, idx: number): HTMLImageElement | ImageBitmap | null => {
      const store = imagesRef.current[phase] ?? [];
      for (let d = 0; d < counts[phase]; d++) {
        if (store[idx - d]) return store[idx - d];
        if (store[idx + d]) return store[idx + d];
      }
      return null;
    };

    const draw = () => {
      const target = progressRef.current * (totalFrames - 1);
      // Lerp factor 0.05 → extremely silky easing between frames, removes all stutter
      smooth += (target - smooth) * 0.05;
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
      tl.to(".hero-fade-out", { autoAlpha: 0, ease: "none", duration: 0.35 }, 0.5);
      tl.to(".chapter-toggle-globes", { autoAlpha: 0, ease: "none", duration: 0.15 }, offsets[1] / totalFrames);
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

      {/* Chapter toggle globes */}
      <div className="chapter-toggle-globes absolute bottom-8 md:bottom-12 left-1/2 z-30 -translate-x-1/2 transform scale-75 md:scale-90 lg:scale-100 origin-bottom">
        <ModeToggle onModeChange={(newMode) => {
          if (newMode === "professional") {
            scrollToTarget("#chapter-one");
          } else {
            router.push("/creator");
          }
        }} />
      </div>

      {/* Swipe hint — touch only, first load */}
      {!hintDismissed && (
        <div className="hero-fade-out pointer-events-none absolute bottom-2.5 left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] tracking-[0.25em] text-white/50 md:hidden">
          <span className="swipe-hint-arrow">←</span>
          {novelHero.swipeHint}
        </div>
      )}

    </section>
  );
}
