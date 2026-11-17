import { useEffect } from 'react';
import XRayHero from '../components/hero/XRayHero';
import { LEGACY_FONTS, loadStylesheet } from '../lib/fonts';
import '../styles/legacy.css';

/* The lens hero, kept as its own page and linked from the footer as an experiment.
   The Playwright lens specs (scripts/) run against this route. */
loadStylesheet(LEGACY_FONTS);
export default function XRayPage() {
  useEffect(() => { document.title = 'Lens hero · Kirtiraj Chaudhari'; }, []);
  return <XRayHero />;
}
