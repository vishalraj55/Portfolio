"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const linkRef = useRef<HTMLAnchorElement>(null);

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

  return (
    <section
      id="contact"
      className="section-pad gutter border-t border-line flex flex-col gap-10"
    >
      <p className="text-label uppercase text-amber">05 - Roll Credits</p>

      <div className="flex flex-col gap-6">
        <h2 className="font-display text-display-1 text-bone max-w-3xl">
          Got a role, a build, or a bug worth talking about?
        </h2>

        <motion.a
          ref={linkRef}
          href="mailto:vishalraj2487@gmail.com"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="group inline-flex items-center gap-4 self-start transition-transform duration-300 ease-out"
        >
          <span className="font-display italic text-[clamp(2.2rem,3vw+1rem,4.5rem)] text-bone group-hover:text-amber transition-colors duration-300">
            Contact Me
          </span>
          <span className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-line grid place-items-center shrink-0 group-hover:border-amber group-hover:rotate-45 transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-5 sm:h-5 fill-none stroke-bone group-hover:stroke-amber"
              strokeWidth="1.5"
            >
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-line-soft">
        <ContactMeta label="Location" value="Mumbai, India" />
        <ContactMeta label="Status" value="Open to roles" />
        <ContactMeta
          label="GitHub"
          value="vishalraj55"
          href="https://github.com/vishalraj55"
        />
        <ContactMeta
          label="LinkedIn"
          value="vishal rajbhar"
          href="https://linkedin.com/in/vishalraj55"
        />
      </div>
    </section>
  );
}

function ContactMeta({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-label uppercase text-muted block mb-2">
        {label}
      </span>
      <span className="text-body-fluid text-bone-dim">{value}</span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="hover:text-amber transition-colors duration-300"
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}
