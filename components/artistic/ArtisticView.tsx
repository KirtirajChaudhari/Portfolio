import { Hero } from "./Hero";
import { NarrativeIntro } from "./NarrativeIntro";
import { Disciplines } from "./Disciplines";
import { FeaturedWork } from "./FeaturedWork";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

/**
 * Artistic view — warm, narrative, personal.
 */
export function ArtisticView() {
  return (
    <>
      <Hero />
      <NarrativeIntro />
      <Disciplines />
      <FeaturedWork />
      <Contact />
      <Footer />
    </>
  );
}
