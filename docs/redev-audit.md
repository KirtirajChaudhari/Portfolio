# Site audit: kirtiraj-chaudhari.vercel.app

Audited 2026-11-17 against the production build of `main` (`f03c96b`). The live host is not reachable
from the build sandbox, so the audit ran on a local `vite preview` whose bundle hashes match the
deployed ones exactly (`index-DmitdUhn.js`, `index-DXWsZxQM.css`). Every route was captured at
1440x900 and at iPhone 13 size with Playwright; payloads, console output and DOM facts come from those
runs. Not exercised: the Instagram and Spotify embeds (third-party hosts are blocked here), real
devices, and Lighthouse.

Severity: **P0** broken, **P1** costs credibility with a recruiter, **P2** reads as generic or
unfinished, **P3** polish.

## The short version

The site is assembled, not designed. Six unrelated registry components (hanging ID card, typing
keyboard, research bento, liquid ocean, animated footer, interactive book), three design systems
copied from other brands (`DESIGN-apple.md`, `DESIGN-starbucks.md`, plus Vercel, Spotify and
together.ai files in the repo root) and seven font families sit side by side. Each piece is fine
alone. Together they say "collected from component libraries", which is the opposite of a
portfolio that gets someone noticed.

The second problem is order. The home page is one screen with a cartoon avatar, a script-font first
name and two buttons. It shows no work. The strongest facts on the whole site (a live clinical
product, a copyright, a first-place paper, a hand-written neural network) are two clicks deep.

The third is that nothing on the site is actually 3D. The head-tracker is 64 flat frames, and the
one WebGL scene that exists is switched off for most visitors' first paint path and absent on home.

## A. Home page

1. **P1** The home page is a single viewport (document height 900 px). No projects, no proof, no
   scroll. A visitor who does not click learns a first name and a role.
2. **P1** The hero subject is an AI-generated cartoon avatar on saturated red. It is the first thing a
   hiring manager sees and it reads as a novelty profile picture, not as an engineer's work.
3. **P1** The H1 is the single word "Kirtiraj" in Dancing Script. A script wedding-invitation face
   for an ML engineer, no surname, no role in the heading, and nothing a search engine can use.
4. **P0 (mobile)** On a phone the headline and the first lines of the bio are drawn across the
   avatar's mouth and beard. The "Hi, I'm" label sits on the cheek. Text on a face is unreadable and
   looks like a layout bug.
5. **P1** Desktop preloads 64 WebP frames for the head-tracker: 5.2 MB and 75 requests for a home
   page that contains one sentence.
6. **P2** "Hi, I'm" is a tracked uppercase eyebrow, the most recognisable template opener there is.
7. **P2** Two CTAs with the same intent are on screen at once: "Let's Talk" in the hero and
   "Contact" in the nav.
8. **P2** The nav on home has no home link or wordmark. The avatar monogram only appears on other
   pages, and never on phones (`hidden sm:inline-flex`).
9. **P2** A custom glow cursor replaces the system pointer (`GlowCursor`, `cursor: none !important`).
   Custom cursors are dated and hostile to accessibility tools.
10. **P2** The page background is set by JavaScript after the frames' manifest loads, so the colour
    can shift after first paint.
11. **P3** "Resume" opens a Google Drive forced-download URL with no preview, no file size and no
    hint that it leaves the site.

## B. Navigation and information architecture

12. **P1** A quarter of the primary nav is "Artistic", styled as the most prominent chip. The hobby
    profile gets more visual weight than Work.
13. **P2** "Artistic" carries an external-link arrow but is an internal route.
14. **P2** Nav labels are 10 to 11 px monospace capitals with wide tracking. Small, low-contrast on
    the glass pill, and below comfortable tap size on phones.
15. **P2** The nav is a floating glass pill with backdrop blur on every page: glassmorphism as the
    default surface.
16. **P0** There is no 404 route. Any unknown URL renders the nav on an empty dark page and logs
    "No routes matched location".
17. **P1** `/xray` is publicly reachable, unlinked, in a different light theme, and its nav renders
    white on near-white (invisible). `/profile-2` duplicates `/creator`.
18. **P2** Project pages are only reachable through the Work index. Nothing on home links to them.
19. **P2** Route changes are a hard cut with a blank frame (`Suspense fallback={null}`): no loading
    state and no transition.
20. **P3** The footer is one line of grey text and five links. No socials, no email, no résumé.

## C. Visual identity

21. **P1** No identity of its own. The tokens file says so in its comments: Chapter One is "Apple's
    system, verbatim", Chapter Two is Starbucks. `/xray` has a third system.
22. **P1** Seven font families across the site: Inter, Inter Tight, Antonio, Spectral, Caveat,
    Dancing Script and a system mono. The professional pages resolve to `-apple-system` first, so
    the type also changes between Apple and non-Apple devices.
23. **P2** Inter as the workhorse face is the default of every generated site.
24. **P2** Three unrelated palettes: saturated red on home, near-black maroon with red radial glow
    on inner pages, cream paper on Creator, cold grey-white on `/xray`.
25. **P2** Dark only. No light theme, no `prefers-color-scheme` handling.
26. **P2** Radius has no system: 13 different values are in use, from `rounded-[1px]` to
    `rounded-[2rem]`, and 33 pills.
27. **P2** 146 hard-coded hex colours inside TSX files bypass the tokens entirely.
28. **P2** 16 tracked-uppercase micro-labels ("BASED", "STUDYING", "FIND ME ON", "CURRENT"...) and
    giant outlined section numerals 01 to 04 on About. Both are template grammar.
29. **P2** Dashed hairlines divide almost every row on About, Work and Contact.
30. **P3** The red radial glow in the top-right corner is the only art direction on the inner pages,
    and it is the same on every one of them.
31. **P3** Nothing on the pro pages is an image of his own making apart from one screenshot per
    project. No diagrams, no model figures, no results plots.

## D. Layout, spacing and responsive

32. **P0 (mobile)** About hero: the statement headline loses its first line. The phone shows the ID
    card, the "ABOUT" label, a large empty gap, then "that shows its reasoning." with "Machine
    learning" missing.
33. **P0 (mobile)** Work, "What I'm good at": the title "Knowledge Graphs & Clinical Decision
    Support" is covered by the floating "Traceable" pill.
34. **P1** About uses a narrow column and leaves roughly the right third of a 1440 px screen empty for
    5,500 px of scroll.
35. **P1** The Work project index shows one small preview for nine projects. Eight of them are a
    plain text list.
36. **P2** The internship timeline alternates left and right around a centre line, so each entry
    wastes half the row and the reading order zigzags.
37. **P2** Every case-study section uses the same split: label on the left, paragraph on the right,
    five times in a row.
38. **P2** Case studies have one image each. No architecture diagram, no results, no second
    screenshot.
39. **P2** The "Tools I use" block spends 600 px on a 3D keyboard and a red screen, then repeats the
    same tools as a logo grid, then a third time as text.
40. **P2** The tool logos are mismatched rasters in white tiles (a JPEG for YOLO, scraped PNGs with
    names like `38-384674_opencv-logo-png-transparent-png.png`).
41. **P2** Contact hero is a rounded glass card containing a heading, a paragraph and a button: a
    card used where no card is needed.
42. **P2** Contact repeats "FIND ME ON" five times as a label column.
43. **P3** Section spacing is uniform. Nothing is tight, nothing is generous, so the page has no
    rhythm.
44. **P3** The ASCII avatars in the Contact footer are illegible at their size and read as noise
    behind the 200 px "Kirtiraj".
45. **P3** The "Next" card at the bottom of a case study is an empty-looking box with one word of
    text right-aligned.

## E. Content and copy

46. **P1** The About bio is filler: "My core passion lies at the intersection of", "create a tangible
    impact on society", "turning complex models into real-world solutions", "comprehensive". None
    of it could not be said by anyone else.
47. **P1** The best facts are buried. First place at RTCSA-2026, a registered copyright, a paper under
    review at an IEEE conference and a national hackathon final are the last section of the About
    page.
48. **P1** Nine projects with no curation. A live clinical product sits in the same list, at the
    same size, as three course capstones and a college ticketing system.
49. **P2** 91 em dashes in visible copy (79 in content files, 12 in components). It is the strongest
    single tell of generated text.
50. **P2** Numbers disagree. The B.E. grade is "GPA 7.85/10" in one file and "CGPA 7.86" in another.
    The RasaCare screenshot shows "89.1%" while the text beside it says 86.74%.
51. **P2** Names disagree: "DrishtiManas" and "Drishti Manas" are both used.
52. **P2** Class X and XII percentages (92.8%, 73.33%) are published. Under an M.Tech they add
    nothing and the second one works against him.
53. **P2** Eight certifications are listed with equal weight, including two Forage job simulations.
54. **P2** The Work headline "What I've built, and where I've worked." and the intro under it explain
    the page layout instead of saying anything about the work.
55. **P2** "What came out of it" for RasaCare is one line of three fragments. The strongest project
    has the weakest outcome section.
56. **P3** Case-study prose is one 130-word paragraph per section with no figures pulled out.
57. **P3** Internship entries have no link to anything built, and dates are in three formats.
58. **P3** A personal mobile number is published in plain text and as a `tel:` link.
59. **P3** `content/professional.ts` still carries invented skill percentages (Python 92, Neo4j
    76...) and a tagline ("Building Intelligent Solutions for Healthcare, Society & the Future").
    Unused today, one import away from being shown.

## F. Motion and interaction

60. **P1** Nothing is 3D. The head-tracker swaps flat frames, the keyboard is CSS, and the only real
    WebGL (the ocean on Contact, the gallery on Creator) is gated off on software GPUs and absent
    from home.
61. **P2** The same fade-and-rise reveal is applied to every block on every page. Motion is applied
    as a reflex, not designed per section.
62. **P2** Hover and press feedback is uneven: pill buttons scale on press, text links and list
    rows only change colour, and hover styles are not gated to devices that can hover.
63. **P2** The ID card asks the visitor to "Drag or click the card". An instruction label is a sign
    the interaction does not explain itself, and the card does nothing useful.
64. **P2** The floating cursor-and-pill decorations on the bento ("Reviewable", "Detection") imitate
    multiplayer cursors for no reason.
65. **P2** The Creator page runs a marquee and a WebGL gallery; the pro pages run almost nothing.
    The hobby page is more animated than the work.
66. **P3** `transition-all` is used twice; several transitions run 300 ms and longer on small
    controls.
67. **P3** No page transition, no shared element between the project list and the case study.

## G. Performance

68. **P1** Home: 5.2 MB transferred on desktop for one screen (frames). Creator: 7.5 MB, including a
    1.75 MB PNG avatar and a 693 kB three.js chunk.
69. **P1** Project screenshots are 1920 px PNGs. `RasaCare.png` is 526 kB and is the LCP image on
    Work and on its case study.
70. **P1** About downloads 28 images, among them a 336 kB JPEG and a 237 kB PNG shown at 28 px.
71. **P1** `public/` is 195 MB. 161 MB of that is original photographs in `public/creator/photos`
    that no code references. They are deployed and publicly downloadable.
72. **P2** Five Google Fonts families load from a render-blocking stylesheet on every page,
    including faces only the Creator page uses.
73. **P2** The main JS chunk is 267 kB (85 kB gzip) and the CSS is 90 kB for pages that are mostly
    text.
74. **P2** The avatars are four PNGs of 1.8 to 2.0 MB each.
75. **P2** `character.mp4` (4.5 MB) and `character.png` (2.1 MB) ship in `public/` and are never
    requested.
76. **P3** No image has `srcset`/`sizes`; phones get desktop assets.
77. **P3** No cache or security headers in `vercel.json` beyond the SPA rewrite.

## H. Accessibility

78. **P1** The About statement heading is in the DOM twice (visible words plus a duplicate), so a
    screen reader reads it twice. On Creator the H1 reads "Beyondthe code" with no space.
79. **P1** Creator has two H1 elements on desktop.
80. **P2** On About the H1 is the 12 px tracked label "ABOUT" and the real headline is an H2, so the
    document outline is upside down.
81. **P2** Nav tap targets are about 30 px tall on phones.
82. **P2** The contact form is `noValidate` with one generic error line under the whole form. Errors
    are not tied to the field that caused them.
83. **P2** The form's `select` uses `appearance-none` with no replacement arrow, so it does not look
    like a control.
84. **P2** The form posts nowhere. It builds a `mailto:` link, which fails silently for anyone
    without a configured mail app.
85. **P3** External links are marked only by an arrow glyph; nothing tells a screen reader they open
    a new tab.

## I. SEO and sharing

86. **P1** No Open Graph or Twitter tags. A link pasted into LinkedIn, WhatsApp or Slack shows no
    image and no description. For a portfolio that is the most common way it will be seen.
87. **P1** Client-rendered SPA with an empty `<div id="root">`. Crawlers that do not run JS see no
    content, and every route serves the same static title and description.
88. **P2** No `robots.txt`, no sitemap, no canonical URL, no structured data (`Person`).
89. **P2** Titles are inconsistent: "Kirtiraj Nitin Chaudhari — AI/ML Engineer", "About · Kirtiraj
    Chaudhari", "Beyond the Code · Kirtiraj Nitin Chaudhari", "Lens hero · Kirtiraj Chaudhari".
90. **P3** No `theme-color`, no web manifest. `public/icons.svg` and `favicon.svg` are unused.

## J. Code and repository

91. **P1** The repo root holds two old HTML portfolios, a `.docx` prompt, `Untitled-1.yaml`, a
    `spike/` folder and four other companies' design-system documents.
92. **P2** Dead or one-import-from-dead code: `content/artistic.ts` (flagged as AI filler in
    `CLAUDE.md`), `poetry.ts`, the unused `art-gallery` install, `loaders-gooey-blobs.tsx`,
    `professionalSkillLevels`, `professionalTimeline` (duplicates `journey.ts`).
93. **P2** `art-gallery.jsx` is 536 lines of untyped JSX in a TypeScript project.
94. **P2** Two parallel sources for projects (`professionalProjects` and `projectCases`) with
    different titles, one-liners and repo URLs for the same project.
95. **P2** Asset folders and files have spaces in their names (`education logos/`, `experience
    logo/`, `Lab Complaint Management System.png`), which forces URL-encoding everywhere.
96. **P2** Two styling systems fight: unlayered hand-written CSS and Tailwind utilities forced to
    `!important` so they can win.
97. **P2** The two page-level specs assert selectors of specific vendored components, so they test
    the registry installs rather than the site.
98. **P3** `z-index: 9999` on the grain overlay and two other four-digit values; no z-index scale.
99. **P3** Commit history includes a commit titled `:wq`. The README still mentions a boot curtain
     that was removed.
100. **P3** `components.json` exists only so a CLI can drop components in; `lib/utils.ts` and
     `components/lib/utils.ts` are duplicates.

## Found during the rebuild

101. **P1** Eight of the nine project images are generated posters, not screenshots. Only RasaCare
     has a real capture. The DrishtiManas poster still advertises "DenseNet121", "37,649 fundus
     images", "0.81 weighted F1" and "Grad-CAM heatmaps", all of which `CLAUDE.md` records as
     claims the repository does not support. Anyone who opens the repo after seeing the image
     finds a NumPy MLP at 69.1%.
102. **P2** The other posters show invented dashboards with invented numbers (ticket counts, sales
     figures, detection scores) and marketing lines such as "Real-Time Ready" and "Early Alerts".
103. **P2** `main.tsx` renders into an empty root and every route shares one static `<head>`, so the
     per-page titles only exist after JavaScript runs.

## What a premium version has to do

1. **Show the work on the first screen and the first scroll.** Home becomes a narrative: statement,
   three projects with their real numbers, experience, recognition, contact.
2. **One identity.** One type family with a mono for data, one neutral ramp, one accent, one radius
   scale, light and dark from the same tokens. Delete the borrowed systems.
3. **3D that means something.** One real-time WebGL scene on home whose geometry is his own work:
   the 23,756-node graph, the 2,788-256-4 network, the track. Depth elsewhere through CSS 3D on the
   project plates. Never decoration with no referent.
4. **Curate.** Three projects carry the site. Six are an index. Certifications are grouped and
   quiet. Recognition moves up.
5. **Plain copy.** Short sentences, facts from `src/content/`, no filler, no em dashes, one name
   per project, one grade.
6. **Motion with a job.** One orchestrated load, scroll-driven morphs tied to the projects, shared
   element transitions into case studies, pressed states on everything, full reduced-motion and
   touch paths.
7. **Fast.** Self-hosted variable fonts, WebP screenshots at two widths, WebGL loaded after first
   paint, no library for the scene, no 160 MB of unreferenced photos in the deploy.
8. **Shareable and findable.** OG image, per-route titles, canonical, `Person` JSON-LD, robots,
   sitemap, a real 404.
9. **Clean repo.** One source per fact, no vendored components on the pro pages, no stray files in
   the root, specs that test the site.
