/**
 * Audio effects using the Web Audio API.
 * Provides tick sounds, victory fanfare, and hold-to-spin charge/release sounds.
 * @module audio
 */

/** @type {AudioContext|null} Lazily-initialized audio context. */
let audioCtx = null;

/** @type {OscillatorNode|null} Active charge-up oscillator (while holding). */
let chargeOsc = null;

/** @type {GainNode|null} Gain node for the charge-up sound. */
let chargeGain = null;

/**
 * Get or create the shared AudioContext.
 * @returns {AudioContext}
 */
function getContext() {
    if (!audioCtx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioCtor();
    }
    return audioCtx;
}

/**
 * Play a short tick sound (wheel passing a segment).
 */
export function playTick() {
    try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 800 + Math.random() * 400;
        osc.type = 'sine';
        gain.gain.value = 0.05;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch {
        // Audio not supported
    }
}

/**
 * Play a rising arpeggio fanfare when a song is chosen.
 */
export function playWinSound() {
    try {
        const ctx = getContext();
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.1;
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + 0.3 + i * 0.15,
            );

            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + 0.3 + i * 0.15);
        });
    } catch {
        // Audio not supported
    }
}

/**
 * Start the charge-up sound — a rising pitch that increases as power builds.
 * Call `updateChargeSound(power)` to update the pitch, and `stopChargeSound()`
 * or `releaseChargeSound()` to end it.
 */
export function startChargeSound() {
    try {
        const ctx = getContext();

        // Clean up any existing charge sound
        stopChargeSound();

        chargeOsc = ctx.createOscillator();
        chargeGain = ctx.createGain();

        chargeOsc.connect(chargeGain);
        chargeGain.connect(ctx.destination);

        // Start with a low hum
        chargeOsc.type = 'sawtooth';
        chargeOsc.frequency.value = 60;
        chargeGain.gain.value = 0.04;

        chargeOsc.start(ctx.currentTime);
    } catch {
        // Audio not supported
    }
}

/**
 * Update the charge-up sound pitch and volume based on current power level.
 *
 * @param {number} power - 0 to 1 (how charged up the spin is).
 */
export function updateChargeSound(power) {
    if (!chargeOsc || !chargeGain) return;

    try {
        const ctx = getContext();
        // Pitch rises from 80 Hz to 600 Hz
        const freq = 80 + power * 520;
        chargeOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);

        // Volume rises from 0.04 to 0.12
        const vol = 0.005 + power * 0.02;
        chargeGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.05);
    } catch {
        // Ignore
    }
}

/**
 * Stop the charge sound immediately (e.g., on cancel/mouse leave).
 */
export function stopChargeSound() {
    try {
        if (chargeOsc) {
            chargeOsc.stop();
            chargeOsc.disconnect();
            chargeOsc = null;
        }
        if (chargeGain) {
            chargeGain.disconnect();
            chargeGain = null;
        }
    } catch {
        // Already stopped
        chargeOsc = null;
        chargeGain = null;
    }
}

/**
 * Play a satisfying "whoosh" release sound when the spin button is released,
 * and stop the charge-up sound.
 *
 * @param {number} power - 0 to 1 (final power level).
 */
export function playReleaseSound(power) {
    // Stop the charge hum
    stopChargeSound();

    try {
        const ctx = getContext();

        // Whoosh: white noise burst with a bandpass filter
        const bufferSize = ctx.sampleRate * 0.3; // 300ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // fade out
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800 + power * 2000; // higher power = higher whoosh
        filter.Q.value = 0.5;

        const gain = ctx.createGain();
        gain.gain.value = 0.08 + power * 0.12; // louder with more power

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(ctx.currentTime);

        // Also play a descending tone for extra "release" feel
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.value = 400 + power * 400;
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        oscGain.gain.value = 0.06;
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch {
        // Audio not supported
    }
}
