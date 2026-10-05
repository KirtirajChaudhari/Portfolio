/*
 * X-Ray hero copy. Same person, two truths, one box.
 *
 * The two layers are written to REGISTER: same slot count, same order, similar
 * length, so the professional and artistic headlines occupy the identical box.
 * If you edit one side, edit the other or the illusion breaks.
 *
 * PRO says what he builds. ART says why he builds it that way. Neither is
 * decoration and neither is filler — see docs/xray-plan.md §7.
 *
 * Sourcing: every factual claim here already exists in professional.ts or
 * novel.ts (tabla / lens / ink comes from `creatorIntro`; the three domains
 * come from `novelHero.subtitle`; the explainability thesis is
 * `professionalMission`). Nothing creative is invented — no poem lines, no
 * lyrics, no photo captions. That rule is in CLAUDE.md and it is not
 * negotiable when this file grows.
 */

export interface HeroLayerCopy {
  /** Small factual label above the headline. */
  eyebrow: string;
  /** The display line. Both layers must stay inside 3 lines at every width. */
  title: string;
  /** One paragraph, same slot in both layers. */
  lead: string;
  /** Button label. In the artistic layer this is a decorative twin — it holds
   *  the slot open so the layers stay registered, and it is never focusable. */
  action: string;
}

export const heroPro: HeroLayerCopy = {
  eyebrow: 'AI/ML Engineer — Pune, IST',
  title: 'Models that have to explain themselves.',
  lead:
    'Clinical nutrition, disease screening, railway safety — domains where a wrong prediction costs somebody something. I build the part that shows its reasoning to the person who has to act on it.',
  action: 'See the work',
};

export const heroArt: HeroLayerCopy = {
  eyebrow: 'Tabla — Lens — Ink',
  title: 'Nothing I make gets to stay quiet.',
  lead:
    'Taal on the tabla, light through a lens, lines that mostly stay in the notebook. None of it is a case study. It is the half that does not fit on a résumé — and it is where the habit of explaining myself started.',
  action: 'Chapter Two',
};

/* UI instruction, identical in both layers. Shown only where the lens runs. */
export const heroHint = 'Hover to look closer. Hold to open it up.';

/* Tiny factual tags. Real information only — place, stack, programme. A label
   that encodes nothing is an eyebrow pretending to be data. */
export const heroTags = [
  { label: 'M.Tech AI & ML', detail: 'MIT-WPU, Pune' },
  { label: 'Building', detail: 'RasaCare — Ayurvedic practice + nutrient analysis' },
];
