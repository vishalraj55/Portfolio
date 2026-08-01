# Vishal Rajbhar — Portfolio

Cinematic dark portfolio. Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis + Framer Motion.

## Concept
Treated as a director's reel: sections are numbered like film chapters (Open / Reel / Cut / Kit / Roll Credits), the signature element is a live **timecode scrubber** (`src/components/Timecode.tsx`) synced to scroll progress via GSAP ScrollTrigger, and the projects section (`src/components/Work.tsx`) plays as a pinned, horizontally-scrolling filmstrip on desktop, collapsing to a simple vertical stack on mobile. Color grading follows classic film orange/teal: amber highlights, teal shadows, on near-black graphite.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm start
```

## Structure
- `src/app/layout.tsx` — fonts (Fraunces / Inter / JetBrains Mono), metadata
- `src/app/globals.css` — design tokens (`@theme`), fluid type scale via `clamp()`, grain/vignette utilities
- `src/components/` — Preloader, SmoothScroll (Lenis + GSAP ticker), Timecode (signature scroll scrubber), Nav, Hero, Work (pinned filmstrip), About (staggered panel reveal), Skills, Contact, Footer, Grain
- `src/lib/data.ts` — content: shipped projects, real debugging incidents, skill groups

## Notes
- Respects `prefers-reduced-motion` throughout (Lenis, preloader, and reveal animations all short-circuit).
- Desktop-only pin/horizontal-scroll behavior is scoped with `gsap.matchMedia` (`min-width: 1024px`); mobile gets a simplified vertical stack — same content, lighter motion.
- No horizontal overflow at any width 320–1920px; fluid spacing via `clamp()`-based utility classes (`.gutter`, `.section-pad`).
- Replace the placeholder `hello@vishalraj.dev` and GitHub link in `src/lib/data.ts` / `src/components/Contact.tsx` with your real contact details before shipping.
