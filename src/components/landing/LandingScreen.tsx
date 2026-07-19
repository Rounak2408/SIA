"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { resumeAudioContext } from "@/lib/procedural-audio";

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoaded(true), 2200);
    const contentTimer = setTimeout(() => setShowContent(true), 2800);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleStart = async () => {
    await resumeAudioContext();
    onStart();
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_55%)]" />

      {!loaded && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-8"
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative h-24 w-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border border-amber-400/20" />
            <div className="absolute inset-2 rounded-full border-t-2 border-amber-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]" />
          </motion.div>
          <motion.p
            className="text-xs tracking-[0.5em] text-white/40 uppercase"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-white/5 shadow-[0_0_60px_rgba(255,215,0,0.2)] backdrop-blur-xl"
          >
            <span className="bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-2xl font-light tracking-[0.3em] text-transparent">
              S
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-4 font-serif text-6xl font-light tracking-wide text-white md:text-8xl"
          >
            Welcome.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16 max-w-md text-sm tracking-[0.15em] text-white/50 md:text-base"
          >
            Complete this short experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <PremiumButton onClick={handleStart} size="lg">
              Start
            </PremiumButton>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
