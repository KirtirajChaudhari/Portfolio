"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { professionalExpertise } from "@/content/professional";
import { FollowCursor } from "./FollowCursor";

export function Service() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string>(professionalExpertise[0]?.id ?? "");

  return (
    <section
      id="expertise"
      className="flex min-h-dvh items-center px-6 py-24 tablet:px-10"
    >
      <div className="mx-auto flex w-full max-w-[1200px] justify-start">
        <div className="flex w-full max-w-[600px] flex-col gap-10">
          {/* Text wrap */}
          <div className="flex flex-col gap-5">
            <h2 className="type-heading text-[42px] font-bold leading-[1.3] text-text tablet:text-[48px] desktop:text-[60px]">
              What I do
            </h2>
            <p className="max-w-[500px] text-[16px] font-light leading-[1.5] text-text-muted desktop:text-[18px]">
              Four areas I work across — from the model to the product it ships
              inside. Open one to see the tools and the thinking behind it.
            </p>
          </div>

          {/* Accordion */}
          <div className="flex flex-col">
            {professionalExpertise.map((row) => {
              const open = openId === row.id;
              return (
                <FollowCursor
                  key={row.id}
                  label={row.cursorLabel}
                  className="border-t border-border last:border-b"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`expertise-panel-${row.id}`}
                    onClick={() => setOpenId(open ? "" : row.id)}
                    className="flex w-full items-center gap-4 py-6 text-left"
                  >
                    <span className="text-[13px] font-medium tracking-wider text-accent">
                      {row.index}
                    </span>
                    <span className="type-heading flex-1 text-[24px] font-normal leading-[1.3] text-text tablet:text-[32px]">
                      {row.title}
                    </span>
                    <Plus
                      className={`h-6 w-6 shrink-0 text-text-muted transition-transform duration-300 motion-reduce:transition-none ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <motion.div
                    id={`expertise-panel-${row.id}`}
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pl-9">
                      <p className="max-w-[500px] text-[16px] font-light leading-[1.5] text-text-muted desktop:text-[18px]">
                        {row.description}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {row.tools.map((tool) => (
                          <li
                            key={tool}
                            className="rounded-full border border-border px-3 py-1 text-[12px] text-text-muted"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </FollowCursor>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
