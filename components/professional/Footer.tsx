import { siteMeta } from "@/content/shared";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-text-muted">
          © {year} {siteMeta.fullName}. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {siteMeta.socials.github && (
            <a
              href={siteMeta.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-text-muted transition-colors duration-200 hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {siteMeta.socials.linkedin && (
            <a
              href={siteMeta.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-text-muted transition-colors duration-200 hover:text-accent"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          <a
            href={`mailto:${siteMeta.email}`}
            aria-label="Email"
            className="text-text-muted transition-colors duration-200 hover:text-accent"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
