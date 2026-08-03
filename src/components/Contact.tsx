"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/vishalraj55",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current"
      >
        <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.34-3.84-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 2.87-.39c.97.01 1.95.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.34-5.2 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/vishalraj55",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:vishalraj2487@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-none stroke-current"
        strokeWidth="1.8"
      >
        <path d="M3 6.5h18v11H3z" strokeLinejoin="round" />
        <path d="m3 6.5 9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-32%", "32%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.35, 1.05]);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = linkRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
  }

  function handleLeave() {
    const el = linkRef.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden min-h-screen flex flex-col justify-between bg-black text-white"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <Image
          src="/img/contact.jpg"
          alt=""
          fill
          className="w-full h-[160%] object-cover grayscale contrast-125"
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-black/10 via-black/40 to-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Top row: label + socials */}
      <div className="relative z-10 gutter flex items-center justify-between pt-8 sm:pt-10 text-xs sm:text-sm uppercase tracking-wider">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="text-white/60"
        >
          Available for work
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={
                s.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              aria-label={s.label}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors duration-300"
            >
              {s.icon}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Headline */}
      <div className="relative z-10 gutter flex-1 flex flex-col justify-center items-center gap-0">
        <h1 className="font-display uppercase leading-[0.9] tracking-tight text-[clamp(3rem,3rem+7vw,50rem)] text-center">
          <motion.span
            className="block text-[15vw] sm:text-[13vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease }}
          >
            Let&apos;s build
          </motion.span>
          <motion.span
            className="block text-[15vw] sm:text-[13vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            an experience
          </motion.span>
          <motion.span
            className="block text-[15vw] sm:text-[13vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            that moves
          </motion.span>
          <motion.span
            className="block text-[15vw] sm:text-[13vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            people
          </motion.span>
        </h1>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 gutter pb-8 sm:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <motion.a
          ref={linkRef}
          href="mailto:vishalraj2487@gmail.com"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center gap-4 bg-white text-black rounded-full pl-8 pr-3 py-4 transition-transform duration-300 ease-out self-start sm:self-auto"
        >
          <span className="font-display text-2xl sm:text-3xl">Contact me</span>
          <motion.span
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black grid place-items-center shrink-0"
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 45 }}
            transition={{ duration: 0.3, ease }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-5 sm:h-5 fill-none stroke-white"
              strokeWidth="2"
            >
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="flex flex-col items-start sm:items-end gap-1 text-xs sm:text-sm uppercase tracking-wider text-white/60"
        >
          <span>Vishal Rajbhar</span>
          <span>Mumbai, India</span>
        </motion.div>
      </div>
    </section>
  );
}
