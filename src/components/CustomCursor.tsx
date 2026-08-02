"use client";

import { useEffect, useRef, useState, useId } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const filterId = useId().replace(/:/g, "");
  const [isTouch] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: coarse)").matches
      : false,
  );
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    };

    const onEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      );
      setHovering(true);
      setLabel(target?.dataset.cursor || "");
    };

    const onLeave = () => {
      setHovering(false);
      setLabel("");
    };

    window.addEventListener("mousemove", move);

    const hoverEls = document.querySelectorAll(
      "a, button, [data-cursor], [role='button']",
    );
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [isTouch]);

  useEffect(() => {
    if (isTouch || !ringRef.current) return;
    gsap.to(ringRef.current, {
      scale: hovering ? (label ? 2.8 : 1.9) : 1,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(dotRef.current, {
      scale: hovering ? 0 : 1,
      duration: 0.25,
      ease: "power3.out",
    });
  }, [hovering, label, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* SVG displacement filter */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.06"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              in="displaced"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1.1 0"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={dotRef}
        className={`hidden md:block fixed top-0 left-0 z-10000 w-1.5 h-1.5 rounded-full bg-white pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_rgba(255,255,255,0.8)] transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={ringRef}
        className={`hidden md:flex fixed top-0 left-0 z-10000 w-11 h-11 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backdropFilter: `blur(4px) url(#${filterId}) saturate(160%)`,
          WebkitBackdropFilter: "blur(4px) saturate(160%)",
          background: `
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.4), transparent 55%),
            linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))
          `,
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -8px 12px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {label && (
          <span className="relative text-[9px] uppercase tracking-wide text-white whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
