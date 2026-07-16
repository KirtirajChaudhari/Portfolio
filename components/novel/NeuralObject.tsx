"use client";

import { useMemo } from "react";

/*
 * Stylized neural network rendered in CSS 3D — three node layers spaced
 * along Z plus an orbital ring. The hero rotates the whole assembly from
 * scroll progress (never autoplay), so it reads as the "signature moment".
 */

const LAYERS = [
  { z: -110, nodes: 4 },
  { z: 0, nodes: 6 },
  { z: 110, nodes: 3 },
];

function LayerPlane({ nodes, z }: { nodes: number; z: number }) {
  const points = useMemo(() => {
    const r = 118;
    // Rounded to avoid SSR/client float drift (hydration mismatch).
    const round = (n: number) => Math.round(n * 100) / 100;
    return Array.from({ length: nodes }, (_, i) => {
      const a = (i / nodes) * Math.PI * 2 + nodes; // per-layer phase offset
      return { x: round(150 + Math.cos(a) * r), y: round(150 + Math.sin(a) * r) };
    });
  }, [nodes]);

  return (
    <svg
      viewBox="0 0 300 300"
      className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(-50%, -50%) translateZ(${z}px)` }}
      aria-hidden
    >
      {points.map((p, i) =>
        points.map((q, j) =>
          j > i ? (
            <line
              key={`${i}-${j}`}
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1"
            />
          ) : null
        )
      )}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="var(--accent)" fillOpacity="0.85" />
      ))}
      <circle cx="150" cy="150" r="3" fill="var(--accent)" />
    </svg>
  );
}

export function NeuralObject() {
  return (
    <div
      className="pointer-events-none relative h-[340px] w-[340px] opacity-80"
      style={{ perspective: "900px", filter: "drop-shadow(0 0 24px rgba(88,166,255,0.35))" }}
      aria-hidden
    >
      <div
        data-neural-object
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {LAYERS.map((layer) => (
          <LayerPlane key={layer.z} nodes={layer.nodes} z={layer.z} />
        ))}
        {/* Orbital ring */}
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] rounded-full border border-[var(--accent)]/30"
          style={{ transform: "translate(-50%, -50%) rotateX(72deg)" }}
        />
      </div>
    </div>
  );
}
