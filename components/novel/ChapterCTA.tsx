"use client";

import { useRouter } from "next/navigation";
import { Reveal } from "./Reveal";
import { scrollToTarget } from "@/lib/scroll";
import { PremiumShaderButton } from "@/components/ui/PremiumShaderButton";

interface ChapterCTAProps {
  label: string;
  /** In-page anchor ("#id") or route ("/path"). */
  target: string;
  serif?: boolean;
}

/** Page-turn between chapters — scrolls to anchors, routes to pages. */
export function ChapterCTA({ label, target, serif = false }: ChapterCTAProps) {
  const router = useRouter();
  const isArtistic = target === "/creator" || target.includes("creator");

  const go = () => {
    if (target.startsWith("#")) scrollToTarget(target);
    else router.push(target);
  };

  return (
    <Reveal className="flex justify-center py-24 md:py-36">
      <div className="h-16 w-[340px] md:h-[72px] md:w-[420px]">
        <PremiumShaderButton
          onClick={go}
          baseColor={isArtistic ? "#0d0a12" : "#0a0a0a"}
          glassColor={isArtistic ? "#a855f7" : "#3b82f6"}
          hoverSpeed={isArtistic ? 1.2 : 0.8}
          padding="0px"
          borderRadius={999}
        >
          <div
            className={`flex items-center justify-center gap-4 px-8 whitespace-nowrap ${
              isArtistic
                ? "type-serif italic text-lg md:text-xl text-white/90"
                : "type-heading uppercase tracking-[0.2em] text-sm text-white"
            }`}
          >
            {label}
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-3">
              →
            </span>
          </div>
        </PremiumShaderButton>
      </div>
    </Reveal>
  );
}
