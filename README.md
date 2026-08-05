# Vishal Rajbhar - Portfolio

🔗 **Live:** [vishal.vercel.app](https://vishalrajbhar.vercel.app)

Cinematic dark portfolio for **Vishal Rajbhar**, a full-stack developer. Built with Next.js 16 (App Router), TypeScript, Tailwind v4, GSAP/ScrollTrigger, Lenis, and Framer Motion.

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP ScrollTrigger" />
  <img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-E5824A?style=flat-square" alt="Lenis" />
  <img src="https://img.shields.io/badge/Framer_Motion-Animation-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Concept

Treated as a director's reel: sections are numbered like film chapters - _Open / Reel / Cut / Kit / Roll Credits_. The signature element is a live **timecode scrubber** (`src/components/Timecode.tsx`) synced to scroll progress via GSAP ScrollTrigger. The projects section (`src/components/Work.tsx`) plays as a pinned, horizontally-scrolling filmstrip on desktop, collapsing to a simple vertical stack on mobile. Color grading follows classic film orange/teal: amber highlights, teal shadows, on near-black graphite.

---

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

---

## Structure

| Path                  | Purpose                                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`  | Fonts (Fraunces / Inter / JetBrains Mono), metadata, JSON-LD                                                                                                                  |
| `src/app/sitemap.ts`  | Sitemap for search engines                                                                                                                                                    |
| `src/app/robots.ts`   | Crawler rules                                                                                                                                                                 |
| `src/app/globals.css` | Design tokens (`@theme`), fluid type scale via `clamp()`, grain/vignette utilities                                                                                            |
| `src/components/`     | Preloader, SmoothScroll (Lenis + GSAP ticker), Timecode (scroll scrubber), Nav, Hero, Work (pinned filmstrip), About (staggered panel reveal), Skills, Contact, Footer, Grain |
| `src/lib/data.ts`     | Content: shipped projects, real debugging incidents, skill groups                                                                                                             |

---

## Shipped projects featured

- **HTTPilot** - browser-based API testing tool (Next.js, NestJS, Prisma, PostgreSQL, Firebase Auth)
- **Frameloop** - Instagram-style social photo-sharing PWA (Next.js, NestJS, Prisma, Firebase Auth, Cloudinary)
- **CineVoxa** - movie discovery app (Watchmode API)
- **LinguaFlow** - Android translation app

---

## Notes

- Respects `prefers-reduced-motion` throughout - Lenis, preloader, and reveal animations all short-circuit.
- Desktop-only pin/horizontal-scroll behavior is scoped with `gsap.matchMedia` (`min-width: 1024px`); mobile gets a simplified vertical stack - same content, lighter motion.
- No horizontal overflow at any width 320–1920px; fluid spacing via `clamp()`-based utility classes (`.gutter`, `.section-pad`).
- Update `src/lib/data.ts` / `src/components/Contact.tsx` with your real contact details before shipping.

---

## Connect

- Portfolio: [vishalrajbhar.vercel.app](https://vishalrajbhar.vercel.app)
- GitHub: [@vishalraj55](https://github.com/vishalraj55)
