# Copy, facts and navigation pass (2026-11-21, branch `re-dev`)

Owner brief: correct the copy, factual consistency, navigation and the listed layout
issues without changing the site's identity. Base: `origin/re-dev` at `fa04a08`
(Crimson redesign, the build deployed at kirtiraj-chaudhari.vercel.app).

Source of truth, in order: the brief's explicit corrections, the résumé facts the
brief reproduces (the PDF itself is not in this workspace), the repos. Nothing invented.

## Requirement map

| # | Requirement | Where |
|---|---|---|
| 3 | Pill portrait squeezed (rendered 13.6x28 from a 64x64 source: the `min-width:640px` `.nav-link` padding beats `.nav-home { padding: 0 }` and the flex child shrinks). Remove About and Work from the pill. | `components/site/Header.tsx`, `styles/site.css`, new `public/avatars/nav-avatar.webp` (96px crop of the same red avatar art) |
| 4 | Hero: role "AIML Engineer", one sentence on interpretable ML, "Currently: M.Tech AI & ML at MIT-WPU, Pune." | `views/HomePage.tsx`, `styles/site.css`, `content/shared.ts` (`role`), `content/meta.ts`, `index.html` |
| 5 | Remove 01/02/03 tour; one "Scroll to explore" cue | `HomePage.tsx`, `site.css` |
| 6 | About copy: keep interests sentence, drop the tool inventory, drop "Currently / Building RasaCare" and "The most recent build", rebalance facts | `content/professional.ts` (`aboutBio`), `content/facts.ts`, `HomePage.tsx`, `AboutPage.tsx` |
| 7 | "The full story" -> `/about` | `HomePage.tsx` (verify in browser) |
| 8 | Experience: Inspira (new, no invented duties), Edunet, BitSpark, PCI; Quasar removed; same data on /about and /work | `content/journey.ts` (single source), new `components/about/ExperienceList`, `work/InternshipTimeline.tsx`, `AboutPage.tsx`; delete unused stale `professionalTimeline` / `professionalFacts` |
| 9 | Tools note, Meta cert + tally, ICCCMLA "Accepted", artistic descriptor, contact CTA | `AboutPage.tsx`, `content/professional.ts`, `components/site/Footer.tsx`, `views/ContactPage.tsx` |
| 10 | "Explore my work" -> `/work` above the artistic block | `AboutPage.tsx` |
| 11 | "My Tools", drop the paragraph, re-lay the keyboard | `HomePage.tsx`, `components/about/ToolsKeyboard.tsx` |
| 12 | Selected Work intro: heading only, keep the figure and its aria-hidden captions | `HomePage.tsx` |
| 13 | RasaCare / DrishtiManas captions, DrishtiManas URL, PRAVAAS extra link, "More such projects on my GitHub." | `content/projects.ts`, `content/professional.ts`, `HomePage.tsx` |
| 14 | Remove "Experiments: lens, head-tracker" (routes stay) | `Footer.tsx`; `/character` bio also carried "Currently building RasaCare" |
| 15-16 | Musician: three distinct elements (artist / channel / single), delete the two passages | `views/CreatorPage.tsx`, `CreatorPage.css`, `content/novel.ts` |

## Decisions

- Hero: one sentence, an engineering focus, no project list:
  "I focus on interpretable machine learning: models whose outputs people can
  understand and check." Role set large under the name; education a quieter line.
- The bottom "Scroll" cue and the "Explore" button both pointed at `#about`.
  They merge into one cue, the hero's primary button labelled "Scroll to explore",
  visible at every width. The tour chips and the mouse icon go.
- `siteMeta.role` becomes "AIML Engineer" so the title, footer and ID card agree
  with the hero.
- Experience heading is "Experience" on both pages (PCI LLP was a traineeship).
  Inspira renders role, company link and "Nov 2026 to Present" only.
- Musician: header, then a three-column row (stacked below `lg`): Spotify artist
  card with the artist player, YouTube channel card, debut-single card with the
  cover/vinyl and the track player. Performances stay as a secondary row.

## Out of scope, flagged only

- The About heading "Machine learning that shows its reasoning." is unchanged.
- The /work bento's "5 columns" detail for PCI LLP is not in the facts reproduced in
  the brief; left as is and reported.

## Outcome

Implemented as planned, plus five layout fixes found in review: `.t-body + .t-body`
margin stacked on a grid gap in the About bio; the hero focus sentence split
"models / whose" (now broken after the colon from 360px); "MIT-WPU" broke at its
hyphen at 320px (kept together with `nowrap`, characters unchanged); the taal
ornament wrapped at 390px; the YouTube picture's white side bars showed in the
larger circle (fixed zoom).

Validation (production build, `scripts/serve-dist.mjs`):
- `npm run build` (tsc, client, SSR, 15 prerendered routes): passes.
- `scripts/pro-ui.spec.ts` + `scripts/redev.spec.ts`, chromium: 72/72. Changed only
  where markup changed on purpose (pill without About/Work, "Scroll to explore", h1
  and title text); added a test that "The full story" opens /about and "Explore my
  work" (above the artistic link) opens /work.
- Rejected phrases and stale URLs: zero matches in `dist/` HTML and JS.
- Horizontal overflow 0 at 320/390/768/1024/1440 on 8 routes; CLS 0 on load for /,
  /about, /creator at 390.
- Screenshots reviewed: pill 320/390/1440 (pro and creator), hero 320/390/768/1440,
  home About + tools 390/1440, /about 1440 dark and 1024 light, /work experience 1440,
  music 390/1440.
- NOT VERIFIED: external destinations (drishtimanas.vercel.app, inspiraenterprise.com,
  GitHub, YouTube, Spotify) and the Spotify embeds: the sandbox proxy blocks them.
