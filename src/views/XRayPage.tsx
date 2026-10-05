import { useEffect } from 'react';
import XRayHero from '../components/hero/XRayHero';

/* The lens hero, kept as its own page. Not linked from the site: the character
   page is home now, and the Playwright specs (scripts/) run against this route. */
export default function XRayPage() {
  useEffect(() => { document.title = 'Lens hero · Kirtiraj Chaudhari'; }, []);
  return <XRayHero />;
}
