"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";

export function CustomCursor() {
  const { mouseDisabled } = useExperience();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    []
  );

  useEffect(() => {
    if (mouseDisabled) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setTrail((prev) => [
        { x: e.clientX, y: e.clientY, id: Date.now() },
        ...prev.slice(0, 8),
      ]);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, mouseDisabled]);

  if (mouseDisabled) return null;

  return (
    <>
      {trail.map((point, i) => (
        <motion.div
          key={point.id + i}
          className="pointer-events-none fixed z-[9998] rounded-full bg-amber-400/30"
          style={{
            left: point.x,
            top: point.y,
            width: 6 - i * 0.5,
            height: 6 - i * 0.5,
            opacity: 0.4 - i * 0.04,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ))}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border border-amber-300/60 shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
          <div className="absolute inset-2 rounded-full bg-amber-200/20 blur-sm" />
        </div>
      </motion.div>
    </>
  );
}
