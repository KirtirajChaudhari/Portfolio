# Full Portfolio Redesign — Implementation Plan

A complete visual and structural redesign of `sia-portfolio`, built from zero while preserving the dual-mode toggle concept, the tech stack, and baseline accessibility.

---

## User Review Required

> [!IMPORTANT]
> **Subjective design decisions that set the brand direction** — please review these before I proceed. Any of these can be changed, but they'll propagate throughout the entire build.

### 1. Color System

**Professional mode** — deep navy/slate dark theme with a cool blue-cyan accent:
| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#06090F` | Near-black canvas (navy undertone) |
| `--surface` | `#0D1117` | Cards, elevated surfaces |
| `--surface-2` | `#161B22` | Secondary surface (timeline, skill tags) |
| `--border` | `#21262D` | Subtle borders |
| `--text` | `#E6EDF3` | Primary text (warm-cool white) |
| `--text-muted` | `#8B949E` | Secondary text |
| `--accent` | `#58A6FF` | Links, CTAs, highlights |
| `--accent-glow` | `#1F6FEB` | Glow effects, gradients |

**Artistic mode** — warmer, moodier dark theme with an amber/warm accent:
| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#0C0A09` | Near-black canvas (warm undertone) |
| `--surface` | `#1C1917` | Cards, elevated surfaces |
| `--surface-2` | `#292524` | Secondary surface |
| `--border` | `#44403C` | Subtle borders |
| `--text` | `#FAFAF9` | Primary text |
| `--text-muted` | `#A8A29E` | Secondary text |
| `--accent` | `#F59E0B` | Amber — warmth, creativity |
| `--accent-glow` | `#D97706` | Glow effects |

Both modes are dark — the transition between them is a **temperature shift** (cool → warm) rather than a light/dark flip. This creates a visceral mood change without breaking readability.

### 2. Typography

**Font pairing:** [Inter](https://fonts.google.com/specimen/Inter) for body + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for display headings.

- Inter: clean, professional, excellent at small sizes — ideal for body copy, skill tags, timeline entries
- Space Grotesk: geometric yet distinctive, techy personality without being cold — perfect for a CS/AI graduate's portfolio headings

Loaded via `next/font/google` (two weights each: 400/500 for Inter, 500/700 for Space Grotesk).

### 3. Animation Language

- **Scroll reveals:** `whileInView` with `once: true`, 20px upward translation + opacity fade, staggered for lists
- **Mode transition:** Reimagined as a **perspective rotation** — outgoing view rotates slightly on the Y axis and fades, incoming rotates in from the opposite side. Under `prefers-reduced-motion`, degrades to a cross-fade
- **Lenis smooth scroll:** Adding `lenis` (lightweight scroll physics library) for buttery momentum scrolling — inspired by the Majd template
- **Toggle micro-interaction:** Sun/moon-style icon morph with a smooth color temperature transition on the toggle pill itself — inspired by Portavia

### 4. Overall Tone

Professional mode = **confident, structured, proof-first** — a recruiter should immediately see competence.  
Artistic mode = **warm, narrative, personal** — a human voice behind the engineer.

---

## Open Questions

> [!IMPORTANT]
> **Avatar file format:** The existing avatars are `.png` (not `.webp` as the content schema references). The files are:
> - `professional-full.png` (1.7 MB), `professional-icon.png` (1.8 MB)
> - `artistic-full.png` (1.7 MB), `artistic-icon.png` (1.9 MB)
>
> These are quite large. Should I:
> - **A)** Use them as-is and let Next.js `<Image>` handle optimization
> - **B)** Convert them to WebP and resize during the build (would add a build step)
> - **C)** Just use them as-is — they'll be fine with `<Image>` optimization (recommended)

> [!NOTE]
> The `content/shared.ts` references `.webp` hero paths that don't exist yet (`professional-hero.webp`, `artistic-hero.webp`). I'll normalize all avatar references to use the existing `.png` files.

---

## Proposed Changes

### Phase 1 — Foundation & Infrastructure

---

#### New Dependency: Lenis

Install `lenis` for smooth scroll physics (Majd reference). Lenis only manages scroll behavior — it doesn't conflict with Motion's animation system.

#### [MODIFY] [package.json](file:///d:/Resume/Portfolio/MyPortfolioDev/sia-portfolio/package.json)
- Add `lenis` dependency
- Add `@fontsource/space-grotesk` if needed (or use `next/font/google`)

---

#### [MODIFY] [globals.css](file:///d:/Resume/Portfolio/MyPortfolioDev/sia-portfolio/app/globals.css)
Complete rewrite of the design token system:
- CSS custom properties for both modes (Professional / Artistic), switchable via `data-mode` attribute on `<html>`
- Tailwind `@theme` block mapping tokens to Tailwind utilities
- Base typography styles, smooth scrolling setup
- Noise/grain overlay (subtle texture)
- Custom scrollbar styling
- Lenis integration CSS

#### [MODIFY] [layout.tsx](file:///d:/Resume/Portfolio/MyPortfolioDev/sia-portfolio/app/layout.tsx)
- Switch fonts to Inter + Space Grotesk via `next/font/google`
- Add proper SEO metadata
- Set `data-mode="professional"` as default on `<html>`

#### [MODIFY] [page.tsx](file:///d:/Resume/Portfolio/MyPortfolioDev/sia-portfolio/app/page.tsx)
- Complete rewrite as the new site shell entry point
- Renders the new `<SiteShell>` with both view slots

---

### Phase 2 — Core Architecture (Store + Shell + Toggle)

---

#### [MODIFY] [useViewMode.ts](file:///d:/Resume/Portfolio/MyPortfolioDev/sia-portfolio/store/useViewMode.ts)
- Keep the core `mode` / `direction` / `setMode` / `toggle` pattern (it's sound)
- Add a side-effect subscriber that toggles `data-mode` on `document.documentElement` for CSS token switching
- Export types from here

#### [NEW] components/ui/SiteShell.tsx
The new top-level layout component replacing `PortfolioShell.tsx`:
- Full-height wrapper with noise overlay and gradient backgrounds
- Floating navigation header (glassmorphism) with name, nav links, and mode toggle
- Contains the `<ViewTransition>` zone for mode switching
- Integrates Lenis smooth scroll provider
- Swipe + hotkey hooks

#### [NEW] components/ui/ModeToggle.tsx
Completely redesigned toggle inspired by Portavia:
- Pill-shaped segmented control showing BOTH labels ("Professional" / "Artistic")
- Active side gets accent highlight with smooth sliding indicator
- Icon morph: briefcase ↔ palette (using Lucide icons)
- Smooth color temperature transition on the pill itself
- Keyboard accessible (action button semantics preserved)
- `aria-live` region for screen readers

#### [NEW] components/ui/ViewTransition.tsx
Replaces `ModeSwitcher.tsx`:
- Perspective-rotation based transition (Y-axis tilt + opacity)
- `AnimatePresence` with grid-stack technique (preserved from current — it's clever)
- `prefers-reduced-motion` → cross-fade only
- `custom={direction}` on `AnimatePresence` (preserved)

#### [NEW] components/ui/SectionReveal.tsx
Reusable scroll-triggered reveal wrapper:
- `whileInView` with configurable direction and delay
- Stagger support for lists
- Respects `prefers-reduced-motion`

#### [NEW] components/ui/SectionHeading.tsx
Consistent section heading with:
- Overline label (small caps, accent color)
- Main heading (Space Grotesk, large)
- Optional description

#### [NEW] components/ui/GlassCard.tsx
Reusable card component with:
- Glassmorphism styling (backdrop-blur, border, surface color)
- Hover lift + glow effect
- Mode-aware accent coloring

---

### Phase 3 — Professional Mode Sections

All in `components/professional/`:

#### [NEW] ProfessionalView.tsx
Section composition in LaunchFolio-inspired order:
1. Hero → 2. Projects (proof first) → 3. Skills → 4. Experience/Education Timeline → 5. Achievements (counters) → 6. Certifications → 7. About → 8. Contact/CTA → 9. Footer

#### [NEW] Hero.tsx
- Full-viewport hero with large headline, gradient text accent
- Avatar image (using existing professional-full.png)
- Role tagline + value proposition
- Two CTAs: "View Projects" (primary, scroll anchor) + "Download Resume" (secondary, ghost)
- Animated grid/dot pattern background (subtle)

#### [NEW] Projects.tsx
Case-study style (Portavia reference):
- Featured projects (3) get large cards with:
  - Gradient placeholder visual with Lucide icon
  - Title + one-liner
  - Tech stack tags
  - Outcome badge (if available)
  - Links (Live, GitHub)
- Remaining projects in a compact grid
- Expandable description on click/tap

#### [NEW] Skills.tsx
Grouped/tagged skill list (NOT percentage bars — per brief):
- Category headers (Languages, Web Dev, DS & ML, etc.)
- Tag cloud style within each group
- Subtle hover highlight
- Grid layout: 2 or 3 columns on desktop

#### [NEW] Timeline.tsx
Vertical timeline (Meeko reference):
- Alternating left/right on desktop, stacked on mobile
- Icon per type (🎓 education, 💼 internship, 📜 certification)
- Animated line that draws as you scroll
- Date range on the opposite side
- Expandable description

#### [NEW] Achievements.tsx
Animated counter strip (Meeko reference):
- 3 large numbers that count up on scroll into view
- Labels below each: "Projects Shipped", "Certifications", "Internships"
- Full-width section with accent gradient background

#### [NEW] Certifications.tsx
- Compact grid of certification badges
- Organization logo/icon area + title
- Hover to see organization name

#### [NEW] About.tsx
- Two-column: avatar image left, bio text right (mobile: stacked)
- Pull `professionalAbout` from content
- Social links row at bottom

#### [NEW] Contact.tsx
- CTA section with large heading: "Let's work together"
- Email link, social icons
- Resume download button
- Optional: simple contact form (email + message) — or just mailto link

#### [NEW] Footer.tsx
- Minimal footer: name, copyright, social links
- "Made with" stack badges (optional, tasteful)

---

### Phase 4 — Artistic Mode Sections

All in `components/artistic/`:

#### [NEW] ArtisticView.tsx
Section composition:
1. Hero → 2. Narrative Intro → 3. Creative Disciplines (tabbed) → 4. Featured Work Spotlight → 5. Contact → 6. Footer

#### [NEW] Hero.tsx
- Artistic hero with warm amber palette
- Different headline voice: "The Other Side" or similar
- Artistic avatar (existing artistic-full.png)
- Flowing/organic animation (contrast with professional's structured grid)

#### [NEW] NarrativeIntro.tsx
- Large serif-feel text (Space Grotesk at weight 500, oversized)
- `artisticStory` content
- Reading pace — no rush, generous whitespace

#### [NEW] Disciplines.tsx
- Tabbed interface (Meeko reference) for 3 disciplines: Music, Photography, Writing
- Each tab shows works from that discipline
- Tab icons match avatar props (tabla/camera/pen)
- Media cards with thumbnails and descriptions

#### [NEW] FeaturedWork.tsx
- Spotlight section for the featured piece
- Large media display
- Story/context text alongside

#### [NEW] Contact.tsx (artistic variant)
- Casual voice: "Want to collaborate?" / "Drop me a line"
- Same email/socials but warmer styling

#### [NEW] Footer.tsx (artistic variant)
- Warmer tone, possibly with a quote/reflection

---

### Phase 5 — Hooks & Utilities

#### [MODIFY] hooks/useSwipe.ts
- Keep as-is — the implementation is solid and well-documented

#### [MODIFY] hooks/useModeHotkeys.ts
- Keep as-is — well-designed with proper input field guards

#### [NEW] hooks/useLenis.ts
- Lenis smooth scroll initialization hook
- Integrates with React lifecycle
- RAF update loop

#### [NEW] hooks/useCountUp.ts
- Animated counter hook for achievement numbers
- IntersectionObserver triggered
- Configurable duration and easing

---

### Phase 6 — Content Updates

#### [MODIFY] content/types.ts
- Potentially minor additions (no major structural changes needed — the schema is well-designed)

#### [MODIFY] content/shared.ts
- Fix avatar paths to use existing `.png` files
- Add any new shared content (nav links, footer copy)

#### [MODIFY] content/professional.ts
- Content stays the same (it's real content, well-structured)
- May add ordering hints

#### [MODIFY] content/artistic.ts
- Keep existing content
- Ensure all disciplines are present (Music, Photography, Writing — audio discipline seems missing from artistic but was mentioned in the brief)

---

### Phase 7 — Cleanup

#### [DELETE] components/PortfolioShell.tsx
#### [DELETE] components/ModeSwitcher.tsx
#### [DELETE] components/ModeToggle.tsx
#### [DELETE] components/professional/Reveal.tsx
#### [DELETE] components/professional/Section.tsx
#### [DELETE] components/professional/contact.ts
#### [DELETE] All old professional components (replaced by new ones)

---

## File Organization (Final)

```
sia-portfolio/
├── app/
│   ├── globals.css          ← Complete rewrite (design tokens, base styles)
│   ├── layout.tsx           ← Updated fonts + metadata
│   └── page.tsx             ← New entry point
├── components/
│   ├── ui/                  ← Shared UI primitives
│   │   ├── SiteShell.tsx
│   │   ├── ModeToggle.tsx
│   │   ├── ViewTransition.tsx
│   │   ├── SectionReveal.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── GlassCard.tsx
│   │   └── LenisProvider.tsx
│   ├── professional/        ← Professional mode sections
│   │   ├── ProfessionalView.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Timeline.tsx
│   │   ├── Achievements.tsx
│   │   ├── Certifications.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── artistic/            ← Artistic mode sections
│       ├── ArtisticView.tsx
│       ├── Hero.tsx
│       ├── NarrativeIntro.tsx
│       ├── Disciplines.tsx
│       ├── FeaturedWork.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
├── content/                  ← Minimal changes (data is solid)
│   ├── types.ts
│   ├── shared.ts
│   ├── professional.ts
│   └── artistic.ts
├── hooks/
│   ├── useSwipe.ts          ← Keep
│   ├── useModeHotkeys.ts   ← Keep
│   ├── useLenis.ts          ← New
│   └── useCountUp.ts        ← New
├── store/
│   └── useViewMode.ts       ← Modified
└── public/
    └── avatars/              ← Existing PNGs reused
```

---

## Verification Plan

### Automated Tests
```bash
# TypeScript strict mode check
npx tsc --noEmit --strict

# ESLint
npm run lint

# Build check (ensures no SSR/hydration issues)
npm run build
```

### Manual Verification
- Run `npm run dev` and visually inspect:
  - Professional mode: all 9 sections render, scroll reveals trigger, counters animate
  - Artistic mode: all 6 sections render, tab switching works, warm palette applies
  - Mode toggle: smooth transition, color temperature shift, keyboard accessible
  - Lenis smooth scroll: momentum scroll feels natural
  - Mobile: responsive layouts, swipe gesture works, no horizontal overflow
  - `prefers-reduced-motion`: all motion degrades to cross-fades
  - Browser recording of the complete flow
