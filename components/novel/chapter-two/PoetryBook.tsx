"use client";

import * as React from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { Poem, poetryCollectionTitle } from "@/content/poetry";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PoetryBookProps {
  poems: Poem[];
  width?: number;
  height?: number;
  borderRadius?: number;
  shadowColor?: string;
}

export function PoetryBook(props: PoetryBookProps) {
  const {
    width = 400,
    height = 560,
    poems = [],
    shadowColor = "var(--shadow-tint)",
    borderRadius = 2,
  } = props;

  const prefersReducedMotion = useReducedMotion();

  // 1 front cover (text), N poems, 1 back cover (empty)
  // We represent leaves as pairs of [frontFace, backFace]
  // 'front' face of leaf 0 is front cover. 'back' face of leaf 0 is poem 1.
  // 'front' face of leaf 1 is poem 2. 'back' face of leaf 1 is poem 3...
  
  const allFaces: (Poem | "frontCover" | "backCover" | null)[] = ["frontCover", ...poems, "backCover"];
  if (allFaces.length % 2 !== 0) {
    allFaces.push(null); // pad to even
  }

  const leafPairs: [typeof allFaces[0], typeof allFaces[0]][] = [];
  for (let i = 0; i < allFaces.length; i += 2) {
    leafPairs.push([allFaces[i], allFaces[i + 1]]);
  }
  const totalLeaves = leafPairs.length;

  const [flippedCount, setFlippedCount] = React.useState(0);
  const [isBookClosed, setIsBookClosed] = React.useState(true);
  
  // Create a ref for focus management if needed
  const bookRef = React.useRef<HTMLDivElement>(null);

  // Since poems is from static content, totalLeaves is constant per render.
  // We can call useAnimationControls in a map, but to satisfy the linter
  // without creating a custom hook violation, we'll just use a loop.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const controlsPool = leafPairs.map(() => useAnimationControls());
  const bookContainerControls = useAnimationControls();

  const closedBookShadow = `8px 8px 30px ${shadowColor}`;

  const flipNext = async () => {
    if (flippedCount >= totalLeaves) return;

    if (flippedCount === 0) {
      setIsBookClosed(false);
      if (!prefersReducedMotion) {
        bookContainerControls.start({
          x: width / 2,
          transition: { duration: 0.6, ease: "easeInOut" },
        });
      }
    }

    const indexToFlip = flippedCount;
    setFlippedCount((prev) => prev + 1);

    if (!prefersReducedMotion) {
      await controlsPool[indexToFlip].start({
        rotateY: -180,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      });
    }
  };

  const flipPrev = async () => {
    if (flippedCount <= 0) return;

    const indexToFlip = flippedCount - 1;
    setFlippedCount((prev) => prev - 1);

    if (prefersReducedMotion) {
      if (indexToFlip === 0) setIsBookClosed(true);
      return;
    }

    if (indexToFlip === 0) {
      bookContainerControls.start({
        x: 0,
        transition: { duration: 0.8, ease: "easeInOut" },
      });
    }

    await controlsPool[indexToFlip].start({
      rotateY: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    });

    if (indexToFlip === 0) {
      setIsBookClosed(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      flipNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      flipPrev();
    }
  };

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center gap-8 py-12"
      aria-label="Poetry flip-book"
    >
      <div
        ref={bookRef}
        style={{
          width: width * 2, // Book spans 2x width when open
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: 2500,
          overflow: "visible",
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Poetry book. Use left and right arrow keys to flip pages."
        className="outline-none focus-visible:ring-2 focus-visible:ring-crayon-sun"
      >
        <motion.div
          animate={bookContainerControls}
          style={{
            width,
            height,
            position: "relative",
            transformStyle: "preserve-3d",
            boxShadow: isBookClosed ? closedBookShadow : "0px 0px 0px transparent",
            transition: prefersReducedMotion ? "none" : "box-shadow 0.6s var(--ease-in-out)",
          }}
        >
          {leafPairs.map(([frontFace, backFace], index) => {
            const isFlipped = index < flippedCount;
            const isFlipping = index === flippedCount - 1;
            
            // Reduced offset to remove the "thick border" look
            const zOffset = isFlipped ? index * 0.4 : (totalLeaves - index) * 0.4;
            const zIndex = isFlipping ? 100 : isFlipped ? index : totalLeaves - index;

            // In reduced motion, we just crossfade the pages
            const reducedMotionOpacity = prefersReducedMotion
              ? isFlipped ? 0 : 1
              : 1;

            return (
              <motion.div
                key={index}
                animate={controlsPool[index]}
                initial={{ rotateY: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  zIndex,
                  transform: prefersReducedMotion ? "none" : `translateZ(${zOffset}px)`,
                  willChange: prefersReducedMotion ? "auto" : "transform",
                  opacity: reducedMotionOpacity,
                  pointerEvents: (prefersReducedMotion && isFlipped) ? "none" : "auto",
                }}
              >
                {/* FRONT FACE */}
                <div
                  style={{
                    ...faceStyle,
                    borderRadius: `0px ${borderRadius}px ${borderRadius}px 0px`,
                    background: "var(--surface)",
                  }}
                  className="border border-border/50 shadow-sm"
                >
                  <PageContent face={frontFace} />
                  <div style={spineGradient} />
                </div>

                {/* BACK FACE */}
                <div
                  style={{
                    ...faceStyle,
                    transform: "rotateY(180deg) translateZ(0.01px)",
                    borderRadius: `${borderRadius}px 0px 0px ${borderRadius}px`,
                    background: "var(--surface)",
                    display: prefersReducedMotion ? "none" : "block", // Handled differently in reduced motion
                  }}
                  className="border border-border/50 shadow-sm"
                >
                  <PageContent face={backFace} />
                  <div
                    style={{
                      ...spineGradient,
                      left: "auto",
                      right: 0,
                      transform: "scaleX(-1)",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
          
          {/* Reduced Motion Back Face (Simulated) */}
          {prefersReducedMotion && flippedCount > 0 && (
             <div
               style={{
                 position: "absolute",
                 inset: 0,
                 zIndex: flippedCount,
                 borderRadius: `${borderRadius}px 0px 0px ${borderRadius}px`,
                 background: "var(--surface)",
                 transform: "translateX(-100%)", // Move to the left
               }}
               className="border border-border/50 shadow-sm"
             >
               <PageContent face={leafPairs[flippedCount - 1][1]} />
             </div>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={flipPrev}
          disabled={flippedCount === 0}
          aria-label="Previous page"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text hover:bg-surface-2 hover:text-crayon-sun disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="type-sans text-sm text-text-muted">
          {flippedCount === 0 ? "Cover" : `Spread ${flippedCount} of ${totalLeaves}`}
        </div>
        <button
          onClick={flipNext}
          disabled={flippedCount === totalLeaves}
          aria-label="Next page"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text hover:bg-surface-2 hover:text-crayon-sun disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function PageContent({ face }: { face: Poem | "frontCover" | "backCover" | null }) {
  if (face === "frontCover") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center relative overflow-hidden" style={{
        backgroundColor: "#1c1917",
        backgroundImage: "radial-gradient(circle at 50% 50%, #2a2422 0%, #171514 100%)",
        border: "1px solid #3f3a38",
      }}>
        <div className="absolute inset-2 border-2 border-[#d4af37]/40 p-2 pointer-events-none">
          <div className="w-full h-full border border-[#d4af37]/30 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]/60" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/60" />
            
            <h2 className="type-heading text-4xl leading-tight uppercase font-serif tracking-widest mt-8" style={{
                color: "#d4af37",
                textShadow: "1px 1px 3px rgba(0,0,0,0.9)"
            }}>
              {poetryCollectionTitle}
            </h2>
            
            <div className="mt-8 h-[2px] w-16 bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
            
            <p className="mt-8 type-serif italic tracking-wider" style={{ color: "#d4af37", opacity: 0.85 }}>
              Kirtiraj Chaudhari
            </p>
          </div>
        </div>
        <div className="h-full w-8 absolute left-0 top-0 bottom-0 opacity-60 bg-gradient-to-r from-black/90 to-transparent pointer-events-none" />
      </div>
    );
  }

  if (face === "backCover") {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 relative overflow-hidden" style={{
        backgroundColor: "#1c1917",
        backgroundImage: "radial-gradient(circle at 50% 50%, #2a2422 0%, #171514 100%)",
        border: "1px solid #3f3a38",
      }}>
        <div className="absolute inset-2 border border-[#d4af37]/20 flex items-center justify-center pointer-events-none">
          <div className="type-heading text-xl tracking-[0.3em]" style={{ color: "#d4af37", opacity: 0.5 }}>
            Fin.
          </div>
        </div>
        <div className="h-full w-8 absolute right-0 top-0 bottom-0 opacity-60 bg-gradient-to-l from-black/90 to-transparent pointer-events-none" />
      </div>
    );
  }

  if (!face) return <div className="h-full w-full" style={linedPaperStyle} />;

  return (
    <div className="flex h-full w-full flex-col p-8 pt-12 relative" style={linedPaperStyle}>
      <h3 className="type-hand text-3xl text-text mb-4 text-center">{face.title}</h3>
      <div className="type-hand text-2xl text-text whitespace-pre-wrap flex-grow" style={{ lineHeight: "32px", paddingTop: "4px" }}>
        {face.body}
      </div>
      {face.note && (
        <div className="absolute bottom-8 right-8 type-hand text-xl text-crayon-violet -rotate-2 opacity-80 max-w-[150px] text-right leading-tight">
          {face.note}
        </div>
      )}
    </div>
  );
}

const linedPaperStyle: React.CSSProperties = {
  backgroundColor: "#fdfbf7",
  backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px)",
  backgroundAttachment: "local",
};

const faceStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  overflow: "hidden",
};

const spineGradient: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "12%",
  background: "linear-gradient(to right, rgba(0,0,0,0.05), transparent)",
  pointerEvents: "none",
};
