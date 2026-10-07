"use client";

import { motion } from "framer-motion";

const EMAIL = "vishalraj2487@gmail.com";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/vishalraj55",
    path: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.500 11.500 0 0 1 6 0c2.300-1.500 3.300-1.200 3.300-1.200.7 1.700.2 2.900.1 3.200.8.800 1.200 1.900 1.200 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/vishalraj55",
    path: "M20.400 20.500h-3.600v-5.600c0-1.300 0-3-1.800-3s-2.100 1.400-2.100 2.900v5.700H9.400V9h3.400v1.600c.5-.9 1.600-1.900 3.400-1.900 3.600 0 4.300 2.400 4.300 5.500v6.300zM5.300 7.400a2.100 2.100 0 1 1 0-4.100 2.100 2.100 0 0 1 0 4.100zm1.800 13.100H3.600V9h3.500v11.500zM22.200 0H1.800C.8 0 0 .8 0 1.700v20.600c0 .9.800 1.700 1.800 1.700h20.400c1 0 1.800-.8 1.800-1.700V1.700C24 .8 23.200 0 22.200 0z",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1, delay, ease },
});

const meta = "text-[10px] leading-snug sm:text-xs text-bone/60";

export default function Contact() {
  return (
    <section
      id="contact"
      className="flex min-h-svh flex-col justify-between bg-black p-5 text-bone sm:p-8"
    >
      {/* Top bar */}
      <motion.header
        {...reveal()}
        className={`grid grid-cols-2 items-start ${meta}`}
      >
        <p>
          Full-Stack Developer
          <br />
          Portfolio 2026
        </p>
        <p className="text-right">
          Available for work
          <br />
          Mumbai, India
        </p>
      </motion.header>

      {/* Center */}
      <div className="flex flex-col items-center py-6 text-center">
        <motion.h2
          {...reveal(0.1)}
          className="relative font-(family-name:--font-display-tall) text-[clamp(4rem,17vw,16rem)] uppercase leading-[0.82] tracking-tight"
        >
          Interested in
          <br />
          working together?
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-[0.75em] drop-shadow-2xl"
              animate={{ rotate: [-8, 8, -8], y: [0, -8, 0] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            >
              ✌🏼
            </motion.span>
          </span>
        </motion.h2>

        <motion.div {...reveal(0.25)} className="mt-8 space-y-1">
          <p className={meta}>Contact me:</p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-xl underline decoration-bone/20 underline-offset-8 transition-colors duration-300 hover:text-amber hover:decoration-amber sm:text-2xl"
          >
            {EMAIL}
          </a>
        </motion.div>
        <ul className="flex gap-2 pt-4">
          {SOCIALS.map(({ label, href, path }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 transition-colors duration-300 hover:border-amber hover:bg-amber hover:text-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                >
                  <path d={path} />
                </svg>
              </a>
            </li>
          ))}
          <li id="ask-slot" aria-hidden className="h-10 w-10" />
        </ul>
      </div>

      {/* Bottom bar */}
      <motion.footer
        {...reveal(0.3)}
        className={`flex items-end justify-between gap-4 ${meta}`}
      >
        <p>
          Design &amp; development
          <br />
          by Vishal Rajbhar
        </p>

        <p className="text-right">
          &copy; {new Date().getFullYear()} · All Rights Reserved
          <br />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition-colors duration-300 hover:text-amber"
          >
            Back to top ↑
          </button>
        </p>
      </motion.footer>
    </section>
  );
}
