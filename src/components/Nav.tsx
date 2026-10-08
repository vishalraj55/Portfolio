"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LINKS = [
  { href: "#work", label: "Reel", cursor: "Work" },
  { href: "#about", label: "Cut", cursor: "About Me" },
  { href: "#skills", label: "Kit", cursor: "My Skills" },
  { href: "#contact", label: "Contact", cursor: "Get in Touch" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [time, setTime] = useState({ hm: "", s: "", period: "" });

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      setTime({
        hm: `${get("hour")}:${get("minute")}`,
        s: get("second"),
        period: get("dayPeriod"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    document.body.style.overflow = open ? "hidden" : "";
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
  }, [open]);

  useEffect(() => {
    if (!panelRef.current || !layerRef.current) return;

    if (!tlRef.current) {
      gsap.set(panelRef.current, { xPercent: 100 });
      gsap.set(layerRef.current, { xPercent: 100 });
      gsap.set(itemsRef.current, { xPercent: 20, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    tl.to(layerRef.current, {
      xPercent: 0,
      duration: 0.5,
      ease: "power4.out",
    });

    tl.to(
      panelRef.current,
      {
        xPercent: 0,
        duration: 0.5,
        ease: "power4.out",
      },
      "-=0.42",
    );

    tl.to(
      itemsRef.current,
      {
        xPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.07,
      },
      "-=0.25",
    );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (open) {
      tlRef.current.timeScale(1).play();
    } else {
      tlRef.current.timeScale(1.4).reverse();
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 gutter transition-[background-color,border-color,padding] duration-500 ease-out ${
          scrolled
            ? "py-3 bg-ink/85 backdrop-blur-md border-b border-line md:py-4 md:bg-transparent md:backdrop-blur-none md:border-transparent md:pointer-events-none"
            : "py-6 border-b border-transparent"
        }`}
      >
        <nav
          className={`mx-auto flex w-full max-w-full items-center justify-between transition-[max-width,padding,background-color,border-color] duration-500 ease-out md:border md:pointer-events-auto ${
            scrolled
              ? "md:max-w-160 md:rounded-full md:border-line md:bg-ink/80 md:px-6 md:py-2.5 md:backdrop-blur-md"
              : "md:max-w-full md:rounded-full md:border-transparent md:bg-transparent md:px-0 md:py-0"
          }`}
        >
          <a
            href="#hero"
            className="relative z-50 font-display italic text-lg sm:text-xl tracking-tight text-bone"
            data-cursor="logo"
          >
            VR<span className="text-amber not-italic">.</span>
          </a>

          <ul
            className={`hidden md:flex items-center transition-[gap] duration-500 ease-out ${
              scrolled ? "gap-7" : "gap-9"
            }`}
          >
            {LINKS.map((l, i) => (
              <li key={l.href} className="flex items-center">
                <span
                  aria-hidden
                  className={`inline-block overflow-hidden whitespace-nowrap text-label text-muted transition-[max-width,opacity,margin] duration-500 ease-out ${
                    scrolled
                      ? "mr-0 max-w-0 opacity-0"
                      : "mr-2 max-w-6 opacity-100"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={l.href}
                  data-cursor={l.cursor}
                  className="text-label uppercase text-bone-dim hover:text-amber transition-colors duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center tabular-nums text-label uppercase text-bone-dim hover:text-amber transition-colors duration-300"
            data-cursor="My local time - Mumbai, India"
          >
            <span>{time.hm}</span>
            <span
              aria-hidden
              className={`inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-500 ease-out ${
                scrolled ? "max-w-0 opacity-0" : "max-w-8 opacity-100"
              }`}
            >
              :{time.s}
            </span>
            {time.period && <span className="ml-1.5">{time.period}</span>}
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-50 flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "translate-y-0.75 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "-translate-y-0.75 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        ref={layerRef}
        className="md:hidden fixed inset-0 top-0 z-40 bg-amber/10 pointer-events-none"
      />

      <div
        ref={panelRef}
        className="md:hidden fixed inset-0 top-0 z-40 bg-ink border-l border-line-soft"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <ul className="flex flex-col justify-center h-full gutter gap-2">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="border-b border-line-soft py-4"
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 font-display text-display-3 text-bone"
              >
                <span className="text-label text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="group-hover:text-amber transition-colors duration-300">
                  {l.label}
                </span>
              </a>
            </li>
          ))}

          <li
            ref={(el) => {
              itemsRef.current[LINKS.length] = el;
            }}
            className="pt-6"
          >
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 text-label uppercase border border-line rounded-full px-4 py-2 text-bone"
            >
              Available for hire
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}