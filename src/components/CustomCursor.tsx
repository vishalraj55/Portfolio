"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BANNER_OFFSET_X = 20;
const BANNER_OFFSET_Y = 26;
const EDGE_PADDING = 12;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isTouch] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: coarse)").matches
      : false,
  );
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const banner = bannerRef.current;
    if (!cursor || !banner) return;

    const cx = gsap.quickTo(cursor, "x", {
      duration: 0.12,
      ease: "power3.out",
    });
    const cy = gsap.quickTo(cursor, "y", {
      duration: 0.12,
      ease: "power3.out",
    });
    const bx = gsap.quickTo(banner, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const by = gsap.quickTo(banner, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    function getBannerPosition(clientX: number, clientY: number) {
      const rect = banner!.getBoundingClientRect();
      const w = rect.width || banner!.offsetWidth;
      const h = rect.height || banner!.offsetHeight;

      let x = clientX + BANNER_OFFSET_X;
      let y = clientY + BANNER_OFFSET_Y;

      if (x + w + EDGE_PADDING > window.innerWidth) {
        x = clientX - w - BANNER_OFFSET_X;
      }
      if (y + h + EDGE_PADDING > window.innerHeight) {
        y = clientY - h - (BANNER_OFFSET_Y - 10);
      }

      x = Math.max(EDGE_PADDING, x);
      y = Math.max(EDGE_PADDING, y);

      return { x, y };
    }

    const move = (e: MouseEvent) => {
      cx(e.clientX);
      cy(e.clientY);
      const { x, y } = getBannerPosition(e.clientX, e.clientY);
      bx(x);
      by(y);
    };
    window.addEventListener("mousemove", move);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      if (!target) return;
      const text =
        target.dataset.cursor ||
        target.getAttribute("aria-label") ||
        target.textContent?.trim().slice(0, 20) ||
        "View";
      setLabel(text);
      setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      const from = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      if (!from) return;
      const to = e.relatedTarget as HTMLElement | null;
      if (to && from.contains(to)) return;
      setHovering(false);
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    const html = document.documentElement;
    const onWindowLeave = () => {
      setHovering(false);
      gsap.to(cursor, { opacity: 0, duration: 0.15, ease: "power2.out" });
      gsap.to(banner, { opacity: 0, duration: 0.15, ease: "power2.out" });
    };
    const onWindowEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.15, ease: "power2.out" });
    };
    html.addEventListener("mouseleave", onWindowLeave);
    html.addEventListener("mouseenter", onWindowEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      html.removeEventListener("mouseleave", onWindowLeave);
      html.removeEventListener("mouseenter", onWindowEnter);
    };
  }, [isTouch]);

  useEffect(() => {
    if (isTouch || !cursorRef.current || !bannerRef.current) return;
    gsap.to(cursorRef.current, {
      scale: hovering ? 0.85 : 1,
      duration: 0.25,
      ease: "power3.out",
    });
    gsap.to(bannerRef.current, {
      opacity: hovering ? 1 : 0,
      scale: hovering ? 1 : 0.85,
      duration: 0.28,
      ease: "power3.out",
    });
  }, [hovering, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* arrow cursor */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 z-10000 pointer-events-none -translate-x-1 -translate-y-0.5"
      >
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
          <path
            d="M2 1.8C2 1 2.9 0.6 3.5 1.1L17.5 11C18.1 11.5 17.9 12.5 17.1 12.7L11.3 14.1C11 14.2 10.7 14.4 10.5 14.7L7.3 19.8C6.9 20.5 5.8 20.4 5.6 19.6L2 1.8Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* hover label banner */}
      <div
        ref={bannerRef}
        className="hidden md:block fixed top-0 left-0 z-10000 pointer-events-none opacity-0 scale-[0.85]"
      >
        <div className="bg-bone text-ink text-[10px] font-medium uppercase tracking-wide whitespace-nowrap px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          {label}
        </div>
      </div>
    </>
  );
}
