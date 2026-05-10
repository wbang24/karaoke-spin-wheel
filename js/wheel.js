/**
 * Canvas-based spinning wheel renderer and animation controller.
 * Supports variable spin power (0–1) for the hold-to-spin mechanic.
 * Uses theme-aware colors from the active theme.
 * Flat design — no glows or shadows on canvas elements.
 * @module wheel
 */

import { SPIN_CONFIG } from './constants.js';
import { getActiveTheme } from './themes.js';
import { playTick } from './audio.js';

/** Current rotation angle in radians. */
let currentAngle = 0;

/** Whether a spin animation is currently in progress. */
let spinning = false;

/**
 * Draw the wheel on the given canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./constants.js').Song[]} songs
 */
export function drawWheel(ctx, songs) {
    const theme = getActiveTheme();
    const colors = theme.wheelColors;

    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 5;
    const numSegments = songs.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // Thin outer border ring (flat, no glow)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = theme.vars['--border-subtle'] || 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Segments
    for (let i = 0; i < numSegments; i++) {
        const startAngle = currentAngle + i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Thin divider line between segments
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);

        const fontSize = calculateFontSize(numSegments);
        ctx.font = `600 ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
        ctx.fillStyle = theme.vars['--wheel-label'] || '#1a1a2e';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const label = truncateText(ctx, songs[i].title, radius - 40);
        ctx.fillText(label, radius - 15, 0);
        ctx.restore();
    }

    // Center hub — simple flat circle
    const hubColor = theme.vars['--wheel-hub'] || '#1e1e3a';
    const hubBorder = theme.vars['--wheel-hub-border'] || 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = hubColor;
    ctx.fill();
    ctx.strokeStyle = hubBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Spin the wheel and resolve with the winning song object.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./constants.js').Song[]} songs
 * @param {number} [power=0.5] - Spin power from 0 (minimum) to 1 (maximum).
 *   Controls how many rotations and how long the spin lasts.
 * @returns {Promise<import('./constants.js').Song>}
 */
export function spin(ctx, songs, power = 0.5) {
    if (spinning || songs.length === 0) {
        return Promise.reject(new Error('Cannot spin right now'));
    }

    spinning = true;

    // Clamp power to [0, 1]
    const p = Math.max(0, Math.min(1, power));

    return new Promise((resolve) => {
        const { minRotations, maxRotations, minDurationMs, maxDurationMs } = SPIN_CONFIG;

        // Interpolate rotations and duration based on power
        const rotations = minRotations + (maxRotations - minRotations) * p;
        const spinAmount = rotations * 2 * Math.PI + Math.random() * 2 * Math.PI;

        const duration = minDurationMs + (maxDurationMs - minDurationMs) * p;
        const startTime = performance.now();
        const startAngle = currentAngle;

        let lastTickSegment = -1;

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            currentAngle = startAngle + spinAmount * easedProgress;

            // Tick sound on segment boundary
            const numSegments = songs.length;
            const arcSize = (2 * Math.PI) / numSegments;
            const pointerAngle = normalizePointerAngle(currentAngle);
            const segmentIndex = Math.floor(pointerAngle / arcSize) % numSegments;

            if (segmentIndex !== lastTickSegment) {
                lastTickSegment = segmentIndex;
                playTick();
            }

            drawWheel(ctx, songs);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                const winnerIndex = getWinnerIndex(songs.length);
                resolve(songs[winnerIndex]);
            }
        }

        requestAnimationFrame(animate);
    });
}

/** @returns {boolean} Whether a spin is currently in progress. */
export function isSpinning() {
    return spinning;
}

/* ---------------------------------------------------------------------------
   Internal helpers
   --------------------------------------------------------------------------- */

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function normalizePointerAngle(angle) {
    return ((-Math.PI / 2 - (angle % (2 * Math.PI))) + 4 * Math.PI) % (2 * Math.PI);
}

function getWinnerIndex(numSegments) {
    const arcSize = (2 * Math.PI) / numSegments;
    const pointerAngle = normalizePointerAngle(currentAngle);
    return Math.floor(pointerAngle / arcSize) % numSegments;
}

function calculateFontSize(count) {
    if (count > 20) return 9;
    if (count > 14) return 10;
    if (count > 8) return 11;
    return 13;
}

function truncateText(ctx, text, maxWidth) {
    let truncated = text;
    while (ctx.measureText(truncated).width > maxWidth && truncated.length > 3) {
        truncated = truncated.slice(0, -4) + '...';
    }
    return truncated;
}
