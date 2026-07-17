# Product

## Register

brand

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Kirtiraj Chaudhari (M.Tech AI/ML, MIT-WPU) for AI/ML engineering roles — they arrive from a resume link or LinkedIn, skim on desktop or phone, and decide in under two minutes whether to read a case study. Secondary: creative collaborators and peers (photography, music, poetry circles) who land on Chapter Two and should meet the same person, not a different website.

## Product Purpose

A personal portfolio structured as a two-chapter novel: the site *is* the proof of craft. Chapter One ("The Engineer") carries the hiring case — about, experience/education timeline, nine project case studies, skills, epilogue CTA. Chapter Two ("The Creator") carries the person — photography, poetry, short-form video and music. Success = a recruiter reads at least one case study and downloads the resume; a visitor can retell the "life as a novel" conceit afterwards.

## Positioning

The only AI/ML portfolio that reads like a film — one continuous cinematic narrative across engineering and art, not a template with sections.

## Conversion & proof

- Primary CTA: Download Resume (epilogue/Finale, `finale.primaryCta`).
- Secondary CTA: GitHub / LinkedIn / email links in the Finale footer.
- The line a visitor remembers: "Let's write the next chapter together."
- Belief ladder: (1) this person has unusual taste and craft — felt in the first viewport; (2) the engineering is real — evidenced by problem → approach → decisions case studies with measurable outcomes; (3) the person is multidimensional — Chapter Two in the same voice; (4) I should talk to them — epilogue.
- Proof on hand: nine project case studies with quantified outcomes (accuracy figures, SIH 2025, graph-node counts) in `content/projects.ts`; live Instagram/YouTube/Spotify embeds in Chapter Two; internship history in `content/journey.ts`.

## Brand Personality

- **Chapter One ("The Engineer")**: Cinematic, precise, deep dark background with single blue glass accent. Motion carries narrative weight — scroll is the act of turning pages of a film script. Voice is first-person, quiet, confident.
- **Chapter Two ("The Creator")**: Vibrant, paper-white, whimsical. A personal, illustrated creative portfolio telling stories in full color blocks. 

The two chapters are intentionally completely different visual systems, sharing only typography and the overarching book metaphor.

## Anti-references

- AI purple/pink gradients; stock 3D-blob or aurora backgrounds.
- Generic SaaS hero-with-illustration; templated bento grids with no point of view.
- Default Inter + shadcn look; emoji-as-icons; rounded-square icon tile above every heading.
- Cards nested in cards; gray text on colored backgrounds.
- Tiny uppercase tracked eyebrows above every section (the 2023 kicker grammar is banned).
- Dark-themed or Scrapbook-cream Chapter Two: Chapter Two is specifically bright, vibrant paper-white and crayon colors.

## Design Principles

1. **One book, two chapters.** A single typography and motion grammar everywhere; chapters differ entirely by color and texture (flat dark + blue glass vs. paper white + bold crayon).
2. **Precision and Identity.** Chapter One relies on a flat dark ground and single blue accent to project engineering credibility. Chapter Two uses bold swatches of color on white to project creative identity.
3. **Motion is narrative, not decoration.** Every scroll-driven sequence advances the story (a page turns, a scene opens); nothing animates just to move.
4. **The case study is the proof.** Project pages read problem → approach → decisions as a story with evidence, not a bullet dump.
5. **Show the work, spend the restraint.** One accent in Ch.1, deliberate bold swatches in Ch.2, real imagery everywhere imagery is implied.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text ≥ 4.5:1 against its surface. Every animation has a `prefers-reduced-motion` alternative that keeps content visible (crossfade or static) — reveals must enhance already-visible content, never gate it. Touch targets ≥ 44px; visible focus states; keyboard order matches visual order. Heavy scroll scenes (pinned hero, 3D) degrade gracefully on low-power devices.
