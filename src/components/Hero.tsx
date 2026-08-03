"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const rise = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || !sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      // background img
      gsap.to(bgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate min-h-svh flex flex-col justify-between gutter pt-28 pb-10 overflow-hidden"
    >
      {/* background layer*/}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 scale-[1.15]">
          <Image
            src="/img/hero2.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/75 to-ink/40" />
        <div className="absolute inset-0 bg-ink/35" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        <motion.div variants={fade} className="overflow-hidden">
          <p className="text-label uppercase text-muted">
            Full-stack developer Mumbai, IN
          </p>
        </motion.div>

        <h1 className="font-display text-hero text-bone ml-[-0.02em] mt-1">
          <span className="block overflow-hidden">
            <motion.span variants={rise} className="block">
              VISHAL
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.15em] mb-[-0.15em]">
            <motion.span
              variants={rise}
              className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-bone)] sm:[-webkit-text-stroke:2px_var(--color-bone)]"
            >
              RAJBHAR
              <span className="text-amber [-webkit-text-stroke:0px] not-italic">
                .
              </span>
            </motion.span>
          </span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-end mt-10">
        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
          className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 text-lead text-bone-dim md:text-right"
        >
          I build fast, focused software full-stack, from a Postgres schema to
          the pixel that ships. Four products shipped, three production
          incidents survived and documented.
        </motion.p>
      </div>

      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.85 }}
        className="hidden sm:flex items-center gap-3 absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <span className="w-8 h-px bg-line" />
        <span className="text-label uppercase text-muted">Scroll to play</span>
        <span className="w-8 h-px bg-line" />
      </motion.div>
    </section>
  );
}
