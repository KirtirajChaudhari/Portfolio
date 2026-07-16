"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useSwipe } from "@/hooks/useSwipe";
import { useFinePointer } from "@/hooks/useFinePointer";
import { novelHero } from "@/content/novel";
import { avatarSet } from "@/content/shared";
import { NeuralObject } from "./NeuralObject";

/*
 * Chapter One hero (spec v2): a pinned four-phase identity sequence —
 * boot / builder / explainer / closer — crossfaded by scroll, with a
 * neural-network object whose 3D rotation is driven directly by scroll
 * progress. Missing clips render a pulse placeholder, never a stand-in
 * image (identity clips must be the real Higgsfield likeness).
 */
export function HeroCover() {
  const router = useRouter();
  const sectionRef = useSwipe<HTMLElement>({
    onSwipeLeft: () => router.push("/creator"),
  });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressRef = useRef(0);
  const finePointer = useFinePointer();

  const [videoOk, setVideoOk] = useState<boolean[]>(() =>
    novelHero.phases.map(() => false)
  );
  const [hintDismissed, setHintDismissed] = useState(false);

  const phaseCount = novelHero.phases.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
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

      // The signature moment: object rotation is the scroll.
      tl.to(
        "[data-neural-object]",
        { rotateY: 540, rotateX: 18, ease: "none", duration: phaseCount },
        0
      );

      // Crossfade phases — one per scroll quarter.
      const slots = gsap.utils.toArray<HTMLElement>("[data-phase-slot]");
      slots.forEach((slot, i) => {
        if (i === 0) {
          tl.to(slot, { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.8);
        } else {
          tl.fromTo(
            slot,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.35, ease: "none" },
            i - 0.2
          );
          if (i < slots.length - 1) {
            tl.to(slot, { autoAlpha: 0, duration: 0.35, ease: "none" }, i + 0.8);
          }
        }
      });

      // Phase captions follow their slots.
      const captions = gsap.utils.toArray<HTMLElement>("[data-phase-caption]");
      captions.forEach((cap, i) => {
        if (i === 0) {
          tl.to(cap, { autoAlpha: 0, duration: 0.3 }, 0.8);
        } else {
          tl.fromTo(cap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, i - 0.2);
          if (i < captions.length - 1) {
            tl.to(cap, { autoAlpha: 0, duration: 0.3 }, i + 0.8);
          }
        }
      });

      // Name: letter tracking widens as the book opens; chrome fades late.
      gsap.from("[data-hero-letter]", {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.045,
        delay: 0.2,
      });
      const letterCount = novelHero.name.length;
      tl.to(
        "[data-hero-letter]",
        { x: (i) => (i - (letterCount - 1) / 2) * 9, ease: "none", duration: phaseCount },
        0
      );
      tl.to(".hero-fade-out", { opacity: 0, ease: "none", duration: 0.5 }, 0.5);
    }, section);

    return () => ctx.revert();
    // sectionRef is a stable ref object from useSwipe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseCount]);

  // Desktop: lerp the ACTIVE clip's currentTime toward its share of progress.
  useEffect(() => {
    if (!finePointer) return;

    const tick = () => {
      const p = progressRef.current * phaseCount;
      const active = Math.min(Math.floor(p), phaseCount - 1);
      const local = p - active;
      const video = videoRefs.current[active];
      if (!video || !video.duration || Number.isNaN(video.duration)) return;
      const target = local * Math.max(video.duration - 0.08, 0);
      const next = video.currentTime + (target - video.currentTime) * 0.12;
      if (Math.abs(next - video.currentTime) > 0.001) {
        video.currentTime = next;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [finePointer, phaseCount]);

  const handleReady = (i: number) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoOk((prev) => prev.map((v, j) => (j === i ? true : v)));
    if (!finePointer) {
      e.currentTarget.play().catch(() => {});
    } else {
      e.currentTarget.pause();
    }
  };

  const letters = `${novelHero.name}`.split("");

  return (
    <section
      ref={sectionRef}
      id="cover"
      aria-label="Kirtiraj Chaudhari — cinematic hero"
      className="relative h-screen overflow-hidden bg-bg"
      onTouchStart={() => setHintDismissed(true)}
    >
      {/* Identity clip slots */}
      {novelHero.phases.map((phase, i) => (
        <div
          key={phase.id}
          data-phase-slot
          className="absolute inset-0"
          style={i > 0 ? { opacity: 0, visibility: "hidden" } : undefined}
        >
          {/* Pulse placeholder until the real Higgsfield clip exists */}
          {!videoOk[i] && (
            <div className="absolute inset-0 animate-pulse bg-zinc-800">
              <span className="absolute bottom-6 right-6 rounded border border-zinc-600 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-zinc-400">
                CLIP PENDING · HIGGSFIELD · {phase.id.toUpperCase()}
              </span>
            </div>
          )}
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={phase.video}
            muted
            playsInline
            loop={!finePointer}
            preload={i === 0 ? "auto" : "metadata"}
            onLoadedData={handleReady(i)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoOk[i] ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Readability overlay between clip and type */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Scroll-rotating 3D object */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <NeuralObject />
      </div>

      {/* Name + subtitle */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <h1
          aria-label={`${novelHero.name} ${novelHero.surname}`}
          className="type-heading text-center leading-[0.9] text-[#F5F5F0] mix-blend-difference"
        >
          <span aria-hidden className="block overflow-hidden text-[clamp(3.5rem,13vw,11rem)]">
            {letters.map((ch, i) => (
              <span key={i} data-hero-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          <span aria-hidden className="block text-[clamp(1.6rem,5.5vw,4.5rem)] tracking-[0.3em] opacity-80">
            {novelHero.surname}
          </span>
        </h1>
        <p className="hero-fade-out mt-8 max-w-2xl text-center text-sm leading-relaxed text-white/70 md:text-base">
          {novelHero.subtitle}
        </p>
      </div>

      {/* Phase captions */}
      <div className="pointer-events-none absolute left-6 top-6 z-20 md:left-10 md:top-10">
        {novelHero.phases.map((phase, i) => (
          <span
            key={phase.id}
            data-phase-caption
            className="type-heading absolute left-0 top-0 whitespace-nowrap text-[11px] tracking-[0.35em] text-white/60 md:text-xs"
            style={i > 0 ? { opacity: 0, visibility: "hidden" } : undefined}
          >
            {String(i + 1).padStart(2, "0")} — {phase.label}
          </span>
        ))}
      </div>

      {/* Chapter toggle pill */}
      <div className="hero-fade-out absolute bottom-24 left-1/2 z-30 -translate-x-1/2 md:bottom-14">
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => scrollToTarget("#chapter-one")}
            className="group flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Image
              src={avatarSet.professional.icon}
              alt=""
              width={22}
              height={22}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="type-heading whitespace-nowrap">CH. 1</span>
          </button>
          <span className="h-4 w-px bg-white/20" />
          <button
            type="button"
            onClick={() => router.push("/creator")}
            className="group flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="type-serif italic whitespace-nowrap">Ch. 2</span>
            <Image
              src={avatarSet.artistic.icon}
              alt=""
              width={22}
              height={22}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        </div>
      </div>

      {/* Swipe hint — touch only, first load */}
      {!hintDismissed && (
        <div className="hero-fade-out pointer-events-none absolute bottom-10 left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[11px] tracking-[0.25em] text-white/50 md:hidden">
          <span className="swipe-hint-arrow">←</span>
          {novelHero.swipeHint}
        </div>
      )}

      <div className="hero-fade-out pointer-events-none absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 text-[10px] tracking-[0.4em] text-white/40 md:block">
        SCROLL TO OPEN
      </div>
    </section>
  );
}
