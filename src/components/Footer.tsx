"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <footer className="bg-black text-white/40 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease }}
        className="gutter py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-wider"
      >
        <span>© {new Date().getFullYear()} Vishal Rajbhar - end of reel</span>
        <a
          href="https://github.com/vishalraj55"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          Built by vishalraj55
        </a>
      </motion.div>
    </footer>
  );
}
