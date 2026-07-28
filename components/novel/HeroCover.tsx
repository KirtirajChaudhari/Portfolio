"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useSwipe } from "@/hooks/useSwipe";
import { novelHero } from "@/content/novel";
import { ModeToggle } from "@/components/ui/ModeToggle";

/*
 * Chapter One hero — a pinned four-phase identity sequence scrubbed by
 * scroll via <video> currentTime on /videos/hero-scrub.mp4. The video is
 * pre-baked from the trimmed frame edit (boot 0-59 + builder 0-59 +
 * explainer 0-49,194-204 + closer 144-203) with a 6-frame GOP so seeks
 * stay cheap — no runtime frame mapping needed.
 */

/* Logical frame counts per phase — must match the baked hero-scrub.mp4 edit. */
const PHASE_COUNTS: Record<string, number> = {
  boot: 60,
  builder: 60,
  explainer: 61,
  closer: 60,
};

/* Video filter settings — enhance rendered frames. */
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const blinkRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const phaseCount = novelHero.phases.length;
  const counts = novelHero.phases.map((p) => PHASE_COUNTS[p.id] ?? 60);
  // Cumulative frame offsets: phase i spans [offsets[i], offsets[i+1]).
  const offsets = counts.reduce<number[]>((acc, c) => [...acc, acc[acc.length - 1] + c], [0]);
  const totalFrames = offsets[phaseCount];

  /* ——— Video scrub: currentTime driven by scroll progress, boundary dip ——— */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS blocks programmatic seeking until the video has played once;
    // play() -> pause() unlocks it before any frame paints.
    const onLoaded = () => {
      setFirstFrameReady(true);
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };
    if (video.readyState >= 2) {
      onLoaded();
    } else {
      video.addEventListener("loadeddata", onLoaded);
    }

    let lastTime = -1;

    const scrub = () => {
      const duration = video.duration;
      if (!duration) return;

      const t = progressRef.current * duration;
      if (Math.abs(t - lastTime) > 0.02) {
        video.currentTime = t;
        lastTime = t;
      }

      // Blink-cut between clips: brief dark dip near interior phase boundaries.
      const global = progressRef.current * (totalFrames - 1);
      let toBoundary = Infinity;
      for (let k = 1; k < phaseCount; k++) {
        toBoundary = Math.min(toBoundary, Math.abs(global - offsets[k]));
      }
      if (blinkRef.current) {
        blinkRef.current.style.opacity =
          toBoundary < 4 ? String((1 - toBoundary / 4) * 0.7) : "0";
      }
    };

    gsap.ticker.add(scrub);
    return () => {
      gsap.ticker.remove(scrub);
      video.removeEventListener("loadeddata", onLoaded);
    };
    // offsets derive from static content — stable across renders.
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
          end: "+=250%",
          pin: true,
          scrub: 0.15,
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

      {/* Scroll-scrubbed video — the star of the frame */}
      <video
        ref={videoRef}
        aria-hidden
        muted
        playsInline
        preload="auto"
        src="/videos/hero-scrub.mp4"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          firstFrameReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          filter: `contrast(${FRAME_FILTERS.contrast}) saturate(${FRAME_FILTERS.saturation}) brightness(${FRAME_FILTERS.brightness})`,
        }}
      />
      {/* Blink-cut dip overlay, driven imperatively from the scrub ticker */}
      <div
        ref={blinkRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#04060a] opacity-0"
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
