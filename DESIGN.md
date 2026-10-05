---
name: Kirtiraj Chaudhari — X-Ray Hero
description: One person, two truths, one box. A cold professional layer with a darkroom artistic layer revealed through a lens.
colors:
  filtered-white: "#f2f4f6"
  panel: "#fcfdfe"
  graphite: "#14161a"
  graphite-mute: "#5a6068"
  signal: "#0b63e5"
  hairline: "rgba(20, 22, 26, 0.10)"
  safelight-ground: "#140a0c"
  emulsion: "#201316"
  print-warm: "#f0e4d9"
  print-mute: "#b39c90"
  safelight: "#e4465a"
typography:
  display:
    fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7.2vw, 6rem)"
    fontWeight: 600
    lineHeight: "clamp(3.2rem, 8.4vw, 7rem)"
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: "1.75rem"
  label:
    fontFamily: "ui-monospace, 'SFMono-Regular', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "0.14em"
rounded:
  pill: "999px"
spacing:
  gap: "28px"
  gutter: "32px"
components:
  cta-pro:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 28px"
  cta-art-ghost:
    backgroundColor: "{colors.safelight}"
    textColor: "{colors.safelight-ground}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 28px"
---

# Design System: Kirtiraj Chaudhari — X-Ray Hero

Scope: the `XRayHero` surface (`src/components/hero/XRayHero.vue`, tokens declared on `.hero`). Site-wide tokens in `src/styles/tokens.css` follow a separate Apple-derived system for Chapter One and a warm pinboard for Chapter Two; they are not restated here. Sources: `docs/xray-plan.md` §4–7, `CLAUDE.md` guardrails.

## 1. Overview

**Creative North Star: "The Explainability Overlay"**

The hero is the author's own thesis turned on himself: models that show their reasoning, run on the person who built them. A cold, over-lit professional layer states what he builds. A warm darkroom layer, uncovered by a lens, states why. The lens is the mechanism, not the signature; the two layers are the signature, and they must register exactly.

Both rooms are defined by what they exclude. Clean Room excludes particles. Safelight excludes light. Each has exactly one accent, and the two accents are the cold and hot ends of one saliency ramp, not two brand colours.

This system rejects the cream/serif/terracotta default, gradient blobs, decorative contour wallpaper, a boot curtain gating the first read, two competing CTAs, and any copy or imagery invented to fill space. Empty stays empty until the author supplies the real thing.

**Key Characteristics:**
- Two layers from one template; every geometry value declared once on `.hero`.
- One accent per layer: `signal` (cold) and `safelight` (hot).
- A single display face and weight in both layers, so headlines hold the same box.
- Flat surfaces. No card shadows, no glows.
- The lens is theatre, not navigation: everything behind it exists in accessible DOM.

## 2. Colors

Luminance-inverted pair: Clean Room at L* ≈ 96, Safelight at L* ≈ 6. The artistic layer sits on top and is masked, so the feather only ever darkens the layer beneath it.

### Primary
- **Signal Blue** (#0b63e5): the professional accent. Links, CTA fill, focus rings, tag labels. 4.85:1 on Filtered White.
- **Safelight Red** (#e4465a): the artistic accent. Eyebrow, tag labels, ghost CTA. 4.94:1 on Safelight Ground. Chosen over #e0384a, which measured 4.48.

### Neutral
- **Filtered White** (#f2f4f6): professional ground. Cool off-white, never #ffffff.
- **Panel** (#fcfdfe): raised professional surface.
- **Graphite** (#14161a): display and body ink on Filtered White. 16.43:1.
- **Graphite Mute** (#5a6068): lead and tag detail. 6.03:1.
- **Hairline** (rgba(20,22,26,0.10)): the only border weight.
- **Safelight Ground** (#140a0c): artistic ground. Warm near-black.
- **Emulsion** (#201316): second artistic surface step.
- **Print Warm** (#f0e4d9): artistic type. 15.58:1.
- **Print Mute** (#b39c90): artistic secondary type. 7.19:1.

### Named Rules
**The One Voice Rule.** Each layer has one accent and no second. `signal` never appears in the artistic layer; `safelight` never in the professional.

**The Feather Rule.** No artistic type may live permanently in the 40%-alpha feather band. Artistic type sits inside the solid core or it is texture.

## 3. Typography

**Display Font:** Inter Tight 600 (with Inter, system-ui)
**Body Font:** Inter 400, 600 for strong
**Label/Mono Font:** system `ui-monospace` stack (zero bytes)

**Character:** One grotesk, one weight, tight at display size. The layers separate by colour and texture, not by typeface, because a different face cannot hold the same right edge from 320 to 2560px.

### Hierarchy
- **Display** (600, clamp(2.75rem, 7.2vw, 6rem), line-height clamp(3.2rem, 8.4vw, 7rem), tracking -0.035em): the H1 in the professional layer, a `<p>` in the artistic twin. Max 15ch, `text-wrap: balance`.
- **Body** (400, 17px, 28px): the lead. 46ch measure. 28px is the shared baseline unit.
- **Label** (400, 12px, 20px, tracking 0.14em, uppercase): eyebrow and tag labels.

### Named Rules
**The Registration Rule.** A font swap is safe only because both layers share the display face. Never give one layer a different family, weight, or tracking.

## 4. Elevation

Flat. Depth comes from the layer change itself: the lens is the only depth cue. No box-shadow on hero content. The ring uses `mix-blend-mode: difference` and moves by `transform` only.

### Named Rules
**The Per-Frame Rule.** Only `transform`, `opacity`, and mask-feeding attributes change per frame. Never `filter`, `backdrop-filter`, `box-shadow`, size or position properties, or `background-position`. One rAF loop for the whole hero.

## 5. Components

### Buttons
- **Shape:** full pill (999px), 48px high, 28px horizontal padding, 17px/600.
- **Primary (professional):** Signal Blue fill, white text. Outline 2px Signal Blue at 3px offset on `:focus-visible`.
- **Ghost (artistic):** plain Safelight Red text, no fill, no padding. A `span`, inert, never focusable. It holds the slot open for registration and does not navigate, so it must never be dressed as a pill: under the lens a click lands on the professional CTA.

### Chips / Tags
- **Style:** 12px mono, label in uppercase tracked accent, detail in mute. Chapter link is underlined 1px in the layer's text colour.
- **State:** the row has a fixed height from `--tags-lines`, never `auto`.

### Lens Hint
- Static 12px mono line with a ring glyph, bottom-right of the column, identical in both layers. Only shown where the lens runs and above 900px.

### Signature Component: The Lens
- **Mechanism:** SVG `<mask>` on the artistic layer. A radial-feathered circle (stops 1 / 1 / 0.4 / 0 at 0 / 0.74 / 0.9 / 1) lerps behind a ring at the true pointer position.
- **Ink spill:** two fixed-geometry baked blots, moved only by group transform. Hold to flood, release to recede.
- **Fallbacks:** `hover: none` and `prefers-reduced-motion: reduce` get the complete professional layer, no lens.

## 6. Do's and Don'ts

### Do:
- **Do** declare every geometry value once on `.hero` and consume it in both layers.
- **Do** keep every link, heading, and case study reachable in accessible DOM; the lens is theatre.
- **Do** keep grid rows fixed-height so `align-content: center` cannot leak a content delta between slots.
- **Do** render placeholders as `chapter-two/FilmFrame.vue` where real creative work is not yet supplied.
- **Do** hold 4.5:1 for all text in both layers.

### Don't:
- **Don't** invent poetry, lyrics, captions, or photo credits to fill an artistic layout. `poemFragments` is `[]` and `photographyWall[].src` is `''` by design.
- **Don't** render `src/content/artistic.ts` `poemContent`; it is AI filler.
- **Don't** lift any asset, SVG, font file, or line of copy from a reference site.
- **Don't** add a second CTA, a second accent, or a gradient blob to either layer.
- **Don't** use full-bleed raster imagery, `background-blend-mode`, or live filters in the masked layer; masks repaint every frame.
- **Don't** lock orientation, gate on rotation, or require a tap to unlock scroll.
