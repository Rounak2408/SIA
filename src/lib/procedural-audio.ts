import type { MusicTrack } from "./types";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function resumeAudioContext(): Promise<void> {
  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

type StopFn = () => void;

function createMasterGain(volume: number): GainNode {
  const ctx = getContext();
  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);
  return master;
}

function fadeOutGain(gain: GainNode, durationSec = 1.5): void {
  const ctx = getContext();
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + durationSec);
}

export function playHeartbeat(durationMs = 8000): StopFn {
  const ctx = getContext();
  const master = createMasterGain(0.35);
  let stopped = false;

  const beat = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    const thump = (time: number, freq: number, gain: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
      g.gain.setValueAtTime(gain, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      osc.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + 0.3);
    };

    thump(now, 80, 0.8);
    thump(now + 0.15, 60, 0.5);
  };

  beat();
  const intervalId = setInterval(beat, 900);

  const timeoutId = setTimeout(() => {
    stopped = true;
    clearInterval(intervalId);
    fadeOutGain(master, 0.5);
  }, durationMs);

  return () => {
    stopped = true;
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    fadeOutGain(master, 0.3);
  };
}

export function playBassHit(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(90, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);

  filter.type = "lowpass";
  filter.frequency.value = 200;

  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.65);
}

export function playStaticBurst(durationMs = 400): StopFn {
  const ctx = getContext();
  const bufferSize = Math.floor(ctx.sampleRate * (durationMs / 1000));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.15;
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = 0.2;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  return () => {
    try {
      source.stop();
    } catch {
      /* already stopped */
    }
  };
}

function playAmbientPad(frequency = 220, volume = 0.04): StopFn {
  const ctx = getContext();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = "sine";
  osc2.type = "triangle";
  osc1.frequency.value = frequency;
  osc2.frequency.value = frequency * 1.005;

  filter.type = "lowpass";
  filter.frequency.value = 800;

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  return () => {
    fadeOutGain(gain, 1.5);
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, 1600);
  };
}

function playUniverseDrone(): StopFn {
  const ctx = getContext();
  const master = createMasterGain(0.12);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  filter.connect(master);

  const freqs = [55, 82.41, 110, 164.81];
  const oscillators = freqs.map((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.value = i === 0 ? 0.5 : 0.15 / i;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    return osc;
  });

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 20;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3);

  return () => {
    fadeOutGain(master, 2);
    setTimeout(() => {
      oscillators.forEach((osc) => osc.stop());
      lfo.stop();
    }, 2200);
  };
}

function playGlitchLoop(): StopFn {
  const ctx = getContext();
  const master = createMasterGain(0.18);
  let stopped = false;

  const burst = () => {
    if (stopped) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = 0.25;
    source.connect(gain);
    gain.connect(master);
    source.start();
    source.stop(ctx.currentTime + 0.08);
  };

  const rumble = ctx.createOscillator();
  const rumbleGain = ctx.createGain();
  rumble.type = "sawtooth";
  rumble.frequency.value = 45;
  rumbleGain.gain.value = 0.04;
  rumble.connect(rumbleGain);
  rumbleGain.connect(master);
  rumble.start();

  burst();
  const intervalId = setInterval(burst, 180 + Math.random() * 120);

  return () => {
    stopped = true;
    clearInterval(intervalId);
    fadeOutGain(master, 0.4);
    setTimeout(() => rumble.stop(), 450);
  };
}

function playEmotionalPad(): StopFn {
  return playAmbientPad(349.23, 0.045);
}

function playEndingPad(): StopFn {
  const ctx = getContext();
  const stopAmbient = playAmbientPad(261.63, 0.035);
  const master = createMasterGain(0.06);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 392;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
  osc.connect(gain);
  gain.connect(master);
  osc.start();

  return () => {
    stopAmbient();
    fadeOutGain(gain, 2);
    setTimeout(() => osc.stop(), 2200);
  };
}

export function playPhaseTrack(track: MusicTrack): StopFn {
  switch (track) {
    case "landing":
      return playAmbientPad(261.63, 0.05);
    case "quiz":
      return playAmbientPad(293.66, 0.045);
    case "glitch":
      return playGlitchLoop();
    case "heartbeat":
      return playHeartbeat(120000);
    case "universe":
      return playUniverseDrone();
    case "photo":
      return playEmotionalPad();
    case "ending":
      return playEndingPad();
    default:
      return () => {};
  }
}

export function fadeOutAllProcedural(stopFn: StopFn | null): void {
  stopFn?.();
}
