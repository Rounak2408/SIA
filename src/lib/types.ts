export type ExperiencePhase =
  | "boot"
  | "landing"
  | "quiz"
  | "glitch"
  | "countdown"
  | "space"
  | "name3d"
  | "photo"
  | "typing"
  | "ending";

export type MusicTrack =
  | "landing"
  | "quiz"
  | "glitch"
  | "heartbeat"
  | "universe"
  | "photo"
  | "ending";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface ExperienceContextValue {
  phase: ExperiencePhase;
  quizStep: number;
  isMuted: boolean;
  mouseDisabled: boolean;
  setPhase: (phase: ExperiencePhase) => void;
  setQuizStep: (step: number) => void;
  setMuted: (muted: boolean) => void;
  setMouseDisabled: (disabled: boolean) => void;
  nextQuizStep: () => void;
}
