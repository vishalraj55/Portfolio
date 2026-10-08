"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT = "CREATING PRODUCTS ✦ SOLVING PROBLEMS ✦ SHIPPING IDEAS ✦ ";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/vishalraj55", Icon: FaGithub },
  {
    label: "Email",
    href: "mailto:vishalraj2487@gmail.com",
    Icon: HiOutlineMail,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/vishalraj55",
    Icon: FaLinkedinIn,
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoMobileRef = useRef<HTMLDivElement>(null);
  const curveTextPathRef = useRef<SVGTextPathElement>(null);
  const curveTextPathMobileRef = useRef<SVGTextPathElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: stageRef.current, start: "top 75%" };
      gsap.fromTo(
        ".about-line",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: trigger,
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
          scrollTrigger: trigger,
        },
      );

      [curveTextPathRef.current, curveTextPathMobileRef.current].forEach(
        (el) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { attr: { startOffset: "0%" } },
            {
              attr: { startOffset: "-100%" },
              ease: "none",
              duration: 26,
              repeat: -1,
            },
          );
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden section-bg-about pt-15 pb-5 md:pb-35 px-6 md:px-10 lg:px-16"
    >
      {/*  background marquee */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      >
        <svg preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <path
              id="about-curve"
              d="M -200 220 C 120 120, 280 650, 620 540 S 1180 120, 1560 480 S 2050 900, 2250 700"
              fill="none"
            />
          </defs>
          <text
            className="font-display tracking-tight"
            style={{ fill: "var(--color-bone)", fillOpacity: 0.1 }}
            fontSize="100"
          >
            <textPath
              ref={curveTextPathRef}
              href="#about-curve"
              startOffset="0%"
            >
              {MARQUEE_TEXT.repeat(8)}
            </textPath>
          </text>
        </svg>
      </div>

      <p className="relative z-10 text-label uppercase text-amber mb-10 about-line">
        03 - The Cut
      </p>

      <div
        ref={stageRef}
        className="relative z-10 flex flex-col md:flex-row md:items-center gap-10 lg:gap-16 w-full max-w-6xl mx-auto"
      >
        {/* MOBILE background marquee */}
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden md:hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <path
                id="about-curve-mobile"
                d="M -50 100 C 100 220, 300 180, 450 140"
                fill="none"
              />
            </defs>
            <text
              className="font-display tracking-tight"
              style={{ fill: "var(--color-bone)", fillOpacity: 0.5 }}
              fontSize="25"
            >
              <textPath
                ref={curveTextPathMobileRef}
                href="#about-curve-mobile"
                startOffset="0%"
              >
                {MARQUEE_TEXT.repeat(8)}
              </textPath>
            </text>
          </svg>
        </div>

        {/* LEFT (desktop): photo + stickers */}
        <div
          className="relative shrink-0 w-[48%] hidden md:block"
          style={{ aspectRatio: "1 / 1.15" }}
        >
          <div
            data-cursor="Chill Guy"
            className="about-doodle absolute z-20"
            style={{ left: "40%", top: "1%", width: "50%", height: "40%" }}
          >
            <Image
              src="/img/Chill.png"
              alt=""
              fill
              sizes="280px"
              className="object-contain"
            />
          </div>

          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "-35%", top: "-2%", width: "50%", height: "40%" }}
          >
            <div
              data-cursor="Random png"
              className="relative size-full"
              style={{ transform: "rotate(-30deg)" }}
            >
              <Image
                src="/img/tape.png"
                alt=""
                fill
                sizes="220px"
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute z-10 flex items-center justify-center"
            style={{ left: "-20%", top: "0%", width: "100%", height: "100%" }}
          >
            <div
              ref={photoRef}
              data-cursor="Vishal Rajbhar"
              className="relative shadow-2xl"
              style={{ width: "80%", height: "80%" }}
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

          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "-30%", top: "60%", width: "40%", height: "15%" }}
          >
            <div
              data-cursor="Felt Cool"
              className="relative size-full"
              style={{ transform: "rotate(-5deg)" }}
            >
              <Image
                src="/img/holdon.png"
                alt=""
                fill
                sizes="550px"
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="about-doodle absolute z-20 flex items-center justify-center"
            style={{ left: "50%", top: "58%", width: "50%", height: "25%" }}
          >
            <div
              data-cursor="IDK why i put it"
              className="relative size-full"
              style={{ transform: "rotate(-50deg)" }}
            >
              <Image
                src="/img/bow.png"
                alt=""
                fill
                sizes="440px"
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="about-doodle absolute flex items-center justify-center"
            style={{ left: "-10.5%", top: "89%", width: "80%", height: "28%" }}
          >
            <div
              data-cursor="Random png"
              className="relative size-full"
              style={{ transform: "rotate(-6deg)" }}
            >
              <Image
                src="/img/drip.png"
                alt=""
                fill
                sizes="440px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* LEFT (mobile): photo + stickers */}
        <div className="relative w-[min(300px,98vw)] mx-auto md:hidden">
          <div className="about-doodle absolute -top-11 -right-6 w-24 h-40 z-20">
            <Image
              src="/img/Chill.png"
              alt=""
              fill
              sizes="160px"
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
                sizes="128px"
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
                sizes="200px"
                className="object-contain"
              />
            </div>
          </div>

          <div
            ref={photoMobileRef}
            className="relative z-10 shadow-2xl w-full h-90 overflow-hidden"
          >
            <Image
              src="/img/about.png"
              alt="Vishal Rajbhar"
              fill
              sizes="300px"
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
                sizes="160px"
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
                sizes="200px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: text content (shared by mobile + desktop) */}
        <div className="relative flex-1 min-w-0 mt-25 md:mt-0 max-w-md md:max-w-none mx-auto md:mx-0">
          <p className="about-line mb-4 text-label font-semibold uppercase text-muted">
            I&apos;m Vishal Rajbhar &mdash; Designer &amp; Full-Stack Developer
          </p>

          <h2 className="about-line mb-6 font-display leading-[0.95] text-bone text-4xl sm:text-5xl lg:text-6xl">
            Building cinematic,
            <span className="block">fast web experiences.</span>
          </h2>

          <div className="about-line max-w-lg space-y-5 text-base leading-relaxed text-bone-dim lg:text-lg">
            <p>
              I design and build complete products end to end, from the
              interface to the API to the deployment. My stack is Next.js,
              NestJS, PostgreSQL and Tailwind, with Framer Motion and Three.js
              for motion and depth.
            </p>
            <p>
              I care about the details that make a site feel considered: type,
              spacing, timing. Every project here is shipped and live, built
              independently from scratch.
            </p>
          </div>

          <div className="about-line mt-8 flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-amber hover:bg-amber hover:text-ink"
              >
                <Icon size={18} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
