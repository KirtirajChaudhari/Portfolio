import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { heroPro, heroArt, heroTags, heroHint } from '../../content/xray';
import './XRayHero.css';

/* Loop 2: structure only. Loop 3: the lens. Loop 4: the ink spill. */

const layers = [
  { variant: 'pro' as const, copy: heroPro },
  { variant: 'art' as const, copy: heroArt },
];

/* Tuning. POS_LERP is the reveal's lag behind the ring; RAD_LERP is slower so
   the lens opens and closes with a little mass. Recorded in the plan doc. */
const POS_LERP = 0.18;
const RAD_LERP = 0.12;
const EPS = 0.05;

/* Ink spill (Loop 4). The blots are authored once at this local radius and
   never resized: only the group transform changes. See docs/loop4-plan.md for
   why that is load-bearing and not a style choice. */
const INK_R = 400;
/* Local units the baked texture spans, and the bitmap resolution behind it.
   These are independent: the <image> is 1024 user units wide however many
   pixels the PNG has. 768 measured no worse than 1024 and rasters faster. */
const INK_SPAN = 1024;
const INK_TEX = 768;
/* Fraction of the blot that is fully solid. Flood coverage is measured from the
   solid core, not the outer edge, and the bake reads the same constant: the
   gradient stop and the coverage maths can never drift apart. */
const INK_CORE = 0.8;
const INK_LAG = 0.25;   /* companion blot, ~4 frames = 66ms behind. */

/* Spring rather than a bezier because pointerup mid-expansion inherits velocity
   instead of restarting a timeline.
   The spec's 120/18 was measured and rejected: at that stiffness the blot is
   past the viewport edge in 80ms, so the irregular edge (the entire point of
   this loop) exists for one frame. These are the same damping ratio (zeta 0.82,
   ~1% overshoot: the paper sucking back) retuned to the spec's own 850ms
   expansion, which puts ~17 frames of visible edge on screen.
   Opening and closing are deliberately asymmetric: ink blooms slower than it
   is drawn back. Switching stiffness mid-flight is safe: the integrator carries
   position AND velocity across, so there is nothing to jump. */
const K_STIFF_OPEN = 33;    /* zeta*omega = 4.7, ~850ms */
const K_DAMP_OPEN = 9.4;
const K_STIFF_SHUT = 66;    /* zeta*omega = 6.7, ~600ms */
const K_DAMP_SHUT = 13.3;
const SUBSTEP = 0.008;  /* fixed integration step; a dropped frame cannot blow up. */

/* Half-pixel quantisation: sub-pixel movement on a mask edge shimmers. */
const q = (n: number) => Math.round(n * 2) / 2;

/* Run feTurbulence + feDisplacementMap exactly once, off the critical path, and
   keep only the bitmap. Deterministic (seed 7), so every visitor gets the same
   blot and the shape can be reasoned about. */
async function bakeInk(): Promise<string> {
  const half = INK_SPAN / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${INK_TEX}" height="${INK_TEX}" ` +
    `viewBox="-${half} -${half} ${INK_SPAN} ${INK_SPAN}"><defs>` +
    /* Tighter than the lens's own feather on purpose. The lens is an optic and
       wants a wide fade; ink on paper has a wet edge with a small fringe, and
       at flood scale the lens's wide stop smeared a third of the viewport into
       a grey band that buried the displacement detail it exists to show. */
    `<radialGradient id="f">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="1"/>` +
    `<stop offset="${INK_CORE}" stop-color="#fff" stop-opacity="1"/>` +
    `<stop offset="0.92" stop-color="#fff" stop-opacity="0.4"/>` +
    `<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<filter id="k" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="3" seed="7" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter></defs>` +
    `<circle cx="0" cy="0" r="${INK_R}" fill="url(#f)" filter="url(#k)"/></svg>`;

  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const cv = document.createElement('canvas');
  cv.width = cv.height = INK_TEX;
  cv.getContext('2d')!.drawImage(img, 0, 0, INK_TEX, INK_TEX);
  return cv.toDataURL('image/png');
}

export default function XRayHero() {
  const heroRef = useRef<HTMLElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<SVGGElement>(null);
  const inkARef = useRef<SVGGElement>(null);
  const inkBRef = useRef<SVGGElement>(null);
  const inkImgARef = useRef<SVGImageElement>(null);
  const inkImgBRef = useRef<SVGImageElement>(null);
  /* Fallback circles are removed from the tree the moment the texture lands. */
  const [baked, setBaked] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    /* Coarse pointers and reduced-motion get a complete, lens-free professional
       layer. Loop 6 makes those first-class states with a real toggle; this is
       only the guard that stops them getting a broken half-lens meanwhile. */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    /* Pointer handlers write tx/ty (and tr/tk, on enter/leave/down/up). Nothing
       else. The rAF loop is the only code that touches the DOM. */
    const s = { px: 0, py: 0, tx: 0, ty: 0, r: 0, tr: 0, k: 0, tk: 0, kb: 0 };
    let kv = 0;      /* blot scale velocity: the spring's other half. */
    let last = 0;    /* previous frame timestamp; 0 means "loop just restarted". */

    /* Last-written values. -Infinity, NOT NaN: every comparison against NaN is
       false, so a NaN sentinel silently disables the dirty check forever and the
       loop spins without ever writing. -Infinity makes the first frame dirty. */
    let wx = -Infinity, wy = -Infinity, wr = -Infinity, wtx = -Infinity, wty = -Infinity;
    let wk = -Infinity, wkb = -Infinity;
    let ringOn = false;
    let inkOn = false;
    let floodOn = false;
    let raf = 0;
    let heroLeft = 0, heroTop = 0, restR = 0;
    let kFlood = 0, floodAt = 0;
    let alive = true;

    /* Idle-time, and failure is survivable: without the texture the blots stay
       plain feathered circles, which spill correctly and merely lack the edge. */
    const run = () => {
      bakeInk().then((href) => {
        if (!alive) return;
        inkImgARef.current?.setAttribute('href', href);
        inkImgBRef.current?.setAttribute('href', href);
        setBaked(true);
      }).catch(() => { /* keep the circles */ });
    };
    const hasIdle = 'requestIdleCallback' in window;
    const idle = hasIdle ? window.requestIdleCallback(run, { timeout: 2000 }) : window.setTimeout(run, 300);

    /* No scroll listener. The hero's document-space origin is cached; the live
       scroll offset is read per event, which is cheap and never goes stale. */
    const cacheViewport = () => {
      const rect = el.getBoundingClientRect();
      heroLeft = rect.left + window.scrollX;
      heroTop = rect.top + window.scrollY;
      restR = Math.min(Math.max(160, 0.18 * Math.min(window.innerWidth, window.innerHeight)), 280);
      if (s.tr > 0) s.tr = restR;

      /* Flood must cover every corner from any pointer position, so the SOLID
         core, not the outer feather, has to reach 1.15 x the viewport diagonal. */
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      kFlood = (diag * 1.15) / (INK_R * INK_CORE);
      floodAt = (diag * 0.6) / (INK_R * INK_CORE);
      if (s.tk > 0) s.tk = kFlood;
    };

    const frame = (now: number) => {
      /* Clamped: a backgrounded tab returns with a multi-second gap, and a
         spring handed a 30s step integrates to infinity. Clamping is also what
         stops the catch-up jump on tab return (Loop 8 item 3). */
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;

      s.px += (s.tx - s.px) * POS_LERP;
      s.py += (s.ty - s.py) * POS_LERP;
      s.r += (s.tr - s.r) * RAD_LERP;

      /* Blot scale. Fixed-timestep so the shape of the motion does not change
         with the frame rate. Intent, not the instantaneous comparison: `tk > k`
         flips during the opening overshoot and would hand the shut spring the
         one moment the overshoot is supposed to happen. */
      const opening = s.tk > 0;
      const stiff = opening ? K_STIFF_OPEN : K_STIFF_SHUT;
      const damp = opening ? K_DAMP_OPEN : K_DAMP_SHUT;
      for (let acc = dt; acc > 0; acc -= SUBSTEP) {
        const h = Math.min(acc, SUBSTEP);
        kv += (-stiff * (s.k - s.tk) - damp * kv) * h;
        s.k += kv * h;
      }
      if (s.k < 0) { s.k = 0; kv = 0; }
      /* Settle: close enough AND slow enough. Velocity has to be in the test or
         a blot passing through its target at speed reads as "arrived". */
      if (Math.abs(s.tk - s.k) < 0.01 && Math.abs(kv) < 0.05) { s.k = s.tk; kv = 0; }
      s.kb += (s.k - s.kb) * INK_LAG;
      if (Math.abs(s.k - s.kb) < 0.01) s.kb = s.k;
      /* Snap the tail so the loop can actually reach a settled state. A 2px
         threshold is invisible (the feather's solid core at r=2 is ~1.5px) and
         avoids ~10 extra frames of lerping an imperceptible circle. */
      if (Math.abs(s.tr - s.r) < 2) s.r = s.tr;
      /* When fully closed, snap position too: no point lerping an invisible
         center, and the writes keep the loop from going idle. The ink has to be
         gone as well, or a blot still receding would jump to the pointer. */
      if (s.r === 0 && s.tr === 0 && s.k === 0 && s.tk === 0) { s.px = s.tx; s.py = s.ty; }

      let dirty = false;
      /* Captured BEFORE the circle write, which overwrites wx/wy. The blots hang
         off the same lerped centre, so they need the same answer. */
      const movedPos = Math.abs(s.px - wx) > EPS || Math.abs(s.py - wy) > EPS;

      if (movedPos || Math.abs(s.r - wr) > EPS) {
        const c = circleRef.current;
        if (c) {
          c.setAttribute('cx', String(q(s.px)));
          c.setAttribute('cy', String(q(s.py)));
          c.setAttribute('r', String(q(s.r)));
        }
        wx = s.px; wy = s.py; wr = s.r;
        dirty = true;
      }

      if (Math.abs(s.tx - wtx) > EPS || Math.abs(s.ty - wty) > EPS) {
        const ring = ringRef.current;
        if (ring) ring.style.transform = 'translate3d(' + q(s.tx) + 'px,' + q(s.ty) + 'px,0)';
        wtx = s.tx; wty = s.ty;
        dirty = true;
      }

      /* The ink group is display:none until it has something to draw, so the
         turbulence filter costs exactly zero before the first pointerdown. This
         is a discrete state change, not a per-frame write. */
      const showInk = s.k > 0 || s.tk > 0;
      if (showInk !== inkOn) {
        if (inkRef.current) inkRef.current.style.display = showInk ? 'block' : 'none';
        inkOn = showInk;
        dirty = true;
      }

      if (showInk && (movedPos || Math.abs(s.k - wk) > 0.002)) {
        inkARef.current?.setAttribute('transform', `translate(${q(s.px)} ${q(s.py)}) scale(${s.k.toFixed(4)})`);
        wk = s.k;
        dirty = true;
      }

      if (showInk && (movedPos || Math.abs(s.kb - wkb) > 0.002)) {
        inkBRef.current?.setAttribute('transform', `translate(${q(s.px)} ${q(s.py)}) scale(${(s.kb * 0.85).toFixed(4)})`);
        wkb = s.kb;
        dirty = true;
      }

      /* Past this point the lens has become the room: the ring has nothing left
         to point at, and the artistic layer's animations are allowed to run. */
      const flooded = s.k > floodAt;
      if (flooded !== floodOn) {
        el.toggleAttribute('data-flooded', flooded);
        floodOn = flooded;
        dirty = true;
      }

      const showRing = s.tr > 0 && !flooded;
      if (showRing !== ringOn) {
        if (ringRef.current) ringRef.current.style.opacity = showRing ? '1' : '0';
        ringOn = showRing;
        dirty = true;
      }

      /* Idle: nothing moved and both the radius and the blot reached their
         targets, so stop scheduling. A pointer event kicks it back. */
      const settled = !dirty && s.r === s.tr && s.k === s.tk;
      if (settled) { raf = 0; last = 0; } else raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
    };

    const setTarget = (e: PointerEvent) => {
      s.tx = e.clientX + window.scrollX - heroLeft;
      s.ty = e.clientY + window.scrollY - heroTop;
    };

    /* Opening is driven by enter AND move, not enter alone: if the page loads
       with the cursor already inside a full-viewport hero, the pointer never
       crosses the boundary and `pointerenter` never fires: the lens would stay
       shut until the user left and came back. Idempotent, so a move costs
       nothing once open. */
    const activate = () => {
      if (s.tr === restR) return;
      /* Open where the cursor already is rather than sliding in from the origin. */
      s.px = s.tx;
      s.py = s.ty;
      s.tr = restR;
    };

    const onEnter = (e: Event) => { setTarget(e as PointerEvent); activate(); kick(); };
    const onMove = (e: Event) => { setTarget(e as PointerEvent); activate(); kick(); };
    const onLeave = () => { s.tr = 0; s.tk = 0; kick(); };

    /* Hold to flood. Pointer capture is not a nicety: without it, dragging out
       of the window and releasing there never delivers a pointerup and the hero
       stays flooded forever. */
    const onDown = (ev: Event) => {
      const e = ev as PointerEvent;
      /* A click on the CTA should navigate, not stage a light show. */
      if ((e.target as Element | null)?.closest?.('a, button, [role="button"]')) return;
      setTarget(e);
      activate();
      s.tk = kFlood;
      try { el.setPointerCapture(e.pointerId); } catch { /* already gone */ }
      kick();
    };

    /* tk is a target, not a timeline, so click-click-click cannot queue: each
       event just moves where the spring is heading, from wherever it currently is. */
    const onUp = () => { s.tk = 0; kick(); };

    cacheViewport();
    el.dataset.lensMode = 'lens';

    /* pointerrawupdate delivers moves at input rate rather than frame rate, so
       tx/ty are fresher; the rAF loop still gates every DOM write. */
    const moveEvent = 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove';

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener(moveEvent, onMove, { passive: true });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('lostpointercapture', onUp);

    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(cacheViewport, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener(moveEvent, onMove);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('lostpointercapture', onUp);
      delete el.dataset.lensMode;
      el.removeAttribute('data-flooded');
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" data-lens>
      {/* REGISTRATION IS THE WHOLE TRICK, so both layers come out of ONE template.
          A second hand-written layer would drift the first time someone edits one
          side and not the other. Every box below is sized from custom properties
          declared once on .hero: no layer may hardcode a geometry value. */}
      {layers.map((layer) => {
        const pro = layer.variant === 'pro';
        return (
          <div
            key={layer.variant}
            className={`hero__layer hero__layer--${layer.variant}`}
            aria-hidden={pro ? undefined : true}
            inert={pro ? undefined : true}
          >
            <div className="hero__stack">
              <p className="hero__eyebrow">{layer.copy.eyebrow}</p>

              {/* The artistic twin is a <p>, not an <h1>: two h1s in one section is
                  a document-outline bug even when one of them is aria-hidden. */}
              {pro
                ? <h1 className="hero__title">{layer.copy.title}</h1>
                : <p className="hero__title">{layer.copy.title}</p>}

              <p className="hero__lead">{layer.copy.lead}</p>

              <div className="hero__actions">
                {pro
                  ? <Link className="hero__cta" to="/work#projects">{layer.copy.action}</Link>
                  /* Decorative twin. Holds the slot open so the layers stay
                     registered; inert, so it can never take focus. */
                  : <span className="hero__cta hero__cta--ghost">{layer.copy.action}</span>}
              </div>

              <ul className="hero__tags">
                {heroTags.map((tag) => (
                  <li key={tag.label}>
                    <span className="hero__tag-label">{tag.label}</span>
                    <span className="hero__tag-detail">{tag.detail}</span>
                  </li>
                ))}
                <li>
                  {pro
                    ? <Link className="hero__chapter-link" to="/creator">Chapter Two — the other half</Link>
                    : <span className="hero__chapter-link">Chapter Two — the other half</span>}
                </li>
              </ul>
            </div>

            {/* Out of grid flow, identical coordinates in both layers: it registers
                under the lens without touching a stack row. Decorative, so it is
                hidden from assistive tech; the pro layer is complete without it. */}
            <p className="hero__hint" aria-hidden="true">
              <span className="hero__hint-ring"></span>{heroHint}
            </p>
          </div>
        );
      })}

      <div className="hero__lens-ui" aria-hidden="true">
        {/* The ring sits at the TRUE pointer position while the reveal below it
            lerps behind. That lag is the whole feel: a lens being dragged, not a
            CSS variable being assigned. */}
        <div ref={ringRef} className="hero__ring"></div>
      </div>

      {/* Path B from docs/xray-plan.md section 9. The circle's radial fill IS
          the 3-stop feather; only cx/cy/r change per frame. */}
      <svg className="hero__defs" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="xray-feather">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.74" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.9" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          {/* maskUnits is deliberately ABSENT (i.e. objectBoundingBox). It is the
              region (x/y/width/height, defaulting to -10%/120%), not the
              contents. Under userSpaceOnUse those percentages resolve against
              THIS svg's viewport, which is 0x0, so the mask region collapses to
              nothing and the layer is masked out entirely. maskContentUnits
              still defaults to userSpaceOnUse, which is what keeps cx/cy/r in
              plain pixels. Do not "tidy" this attribute back in. */}
          <mask id="xray-lens">
            <circle ref={circleRef} cx="-9999" cy="-9999" r="0" fill="url(#xray-feather)" />

            {/* INK SPILL (Loop 4). The displaced edge is BAKED to a bitmap once
                (see bakeInk) and then only ever moved by the group transform.
                A live feDisplacementMap here measured 26.6fps with 105ms long
                tasks: Chromium re-rasterises an SVG filter at whatever device
                scale the ancestor transform implies, so "constant local
                geometry" buys nothing. The circles are the pre-bake fallback and
                are removed the moment the texture lands.
                The offset and the 0.85 scale are what make two blots read as
                liquid rather than as one circle. */}
            <g ref={inkRef} className="hero__ink">
              <g ref={inkBRef} className="hero__ink-b" opacity="0.55">
                {!baked && <circle className="hero__ink-fallback" cx="-150" cy="95" r={INK_R} fill="url(#xray-feather)" />}
                <image
                  ref={inkImgBRef}
                  x={-INK_SPAN / 2 - 150} y={-INK_SPAN / 2 + 95}
                  width={INK_SPAN} height={INK_SPAN}
                />
              </g>
              <g ref={inkARef}>
                {!baked && <circle className="hero__ink-fallback" cx="0" cy="0" r={INK_R} fill="url(#xray-feather)" />}
                <image
                  ref={inkImgARef}
                  x={-INK_SPAN / 2} y={-INK_SPAN / 2}
                  width={INK_SPAN} height={INK_SPAN}
                />
              </g>
            </g>
          </mask>
        </defs>
      </svg>
    </section>
  );
}
