/*
 * Progressive-blur seam — the yaros.me section-boundary treatment,
 * rebuilt from its measured layer stack (full-width bands at
 * blur 0.5 → 4px). Each layer blurs a feathered slice of whatever
 * scrolls beneath it; together they read as depth, not as a divider.
 * Pointer-transparent and purely decorative.
 */
const LAYERS = [0.5, 1, 2, 4];

export function BlurSeam({ position = "bottom" }: { position?: "top" | "bottom" }) {
  const anchor = position === "bottom" ? "bottom-0" : "top-0";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 ${anchor} h-28`}>
      {LAYERS.map((blur, i) => {
        const from = (i / LAYERS.length) * 100;
        const fade =
          position === "bottom"
            ? `linear-gradient(to bottom, transparent ${from}%, black ${from + 15}%)`
            : `linear-gradient(to top, transparent ${from}%, black ${from + 15}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              maskImage: fade,
              WebkitMaskImage: fade,
            }}
          />
        );
      })}
    </div>
  );
}
