"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useViewMode } from "@/store/useViewMode";
import { useSwipe } from "@/hooks/useSwipe";
import { useModeHotkeys } from "@/hooks/useModeHotkeys";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { ViewTransition } from "@/components/ui/ViewTransition";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { siteMeta } from "@/content/shared";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface SiteShellProps {
  professional: ReactNode;
  artistic: ReactNode;
}

export function SiteShell({ professional, artistic }: SiteShellProps) {
  const mode = useViewMode((s) => s.mode);
  const setMode = useViewMode((s) => s.setMode);

  useModeHotkeys();

  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => setMode("artistic"),
    onSwipeRight: () => setMode("professional"),
  });

  return (
    <LenisProvider>
      <div ref={swipeRef} className="min-h-screen">
        {/* ——— Floating nav header ——— */}
        <header className="fixed top-0 right-0 left-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            {/* Logo / Name */}
            <a
              href="#"
              className="flex items-center gap-3 group"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-border">
                <Image
                  src={`/avatars/${mode === "professional" ? "professional" : "artistic"}-icon.png`}
                  alt={siteMeta.fullName}
                  fill
                  sizes="36px"
                  className="object-cover transition-opacity duration-500 motion-reduce:transition-none"
                />
              </div>
              <span className="font-display text-sm font-semibold text-text hidden sm:inline">
                {siteMeta.fullName.split(" ")[0]}
              </span>
            </a>

            {/* Center: Mode Toggle */}
            <ModeToggle />

            {/* Right: Social links */}
            <nav className="flex items-center gap-3" aria-label="Social links">
              {siteMeta.socials.github && (
                <a
                  href={siteMeta.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-text-muted transition-colors duration-200 hover:text-accent motion-reduce:transition-none"
                >
                  <GithubIcon className="h-4.5 w-4.5" />
                </a>
              )}
              {siteMeta.socials.linkedin && (
                <a
                  href={siteMeta.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-text-muted transition-colors duration-200 hover:text-accent motion-reduce:transition-none"
                >
                  <LinkedinIcon className="h-4.5 w-4.5" />
                </a>
              )}
              <a
                href={`mailto:${siteMeta.email}`}
                aria-label="Email"
                className="text-text-muted transition-colors duration-200 hover:text-accent motion-reduce:transition-none"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </nav>
          </div>

          {/* Glass backdrop for the header */}
          <div
            className="absolute inset-0 -z-10 border-b border-border/50 bg-bg/80 backdrop-blur-xl"
            aria-hidden="true"
          />
        </header>

        {/* ——— Mobile swipe hint ——— */}
        <div
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 md:hidden"
          aria-hidden="true"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
              mode === "professional" ? "bg-accent" : "bg-text-muted/40"
            }`}
          />
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
              mode === "artistic" ? "bg-accent" : "bg-text-muted/40"
            }`}
          />
        </div>

        {/* ——— Main content with view transition ——— */}
        <main className="pt-20">
          <ViewTransition professional={professional} artistic={artistic} />
        </main>
      </div>
    </LenisProvider>
  );
}
