"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const GROUPS: { key: keyof typeof skills; label: string; tag: string }[] = [
  { key: "core", label: "Core", tag: "01" },
  { key: "data", label: "Data", tag: "02" },
  { key: "infra", label: "Infra", tag: "03" },
  { key: "craft", label: "Craft", tag: "04" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const totalItems = GROUPS.reduce((n, g) => n + skills[g.key].length, 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rowTrigger = { trigger: sectionRef.current, start: "top 78%" };

      gsap.fromTo(
        ".skill-row",
        { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: rowTrigger,
        },
      );

      gsap.fromTo(
        ".skill-ghost",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: rowTrigger,
        },
      );

      gsap.fromTo(
        ".skill-check-path",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "power2.inOut",
          stagger: 0.14,
          delay: 0.25,
          scrollTrigger: rowTrigger,
        },
      );
      gsap.fromTo(
        ".skill-check-box",
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(3)",
          stagger: 0.14,
          delay: 0.2,
          scrollTrigger: rowTrigger,
        },
      );

      gsap.fromTo(
        ".skill-chip",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.025,
          delay: 0.4,
          scrollTrigger: rowTrigger,
        },
      );

      if (scanRef.current) {
        gsap.fromTo(
          scanRef.current,
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top+=120",
              end: "bottom bottom-=120",
              scrub: 0.4,
            },
          },
        );
      }

      if (countRef.current) {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: totalItems,
          duration: 1,
          ease: "power1.out",
          scrollTrigger: rowTrigger,
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(
                Math.round(counter.value),
              ).padStart(2, "0");
            }
          },
        });
      }

      GROUPS.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.skill-row-${i}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveGroup(i),
          onEnterBack: () => setActiveGroup(i),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [totalItems]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-pad gutter border-t border-line relative overflow-hidden"
    >
      {/* faint background coordinate grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-soft) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 md:gap-16 relative">
        {/* Sticky intro rail */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-label uppercase text-amber mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-amber" />
            04 - The Kit
          </p>
          <h2 className="font-display text-display-2 text-bone mb-5">
            What&rsquo;s in the bag.
          </h2>
          <p className="text-body-fluid text-muted max-w-md mb-8">
            The stack I reach for by default - chosen for shipping speed, not
            for the résumé.
          </p>

          <div className="hidden md:flex items-center gap-3 text-timecode text-muted border-t border-line-soft pt-5">
            <span className="relative w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-amber animate-ping" />
              <span className="absolute inset-0 rounded-full bg-amber" />
            </span>
            <span className="text-bone-dim">
              <span ref={countRef}>00</span> /{" "}
              {String(totalItems).padStart(2, "0")}
            </span>
            <span className="uppercase">items packed</span>
          </div>

          {/* Group index segmented progress rail */}
          <ul className="hidden md:flex flex-col gap-0 mt-8 relative">
            <span className="absolute left-0.75 top-1 bottom-1 w-px bg-line-soft" />
            <span
              className="absolute left-0.75 top-1 w-px bg-amber transition-all duration-500 ease-out"
              style={{
                height: `calc((100% - 8px) * ${(activeGroup + 1) / GROUPS.length})`,
              }}
            />
            {GROUPS.map((g, i) => (
              <li
                key={g.key}
                className="flex items-center gap-4 text-label uppercase py-2.5 transition-colors duration-300"
              >
                <span
                  className={`relative z-10 h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeGroup === i
                      ? "bg-amber scale-150 shadow-[0_0_8px_var(--color-amber)]"
                      : "bg-line-soft"
                  }`}
                />
                <span className="text-timecode text-muted/60">{g.tag}</span>
                <span
                  className={`transition-colors duration-300 ${
                    activeGroup === i ? "text-amber" : "text-muted"
                  }`}
                >
                  {g.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Manifest list */}
        <div
          ref={listRef}
          className="relative flex flex-col border-t border-line-soft"
        >
          {GROUPS.map((g, i) => (
            <div
              key={g.key}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`skill-row skill-row-${i} relative border-b border-dashed border-line-soft py-8 sm:py-10 transition-opacity duration-300 ${
                hoveredRow !== null && hoveredRow !== i
                  ? "opacity-40"
                  : "opacity-100"
              }`}
            >
              {/* giant ghost label */}
              <span className="skill-ghost pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-display text-[5rem] sm:text-[7rem] leading-none text-bone/3 italic whitespace-nowrap">
                {g.label}
              </span>

              <div className="relative flex items-center gap-4 mb-5 sm:mb-6">
                <span className="skill-check-box flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-amber/60 text-amber">
                  <svg viewBox="0 0 12 10" className="h-2.5 w-2.5" fill="none">
                    <path
                      className="skill-check-path"
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray={1}
                    />
                  </svg>
                </span>
                <span className="text-timecode text-muted">{g.tag}</span>
                <h3 className="font-display text-2xl sm:text-3xl text-bone italic">
                  {g.label}
                </h3>
                <span
                  className={`h-px flex-1 mx-2 transition-colors duration-300 ${
                    hoveredRow === i ? "bg-amber/40" : "bg-line-soft"
                  }`}
                />
                <span className="text-label uppercase text-muted">
                  {String(skills[g.key].length).padStart(2, "0")}
                </span>
              </div>

              <div className="relative flex flex-wrap items-center pl-9 gap-y-3">
                {skills[g.key].map((s, idx) => (
                  <span key={s} className="flex items-center">
                    <span className="skill-chip group relative font-display text-lg sm:text-xl text-bone-dim transition-all duration-300 cursor-default hover:-translate-y-0.5">
                      <span className="relative z-10 transition-colors duration-300 group-hover:text-amber">
                        {s}
                      </span>
                      <span className="absolute left-0 -bottom-1 h-px w-0 bg-amber transition-all duration-300 ease-out group-hover:w-full" />
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
            <span className="flex items-center gap-2">
              <span className="w-3 h-px bg-line-soft" />
              End of manifest
            </span>
            <span className="text-bone-dim">
              {String(totalItems).padStart(2, "0")} items packed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
