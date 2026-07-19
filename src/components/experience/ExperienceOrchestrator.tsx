"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LandingScreen } from "@/components/landing/LandingScreen";
import { QuizSection } from "@/components/quiz/QuizSection";
import { GlitchSequence } from "@/components/glitch/GlitchSequence";
import { Countdown } from "@/components/countdown/Countdown";
import { PhotoReveal } from "@/components/photo/PhotoReveal";
import { TypingMessage } from "@/components/typing/TypingMessage";
import { EndingScreen } from "@/components/ending/EndingScreen";
import { FireworksOverlay } from "@/components/effects/FireworksOverlay";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { MuteButton } from "@/components/ui/MuteButton";
import { useExperience } from "@/context/ExperienceContext";
import { useMusicManager } from "@/hooks/useMusicManager";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { PHASE_MUSIC } from "@/lib/constants";
import { playHeartbeat } from "@/lib/procedural-audio";

const SpaceScene = dynamic(
  () =>
    import("@/components/space/SpaceScene").then((m) => ({
      default: m.SpaceScene,
    })),
  {
    ssr: false,
    loading: () => <SceneLoader label="Entering the universe..." />,
  }
);

const NameReveal3D = dynamic(
  () =>
    import("@/components/name/NameReveal3D").then((m) => ({
      default: m.NameReveal3D,
    })),
  {
    ssr: false,
    loading: () => <SceneLoader label="Gathering stardust..." />,
  }
);

function SceneLoader({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <motion.p
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs tracking-[0.4em] text-amber-400/60 uppercase"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function ExperienceOrchestrator() {
  const {
    phase,
    quizStep,
    isMuted,
    mouseDisabled,
    setPhase,
    setMouseDisabled,
    nextQuizStep,
  } = useExperience();

  const { playTrack, fadeOut } = useMusicManager(isMuted);
  const heartbeatStopRef = useRef<(() => void) | null>(null);
  const [showPhotoFireworks, setShowPhotoFireworks] = useState(false);

  useLenisScroll(phase !== "glitch" && phase !== "countdown");

  useEffect(() => {
    const track = PHASE_MUSIC[phase];
    if (track) playTrack(track);
  }, [phase, playTrack]);

  useEffect(() => {
    if (phase === "boot") {
      const timer = setTimeout(() => setPhase("landing"), 100);
      return () => clearTimeout(timer);
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === "countdown" && !isMuted) {
      heartbeatStopRef.current = playHeartbeat(5000);
    }
    return () => {
      heartbeatStopRef.current?.();
    };
  }, [phase, isMuted]);

  useEffect(() => {
    setMouseDisabled(phase === "glitch" || phase === "countdown");
  }, [phase, setMouseDisabled]);

  const handleLandingStart = useCallback(() => {
    setPhase("quiz");
  }, [setPhase]);

  const handleQuizAnswer = useCallback(() => {
    if (quizStep < 2) {
      nextQuizStep();
    } else {
      setPhase("glitch");
    }
  }, [quizStep, nextQuizStep, setPhase]);

  const handleGlitchComplete = useCallback(() => {
    setPhase("countdown");
  }, [setPhase]);

  const handleCountdownComplete = useCallback(() => {
    setPhase("space");
  }, [setPhase]);

  const handleSpaceComplete = useCallback(() => {
    setPhase("name3d");
  }, [setPhase]);

  const handleNameComplete = useCallback(() => {
    setPhase("photo");
  }, [setPhase]);

  const handlePhotoReveal = useCallback(() => {
    setShowPhotoFireworks(true);
    setTimeout(() => setPhase("typing"), 3500);
  }, [setPhase]);

  const handleTypingComplete = useCallback(() => {
    setPhase("ending");
  }, [setPhase]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white cursor-none">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.04),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(75,0,130,0.08),transparent_50%)]" />

      <MuteButton />
      {!mouseDisabled && <CustomCursor />}

      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8 }}
          >
            <LandingScreen onStart={handleLandingStart} />
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <QuizSection step={quizStep} onAnswer={handleQuizAnswer} />
          </motion.div>
        )}

        {phase === "glitch" && (
          <motion.div key="glitch" className="fixed inset-0 z-50">
            <GlitchSequence onComplete={handleGlitchComplete} />
          </motion.div>
        )}

        {phase === "countdown" && (
          <motion.div key="countdown" className="fixed inset-0 z-50">
            <Countdown onComplete={handleCountdownComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === "space" || phase === "name3d") && (
        <div className="fixed inset-0 z-40">
          {phase === "space" && (
            <SpaceScene onComplete={handleSpaceComplete} />
          )}
          {phase === "name3d" && (
            <NameReveal3D onComplete={handleNameComplete} />
          )}
        </div>
      )}

      <AnimatePresence>
        {(phase === "photo" || phase === "typing" || phase === "ending") && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-30"
          >
            {phase === "photo" && (
              <PhotoReveal onRevealComplete={handlePhotoReveal} />
            )}
            {phase === "typing" && (
              <TypingMessage onComplete={handleTypingComplete} />
            )}
            {phase === "ending" && (
              <EndingScreen onFadeMusic={() => fadeOut(4000)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FireworksOverlay
        active={showPhotoFireworks && phase === "photo"}
        variant="photo"
      />
    </div>
  );
}
