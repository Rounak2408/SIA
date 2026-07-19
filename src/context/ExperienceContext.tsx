"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExperienceContextValue, ExperiencePhase } from "@/lib/types";

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<ExperiencePhase>("boot");
  const [quizStep, setQuizStep] = useState(0);
  const [isMuted, setMuted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);

  const nextQuizStep = useCallback(() => {
    setQuizStep((prev) => prev + 1);
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      phase,
      quizStep,
      isMuted,
      mouseDisabled,
      setPhase,
      setQuizStep,
      setMuted,
      setMouseDisabled,
      nextQuizStep,
    }),
    [phase, quizStep, isMuted, mouseDisabled, nextQuizStep]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used within ExperienceProvider");
  }
  return ctx;
}
