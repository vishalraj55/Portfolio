import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

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
  title: "Vishal Rajbhar",
  description:
    "Vishal Rajbhar is a full-stack developer building fast, focused software - Next.js, NestJS, PostgreSQL. Shipped: HTTPilot, Frameloop, CineVoxa, LinguaFlow.",
  metadataBase: new URL("https://vishalrajbhar.vercel.app"),
  icons: {
    icon: "/img/logo.png",
  },
  openGraph: {
    title: "Vishal Rajbhar",
    description:
      "Full-stack developer building fast, focused software. Four shipped products, one reel.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jbMono.variable} h-full antialiased bg-ink text-bone selection:bg-amber selection:text-ink overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}