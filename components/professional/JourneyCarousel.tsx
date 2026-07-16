"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "motion/react";
import Image from "next/image";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { workJourney, educationJourney } from "@/content/journey";
import type { JourneyEntry } from "@/content/journey";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import "./JourneyCarousel.css";

/* ——— Monogram badge fallback for missing logos ——— */
function MonogramBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s,]+/)
    .filter((w) => w.length > 1 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="journey-card__monogram" aria-hidden="true">
      {initials || "?"}
    </div>
  );
}

/* ——— Single Carousel Track ——— */
interface CarouselTrackProps {
  entries: JourneyEntry[];
  label: string;
}

function CarouselTrack({ entries, label }: CarouselTrackProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const cardWidth = 340;
  const gap = 24;
  const step = cardWidth + gap;

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(entries.length - 1, idx));
      setActive(clamped);
      animate(x, -clamped * step, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    },
    [entries.length, step, x]
  );

  const next = useCallback(
    () => goTo(active < entries.length - 1 ? active + 1 : 0),
    [active, entries.length, goTo]
  );
  const prev = useCallback(
    () => goTo(active > 0 ? active - 1 : entries.length - 1),
    [active, entries.length, goTo]
  );

  /* Auto-advance every 6s, pause on hover/focus */
  useEffect(() => {
    const start = () => {
      autoRef.current = setInterval(() => {
        if (!pausedRef.current) next();
      }, 6000);
    };
    start();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [next]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  /* Drag end snap */
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = info.offset.x;
    if (Math.abs(swipe) > 60) {
      swipe < 0 ? next() : prev();
    } else {
      goTo(active);
    }
  };

  return (
    <div
      className="journey-track"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <h3 className="journey-track__heading">{label}</h3>

      {/* Dot timeline (secondary index) */}
      <div className="journey-track__dots">
        <div className="journey-track__dots-line" />
        {entries.map((entry, i) => (
          <button
            key={entry.id}
            className={`journey-track__dot ${
              i === active ? "journey-track__dot--active" : ""
            }`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${entry.heading}`}
          />
        ))}
      </div>

      {/* Cards viewport */}
      <div className="journey-track__viewport" ref={trackRef}>
        <motion.div
          className="journey-track__strip"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -(entries.length - 1) * step,
            right: 0,
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          {entries.map((entry, i) => {
            const distance = Math.abs(i - active);
            const isActive = i === active;
            return (
              <motion.div
                key={entry.id}
                className="journey-card"
                animate={{
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.5,
                  rotateY: i < active ? 12 : i > active ? -12 : 0,
                  z: isActive ? 0 : -80,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                style={{
                  width: cardWidth,
                  zIndex: entries.length - distance,
                  perspective: 800,
                }}
              >
                {/* Logo or Monogram */}
                <div className="journey-card__logo-wrap">
                  {entry.logo ? (
                    <Image
                      src={entry.logo}
                      alt={entry.organization}
                      width={48}
                      height={48}
                      className="journey-card__logo"
                    />
                  ) : (
                    <MonogramBadge name={entry.organization} />
                  )}
                </div>

                {/* Role / Degree */}
                <h4 className="journey-card__role">{entry.heading}</h4>

                {/* Organization link */}
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journey-card__org"
                  onClick={(e) => e.stopPropagation()}
                >
                  {entry.organization}
                  <ExternalLink className="inline ml-1 h-3 w-3 opacity-50" />
                </a>

                {/* Date pill */}
                <span className="journey-card__date">{entry.dateRange}</span>

                {/* Description */}
                <p className="journey-card__desc">{entry.description}</p>

                {/* Skill pills */}
                <div className="journey-card__skills">
                  {entry.skills.map((skill) => (
                    <span key={skill} className="journey-card__skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Nav arrows */}
      <div className="journey-track__nav">
        <button
          className="journey-track__arrow"
          onClick={prev}
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          className="journey-track__arrow"
          onClick={next}
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ——— Main Section ——— */
export function JourneyCarousel() {
  return (
    <section id="timeline" className="mx-auto max-w-6xl px-6 pt-12 pb-24">
      <AnimeReveal>
        <SectionHeading
          overline="Experience & Education"
          title="The journey so far"
        />
      </AnimeReveal>

      <AnimeReveal delay={100}>
        <div className="journey-grid">
          <CarouselTrack entries={workJourney} label="Work Experience" />
          <CarouselTrack entries={educationJourney} label="Education" />
        </div>
      </AnimeReveal>
    </section>
  );
}
