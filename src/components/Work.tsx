"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const SPROCKET_H =
  "repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 20px)";
const SPROCKET_V =
  "repeating-linear-gradient(180deg, currentColor 0 6px, transparent 6px 20px)";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const glowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moveTos = useRef<Record<number, MoveTo>>({});
  type MoveTo = { x: (v: number) => void; y: (v: number) => void };

  const total = projects.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const section = sectionRef.current;
          if (!track || !section) return;

          const distance = track.scrollWidth - window.innerWidth;

          const tween = gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance + window.innerHeight * 0.4}`,
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (!counterRef.current) return;
                const idx = Math.min(
                  total,
                  Math.max(1, Math.round(self.progress * (total - 1)) + 1),
                );
                counterRef.current.textContent = String(idx).padStart(2, "0");
              },
            },
          });

          gsap.utils.toArray<HTMLElement>(".frame-card").forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0.3, filter: "saturate(0.3) brightness(0.8)" },
              {
                opacity: 1,
                filter: "saturate(1) brightness(1)",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: tween,
                  start: "left 80%",
                  end: "left 40%",
                  scrub: true,
                },
              },
            );
          });

          return () => {
            tween.kill();
          };
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [total]);

  const handleLinkMove =
    (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = linkRefs.current[i];
      const glow = glowRefs.current[i];
      if (!el || !glow) return;

      if (!moveTos.current[i]) {
        moveTos.current[i] = {
          x: gsap.quickTo(glow, "left", { duration: 0.35, ease: "power3.out" }),
          y: gsap.quickTo(glow, "top", { duration: 0.35, ease: "power3.out" }),
        };
      }

      const rect = el.getBoundingClientRect();
      moveTos.current[i].x(e.clientX - rect.left);
      moveTos.current[i].y(e.clientY - rect.top);
    };

  const handleLinkEnter = (i: number) => () => {
    gsap.to(glowRefs.current[i], { opacity: 1, duration: 0.25 });
    gsap.to(linkRefs.current[i], {
      scale: 1.03,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleLinkLeave = (i: number) => () => {
    gsap.to(glowRefs.current[i], { opacity: 0, duration: 0.35 });
    gsap.to(linkRefs.current[i], {
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-ink lg:h-screen lg:overflow-hidden"
    >
      {/* header */}
      <div className="gutter pt-24 pb-10 lg:pb-0 lg:absolute lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-[26vw] lg:min-w-76 lg:items-center lg:bg-linear-to-r lg:from-ink lg:from-70% lg:to-transparent">
        <div>
          <p className="text-label uppercase text-amber mb-3">
            Frame <span ref={counterRef}>01</span> /{" "}
            {String(total).padStart(2, "0")}
          </p>
          <h2 className="font-display text-display-1 text-bone">
            Shipped, <span className="italic text-bone-dim">not</span>
            <br />
            staged.
          </h2>
          <p className="mt-5 text-body-fluid text-muted max-w-[18rem]">
            Four products, four different problems. Scroll to run the reel.
          </p>
        </div>
      </div>

      {/* filmstrip */}
      <div className="lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div
          ref={trackRef}
          className="relative flex flex-col lg:flex-row lg:h-full lg:w-max lg:pl-[26vw] lg:pr-[14vw]"
        >
          {/* continuous sprocket rails */}
          <div
            className="hidden lg:block lg:absolute lg:top-6 lg:left-0 lg:right-0 lg:h-2 text-line-soft opacity-70 pointer-events-none"
            style={{ backgroundImage: SPROCKET_H }}
          />
          <div
            className="hidden lg:block lg:absolute lg:bottom-6 lg:left-0 lg:right-0 lg:h-2 text-line-soft opacity-70 pointer-events-none"
            style={{ backgroundImage: SPROCKET_H }}
          />

          {projects.map((p, i) => (
            <article
              key={p.reel}
              className="frame-card group relative flex shrink-0 flex-col border-b border-line py-10 first:pt-0 last:border-b-0 lg:h-full lg:w-[min(70vw,40rem)] lg:flex-row lg:border-b-0 lg:border-r lg:border-line lg:py-20 lg:last:border-r-0"
            >
              {/* mobile sprocket rail */}
              <div
                className="absolute inset-y-0 left-0 w-2 text-line-soft opacity-70 lg:hidden"
                style={{ backgroundImage: SPROCKET_V }}
              />

              <div className="pl-6 pr-6 w-full lg:flex-1 lg:min-w-0 lg:pl-10 lg:pr-10 lg:flex lg:h-full lg:flex-col lg:justify-center">
                <div className="mb-4 flex items-center gap-3 lg:mb-6">
                  <span className="text-timecode text-muted">
                    {String(i + 1).padStart(2, "0")} / {p.year}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-[50%] lg:min-h-64 w-full overflow-hidden rounded-lg lg:rounded-xl vignette">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="object-cover"
                  />
                  <div
                    className={`absolute inset-0 ${
                      p.tone === "amber"
                        ? "bg-linear-to-t from-ink via-ink/20 to-transparent"
                        : "bg-linear-to-t from-ink via-ink/25 to-transparent"
                    }`}
                  />
                  <span
                    className={`absolute bottom-4 right-5 font-display italic leading-none text-[clamp(2.5rem,7vw,4.5rem)] ${
                      p.tone === "amber" ? "text-amber/40" : "text-teal/45"
                    }`}
                  >
                    {p.reel}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex flex-col gap-1">
                    <h3 className="font-display text-display-3 text-bone">
                      {p.title}
                    </h3>
                    <span className="whitespace-nowrap text-label uppercase text-muted">
                      {p.role}
                    </span>
                  </div>
                  <p className="mb-5 text-body-fluid text-bone-dim lg:max-w-md">
                    {p.detail}
                  </p>
                  <ul className="mb-5 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-line px-3 py-1 text-label uppercase text-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>

                  {p.link && (
                    <a
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      // data-cursor="View"
                      onMouseMove={handleLinkMove(i)}
                      onMouseEnter={handleLinkEnter(i)}
                      onMouseLeave={handleLinkLeave(i)}
                      className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-line bg-surface px-6 py-3 text-label uppercase text-bone will-change-transform"
                    >
                      <span
                        ref={(el) => {
                          glowRefs.current[i] = el;
                        }}
                        className="pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                        style={{
                          left: "50%",
                          top: "50%",
                          background:
                            "radial-gradient(circle, rgba(229,130,74,0.55) 0%, rgba(229,130,74,0.12) 45%, transparent 70%)",
                          filter: "blur(2px)",
                        }}
                      />

                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)",
                        }}
                      />

                      <span className="relative z-10">View live</span>
                      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted">
                        ↗
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
