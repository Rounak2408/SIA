"use client";

import { motion } from "framer-motion";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  launchFireworks,
  launchHeartRain,
} from "@/components/effects/FireworksOverlay";

interface EndingScreenProps {
  onFadeMusic: () => void;
}

export function EndingScreen({ onFadeMusic }: EndingScreenProps) {
  const handleClick = () => {
    launchFireworks("epic");
    launchHeartRain();
    onFadeMusic();
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-0.5 w-0.5 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 font-serif text-2xl text-white/60 md:text-3xl"
        >
          This moment is yours.
        </motion.p>

        <PremiumButton onClick={handleClick} size="lg">
          Keep Smiling 😊
        </PremiumButton>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.06),transparent_60%)]" />
    </section>
  );
}
