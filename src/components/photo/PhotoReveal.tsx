"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PHOTO_SRC } from "@/lib/constants";

interface PhotoRevealProps {
  onRevealComplete: () => void;
}

export function PhotoReveal({ onRevealComplete }: PhotoRevealProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      onRevealComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onRevealComplete]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-amber-300/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotateY: -15, rotateX: 10 }}
        animate={
          revealed
            ? {
                opacity: 1,
                scale: 1,
                rotateY: [-3, 3, -3],
                rotateX: [-2, 2, -2],
              }
            : { opacity: 0, scale: 0.7 }
        }
        transition={{
          opacity: { duration: 1.5 },
          scale: { duration: 2, ease: [0.22, 1, 0.36, 1] },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/10 blur-2xl" />

        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-white/5 p-3 shadow-[0_0_80px_rgba(255,215,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-amber-400/5" />

          <div className="relative aspect-[3/4] w-[min(80vw,380px)] overflow-hidden rounded-2xl">
            <Image
              src={PHOTO_SRC}
              alt="Special moment"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 80vw, 380px"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
          </div>

          <motion.div
            className="pointer-events-none absolute -top-10 right-8 h-24 w-24 rounded-full bg-white/30 blur-2xl"
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute top-1/3 -left-6 h-16 w-32 rotate-[-25deg] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent blur-md"
            animate={{ opacity: [0.1, 0.5, 0.1], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
