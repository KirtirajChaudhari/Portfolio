import { Hero } from "./Hero";
import { About } from "./About";
import { AnimatedProjectsSection } from "./AnimatedProjectsSection";
import { Projects } from "./Projects";
import { Service } from "./Service";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";
import { Certifications } from "./Certifications";
import { ResumeCTA } from "./ResumeCTA";
import { Footer } from "./Footer";

/**
 * Professional-mode layout.
 *
 * Section order (per hero-service-about-spec.md):
 *   Hero → AnimatedProjects (featured 4) → Service → About (stats, contact, social, My Story CTA)
 *   → Skills → Timeline → Certifications → Projects (full listing) → ResumeCTA → Footer
 *
 * The old Achievements section is absorbed into About.
 * The old Contact section is replaced by ResumeCTA.
 */
export function ProfessionalView() {
  return (
    <>
      <Hero />
      <AnimatedProjectsSection />
      <Service />
      <About />
      <Skills />
      <Timeline />
      <Certifications />
      <Projects />
      <ResumeCTA />
      <Footer />
    </>
  );
}
