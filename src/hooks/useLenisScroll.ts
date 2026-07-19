"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [enabled]);
}

export function shakeScreen(intensity = 1, duration = 0.5) {
  const root = document.documentElement;
  gsap.fromTo(
    root,
    { x: 0, y: 0 },
    {
      x: () => (Math.random() - 0.5) * 20 * intensity,
      y: () => (Math.random() - 0.5) * 20 * intensity,
      duration: 0.05,
      repeat: Math.floor(duration / 0.05),
      yoyo: true,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(root, { x: 0, y: 0 });
      },
    }
  );
}
