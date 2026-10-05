# Portfolio v2 plan

Checkpoint: tag `checkpoint-pre-v2` (commit `cf86cc7`). One registry component per commit after it.

## CLAUDE.md check
The only override is the allowed `shadcn add`. Everything else (content truth, Lenis/GSAP stay removed,
transform/opacity only, one rAF per system, reduced-motion and `hover: none` static versions) is
followed. A hand-made `components.json` was created first so the CLI never runs `init` and never
writes `index.css` (none of the six items declares css/cssVars; verified: `index.css`, `styles/*`,
`vite.config.ts`, `tsconfig.app.json` have an empty diff vs the checkpoint).

## Registry items: what they really are, and what I do with them
| item | really is | deps it brought | decision |
|---|---|---|---|
| art-gallery (obsidianui) | WebGL infinite draggable image wall (three, atlas textures) | three, clsx, tailwind-merge | Photos section on profile 2. Zero real photo files exist (`photographyWall[].src` is `''` by rule), so tiles are the existing film-frame placeholders drawn to the atlas, captioned "Frame NN", with every real Instagram link in a text list under it. Demo images/titles/remote CDN removed. Hardware-GPU only, near-viewport mount, pause off-screen. |
| interactive-book | CSS-3D book (framer-motion) | framer-motion (ported to motion/react, dep removed) | Writings section. `poemFragments` is `[]` by rule, so the book's real page is the author's own blurb + the Instagram link; real fragments become pages when they exist. Keyboard + SR text; plain list under reduced motion / touch. |
| typing-keyboard | isometric CSS-3D keyboard that auto-types | none | ONE use: About, "Tools I use" chapter, typing the real tool names from `tools.ts`. Flicker (background-color) animation removed; `innerHTML` replaced with `textContent`; aria-hidden + sr-only copy; still frame under reduced motion / touch. |
| research-bento-grid | SaaS pricing demo (brand logos, invoice, pause toggle) | framer-motion, react-icons | Cannot carry expertise as-is. Reuse its Panel (bezel + grain), FeatureCopy, tile mosaic, spring, cursor motion; replace the three bodies with four expertise tiles fed ONLY by `professionalExpertise`. react-icons and framer-motion removed. |
| animated-footer | ASCII-art footer on canvas | gsap, next-themes (both removed: GSAP stays out) | Contact page footer. GSAP calls ported to motion `animate()/stagger()`; theme switch dropped; loop pauses off-screen. The two ASCII "hands" are the two real avatars (professional / artistic): the two profiles. |
| liquid-ocean | r3f low-poly wave mesh + boxes | needs @react-three/fiber + three (undeclared) | Contact hero backdrop (About and creator hosts rejected: creator already has the gallery's WebGL context). three pinned 0.182 (r183+ logs THREE.Clock deprecation). Static gradient under reduced motion / touch / software GL. |

One WebGL context per page: About none, Work none, Contact liquid-ocean (+ none else; footer is 2D canvas), Profile 2 art-gallery, Home none.

## Reference sites
- obsidianui.dev: adopt (art-gallery). canvasui.dev (HTML-in-canvas WebGL/WebGPU effects): idea only, experimental and a context per effect.
- vengenceui.com: adopt (4 items). lightswind.com: already adopted (HangingIdCard); idea: tilt/spotlight.
- getlayers.ai: it is a prompt marketplace; idea only (cinematic section pacing).
- r3f: used by liquid-ocean. shadergradient: rejected (285 kB gz + console warnings, see CLAUDE.md); own 2 kB shader stays.
- liquid-glass-js: rejected (html2canvas + WebGL capture). liquid-logo: idea only (a WebGL context per logo is not worth a mark).

## About: two concepts
A. "Pinned dossier" (chosen). Desktop: the ID card hangs from a pin at the top of a sticky left column and
   sways with scroll velocity (scroll impulse into the card's own pendulum); chapters scroll on the right
   as numbered files with large outlined numerals and dashed leaders. Chapters: intro, ledger, education,
   tools (typing keyboard), certifications, achievements, profile-2 portal. Mobile: card band on top,
   chapters stack, no sway. Cost: no extra deps.
B. "Saliency read": the text is the artefact; a cursor probe paints Grad-CAM-style heat over keywords.
   Strong tie to his explainability thesis but invisible on touch and weak for scanning.
Why A: it uses the one physical object already on the page, makes scroll itself the interaction (works
with mouse wheel, keyboard and touch drag), and keeps every section scannable.

## Work: three languages
- Projects: interactive index. Left a ruled list of titles (hover/focus/arrow-keys select), right a sticky
  detail pane with screenshot, one-liner, real outcome and "Open case". Mobile: accordion.
- Internships: annotated timeline: a vertical rule with date marks and role notes hanging off it, alternating sides on desktop.
- Expertise: research-bento tiles (4), tile sizes weighted by content.

## Contact
Liquid-ocean hero with the real email as the primary action, real links, the existing mailto form kept
(same behaviour), animated-footer as the closing band. Static fallback everywhere.

## Profile 2 (existing `/creator`)
Restyled (type, texture, pacing), same sections and content; Photos = art-gallery, Writings = interactive-book.

## Risks
three bundle (lazy, creator only); gallery shows placeholders until real photo files are supplied; the
book has one real page until real writings are supplied.
