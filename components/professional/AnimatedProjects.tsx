"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Brain,
  Eye,
  Train,
  Wrench,
  Code2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Project } from "@/content/types";
import { GithubIcon } from "@/components/ui/Icons";
import { ExternalLink } from "lucide-react";
import "./AnimatedProjects.css";

/* ——— Icon map for gradient placeholder thumbnails ——— */
const ICON_MAP: Record<string, LucideIcon> = {
  rasacare: Brain,
  drishtimanas: Eye,
  pravaas: Train,
  "lab-complaint": Wrench,
};

interface AnimatedProjectsProps {
  projects: Project[];
}

interface ProjectTransform {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
}

/*
 * Pixel offsets tuned for the editorial section layout (Hero + Projects).
 * These scatter cards around the Hero area when scrolled away, then
 * animate into a 2×2 grid as the section scrolls into view.
 *
 * NOTE: these may need visual adjustment once all sections are in place.
 */
const desktopTransforms: ProjectTransform[] = [
  { x: 530, y: -850, rotate: 10, scale: 0.7, zIndex: 4 },
  { x: 80, y: -850, rotate: 15, scale: 0.7, zIndex: 3 },
  { x: 480, y: -1250, rotate: -5, scale: 0.7, zIndex: 1 },
  { x: 30, y: -1200, rotate: 5, scale: 0.7, zIndex: 2 },
];

/* ——— Individual animated card ——— */
interface AnimatedProjectCardProps {
  project: Project;
  progress: MotionValue<number>;
  transform: ProjectTransform;
  index: number;
}

function AnimatedProjectCard({
  project,
  progress,
  transform,
  index,
}: AnimatedProjectCardProps) {
  const Icon = ICON_MAP[project.id] || Code2;

  const x = useTransform(progress, [0, 1], [transform.x, 0]);
  const y = useTransform(progress, [0, 1], [transform.y, 0]);
  const rotate = useTransform(
    progress,
    [0, 0.75, 1],
    [transform.rotate, transform.rotate * 0.18, 0]
  );
  const scale = useTransform(progress, [0, 0.8, 1], [transform.scale, 0.94, 1]);
  const opacity = useTransform(
    progress,
    index < 2 ? [0, 0.08, 1] : [0, 0.18, 1],
    [0.88, 1, 1]
  );

  // Determine the primary link for the card
  const primaryHref = project.links.live || project.links.github || "#";

  return (
    <motion.article
      className="animated-project"
      style={{ x, y, rotate, scale, opacity, zIndex: transform.zIndex }}
    >
      <a
        className="animated-project__link"
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Visual placeholder — gradient + icon (no real thumbnails yet) */}
        <div className="animated-project__media">
          <div className="animated-project__placeholder">
            <Icon className="animated-project__icon" strokeWidth={1.5} />
          </div>
        </div>

        {/* Details: title, one-liner, tech stack, action */}
        <div className="animated-project__details">
          <div>
            <h3 className="animated-project__title">{project.title}</h3>
            <p className="animated-project__category">{project.oneLiner}</p>
            {/* Tech stack badges */}
            <div className="animated-project__tech">
              {project.techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="animated-project__tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="animated-project__actions">
            {project.links.github && (
              <span
                className="animated-project__action-icon"
                aria-label="Source code"
              >
                <GithubIcon className="h-4 w-4" />
              </span>
            )}
            {project.links.live && (
              <span className="animated-project__action-icon" aria-label="Live site">
                <ExternalLink className="h-4 w-4" />
              </span>
            )}
            <span className="animated-project__action">
              <span aria-hidden="true">↗</span>
              View
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

/* ——— Main section ——— */
export default function AnimatedProjects({
  projects,
}: AnimatedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 145%", "start 12%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 1000,
    damping: 130,
    mass: 1,
    restDelta: 0.0001,
  });

  const headingOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1]);
  const headingY = useTransform(smoothProgress, [0.65, 0.85], [14, 0]);

  return (
    <section
      ref={sectionRef}
      className="animated-projects"
      id="projects"
    >
      <div className="animated-projects__container">
        <motion.h2
          className="animated-projects__heading"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          Latest Projects
        </motion.h2>

        <div className="animated-projects__grid">
          {projects.slice(0, 4).map((project, index) => (
            <AnimatedProjectCard
              key={project.id}
              project={project}
              progress={smoothProgress}
              transform={desktopTransforms[index]}
              index={index}
            />
          ))}
        </div>

        {/* View all — anchors to the full projects listing further down */}
        <a className="animated-projects__all" href="#projects-all">
          View all my projects
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
