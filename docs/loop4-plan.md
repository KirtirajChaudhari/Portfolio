# Loop 4 — INK SPILL · plan before source

## The one architectural decision

The spec wants `feTurbulence` + `feDisplacementMap` applied **once** to a shape, not
live to pixels. There is a second, sharper trap underneath that, which the spec's own
"verify paint area != full viewport" line is pointing at:

`feTurbulence` is defined in **user space**. If the filtered shape's geometry changes
per frame — radius grows, or the centre translates — the filter *region* moves through
the noise field and the turbulence is regenerated every frame. A displacement filter on
the existing lens circle would therefore be a per-frame turbulence raster over a region
that ends at full viewport. That is the same class of mistake as a live CSS filter,
just wearing an SVG hat.

**So: the filter never touches the lens circle, and the filtered shape never changes
geometry.**

```
<mask id="xray-lens">
  <circle .../>              <!-- Loop 3's lens. cx/cy/r attrs. NO filter. Untouched. -->
  <g class="ink">            <!-- Loop 4. transform only. display:none at rest. -->
    <circle r="400" filter="url(#xray-ink)" .../>   <!-- fixed geometry, filtered once -->
    <circle r="400" .../>                            <!-- companion blot, offset -->
  </g>
</mask>
```

The blots are authored at a fixed local radius and driven **only** by
`transform: translate(x,y) scale(k)`. The filter runs on constant local geometry, so
its region is constant and its raster is cacheable; the ancestor transform maps the
already-filtered result. Per-frame we write one transform string. This also keeps
guardrail #1 literally true — transform and opacity, nothing else.

Cost of the trade: at full flood the filtered raster is upscaled ~7×, so the edge
detail smears. That is acceptable *because the edge is off-screen at full flood* — the
irregular edge only has to read at k ≈ 1–3, where the upscale is 1–3×.

`display:none` at rest (a discrete state change on flood start/end, not a per-frame
write) means the filter costs exactly zero until the first `pointerdown`. Loop 3's
measured 60fps path is bit-for-bit unchanged.

## Motion

One spring, replacing nothing that already works:

| Quantity | Driver | Why |
|---|---|---|
| `px/py` lens centre | lerp 0.18 (Loop 3) | unchanged, measured, passing |
| `r` lens radius | lerp 0.12 (Loop 3) | unchanged |
| `k` blot scale | **spring k=120 c=18 m=1** | new this loop |

Spring, not a bezier, because pointerup mid-expansion has to inherit velocity rather
than restart a timeline. ζ = 18/(2·√120) = 0.82 → ~1% overshoot, which is the "paper
sucking back" the spec asks for, and a step response of ~42% travel in the first 120ms
then a long settle — the requested weight profile, computed rather than eyeballed.

Fixed-timestep substepping (8ms) so a dropped frame cannot make the spring explode.
Clamp accumulated dt at 100ms — a backgrounded tab must not integrate a 30s step
(this is also Loop 8 item 3, taken for free here).

`K_FLOOD` is derived, not hardcoded: the blot's solid core is 62% of its feather, so
`k = diag * 1.15 / (400 * 0.62)`. Recomputed on the debounced resize that already
exists.

## Hooks and edges

- `data-flooded` on `.hero` when the blot's covered radius > 60% of the viewport
  diagonal. Fades the ring out; gates artistic-layer animations via
  `animation-play-state`. **Honest note:** the artistic layer has no animations yet
  (Loop 5 owns them), so this loop ships the contract and the ring fade, and Loop 5
  re-verifies the 0-CPU-before-pointerdown claim with real animations behind it.
- `setPointerCapture` on pointerdown → pointerup always arrives, including released
  outside the window. `pointercancel` and `lostpointercapture` both recede. (Loop 8
  items 2 and 3, cheap now, so taken now.)
- pointerdown on a link/button does **not** flood — clicking the CTA should navigate,
  not stage a light show.
- Rapid click-click-click: `tk` is a target, not a timeline. Nothing queues.

## Acceptance to run

`scripts/hero-ink.spec.ts`, added alongside the existing two specs:
1. worst frame during expansion, and long-task count (`PerformanceObserver`).
2. release at 100 / 300 / 700ms — sample `k` across the release, assert monotone
   descent with no discontinuity > a frame's worth of travel.
3. 10 rapid clicks — assert final resting state is closed and the loop went idle.
4. filter cost before first pointerdown is zero — assert `display:none`.
5. Loop 3's whole spec re-runs green (the fast path must be untouched).
