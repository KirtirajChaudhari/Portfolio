import { professionalProjects } from "@/content/professional";
import AnimatedProjects from "./AnimatedProjects";

/**
 * Server-side wrapper that filters featured projects and passes them
 * to the client-side AnimatedProjects component.
 */
export function AnimatedProjectsSection() {
  const featured = professionalProjects.filter((p) => p.featured);
  return <AnimatedProjects projects={featured} />;
}
