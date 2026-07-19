"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MusicTrack } from "@/lib/types";
import {
  fadeOutAllProcedural,
  playPhaseTrack,
  resumeAudioContext,
} from "@/lib/procedural-audio";

type StopFn = () => void;

export function useMusicManager(isMuted: boolean) {
  const stopRef = useRef<StopFn | null>(null);
  const currentTrackRef = useRef<MusicTrack | null>(null);
  const ready = true;

  const stopAll = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    currentTrackRef.current = null;
  }, []);

  const playTrack = useCallback(
    async (track: MusicTrack) => {
      if (!ready) return;
      await resumeAudioContext();

      if (currentTrackRef.current === track) return;

      stopRef.current?.();
      stopRef.current = null;
      currentTrackRef.current = track;

      if (!isMuted) {
        stopRef.current = playPhaseTrack(track);
      }
    },
    [isMuted, ready]
  );

  const fadeOut = useCallback(() => {
    fadeOutAllProcedural(stopRef.current);
    stopRef.current = null;
    currentTrackRef.current = null;
  }, []);

  useEffect(() => {
    if (isMuted) {
      stopRef.current?.();
      stopRef.current = null;
    } else if (currentTrackRef.current) {
      stopRef.current = playPhaseTrack(currentTrackRef.current);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      stopRef.current?.();
    };
  }, []);

  return { playTrack, stopAll, fadeOut, ready };
}
