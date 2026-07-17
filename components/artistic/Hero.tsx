"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Camera, Feather, Music } from "lucide-react";
import { artisticHero } from "@/content/artistic";
import { avatarSet } from "@/content/shared";

interface Ornament {
  icon: typeof Music;
  position: string;
  rotate: number;
  gradient: string;
}

const emptySubscribe = () => () => {};

/** False during SSR/hydration, true once the DOM refs are real. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const ORNAMENTS: Ornament[] = [
  {
    icon: Music,
    position: "left-[10%] top-[18%]",
    rotate: -10,
    gradient: "from-white/10 to-white/5",
  },
  {
    icon: Camera,
    position: "right-[12%] top-[26%]",
    rotate: 8,
    gradient: "from-white/10 to-white/5",
  },
  {
    icon: Feather,
    position: "left-[16%] bottom-[16%]",
    rotate: -6,
    gradient: "from-white/10 to-white/5",
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked values need a mounted DOM ref before they're meaningful
  const mounted = useMounted();
  const motionOK = mounted && !prefersReducedMotion;

  const sectionInView = useInView(sectionRef, { amount: 0.25 });
  const bioInView = useInView(bioRef, { amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="relative overflow-hidden">
      {/* Neutral background layer */}
      <div
        className="absolute inset-0 bg-bg"
        aria-hidden="true"
      />
      <div
        className="absolute top-[10%] left-1/4 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]"
        aria-hidden="true"
      />

      {/* ——— First viewport: heading over portrait, ornaments around ——— */}
      <section
        ref={sectionRef}
        className="relative flex h-screen items-center justify-center px-6"
      >
        {ORNAMENTS.map(({ icon: Icon, position, rotate, gradient }) => (
          <motion.div
            key={position}
            drag={motionOK}
            dragMomentum={false}
            whileHover={motionOK ? { scale: 1.05 } : undefined}
            // Keep ornament drags from reaching the shell's mode-switch swipe
            onTouchStart={(e) => e.stopPropagation()}
            style={{ rotate }}
            className={`absolute z-[1] hidden h-24 w-24 items-center justify-center rounded-[22px] bg-gradient-to-br shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:flex ${position} ${gradient} ${
              motionOK ? "cursor-grab active:cursor-grabbing" : ""
            }`}
            aria-hidden="true"
          >
            <Icon className="h-9 w-9 text-bg" strokeWidth={1.75} />
          </motion.div>
        ))}

        {/* Portrait — scroll-driven drift behind the heading */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ opacity: motionOK && !sectionInView ? 0.7 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={
              motionOK
                ? { y: portraitY, scale: portraitScale, rotate: portraitRotate }
                : undefined
            }
            className="sticky top-[18vh] z-[2]"
          >
            <Image
              src={avatarSet.artistic.hero}
              alt={avatarSet.artistic.alt}
              width={420}
              height={420}
              className="w-[280px] max-w-[70vw] rounded-3xl object-cover md:w-[420px] md:max-w-[45vw]"
            />
          </motion.div>
        </div>

        {/* Oversized two-line heading */}
        <motion.h1
          animate={{ opacity: motionOK && !sectionInView ? 0.5 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={motionOK ? { y: headingY } : undefined}
          className="relative z-[3] text-center font-display text-[clamp(3.5rem,14vw,10rem)] leading-[0.88] font-bold tracking-tight text-text uppercase"
        >
          <span className="block">{artisticHero.headingTop}</span>
          <span className="block">{artisticHero.headingBottom}</span>
        </motion.h1>

        {/* Corner meta */}
        <div className="absolute bottom-8 left-6 text-[11px] font-medium tracking-[0.2em] text-text-muted uppercase">
          {artisticHero.metaLeft}
        </div>
        <div className="absolute right-6 bottom-8 text-[11px] font-medium tracking-[0.2em] text-text-muted uppercase">
          {artisticHero.metaRight}
        </div>
      </section>

      {/* ——— Second viewport: bio ——— */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <motion.div
          ref={bioRef}
          animate={
            motionOK && !bioInView
              ? { opacity: 0, y: 24 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid w-full max-w-4xl gap-7 md:grid-cols-[180px_1fr]"
        >
          <p className="font-display text-4xl leading-none font-bold text-text sm:text-5xl">
            {artisticHero.heyLabel}
          </p>
          <div className="grid gap-5">
            <p className="text-lg leading-relaxed text-text sm:text-xl">
              {artisticHero.introParagraph}
            </p>
            <p className="text-lg leading-relaxed text-text-muted sm:text-xl">
              {artisticHero.supportingCopy}
            </p>
            <a
              href={artisticHero.ctaHref}
              className="w-max text-sm font-semibold tracking-widest text-accent uppercase underline underline-offset-4 transition-colors duration-200 hover:text-text motion-reduce:transition-none"
            >
              {artisticHero.ctaLabel} ↓
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
