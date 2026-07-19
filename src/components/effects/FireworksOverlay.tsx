"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function launchFireworks(intensity: "normal" | "epic" = "normal") {
  const count = intensity === "epic" ? 200 : 120;
  const defaults = {
    origin: { y: 0.6 },
    zIndex: 9999,
  };

  confetti({
    ...defaults,
    particleCount: count,
    spread: 100,
    startVelocity: 45,
    colors: ["#ffd700", "#ff6b6b", "#ffffff", "#ff1493", "#ffa500"],
  });

  confetti({
    ...defaults,
    particleCount: count * 0.5,
    spread: 160,
    scalar: 1.2,
    shapes: ["circle"],
    colors: ["#ffd700", "#ffffff"],
  });
}

export function launchHeartRain() {
  const duration = 4000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 270,
      spread: 40,
      origin: { x: Math.random(), y: -0.1 },
      colors: ["#ff6b8a", "#ff1493", "#ffd700"],
      shapes: ["circle"],
      scalar: randomInRange(0.8, 1.4),
      zIndex: 9999,
    });

    confetti({
      particleCount: 2,
      angle: 270,
      spread: 30,
      origin: { x: Math.random(), y: -0.1 },
      colors: ["#ffb6c1", "#ffc0cb"],
      ticks: 300,
      gravity: 0.6,
      scalar: randomInRange(1, 1.8),
      zIndex: 9999,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
}

export function launchRosePetals() {
  confetti({
    particleCount: 50,
    spread: 120,
    origin: { y: 0.3 },
    colors: ["#ffb6c1", "#ff69b4", "#ffc0cb", "#ffd700"],
    scalar: 1.5,
    gravity: 0.8,
    drift: 0.5,
    ticks: 400,
    zIndex: 9999,
  });
}

interface FireworksOverlayProps {
  active: boolean;
  variant?: "photo" | "ending";
}

export function FireworksOverlay({
  active,
  variant = "photo",
}: FireworksOverlayProps) {
  const trigger = useCallback(() => {
    if (variant === "photo") {
      launchFireworks("epic");
      setTimeout(() => launchRosePetals(), 400);
      setTimeout(() => launchHeartRain(), 800);
    } else {
      launchFireworks("epic");
      launchHeartRain();
    }
  }, [variant]);

  useEffect(() => {
    if (!active) return;
    trigger();
    if (variant === "photo") {
      const interval = setInterval(() => launchFireworks("normal"), 2000);
      return () => clearInterval(interval);
    }
  }, [active, trigger, variant]);

  return null;
}
