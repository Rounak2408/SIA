"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { shakeScreen } from "@/hooks/useLenisScroll";
import { playBassHit } from "@/lib/procedural-audio";

interface CountdownProps {
  onComplete: () => void;
}

const NUMBERS = [3, 2, 1];

export function Countdown({ onComplete }: CountdownProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= NUMBERS.length) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    shakeScreen(2, 0.6);
    playBassHit();

    const timer = setTimeout(() => setIndex((i) => i + 1), 1000);
    return () => clearTimeout(timer);
  }, [index, onComplete]);

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08),transparent_60%)]" />

      <AnimatePresence mode="wait">
        {index < NUMBERS.length && (
          <motion.div
            key={NUMBERS[index]}
            initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.2, 1],
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <span className="font-serif text-[20vw] font-light leading-none text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.4)] md:text-[15rem]">
              {NUMBERS[index]}
            </span>
            <div className="absolute inset-0 blur-3xl bg-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
