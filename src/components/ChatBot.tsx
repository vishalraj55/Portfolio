"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

const MAX_INPUT_LEN = 2000;
const MAX_HISTORY_MESSAGES = 16;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function getClipOrigin(panelRect: DOMRect, launcherRect: DOMRect) {
  const originX = launcherRect.left + launcherRect.width / 2 - panelRect.left;
  const originY = launcherRect.top + launcherRect.height / 2 - panelRect.top;
  const corners: Array<[number, number]> = [
    [0, 0],
    [panelRect.width, 0],
    [0, panelRect.height],
    [panelRect.width, panelRect.height],
  ];
  const maxRadius = Math.max(
    ...corners.map(([cx, cy]) => Math.hypot(cx - originX, cy - originY)),
  );
  return { originX, originY, maxRadius };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const intentionalAbortRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: loading ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Motion values for the launcher position -- docking thing
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const btn = launcherRef.current;
      const slot = document.getElementById("ask-slot");
      if (!btn || !slot) return;

      const s = slot.getBoundingClientRect();
      const cs = getComputedStyle(btn);
      const root = document.documentElement;

      const homeX =
        root.clientWidth - parseFloat(cs.right) - btn.offsetWidth / 2;
      const homeY =
        root.clientHeight - parseFloat(cs.bottom) - btn.offsetHeight / 2;

      const slotX = s.left + s.width / 2;
      const slotY = s.top + s.height / 2;

      const PULL = 160;
      const t = Math.min(1, Math.max(0, (homeY - slotY + PULL) / PULL));

      x.set((slotX - homeX) * t);
      y.set((slotY - homeY) * t);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [x, y]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const launcher = launcherRef.current;
    if (!panel || !launcher) return;

    if (!open) return;

    const panelRect = panel.getBoundingClientRect();
    const launcherRect = launcher.getBoundingClientRect();
    const { originX, originY, maxRadius } = getClipOrigin(
      panelRect,
      launcherRect,
    );
    const radius = Math.ceil(maxRadius);

    if (prefersReducedMotion()) {
      gsap.set(panel, { opacity: 1, clipPath: "none" });
    } else {
      gsap.fromTo(
        panel,
        {
          opacity: 0,
          clipPath: `circle(0px at ${originX}px ${originY}px)`,
        },
        {
          opacity: 1,
          clipPath: `circle(${radius}px at ${originX}px ${originY}px)`,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(panel, { clearProps: "clipPath,opacity" });
          },
        },
      );
    }

    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !open) return;

    function onWheel(e: WheelEvent) {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = el as HTMLDivElement;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;
      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        e.preventDefault();
        return;
      }
      (el as HTMLDivElement).scrollTop += e.deltaY;
      e.preventDefault();
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = el as HTMLDivElement;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
        e.preventDefault();
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  function closePanel() {
    if (abortRef.current) {
      intentionalAbortRef.current = true;
      abortRef.current.abort();
    }

    const panel = panelRef.current;
    const launcher = launcherRef.current;

    if (!panel || !launcher || prefersReducedMotion()) {
      setOpen(false);
      launcherRef.current?.focus();
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const launcherRect = launcher.getBoundingClientRect();
    const { originX, originY, maxRadius } = getClipOrigin(
      panelRect,
      launcherRect,
    );
    const radius = Math.ceil(maxRadius);

    gsap.fromTo(
      panel,
      {
        opacity: 1,
        clipPath: `circle(${radius}px at ${originX}px ${originY}px)`,
      },
      {
        opacity: 0,
        clipPath: `circle(0px at ${originX}px ${originY}px)`,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          setOpen(false);
          launcherRef.current?.focus();
        },
      },
    );
  }

  function handleLauncherClick() {
    if (open) {
      closePanel();
    } else {
      setExpanded(false);
      setOpen(true);
    }
  }

  function handleBackdropWheel(e: React.WheelEvent) {
    document.body.style.overflow = "";
    window.scrollBy({ top: e.deltaY, left: e.deltaX });
    closePanel();
  }

  function handleBackdropTouchMove() {
    closePanel();
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    intentionalAbortRef.current = false;
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-MAX_HISTORY_MESSAGES),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout); // timeout only guards time-to-response, not typing

      if (res.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      if (!res.ok || !res.body) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = "";
      let shown = 0;
      let streamDone = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const typed = new Promise<void>((resolve) => {
        const tick = () => {
          if (controller.signal.aborted) return resolve();
          if (shown < received.length) {
            const backlog = received.length - shown;
            shown = Math.min(
              received.length,
              shown + Math.max(1, Math.ceil(backlog / 30)),
            );
            const content = received.slice(0, shown);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content };
              return updated;
            });
          } else if (streamDone) {
            return resolve();
          }
          setTimeout(tick, 16);
        };
        tick();
      });

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += decoder.decode(value, { stream: true });
        }
      } finally {
        streamDone = true;
      }
      await typed;

      if (!received.trim()) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Hmm, I didn't get a response. Try asking again?",
          };
          return updated;
        });
      }
    } catch (err) {
      if (intentionalAbortRef.current) {
        intentionalAbortRef.current = false;
        return;
      }

      const aborted = err instanceof DOMException && err.name === "AbortError";
      const rateLimited =
        err instanceof Error && err.message === "RATE_LIMITED";
      const fallback = rateLimited
        ? "Too many messages right now. Give it a moment and try again."
        : aborted
          ? "That took too long to respond. Please try again."
          : "ERROR: Working on it. 🧑🏽‍💻.";

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fallback,
          };
          return updated;
        }
        return [...prev, { role: "assistant", content: fallback }];
      });
      setErrorMsg(fallback);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.length <= MAX_INPUT_LEN) {
      setInput(val);
      if (errorMsg) setErrorMsg(null);
    }
  }

  const remaining = MAX_INPUT_LEN - input.length;
  const showCounter = remaining <= 200;

  return (
    <>
      {/* Launcher */}
      <motion.button
        ref={launcherRef}
        style={{ x, y }}
        onClick={handleLauncherClick}
        aria-label={open ? "Close chat" : "Ask about Vishal"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 w-10 h-10 rounded-full
      bg-white/10 backdrop-blur-xl backdrop-saturate-150
        border border-white/10
      text-white font-display
        flex items-center justify-center"
      >
        {open ? (
          <span className="text-xl leading-none drop-shadow-sm">✕</span>
        ) : (
          <span className="text-xs tracking-tight drop-shadow-sm">ASK</span>
        )}
      </motion.button>

      {open && (
        <>
          {/* Backdrop scrolling/swiping  */}
          <div
            className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
            onClick={closePanel}
            onWheel={handleBackdropWheel}
            onTouchMove={handleBackdropTouchMove}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ask about Vishal"
            className={`
              fixed z-50 flex flex-col overflow-hidden
              bg-white/10 backdrop-blur-2xl backdrop-saturate-150
              border border-white/20
              shadow-[0_8px_40px_rgba(0,0,0,0.45)]
              inset-x-4 bottom-20 rounded-2xl
              transition-[height] duration-300 ease-in-out
              ${expanded ? "h-[70dvh] max-h-135" : "h-[46vh] max-h-100"}
              sm:inset-x-auto sm:left-auto sm:right-4 sm:w-90
              md:bottom-24 md:right-6 md:w-95 md:h-130 md:max-h-none
            `}
          >
            {/* Header */}
            <div
              className="shrink-0 px-5 py-4 flex items-center justify-between gap-3
                border-b border-white/15 bg-white/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/30">
                  <Image
                    src="/img/pfp.gif"
                    alt=""
                    fill
                    data-cursor="Random ass Gif"
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div
                  className="min-w-0"
                  data-cursor="Ask Anything i mean anything "
                >
                  <p className="font-display text-bone text-sm leading-none mb- truncate">
                    Ask about Vishal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  aria-label={expanded ? "Shrink chat" : "Expand chat"}
                  className="md:hidden text-bone-dim hover:text-bone w-9 h-9 shrink-0
                    flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10
                    border border-white/10 transition-colors"
                >
                  {expanded ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 3v4a2 2 0 0 1-2 2H3" />
                      <path d="M21 8h-4a2 2 0 0 1-2-2V2" />
                      <path d="M3 16h4a2 2 0 0 1 2 2v4" />
                      <path d="M16 21v-4a2 2 0 0 1 2-2h4" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={closePanel}
                  aria-label="Close chat"
                  className="text-bone-dim hover:text-bone text-lg leading-none w-9 h-9 shrink-0
                    flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10
                    border border-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="max-w-[85%] text-sm leading-relaxed rounded-2xl rounded-bl-sm px-4 py-3 bg-white/10 border border-white/10 text-bone-dim">
                    Ask me anything about Vishal his projects, stack, or
                    experience.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "What's HTTPilot?",
                      "What's his stack?",
                      "Is he open to work?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-xs text-amber border border-amber/30 bg-white/5 backdrop-blur-sm
                          rounded-full px-3 py-1.5 hover:bg-amber/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isEmptyAssistant =
                  m.role === "assistant" &&
                  m.content === "" &&
                  loading &&
                  isLast;
                return (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] min-w-0 text-sm leading-relaxed rounded-2xl px-4 py-2.5
                        wrap-break-word whitespace-pre-wrap
                        border backdrop-blur-md ${
                          m.role === "user"
                            ? "bg-amber/90 text-ink border-amber/40 rounded-br-sm"
                            : "bg-white/10 text-bone-dim border-white/10 rounded-bl-sm"
                        }`}
                    >
                      {isEmptyAssistant ? (
                        <span
                          className="inline-flex gap-1 items-center py-0.5"
                          aria-label="Typing"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-bone-dim/70 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-bone-dim/70 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-bone-dim/70 animate-bounce" />
                        </span>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div
                role="alert"
                className="shrink-0 mx-4 mb-2 text-xs text-red-200 bg-red-500/15 border border-red-400/30 backdrop-blur-md rounded-xl px-3 py-2"
              >
                {errorMsg}
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 border-t border-white/15 bg-white/5 p-3">
              {showCounter && (
                <p className="text-[10px] text-bone-dim/70 px-2 pb-1 text-right">
                  {remaining} characters left
                </p>
              )}
              <div className="flex items-end gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message"
                  maxLength={MAX_INPUT_LEN}
                  disabled={loading}
                  aria-label="Message"
                  className="flex-1 min-w-0 bg-white/10 border border-white/15 backdrop-blur-md
                    rounded-full text-bone text-sm px-4 py-3 outline-none
                    placeholder:text-bone-dim/50 focus:ring-1 focus:ring-amber/40
                    disabled:opacity-60"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="w-11 h-11 shrink-0 rounded-full bg-amber/90 border border-amber/40
                        backdrop-blur-md text-ink font-bold flex items-center justify-center
                        disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
