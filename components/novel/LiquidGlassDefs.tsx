/*
 * SVG filter powering .glass-panel's liquid-glass overlay (Chapter One).
 * feTurbulence + feDisplacementMap warp the overlay's light streaks into
 * an organic refraction shape. Fixed seed, no animated attributes — the
 * filter rasterizes once and stays off the frame budget.
 */
export function LiquidGlassDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.014"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="26"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
