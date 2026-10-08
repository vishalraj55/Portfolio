"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
function Mask({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <span
      ref={ref}
      className={`my-[-0.1em] block overflow-hidden py-[0.1em] ${className}`}
    >
      <motion.span
        className="block"
        initial={false}
        animate={{ y: inView ? 0 : "110%" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* row */
type Project = (typeof projects)[number];

function Row({
  p,
  i,
  open,
  dimmed,
  hovered,
  onToggle,
  onHover,
}: {
  p: Project;
  i: number;
  open: boolean;
  dimmed: boolean;
  hovered: boolean;
  onToggle: () => void;
  onHover: (v: boolean) => void;
}) {
  const accent = p.tone === "amber" ? "bg-amber" : "bg-teal";
  const accentText = p.tone === "amber" ? "text-amber" : "text-teal";

  return (
    <motion.li
      animate={{ opacity: dimmed ? 0.25 : 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      {/* base line + animated fill */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE, delay: i * 0.08 }}
      />
      <motion.span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px origin-left ${accent}`}
        animate={{ scaleX: hovered || open ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center gap-4 py-6 text-left sm:gap-8 lg:py-9"
      >
        <span
          className={`w-8 shrink-0 text-timecode transition-colors duration-300 sm:w-12 ${
            hovered || open ? accentText : "text-muted"
          }`}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        <motion.span
          className="block min-w-0 flex-1 font-display leading-[0.95] text-bone text-[clamp(2rem,7vw,5.5rem)]"
          animate={{ x: hovered ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <Mask delay={i * 0.08}>
            <span className={open ? "italic" : ""}>{p.title}</span>
          </Mask>
        </motion.span>

        <span className="hidden shrink-0 text-right text-label uppercase text-muted md:block">
          {p.role}
          <span className="block text-timecode">{p.year}</span>
        </span>

        <motion.span
          aria-hidden
          animate={{
            rotate: open ? 45 : 0,
            backgroundColor:
              hovered || open ? "rgba(229,130,74,1)" : "rgba(229,130,74,0)",
            color: hovered || open ? "#0b0b0c" : "#8a8a8a",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-lg leading-none sm:h-12 sm:w-12"
        >
          +
        </motion.span>
      </button>

      {/* expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-6 pl-0 sm:gap-8 sm:pb-10 sm:pl-20 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pb-14">
              <div className="max-w-xl">
                {/* image: mobile/tablet only (desktop uses cursor preview) */}
                <motion.div
                  className="relative mb-6 aspect-16/10 w-full overflow-hidden rounded-lg lg:hidden"
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </motion.div>

                <motion.p
                  className="text-body-fluid text-bone-dim"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                >
                  {p.detail}
                </motion.p>

                <span className="mt-4 block text-label uppercase text-muted md:hidden">
                  {p.role} · {p.year}
                </span>
              </div>

              <div className="flex flex-col items-start gap-6 lg:items-end">
                <motion.ul
                  className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end"
                  initial="hidden"
                  animate="show"
                  variants={{
                    show: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
                    },
                  }}
                >
                  {p.stack.map((s) => (
                    <motion.li
                      key={s}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="rounded-full border border-line px-3 py-1 text-label uppercase text-muted"
                    >
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>

                {p.link && (
                  <motion.a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cta inline-flex items-center gap-3 text-label uppercase text-bone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      className="font-extrabold group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-white/20 bg-white px-4 py-2 text-sm text-black transition-all duration-300 hover:gap-3 hover:bg-white/90 hover:shadow-lg active:scale-95"
                    >
                      <span>View live</span>
                    </button>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/* section  */
export default function Work() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const total = projects.length;

  // cursor-follow preview
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 });
  const vx = useSpring(useVelocity(mx), { stiffness: 120, damping: 20 });
  const rotate = useTransform(vx, [-1800, 1800], [-10, 10]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const showPreview = hover !== null && !reduce;

  return (
    <section
      id="work"
      data-no-banner
      onPointerMove={onMove}
      className="relative bg-ink py-20 sm:py-28 lg:py-10"
    >
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-5">
        {/* header */}
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              className="mb-4 text-label uppercase text-amber"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Selected work ({String(total).padStart(2, "0")})
            </motion.p>
            <h2 className="font-display text-display-1 leading-[0.95] text-bone">
              <Mask>Shipped,</Mask>
              <Mask delay={0.1}>
                <span className="text-bone-dim">not</span> staged.
              </Mask>
            </h2>
          </div>
        </div>

        {/* list */}
        <ul
          className="border-b border-line"
          onPointerLeave={() => setHover(null)}
        >
          {projects.map((p, i) => (
            <Row
              key={p.reel}
              p={p}
              i={i}
              open={open === i}
              hovered={hover === i}
              dimmed={hover !== null && hover !== i}
              onToggle={() => setOpen(open === i ? null : i)}
              onHover={(v) => setHover(v ? i : null)}
            />
          ))}
        </ul>
      </div>

      {/* floating cursor preview (desktop, mouse only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
        style={{ x, y, rotate, marginLeft: 36, marginTop: -130 }}
        animate={{ scale: showPreview ? 1 : 0.6, opacity: showPreview ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="relative h-65 w-88 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
          {projects.map((p, i) => (
            <motion.div
              key={p.reel}
              className="absolute inset-0"
              initial={false}
              animate={{
                clipPath:
                  hover === i ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                scale: hover === i ? 1 : 1.15,
              }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <Image
                src={p.image}
                alt=""
                fill
                sizes="22rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <span
                className={`absolute bottom-3 right-4 font-display italic leading-none text-4xl ${
                  p.tone === "amber" ? "text-amber/70" : "text-teal/70"
                }`}
              >
                {p.reel}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
