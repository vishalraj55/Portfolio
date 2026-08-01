"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/Grain";
import Nav from "@/components/Nav";

import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <Grain />
      <CustomCursor />
      <Nav />
      <SmoothScroll>
        <main>
          <Hero />
          <Work />
          <About />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
