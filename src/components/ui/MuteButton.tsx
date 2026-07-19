"use client";

import { motion } from "framer-motion";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useExperience } from "@/context/ExperienceContext";

export function MuteButton() {
  const { isMuted, setMuted } = useExperience();

  return (
    <motion.button
      type="button"
      aria-label={isMuted ? "Unmute" : "Mute"}
      onClick={() => setMuted(!isMuted)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 right-6 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-amber-300/80 backdrop-blur-xl transition-colors hover:border-amber-400/30 hover:text-amber-200"
    >
      {isMuted ? <HiSpeakerXMark size={18} /> : <HiSpeakerWave size={18} />}
    </motion.button>
  );
}
