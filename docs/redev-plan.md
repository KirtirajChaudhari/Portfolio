# re-dev plan

Branch `re-dev`, cut from `main` at `f03c96b`. The audit this answers is `docs/redev-audit.md`.

**Design read.** A portfolio for hiring managers and research collaborators, in an
instrument-and-figure language: it should feel like a well-set scientific figure that happens to
move. Dials: variance 7, motion 7, density 4.

## Identity

- **Type.** Archivo variable (weight and width axes), self-hosted. Display uses the expanded width
  at 600 to 700; body uses normal width at 400. Geist Mono for figures, stacks and dates only.
  Display ceiling 6rem, tracking never tighter than -0.03em.
- **Colour.** OKLCH tokens, light and dark from one set, system preference by default with a toggle.
  Neutral ramp with 0.003 to 0.01 chroma toward hue 20. One accent, signal red, carried over from
  the existing brand (the avatar ground and favicon). It marks the traced path in the 3D scene,
  links and focus. Nothing else is coloured.
- **Shape.** 6 px on controls and inputs, 10 px on image plates, no pills.
- **Scene sentence.** A hiring manager opens the link on a laptop in a lit office between two
  calls: light reads as a printed figure. A student reads a case study at 1am on a phone: dark
  follows the system.

## The 3D

One raw WebGL2 scene on home, no library. 23,756 points, the node count of RasaCare's graph, drawn
as a single `gl.POINTS` call and morphed in the vertex shader between three formations:

| Scroll step | Formation | What it is |
| --- | --- | --- |
| Hero, RasaCare | Clustered graph with one path traced in red | The knowledge graph and an auditable inference path |
| DrishtiManas | Three planes: 2,788 points, 256, 4, with sampled connections | The hand-written network's real layer sizes |
| PRAVAAS | Rails, sleepers and a bounding frame in perspective | Obstacle detection on a track |

Rules it follows (from `CLAUDE.md`): one `requestAnimationFrame` loop, pointer writes to a plain
object, the loop is the only DOM writer, it stops when the stage leaves the viewport. Everything it
depicts also exists as text beside it. Reduced motion gets a still frame per step with no morph.
Touch gets the scroll morph without pointer parallax. A software GPU gets the same formations drawn
once per step on a 2D canvas. The scene module loads after first paint and takes no part in LCP.

Depth on other pages is CSS 3D: pointer-tilted project plates with a spring, and a case-study
screenshot that settles from a tilt to flat as it scrolls in.

## Pages

- **Home `/`** Statement hero, pinned 3D stage stepping through the three lead projects with their
  real figures, experience ledger, recognition set as running type, contact close.
- **Work `/work`** Three lead plates, six-entry index, internships, "What I'm good at" from
  `professionalExpertise` (order kept: projects, internships, expertise).
- **Case `/projects/:slug`** Title, links, plate, outcome figures, problem, approach, stack,
  decisions, next project. Shared-element transition from the plate on Work.
- **About `/about`** Real photograph, rewritten bio (same facts), recognition, education, tools as
  grouped text, certifications grouped, link to the artistic profile.
- **Contact `/contact`** Email with copy, links, the mailto form with per-field errors.
- **404** A real not-found page.
- **Kept as they are:** `/creator` and `/profile-2` (their own visual world, legacy CSS now loaded
  only with them), `/xray` (lens specs run there). The head-tracker home moves to `/character`.
  Both lab routes get a plain way back and are linked from the footer.

## Engineering

- New unlayered `styles/site.css` and tokens; legacy CSS moves into the lazy Creator, X-Ray and
  Character chunks.
- New shell: `Header`, `Footer`, `Page`. View transitions through react-router.
- Fonts via `@fontsource-variable`, preloaded. Creator's Google Fonts load only on Creator.
- Screenshots to WebP at 800 and 1600 wide with `srcset`. Avatar PNGs to WebP.
- Meta: OG and Twitter tags, canonical, `Person` JSON-LD, `robots.txt`, `sitemap.xml`,
  `theme-color`, generated OG image.
- Remove from the pro pages: hanging ID card, typing keyboard, research bento, liquid ocean,
  animated footer, glow cursor, shader backdrop. Files that nothing imports afterwards are deleted.
- New gate `scripts/redev.spec.ts`: routes render, one H1 each, no horizontal overflow at 320 to
  1440, no console errors, axe clean, reduced-motion and touch paths, WebGL context count.

## Acceptance

1. Every route renders with no console errors in the production build.
2. No horizontal overflow from 320 to 1440 px; no text overlapping imagery.
3. axe: no serious or critical violations on the pro pages.
4. Home LCP element is text; the scene chunk is not in the initial request chain.
5. Reduced motion and `hover: none` each land on a complete, static-safe page.
6. Existing lens and character specs still pass on their routes.

## Outcome (2026-11-17)

- `scripts/redev.spec.ts`: 37 checks pass on the production build. Lens, registration and
  head-tracker specs: 28 pass.
- Lighthouse mobile, simulated slow 4G, local build: home 95 to 98, LCP 1.8 to 1.9 s, CLS 0,
  accessibility, best practices and SEO 100. Work, About, Contact and the case studies score 91
  to 99 with CLS 0; where the largest element is an image their LCP measured 2.0 to 2.7 s.
- Prerendering moved into this pass: it was the only way to bring home LCP under 2.0 s.
- Not verified here: real devices, Safari and Firefox, a real GPU (the WebGL path was exercised
  on a software rasteriser), and the Vercel routing of the prerendered files.

## Not in this pass

- Rebuilding the Creator page in the new identity.
- Removing `public/creator/photos` (161 MB, unreferenced): flagged, left for the owner to decide.
- Real captures for the eight projects that have none, second screenshots, diagrams and result
  plots for case studies: need source material.
- Root-level clutter (old HTML portfolios, other brands' design docs, `spike/`): flagged, untouched.

## Creator migration addendum (2026-11-17)

The page list, engineering notes and outcome above describe the original re-dev pass.
The separate Creator rebuild in `docs/creator-plan.md` supersedes its decision to keep
`/creator` and `/profile-2` on the legacy identity. This addendum records implementation;
its gate results are tracked separately and must not be inferred from the earlier 37-test result.

- VERIFIED in source: Creator now uses the same `Page`, Header, Footer, Archivo/Geist Mono,
  tokens, light/dark theme and `data-chapter="pro"` as the professional pages. Only `/xray`
  and `/character` retain the lazy legacy stylesheet and Google Fonts loader.
- VERIFIED in source: the former random 57-photo three.js gallery has been replaced by
  14 selected photographs in a fixed order, with descriptive alt text, intrinsic dimensions,
  lazy grid images and a native dialog. Pointer depth is CSS-only; touch and reduced motion
  remain a static grid. The unused renderer/book subtree and its three/r3f packages were removed.
- VERIFIED in source: the hero uses a real photograph; no avatar, duplicate epigraph, tape,
  marquee or book remains. The debut story, artist bio and subscriber count were omitted under
  the owner's defaults. Supplied reel URLs retain neutral labels. Empty poetry stays empty.
- VERIFIED in source: metadata and prerendering now include both Creator paths, for 15 routes.
  `/profile-2` serves the same page with `/creator` as canonical; only `/creator` is in the sitemap.
- ASSUMED: the artistic-layer LCP rule concerns the `/xray` lens layers. A real photograph may
  be Creator's LCP element if the measured mobile gates pass. No lens artwork is introduced there.
- UNVERIFIED at the time of this addendum: final browser/performance gates. See the completed
  measurements and screenshots in `docs/creator-plan.md` rather than treating source inspection
  as behavioral evidence. Original photos in `public/creator/photos` remain untouched.
