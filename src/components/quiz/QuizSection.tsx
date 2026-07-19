"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QUIZ_QUESTIONS } from "@/lib/constants";

interface QuizSectionProps {
  step: number;
  onAnswer: () => void;
}

export function QuizSection({ step, onAnswer }: QuizSectionProps) {
  const question = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  if (!question) return null;

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <ProgressBar progress={progress} label={`Sawaal ${step + 1}`} />
        </motion.div>

        <AnimatePresence mode="wait">
          <GlassCard key={question.id} className="min-h-[320px]">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-xs tracking-[0.35em] text-amber-400/70 uppercase"
            >
              Sawaal {step + 1}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mb-10 font-serif text-3xl leading-snug text-white md:text-4xl"
            >
              {question.question}
            </motion.h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(255,215,0,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAnswer}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-left text-white/80 transition-all duration-500 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_30px_rgba(255,215,0,0.12)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative text-sm tracking-wide md:text-base">
                    {option}
                  </span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </AnimatePresence>
      </div>
    </section>
  );
}
