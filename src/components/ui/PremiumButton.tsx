"use client";

import { motion } from "framer-motion";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PremiumButton({
  children,
  onClick,
  className = "",
  size = "md",
}: PremiumButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const sizeClasses = {
    sm: "px-8 py-3 text-sm",
    md: "px-12 py-4 text-base",
    lg: "px-16 py-5 text-lg",
  };

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative overflow-hidden rounded-full font-medium tracking-[0.2em] uppercase text-white ${sizeClasses[size]} ${className}`}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-300/10 to-amber-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-0 rounded-full border border-amber-400/40 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,215,0,0.15)]" />
      <span className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/10 to-transparent" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <span className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 bg-amber-400/30" />
    </motion.button>
  );
}
