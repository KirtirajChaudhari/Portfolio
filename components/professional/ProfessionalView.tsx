import { Hero } from "./Hero";
import { About } from "./About";
import { Achievements } from "./Achievements";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";
import { Certifications } from "./Certifications";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

export function ProfessionalView() {
  return (
    <>
      <Hero />
      <About />
      <Achievements />
      <Projects />
      <Skills />
      <Timeline />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}
