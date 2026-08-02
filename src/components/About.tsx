"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT_1 = "SOFTWARE-DEVELOPER ✦ DESIGNER ✦ BUILDER   ";
const MARQUEE_TEXT_2 = "SHIPPED ✦ DEBUGGED ✦ DEPLOYED ✦ ";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  // const panelsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoMobileRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const curveTextPathRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-line",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: stageRef.current, start: "top 75%" },
        },
      );

      [photoRef.current, photoMobileRef.current].forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, rotate: 0 },
          {
            opacity: 1,
            y: 0,
            rotate: -6,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      gsap.fromTo(
        ".about-doodle",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2)",
          stagger: 0.1,
          scrollTrigger: { trigger: stageRef.current, start: "top 75%" },
        },
      );

      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // curved background marquee - opposite diagonal
      if (curveTextPathRef.current) {
        gsap.fromTo(
          curveTextPathRef.current,
          { attr: { startOffset: "0%" } },
          {
            attr: { startOffset: "-100%" },
            ease: "none",
            duration: 26,
            repeat: -1,
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line section-bg-about pt-15 pb-35 px-6 md:px-10 lg:px-16"
    >
      {/* diagonal background marquee */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="w-[220%] flex" style={{ transform: "rotate(-10deg)" }}>
          <div
            ref={marqueeTrackRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-[0.35em]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-[0.35em] font-display font-bold text-[clamp(4rem,14vw,11rem)] leading-none uppercase tracking-tight"
                  >
                    <span
                      className={i % 2 === 0 ? "text-bone/5" : "text-amber/8"}
                    >
                      {MARQUEE_TEXT_1.trim()}
                    </span>
                    <span className="text-amber/10">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* curved background marquee */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <path
              id="about-curve"
              d="M -300 150 Q 960 420 2220 700"
              fill="none"
            />
          </defs>
          <text
            className="font-display font-bold uppercase tracking-tight"
            style={{ fill: "var(--color-bone)", fillOpacity: 0.05 }}
            fontSize="150"
          >
            <textPath
              ref={curveTextPathRef}
              href="#about-curve"
              startOffset="0%"
            >
              {MARQUEE_TEXT_2.repeat(8)}
            </textPath>
          </text>
        </svg>
      </div>

      <p className="relative z-10 text-label uppercase text-amber mb-10 about-line">
        03 - The Cut
      </p>

      {/* DESKTOP LAYOUT*/}
      <div
        ref={stageRef}
        className="relative z-10 hidden md:flex items-center gap-10 lg:gap-16 w-full max-w-6xl mx-auto"
      >
        {/* LEFT: photo + stickers */}
        <div
          className="relative shrink-0 w-[48%]"
          style={{ aspectRatio: "1 / 1.15" }}
        >
          {/* Chill bear sticker */}
          <div
            className="about-doodle absolute z-20"
            style={{ left: "40%", top: "1%", width: "50%", height: "40%" }}
          >
            <Image
              src="/img/Chill.png"
              alt=""
              fill
              sizes="(max-width: 768px) 96px, 280px"
              className="object-contain"
            />
          </div>

          {/* Tape */}
          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "-35%", top: "-2%", width: "50%", height: "40%" }}
          >
            <div
              className="relative"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-30deg)",
              }}
            >
              <Image
                src="/img/tape.png"
                alt=""
                fill
                sizes="(max-width: 768px) 128px, 220px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Main photo */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{ left: "-20%", top: "0%", width: "100%", height: "100%" }}
          >
            <div
              ref={photoRef}
              className="relative shadow-2xl"
              style={{
                transform: "rotate(-6deg)",
                width: "80%",
                height: "80%",
              }}
            >
              <Image
                src="/img/about.png"
                alt="Vishal Rajbhar"
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Holdon sticker */}
          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "-30%", top: "60%", width: "40%", height: "15%" }}
          >
            <div
              className="relative"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-5deg)",
              }}
            >
              <Image
                src="/img/holdon.png"
                alt=""
                fill
                sizes="(max-width: 768px) 160px, 550px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Bow */}
          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "30%", top: "58%", width: "100%", height: "25%" }}
          >
            <div
              className="relative"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-40deg)",
              }}
            >
              <Image
                src="/img/bow.png"
                alt=""
                fill
                sizes="(max-width: 768px) 200px, 440px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Drip */}
          <div
            className="about-doodle absolute flex items-center justify-center"
            style={{ left: "-10.5%", top: "89%", width: "80%", height: "28%" }}
          >
            <div
              className="relative"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-6deg)",
              }}
            >
              <Image
                src="/img/drip.png"
                alt=""
                fill
                sizes="(max-width: 768px) 200px, 440px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: text content */}
        <div className="flex-1 min-w-0">
          <p className="about-line font-display font-bold text-bone leading-none text-6xl lg:text-7xl xl:text-8xl mb-6">
            Hi<span className="text-amber">!!</span>
          </p>

          <div className="about-line text-bone-dim font-semibold leading-snug text-lg lg:text-xl xl:text-2xl mb-8 max-w-md">
            <p>My name is Vishal Rajbhar i&apos;m</p>
            <p>a designer / Software Developer</p>
            <p>based in India.</p>
          </div>

          <div className="about-line text-bone-dim mb-8 max-w-lg">
            <p className="font-display font-bold leading-tight text-2xl lg:text-3xl mb-2">
              Ever since
            </p>
            <p className="font-semibold leading-snug text-lg lg:text-xl xl:text-2xl">
              I remember I&apos;ve always had a special interest in visual
              communication, from the most simple sketch to the most elaborated
              presentation.
            </p>
          </div>

          <div className="about-line text-bone-dim max-w-lg">
            <p className="leading-snug text-lg lg:text-xl xl:text-2xl">
              <span className="font-display font-bold text-2xl lg:text-3xl">
                I live to{" "}
              </span>
              discover and experience creative ways to express myself and do it
              for others.
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="relative z-10 md:hidden">
        <div className="relative w-[min(300px,98vw)] mx-auto">
          <div className="about-doodle absolute -top-2 left-0 z-20"></div>

          <div className="about-doodle absolute -top-11 -right-6 w-24 h-40 z-20">
            <Image
              src="/img/Chill.png"
              alt=""
              fill
              sizes="(max-width: 768px) 160px, 280px"
              className="object-contain"
            />
          </div>

          <div className="about-doodle absolute -top-3 -left-15 w-40 z-20">
            <div
              className="relative w-full aspect-233/141"
              style={{ transform: "rotate(-27deg)" }}
            >
              <Image
                src="/img/tape.png"
                alt=""
                fill
                sizes="(max-width: 768px) 128px, 220px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="about-doodle absolute -bottom-27 left-5 w-50">
            <div
              className="relative w-full aspect-233/141"
              style={{ transform: "rotate(-6deg)" }}
            >
              <Image
                src="/img/drip.png"
                alt=""
                fill
                sizes="(max-width: 768px) 200px, 440px"
                className="object-contain"
              />
            </div>
          </div>

          <div
            ref={photoMobileRef}
            className="relative z-10 shadow-4xl -rotate-6 w-full h-90 overflow-hidden"
          >
            <Image
              src="/img/about.png"
              alt="Vishal Rajbhar"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="about-doodle absolute -bottom-12 -left-10 w-32 z-20">
            <div
              className="relative w-full aspect-16/51"
              style={{ transform: "rotate(-5deg)" }}
            >
              <Image
                src="/img/holdon.png"
                alt=""
                fill
                sizes="(max-width: 768px) 160px, 550px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="about-doodle absolute -bottom-11 -right-25 w-40 z-20">
            <div
              className="relative w-full aspect-233/141"
              style={{ transform: "rotate(-38deg)" }}
            >
              <Image
                src="/img/bow.png"
                alt=""
                fill
                sizes="(max-width: 768px) 200px, 440px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-25 max-w-md mx-auto">
          <h2 className="about-line font-display font-bold text-bone text-5xl leading-none mb-4">
            Hi<span className="text-amber">!!</span>
          </h2>

          <p className="about-line text-bone-dim font-semibold text-sm leading-snug mb-5">
            My name is Vishal Rajbhar i&apos;m a designer / Software Developer
            based in India.
          </p>

          <div className="about-line text-bone-dim text-sm leading-snug mb-5">
            <p className="font-display font-bold text-lg mb-1">Ever since</p>
            <p>
              I remember I&apos;ve always had a special interest in visual
              communication, from the most simple sketch to the most elaborated
              presentation.
            </p>
          </div>

          <div className="about-line text-bone-dim text-sm leading-snug mb-8">
            <p>
              <span className="font-display font-bold text-base">
                I live to{" "}
              </span>
              discover and experience creative ways to express myself and do it
              for others.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
