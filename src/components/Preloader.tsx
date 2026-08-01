"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const COLUMN_COUNT = 5;

export default function Preloader({
  onDone,
}: {
  onDone: () => void;
}) {
  const [pct, setPct] = useState(0);

  const labelRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      onDone();
      return;
    }

    const obj = { value: 0 };

    const tween = gsap.to(obj, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",

      onUpdate: () => {
        setPct(Math.floor(obj.value));
      },

      onComplete: () => {
        if (doneRef.current) return;
        doneRef.current = true;

        const tl = gsap.timeline({
          delay: 0.15,
          onComplete: onDone,
        });

        // Fade the loading UI
        tl.to(labelRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
        });

        // Center panel
        tl.to(
          colsRef.current[2],
          {
            yPercent: -100,
            rotation: -1.5,
            duration: 0.9,
            ease: "power4.inOut",
            transformOrigin: "center center",
          },
          "-=0.1"
        );

        // Left + Right adjacent
        tl.to(
          [colsRef.current[1], colsRef.current[3]],
          {
            yPercent: -100,
            rotation: (i) => (i === 0 ? -1 : 1),
            duration: 0.95,
            ease: "power4.inOut",
            stagger: 0.08,
            transformOrigin: "center center",
          },
          "-=0.65"
        );

        // Outer panels
        tl.to(
          [colsRef.current[0], colsRef.current[4]],
          {
            yPercent: -100,
            rotation: (i) => (i === 0 ? -2 : 2),
            duration: 1,
            ease: "power4.inOut",
            stagger: 0.08,
            transformOrigin: "center center",
          },
          "-=0.72"
        );
      },
    });

    return () => {
      tween.kill();
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-9999 flex pointer-events-none overflow-hidden">
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            colsRef.current[i] = el;
          }}
          className="relative flex-1 h-full bg-ink overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 w-px bg-line-soft" />
        </div>
      ))}

      <div
        ref={labelRef}
        className="absolute inset-0 flex flex-col justify-between px-6 py-8 text-bone"
      >
        <div className="flex items-center justify-between text-label uppercase text-muted">
          <span>Vishal Rajbhar - Reel</span>
          <span>Loading</span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="font-display text-display-1 italic leading-none">
            {String(pct).padStart(3, "0")}
            <span className="text-[0.4em] align-top not-italic text-muted">
              %
            </span>
          </div>

          <div className="hidden xs:block relative w-8 h-8 rounded-full border border-amber/60 shrink-0 mb-2">
            <span
              className="absolute inset-0 rounded-full border-t-2 border-amber"
              style={{
                transform: `rotate(${pct * 3.6}deg)`,
              }}
            />
          </div>
        </div>

        <div className="relative w-full h-px overflow-hidden bg-line">
          <div
            className="absolute inset-y-0 left-0 bg-amber"
            style={{
              width: `${pct}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}