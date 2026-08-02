"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const GROUPS: { key: keyof typeof skills; label: string }[] = [
  { key: "core", label: "Core" },
  { key: "data", label: "Data" },
  { key: "infra", label: "Infra" },
  { key: "craft", label: "Craft" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 78%" };

      gsap.fromTo(
        ".skill-row",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: trigger,
        }
      );

      gsap.fromTo(
        ".skill-check",
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(3)",
          stagger: 0.12,
          delay: 0.25,
          scrollTrigger: trigger,
        }
      );

      gsap.fromTo(
        ".skill-chip",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.02,
          delay: 0.35,
          scrollTrigger: trigger,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const totalItems = GROUPS.reduce((n, g) => n + skills[g.key].length, 0);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-pad gutter border-t border-line"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div>
          <p className="text-label uppercase text-amber mb-3">04 - The Kit</p>
          <h2 className="font-display text-display-2 text-bone">
            What&rsquo;s in the bag.
          </h2>
        </div>
        <p className="text-body-fluid text-muted max-w-md">
          The stack I reach for by default - chosen for shipping speed, not
          for the résumé.
        </p>
      </div>

      {/* kit manifest */}
      <div className="flex flex-col border-t border-line-soft">
        {GROUPS.map((g, i) => (
          <div
            key={g.key}
            className="skill-row border-b border-dashed border-line-soft py-7 sm:py-8"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-5">
              <span className="skill-check flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-amber/60 text-amber">
                <svg viewBox="0 0 12 10" className="h-2.5 w-2.5" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-timecode text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-bone">
                {g.label}
              </h3>
              <span className="ml-auto text-label uppercase text-muted">
                {String(skills[g.key].length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-wrap items-center pl-9 gap-y-2">
              {skills[g.key].map((s, idx) => (
                <span key={s} className="flex items-center">
                  <span className="skill-chip font-display text-lg sm:text-xl text-bone-dim hover:text-amber transition-colors duration-300 cursor-default">
                    {s}
                  </span>
                  {idx < skills[g.key].length - 1 && (
                    <span className="text-line-soft mx-2 sm:mx-3 select-none">
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-6 text-label uppercase text-muted">
          <span>End of manifest</span>
          <span>{String(totalItems).padStart(2, "0")} items packed</span>
        </div>
      </div>
    </section>
  );
}