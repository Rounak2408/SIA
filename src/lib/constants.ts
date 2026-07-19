import type { QuizQuestion } from "./types";

/** Full name shown first in 3D reveal */
export const FULL_NAME = "Sangita";

/** Short name after cinematic transform */
export const SHORT_NAME = "Sia";

/** @deprecated Use FULL_NAME / SHORT_NAME */
export const DISPLAY_NAME = SHORT_NAME;

/** Photo shown in the cinematic reveal */
export const PHOTO_SRC = "/images/sia.png";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Agar tum kahin bhi travel kar sakti ho, toh kahan jaogi?",
    options: ["Pahaad ⛰️", "Beach 🏖️", "Space 🚀", "Ghar 🏠"],
  },
  {
    id: 2,
    question: "Tum sabse zyada kaunsi quality admire karti ho?",
    options: ["Kindness 💛", "Honesty ✨", "Confidence 🔥", "Humor 😄"],
  },
  {
    id: 3,
    question: "Kya tum final experience ke liye ready ho?",
    options: ["Haan! 💫", "Shayad... 🤔", "Chalo dekhte hain! ✨"],
  },
];

export const TYPING_LINES = [
  "There are millions of websites...",
  "But only one...",
  "Was made especially for you.",
];

export const GLITCH_TERMINAL_LINES = [
  "ERROR...",
  "rukiye SIA g",
  "Loading...🔄",
  "DECRYPTING...",
];

export const AUDIO_PATHS = {
  landing: "/audio/landing.mp3",
  quiz: "/audio/quiz.mp3",
  glitch: "/audio/glitch.mp3",
  heartbeat: "/audio/heartbeat.mp3",
  universe: "/audio/universe.mp3",
  photo: "/audio/photo.mp3",
  ending: "/audio/ending.mp3",
} as const;

export const PHASE_MUSIC: Partial<
  Record<
    import("./types").ExperiencePhase,
    import("./types").MusicTrack | null
  >
> = {
  boot: "landing",
  landing: "landing",
  quiz: "quiz",
  glitch: "glitch",
  countdown: "heartbeat",
  space: "universe",
  name3d: "universe",
  photo: "photo",
  typing: "photo",
  ending: "ending",
};
