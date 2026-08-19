"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const COLUMN_COUNT = 5;
const MIN_DISPLAY_MS = 500;
const CREEP_TIME_CONSTANT = 900;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  const labelRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      onDone();
      return;
    }

    let finished = false;
    let rafId: number;
    const obj = { value: 0 };
    const startTime = performance.now();
    function tick() {
      if (finished) return;
      const elapsed = performance.now() - startTime;
      obj.value = 90 * (1 - Math.exp(-elapsed / CREEP_TIME_CONSTANT));
      setPct(Math.floor(obj.value));
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    const loadPromise =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), {
              once: true,
            }),
          );
    const fontsPromise = document.fonts
      ? document.fonts.ready
      : Promise.resolve();

    Promise.all([loadPromise, fontsPromise, delay(MIN_DISPLAY_MS)]).then(() => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(rafId);
      playExit(obj);
    });

    function playExit(progressObj: { value: number }) {
      gsap.to(progressObj, {
        value: 100,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => setPct(Math.floor(progressObj.value)),
        onComplete: () => {
          if (doneRef.current) return;
          doneRef.current = true;
          const panels = [...colsRef.current].reverse();

          const tl = gsap.timeline({
            delay: 0.15,
            onComplete: onDone,
          });

          tl.to(labelRef.current, {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
          });

          tl.to(
            panels,
            {
              yPercent: -100,
              duration: 1.1,
              ease: "power4.inOut",
              stagger: 0.06,
              transformOrigin: "center center",
            },
            "-=0.25",
          );
        },
      });
    }

    return () => {
      finished = true;
      cancelAnimationFrame(rafId);
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
          className="relative flex-1 h-full bg-ink"
        />
      ))}

      <div
        ref={labelRef}
        className="absolute inset-0 flex flex-col justify-between px-6 py-8 text-bone"
      >
        <div className="flex items-center justify-between text-label uppercase text-muted">
          <span>Vishal Rajbhar</span>
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