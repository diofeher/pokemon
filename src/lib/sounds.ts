/**
 * Pokedex-themed sound effects using Web Audio API.
 * No external audio files needed — all synthesized.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  volume: number = 0.15
) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — silently ignore
  }
}

/**
 * Correct answer — ascending two-note chime (classic Pokedex "ding-ding!")
 */
export function playCorrect() {
  playTone(523.25, 0.12, "square", 0.12); // C5
  setTimeout(() => playTone(783.99, 0.2, "square", 0.12), 100); // G5
}

/**
 * Wrong answer — descending buzz
 */
export function playWrong() {
  playTone(233.08, 0.25, "sawtooth", 0.08); // Bb3
  setTimeout(() => playTone(174.61, 0.3, "sawtooth", 0.08), 150); // F3
}

/**
 * Mode select / button press — short click beep
 */
export function playSelect() {
  playTone(1046.5, 0.06, "square", 0.08); // C6
}

/**
 * Quiz complete — triumphant 4-note arpeggio
 */
export function playComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, "square", 0.1), i * 100);
  });
}
