import { useEffect, useRef, useState } from 'react';

/* Frames come from scripts/extract_frames.py. The MP4 itself is never played or
   seeked: it has one keyframe, so currentTime seeks stall and play() runs away.
   64 pre-decoded WebP stills sit 5.625 degrees apart around the head's circular
   sweep; frame 0 looks UP and the index rises clockwise on screen.

   Motion model, in order of what the viewer sees:
   1. The aim (a float position on the 64-frame ring) chases the cursor angle with
      time-based exponential smoothing, so 60Hz and 144Hz screens feel identical.
   2. The displayed frame WALKS toward the aim, at most 2 frames per tick and at a
      fixed frames-per-second budget, so a fast swipe turns the head through the
      frames in between instead of teleporting across them.
   3. The centre pose (eye contact) is entered and left through the ring frame that
      looks most like it, never by a straight swap from some unrelated angle.
   Exactly one fully opaque frame is painted per update: no blending, no ghosting. */
const N = 64;
const STEP = 360 / N;
const TAU = 0.08;           /* s. Smoothing time constant; ~63% of the way in 90ms. */
const MAX_DT = 0.05;        /* s. A stalled tab must not integrate one giant step. */
const WALK_FPS = 120;       /* frames per second the displayed frame may advance... */
const MAX_STEP = 2;         /* ...and never more than this many in a single tick. */
const ENTER = 0.12;         /* of viewport width: look straight into the lens... */
const EXIT = 0.14;          /* ...and stay locked on until the cursor is this far out. */
const IDX_HYST = 0.35;      /* frames. Rounding boundary hysteresis: no flicker on a boundary. */
const DWELL = 0.08;         /* s. Held on the nearest ring frame before the swap to centre. */
const SETTLE = 0.15;        /* frames. Close enough to snap and let the loop idle. */

interface Manifest {
  width: number; height: number; face: { x: number; y: number }; bgEdge: string; nearestToCenter?: number;
}
const FALLBACK: Manifest = { width: 1920, height: 1080, face: { x: 0.4948, y: 0.4648 }, bgEdge: '#b41d1c', nearestToCenter: 60 };

const wrapN = (i: number) => ((i % N) + N) % N;
/* Signed shortest distance a -> b around the ring, in (-N/2, N/2]. */
const ringDelta = (a: number, b: number) => ((((b - a + N / 2) % N) + N) % N) - N / 2;

function load(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  return img.decode().then(() => img);
}

/* Even coverage first (0, 32, 16, 48, 8, ...), so a partial load is still a usable ring. */
const LOAD_ORDER = (() => {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const s of [32, 16, 8, 4, 2, 1]) for (let k = 0; k < N; k += s) if (!seen.has(k)) { seen.add(k); out.push(k); }
  return out;
})();

export default function CharacterCanvas({ onReady }: { onReady?: (bgEdge: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    /* Reduced motion and touch-only devices land on the static centre frame. */
    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches;
    let alive = true;
    let raf = 0;
    let manifest = FALLBACK;
    let center: HTMLImageElement | null = null;
    const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);

    /* Pointer handlers write this object and nothing else. The loop decides. */
    const t = { angle: 0, dist: Infinity, seen: false, leave: false };

    let near = FALLBACK.nearestToCenter!;
    let fPos = near;            /* aim: float position on the ring */
    let shown = near;           /* ring frame currently on screen */
    let pose: 'ring' | 'centre' = 'centre';
    let inDead = true;
    let dwellAt = -1;
    let budget = 0;
    let last = 0;
    let drawn: number | null = null;   /* -1 = centre frame, 0..N-1 = ring frame */
    let dirty = true;
    let faceX = 0, faceY = 0, vw = 0;
    let scale = 1, ox = 0, oy = 0;

    const nearestLoaded = (k: number) => {
      for (let d = 0; d <= N / 2; d++) {
        const a = frames[wrapN(k + d)] ?? frames[wrapN(k - d)];
        if (a) return a;
      }
      return null;
    };

    const draw = (key: number) => {
      const img = key < 0 ? center : nearestLoaded(key) ?? center;
      if (!img) return;
      /* Exactly one frame, fully opaque. No blending, so no double-face ghosting. */
      ctx.globalAlpha = 1;
      ctx.drawImage(img, ox, oy, manifest.width * scale, manifest.height * scale);
      drawn = key;
    };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      /* Setting width/height clears the bitmap, so paint again before the browser can. */
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      /* object-fit: cover, done by hand: the video frame fills the viewport and
         the face centre is mapped through the same transform. */
      scale = Math.max(canvas.width / manifest.width, canvas.height / manifest.height);
      ox = (canvas.width - manifest.width * scale) / 2;
      oy = (canvas.height - manifest.height * scale) / 2;
      faceX = (ox + manifest.face.x * manifest.width * scale) / dpr;
      faceY = (oy + manifest.face.y * manifest.height * scale) / dpr;
      ctx.imageSmoothingQuality = 'high';
      if (center) draw(drawn ?? -1);
      dirty = false;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive || !center) return;

      /* Seconds since the previous tick. A cold start or an idle gap restarts from one
         nominal 60Hz frame instead of a stale timestamp. */
      const dt = last ? Math.min((now - last) / 1000, MAX_DT) : 1 / 60;
      last = now;

      /* 1. Where do we want to look? Hysteresis on the centre lock, so a cursor resting
            on the boundary cannot toggle it. */
      const rim = (inDead ? EXIT : ENTER) * vw;
      inDead = !t.seen || t.leave || t.dist < rim;
      const aim = inDead ? near : wrapN((t.angle + 90) / STEP);

      /* 2. Smooth the aim: time-based, so the refresh rate does not change the feel. */
      const alpha = 1 - Math.exp(-dt / TAU);
      fPos = wrapN(fPos + ringDelta(fPos, aim) * alpha);
      if (Math.abs(ringDelta(fPos, aim)) < SETTLE) fPos = aim;

      /* 3. The frame we would like to be on, with hysteresis around rounding boundaries. */
      let want = shown;
      if (Math.abs(ringDelta(fPos, shown)) > 0.5 + IDX_HYST) want = wrapN(Math.round(fPos));

      /* 4. Walk there: a fixed frames-per-second budget, never more than MAX_STEP per tick. */
      budget = Math.min(budget + WALK_FPS * dt, MAX_STEP);
      const gap = ringDelta(shown, want);
      /* The epsilon keeps 1.9999 (a 60Hz tick that is a hair short) from costing a whole frame. */
      const move = Math.min(Math.floor(budget + 0.05), MAX_STEP, Math.abs(gap));
      if (move > 0) {
        shown = wrapN(shown + Math.sign(gap) * move);
        budget -= move;
      }

      /* 5. Centre pose: only swap once we are sitting on the nearest ring frame. */
      let pending = false;
      if (inDead) {
        if (pose === 'ring' && shown === near && fPos === aim) {
          if (dwellAt < 0) dwellAt = now;
          if ((now - dwellAt) / 1000 >= DWELL) { pose = 'centre'; dwellAt = -1; }
          else pending = true;
        } else if (pose === 'ring') {
          dwellAt = -1;
        }
      } else {
        dwellAt = -1;
        if (pose === 'centre') pose = 'ring';   /* leaves via `near`, which is what `shown` already is */
      }

      /* 6. Paint, only when the picture changes. */
      const key = pose === 'centre' ? -1 : shown;
      if (key !== drawn || dirty) {
        draw(key);
        dirty = false;
      }

      /* 7. Keep going only while something is still moving. Otherwise the loop idles. */
      const moving =
        fPos !== aim || shown !== want ||
        pending || (inDead && pose === 'ring') || (!inDead && pose === 'centre');
      if (moving) raf = requestAnimationFrame(frame);
      else { last = 0; budget = 0; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - faceX;
      const dy = e.clientY - faceY;
      t.dist = Math.hypot(dx, dy);
      t.angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      t.seen = true;
      t.leave = false;
      kick();
    };
    /* Leaving the window is just another aim (the centre pose), eased like any other. */
    const onLeave = () => { t.leave = true; kick(); };

    (async () => {
      try {
        manifest = await fetch('/frames/manifest.json').then((r) => r.json());
        near = manifest.nearestToCenter ?? near;
        fPos = shown = near;
      } catch { /* defaults match the shipped frames */ }
      if (!alive) return;

      try {
        center = await load('/frames/center.webp');
      } catch {
        return;   /* nothing to draw; the page copy and nav still work */
      }
      if (!alive) return;
      layout();
      setReady(true);
      onReady?.(manifest.bgEdge);

      if (still) return;
      /* Progressive and failure-tolerant: a frame that fails is simply skipped and
         its neighbour stands in; frames landing one by one never move the head. */
      for (const k of LOAD_ORDER) {
        load(`/frames/frame-${String(k).padStart(2, '0')}.webp`)
          .then((img) => {
            if (!alive) return;
            frames[k] = img;
            if (pose === 'ring') { dirty = true; kick(); }
          })
          .catch(() => { /* keep the neighbour */ });
      }
    })();

    window.addEventListener('resize', layout, { passive: true });
    if (!still) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
    // onReady is a one-shot callback; the mount is the contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Illustrated portrait of Kirtiraj whose head follows your cursor"
      className="fixed inset-0 h-full w-full transition-opacity duration-700"
      style={{ opacity: ready ? 1 : 0, transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
    />
  );
}
