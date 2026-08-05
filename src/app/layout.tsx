import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google"; //Fraunces ${fraunces.variable}
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

// const fraunces = Fraunces({
//   variable: "--font-display",
//   subsets: ["latin"],
//   axes: ["opsz", "SOFT", "WONK"],
//   weight: "variable",
//   style: ["normal", "italic"],
//   display: "swap",
// });

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishal rajbhar | Full Stack Developer",
  description:
    "Vishal rajbhar is a full-stack developer building fast, focused software - Next.js, NestJS, PostgreSQL. Shipped: HTTPilot, Frameloop, CineVoxa, LinguaFlow.",
  metadataBase: new URL("https://vishalrajbhar.vercel.app"),
  icons: {
    icon: "/img/logo.png",
  },
  openGraph: {
    title: "Vishal rajbhar | Full Stack Developer",
    description:
      "Full-stack developer building fast, focused software. Four shipped products, one reel.",
    url: "https://vishalrajbhar.vercel.app",
    siteName: "Vishal rajbhar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishal rajbhar | Full Stack Developer",
  },
  alternates: { canonical: "https://vishalrajbhar.vercel.app" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vishal rajbhar",
  url: "https://vishalrajbhar.vercel.app",
  sameAs: [
    "https://github.com/vishalraj55",
    "https://linkedin.com/in/vishalraj55",
  ],
  jobTitle: "Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="kZxK-cJzGzsn57WfFTTFeAi8wk7XKjcZWyqG7dNyEz8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${anton.variable} ${inter.variable} ${jbMono.variable} h-full antialiased bg-ink text-bone selection:bg-amber selection:text-ink overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
