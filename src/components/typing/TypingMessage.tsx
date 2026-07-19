"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { TYPING_LINES } from "@/lib/constants";

interface TypingMessageProps {
  onComplete: () => void;
}

export function TypingMessage({ onComplete }: TypingMessageProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed || !elRef.current) return;

    const typed = new Typed(elRef.current, {
      strings: [TYPING_LINES[lineIndex]],
      typeSpeed: 45,
      backSpeed: 0,
      showCursor: true,
      cursorChar: "|",
      onComplete: () => {
        if (lineIndex < TYPING_LINES.length - 1) {
          setTimeout(() => {
            typed.destroy();
            setLineIndex((i) => i + 1);
          }, lineIndex === 0 ? 1800 : 2200);
        } else {
          setTimeout(() => {
            setCompleted(true);
            onComplete();
          }, 2000);
        }
      },
    });

    return () => typed.destroy();
  }, [lineIndex, completed, onComplete]);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-center"
      >
        <div className="mb-6 h-8">
          {lineIndex > 0 &&
            TYPING_LINES.slice(0, lineIndex).map((line) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                className="mb-2 font-serif text-xl text-white/40 md:text-2xl"
              >
                {line}
              </motion.p>
            ))}
        </div>

        <p className="font-serif text-3xl leading-relaxed text-white md:text-5xl md:leading-relaxed">
          <span ref={elRef} />
        </p>
      </motion.div>
    </section>
  );
}
