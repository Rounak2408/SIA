"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GLITCH_TERMINAL_LINES } from "@/lib/constants";
import { shakeScreen } from "@/hooks/useLenisScroll";
import { playStaticBurst } from "@/lib/procedural-audio";

interface GlitchSequenceProps {
  onComplete: () => void;
}

export function GlitchSequence({ onComplete }: GlitchSequenceProps) {
  const [phase, setPhase] = useState<"checking" | "freeze" | "terminal" | "black">(
    "checking"
  );
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.random() * 12 + 3;
      setProgress(Math.min(progressVal, 100));
      if (progressVal >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("freeze"), 400);
      }
    }, 280);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "freeze") return;

    shakeScreen(1.5, 0.8);
    stopStaticRef.current = playStaticBurst(6000);

    const flashInterval = setInterval(() => {
      if (Math.random() > 0.5) shakeScreen(0.8, 0.15);
    }, 200);

    const terminalTimer = setTimeout(() => setPhase("terminal"), 2500);
    return () => {
      clearInterval(flashInterval);
      clearTimeout(terminalTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "terminal") return;

    GLITCH_TERMINAL_LINES.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, index * 700);
    });

    const blackTimer = setTimeout(() => setPhase("black"), 4200);
    return () => clearTimeout(blackTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "black") return;
    stopStaticRef.current?.();
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawNoise = () => {
      if (phase === "black") return;
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = phase === "freeze" ? 40 : 15;
      }
      ctx.putImageData(imageData, 0, 0);
      frame = requestAnimationFrame(drawNoise);
    };

    drawNoise();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "freeze" && phase !== "terminal") return;
    gsap.to(".glitch-rgb", {
      x: () => (Math.random() - 0.5) * 10,
      duration: 0.05,
      repeat: -1,
      yoyo: true,
    });
  }, [phase]);

  return (
    <section
      className={`glitch-rgb relative min-h-screen overflow-hidden bg-black ${
        phase === "freeze" || phase === "terminal" ? "pointer-events-none" : ""
      }`}
    >
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-20 mix-blend-screen ${
          phase === "black" ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        className={`absolute inset-0 z-10 ${
          phase === "freeze" || phase === "terminal"
            ? "animate-[rgb-split_0.1s_infinite]"
            : ""
        }`}
        style={{
          background:
            phase === "freeze"
              ? "linear-gradient(90deg, rgba(255,0,0,0.03) 0%, transparent 33%, rgba(0,255,0,0.03) 66%, rgba(0,0,255,0.03) 100%)"
              : undefined,
        }}
      />

      {phase === "checking" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-30 flex min-h-screen flex-col items-center justify-center px-6"
        >
          <motion.p
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-4 text-sm tracking-[0.4em] text-white/60 uppercase"
          >
            Checking Answers...
          </motion.p>
          <motion.p
            className="mb-10 text-xs tracking-[0.3em] text-amber-400/60 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Loading...
          </motion.p>
          <div className="w-full max-w-md">
            <ProgressBar progress={progress} />
          </div>
        </motion.div>
      )}

      {(phase === "freeze" || phase === "terminal") && (
        <div className="relative z-30 flex min-h-screen items-end justify-start p-8 md:p-12">
          <div className="max-w-xl font-mono text-sm text-green-400/90 md:text-base">
            {terminalLines.map((line, i) => (
              <motion.p
                key={line + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2"
              >
                {">"} {line}
                <span className="animate-pulse">_</span>
              </motion.p>
            ))}
          </div>
        </div>
      )}

      {phase === "freeze" && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute z-20 bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </section>
  );
}
