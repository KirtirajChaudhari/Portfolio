# DESIGN.md — My Life as a Novel

Single source of truth for every color, type, spacing, and motion value on this site.
If any other tool, skill, or component generator suggests a conflicting value, **this file wins**.
21st.dev Magic MCP prompts must include the tokens from this file; Magic's default styling never ships.

## The two worlds (intentional, by design)

The book metaphor is carried by **structure, typography, and motion** — not by a shared palette.
The two chapters are deliberately different color worlds:

- **Chapter One — The Engineer**: flat dark ground, white type, one blue accent used as glass and light. Register: yaros.me — dark background, blue glass highlights, no second hue. Precision and credibility.
- **Chapter Two — The Creator**: paper-white ground, ink type, a multi-color "crayon set" used in big honest swatches. Register: toryloves.art — whimsical, chaptered, personal-narrative; photography entry in bureaudimanche.com's bold-typographic style.

What makes them one book: the same three typefaces, the same motion grammar (below), the same
chapter-marker sequence, and case-study/project structures that rhyme. Nothing else is shared, on purpose.

## Chapter One tokens (default `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.14 0.005 260)` | The one flat dark ground. No temperature system, no hue shifting, nothing layered structurally on top. |
| `--surface` | `oklch(0.18 0.008 260)` | Card/panel fill (glass cards get this at 55–70% alpha + blur). |
| `--surface-2` | `oklch(0.22 0.01 260)` | Second elevation, rare. |
| `--border` | `oklch(0.32 0.01 260)` | 1px hairlines; glass cards use `--text` at 8–12% alpha instead. |
| `--text` | `oklch(0.95 0.005 260)` | Near-white. |
| `--text-muted` | `oklch(0.72 0.01 260)` | Secondary copy. ≥ 4.5:1 on `--bg` and `--surface`. |
| `--accent` | `oklch(0.72 0.13 252)` | THE blue. Refined from the original `#58a6ff`; the only accent hue in Chapter One. |
| `--accent-deep` | `oklch(0.56 0.14 255)` | Hover-darkened / on-light states. |
| `--accent-glass` | `oklch(0.72 0.13 252 / 0.12)` | Blue as light: card rims, soft ambient glows, focus rings. |

Rules:
- One accent. **No gradient pair** — the blue→purple pair stays dead. Blue may appear as *light*
  (soft `--accent-glass` glow, glass rim, italic serif attribution) but never as a second hue family.
- No gradient text, no side-stripe borders, no pure `#000`/`#FFF`.
- Film grain (`.noise-overlay`, 0.035) stays sitewide as the shared "paper/film stock" texture.

## Chapter Two tokens (`[data-chapter="two"]`, applied on `/creator`)

**PROPOSED REVISION (v3.1) — variety-first color system.** Baseline to build forward from:
the pre-redesign hero at `git show 5b56122:components/novel/chapter-two/CreatorHero.tsx`
(scattered taped snapshots with parallax drift, serif-italic kinetic title, drawn ink swash,
handwritten margin notes). That composition returns, recolored onto this system.

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.97 0.004 95)` | Paper white, faint warm. Subtle grid/dot ruling allowed as texture. |
| `--surface` | `oklch(1 0 0 / 0.85)` | White cards/posts sitting on the paper. |
| `--border` | `oklch(0.87 0.01 95)` | Pencil-light hairlines. |
| `--text` | `oklch(0.25 0.015 285)` | Ink. ≥ 4.5:1 everywhere, including on any colored surface. |
| `--text-muted` | `oklch(0.5 0.015 285)` | Captions, dates. |
| `--crayon-pink` | `oklch(0.78 0.13 350)` | Crayon kit — six real hues. |
| `--crayon-violet` | `oklch(0.65 0.17 300)` | |
| `--crayon-blue` | `oklch(0.74 0.11 265)` | |
| `--crayon-peach` | `oklch(0.83 0.1 55)` | |
| `--crayon-sun` | `oklch(0.87 0.13 95)` | |
| `--crayon-leaf` | `oklch(0.78 0.13 150)` | |

**Application rules (toryloves mechanics — variety across many small elements):**
- **HARD BAN: a full-bleed, section-width, single-hue block is never the color mechanism.**
  (This is the named failure that produced the rejected flat-pink hero. Same class of ban as
  the eyebrow-kicker grammar.) The `SectionBand` full-bleed pattern is deprecated with it.
- Crayon hues live at small and medium scales, several per viewport, each doing one job:
  1. **Highlighter strokes** — rotated ~0.5em-tall swatch behind a title word (not the whole line).
  2. **Drawn SVG accents** — swashes, arrows, circles, underlines; 2–3px strokes in crayon hues.
  3. **Chips, keycaps, stickers** — small filled shapes (skill chips, tag pills, sticker dots).
  4. **Tape strips** on photo cards — each tape a different hue across a wall.
  5. **Offset color mats** — a tilted crayon-colored backing card peeking 8–16px behind a white
     photo/poem card.
  6. **Poem-title underlines / handle links.**
- Each section still has a **lead hue** (photography blue, poetry violet, music peach, intro pink)
  expressed through those elements — never as a background fill. Supporting hues may appear in
  small roles; count of visible hues per viewport should be ≥ 3 (the "colorful" test).
- Ink (`--text`) stays the only text color; crayon hues are never text below 24px.
- The cream-scrapbook kit (torn edges, coffee rings, `.creator-paper`) stays retired; polaroid-style
  white frames + colored tape return as clean post cards, not aged paper.
- The darkroom/warm-noir concept stays **cancelled**; nothing in Chapter Two is dark-themed.

**Hero carry-forward:** keep from the git baseline — snapshot scatter + per-card parallax drift,
serif-italic KineticText title, drawn swash (now `--crayon-pink`), Caveat margin notes, "Chapter Two"
marker; change — paper-white ground instead of cream, white post-card frames with per-card crayon
tape instead of aged polaroids, swash/note accents from the crayon kit, scroll hint as a slow
opacity pulse (no bounce).

## Typography (shared — this is a continuity thread)

| Role | Face | Notes |
|---|---|---|
| Display / headings | **Antonio** | Both chapters. Ch.1: white on dark. Ch.2: ink on paper/bands. Cap `clamp()` max at 6rem, letter-spacing ≥ -0.02em, `text-wrap: balance`. |
| Body / prose | **Spectral** 400/500 + italic | Both chapters — the author's voice never changes. 17px/1.7 desktop, 68ch max. |
| Handwriting | **Caveat** | Ch.2 captions, margin doodle labels, sticker text. Never body copy; never in Ch.1. |

No additional families. Spectral italic (not tracked caps) is the label/attribution voice in Ch.1.

## Copy & label grammar

- Labels are **plain and direct**: "About Me", "The Problem", "The Approach", "Tech Stack",
  "Key Decisions", "Skills", "Experience & Education". No narrative-voice microcopy, no
  film-intertitle styling decisions attached to them — they are ordinary headings in the type scale.
- The only sequence markers are the real ones: "Chapter One", "Chapter Two", "Epilogue"
  (Spectral italic, accent/ink color). No eyebrow kickers anywhere.
- Numbered lists (01/02/03 with a hairline rule, karolinahess pattern) are allowed **inside** a section
  whose content is genuinely a list (About principles, Experience roles) — not as section scaffolding.

## Section structures (approved patterns)

- **About Me (Ch.1)** — karolinahess pattern: prominent portrait (real photo; until supplied, a
  stylized still from the existing hero frames), one large short statement headline (not a paragraph),
  a short supporting paragraph beside/below it, then a numbered 01–03 "how I work" list with hairline
  rules. Copy drafted from the existing about body, shown for approval at build.
- **Experience & Education (Ch.1)** — full restructure, spine cancelled. Two parts:
  1. **Credential badges** (yaros pattern): a row of small glass cards — institution/company logo +
     two-line label (degree/cert + org) — for education and certifications.
  2. **Numbered role blocks** (karolinahess pattern): 01/02/03… per role — title, org link, date range,
     one-sentence description, small skill chips. No scroll-drawn spine, no dot rail.
- **Projects (Ch.1 homepage)** — xhulia pattern, one full-width block per project, stacked:
  meta line (name — year), one outcome-driven subtitle sentence, a dot-separated row of quantified
  metric chips from real data in `content/projects.ts` (e.g. "88% CV accuracy · 23K+ graph nodes ·
  SIH 2025"), a mosaic/preview strip, and a "View case study" pill. Uniform card grid retired
  (the compact card grid may survive only as "related projects" on case-study pages).
- **Case-study pages** — entry title-card completing the grid's ripple; then Problem → Approach →
  Tech Stack → Key Decisions with plain labels; related-3 grid; "back to the story" link.
- **Photography (Ch.2)** — bureaudimanche pattern for the ENTRY TYPE ONLY: huge ink display type
  on the paper (a highlighter stroke behind one word, not a colored band), opening into a scrollable
  post feed (Instagram embeds as white post cards with per-card crayon tape). Feed scroll rhythm
  (snap, reveal timing) to be tuned with emil-design-eng at build.
- **Poetry / Music / Video (Ch.2)** — toryloves pattern: short titled first-person beats with drawn
  crayon accents; poems as ink-on-paper cards over offset color mats; music/video as embedded post
  cards. Section identity via lead-hue small elements — full-bleed band dividers are deprecated.

## Spacing & layout

- Base unit 4px; section rhythm `clamp(5rem, 12vh, 9rem)`, varied deliberately.
- Prose 68ch; standard container `max-w-6xl`; full-bleed for band dividers and mosaic strips.
- `min-h-dvh` for full-viewport scenes; `h-svh` where GSAP pinning needs a stable height.
- Z-scale: `--z-nav: 40; --z-transition: 50; --z-modal: 60; --z-toast: 70`.

## Motion (shared — the strongest continuity thread)

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--dur-fast: 160ms;  --dur-ui: 240ms;  --dur-reveal: 700ms;  --dur-scene: 900ms;
```

- MOTION_INTENSITY: **high (scroll-driven / magnetic)** · VISUAL_DENSITY: **spacious**.
- One shared reveal (opacity + 24px rise, `--dur-reveal`, `--ease-out`, once). Stagger 30–80ms in-group.
- Ch.1↔Ch.2 transition: ~`--dur-scene` at `--ease-in-out` — a page-turn/light-flip that crosses
  from the dark world to the paper world (the moment the two palettes exist for).
- Case-study entry: title-card completing the exit ripple.
- Hovers: transform/opacity, ≤ `--dur-ui`, gated `(hover: hover)`. Press: `scale(0.98)` `--dur-fast`.
- `prefers-reduced-motion`: crossfades stay, movement/pinning/parallax dropped; content never hidden.
- Libraries: GSAP + ScrollTrigger, Lenis, motion/react, R3F. No new motion libraries.

## Pattern notes (ui-ux-pro-max vocabulary — names/keywords only)

Ch.1: Motion-Driven + Parallax Storytelling + Dimensional Layering + Dark Mode OLED (flat deep dark,
minimal glow, high readability, single blue accent). Ch.2: Memphis Design (playful geometry, rotate/clip-path, patterns) +
Vibrant & Block-based (block sections, bold color, scroll-snap energy) + Handwritten Charm
(Caveat accents) — implemented with this file's crayon tokens, not the generator's hexes.
Generator anti-patterns: corporate templates, generic layouts.

## Anti-references (hard bans)

AI purple/pink **gradients** · any gradient accent pair · gradient text · SaaS hero-with-illustration ·
emoji icons · default Inter+shadcn look · 3D-blob/aurora backgrounds · nested cards · gray-on-colored
text · icon-tile-above-heading · pointless bento grids · side-stripe borders · eyebrow kickers ·
pure #000/#FFF · film-intertitle or narrator-voice microcopy on functional labels · dark-themed
Chapter Two · cream/scrapbook Chapter Two (both prior concepts are dead; Ch.2 is paper-white + crayon color).
