export type Project = {
  reel: string;
  title: string;
  role: string;
  year: string;
  synopsis: string;
  stack: string[];
  detail: string;
  link?: string;
  tone: "amber" | "teal";
  image: string;
};

export const projects: Project[] = [
  {
    reel: "01",
    title: "HTTPilot",
    role: "Full-stack · API tooling",
    year: "2025",
    synopsis:
      "A Postman-style API testing tool built for developers who live in their terminal.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Firebase Auth"],
    detail:
      "Request builder, collections, and auth flows shipped end-to-end - frontend on Vercel, API on Render, data on Neon. Survived a full Prisma v7 migration and a Firebase Admin v14 rewrite without downtime.",
    link: "https://httppilot.vercel.app",
    tone: "amber",
    image: "/img/httppilot.png",
  },
  {
    reel: "02",
    title: "Frameloops",
    role: "Full-stack · Social PWA",
    year: "2025",
    synopsis:
      "An Instagram-style photo-sharing PWA - feed, follow graph, and image pipeline from scratch.",
    stack: ["Next.js", "NestJS", "Cloudinary", "PostgreSQL", "PWA"],
    detail:
      "Multi-step upload with pinch-to-zoom cropping, a follow/unfollow graph, and an installable PWA kept alive on a free-tier host with scheduled pinging.",
    link: "https://frameloops.vercel.app",
    tone: "teal",
    image: "/img/frameloops.png",
  },
  {
    reel: "03",
    title: "CineVoxa",
    role: "Frontend · Discovery platform",
    year: "2024",
    synopsis:
      "A movie discovery platform built around fast search and clean, image-forward browsing.",
    stack: ["Next.js", "TypeScript", "REST API"],
    detail:
      "Search-first UX for exploring films by mood, genre, and cast - built to feel closer to a streaming service than a database query.",
    link: "https://cinevoxa.vercel.app",
    tone: "amber",
    image: "/img/cinevoxa.png",
  },
  {
    reel: "04",
    title: "LinguaFlow",
    role: "Android · Translation app",
    year: "2024",
    synopsis: "A native Android app for fast, offline-friendly translation.",
    stack: ["Android", "Kotlin", "Translation API"],
    detail:
      "Built to translate on the fly with minimal friction - a smaller-scope build that shipped clean and stayed shipped.",
    link: "https://github.com/vishalraj55/linguaflow",
    tone: "teal",
    image: "/img/linguaflow.png",
  },
];

export const incidents = [
  {
    label: "Incident 001",
    title: "Atlas IP whitelist expiry",
    detail:
      "A production 500 traced back to an expired MongoDB Atlas IP whitelist entry - fixed and documented so it couldn't happen twice.",
  },
  {
    label: "Incident 002",
    title: "Auth-guard header drop",
    detail:
      "A multi-layer auth-guard and proxy setup was silently dropping the Authorization header. Traced through three layers to the fix.",
  },
  {
    label: "Incident 003",
    title: "Node memory leak",
    detail:
      "A slow memory leak in a long-running Node process, isolated and resolved through process configuration, not just a restart cron.",
  },
];

export const skills = {
  core: ["Next.js", "React", "TypeScript", "NestJS", "Node.js","Python","JavaScript"],
  data: ["PostgreSQL", "Prisma", "Neon", "MongoDB"],
  infra: ["Vercel", "Render", "Firebase Auth", "Cloudinary","GitHub"],
  craft: ["GSAP", "Framer Motion", "Tailwind CSS", "Figma-to-code"],
};
