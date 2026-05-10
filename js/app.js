/**
 * Application entry point — Karaoke Spin Wheel.
 * Wires together all modules, manages state, and implements hold-to-spin
 * with charge-up sound effects. Integrates the theme system.
 * @module app
 */

import { MIN_SONGS, HOLD_CONFIG } from './constants.js';
import { loadSongs, saveSongs, exportSongsToFile, importSongsFromFile } from './storage.js';
import { drawWheel, spin, isSpinning } from './wheel.js';
import { playWinSound, startChargeSound, updateChargeSound, stopChargeSound, playReleaseSound } from './audio.js';
import { launchConfetti } from './confetti.js';
import { loadTheme, applyTheme } from './themes.js';
import {
    initUI,
    renderSongList,
    showResult,
    hideResult,
    setSpinDisabled,
    flashDuplicateError,
    clearAddInputs,
    setPowerLevel,
    showPowerBar,
    hidePowerBar,
    updateActiveThemeButton,
} from './ui.js';

/* ---------------------------------------------------------------------------
   State
   --------------------------------------------------------------------------- */

/** @type {import('./constants.js').Song[]} */
let songs = loadSongs();

/** @type {import('./constants.js').Song|null} */
let lastChosenSong = null;

/* ---------------------------------------------------------------------------
   Canvas setup
   --------------------------------------------------------------------------- */

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

/* ---------------------------------------------------------------------------
   Song management callbacks
   --------------------------------------------------------------------------- */

function handleAddSong(title, url) {
    if (songs.some((s) => s.title === title)) {
        flashDuplicateError();
        return;
    }
    songs.push({ title, url });
    saveSongs(songs);
    clearAddInputs();
    renderSongList(songs);
    drawWheel(ctx, songs);
}

function handleRemoveSong(index) {
    if (songs.length <= MIN_SONGS) {
        alert(`You need at least ${MIN_SONGS} songs on the wheel!`);
        return;
    }
    songs.splice(index, 1);
    saveSongs(songs);
    renderSongList(songs);
    drawWheel(ctx, songs);
}

function handleRemoveChosen() {
    if (!lastChosenSong) return;
    const index = songs.findIndex((s) => s.title === lastChosenSong.title);
    if (index === -1) return;
    if (songs.length <= MIN_SONGS) {
        alert(`You need at least ${MIN_SONGS} songs on the wheel!`);
        return;
    }
    songs.splice(index, 1);
    saveSongs(songs);
    lastChosenSong = null;
    hideResult();
    renderSongList(songs);
    drawWheel(ctx, songs);
}

/* ---------------------------------------------------------------------------
   Export / Import
   --------------------------------------------------------------------------- */

function handleExport() {
    exportSongsToFile(songs);
}

async function handleImport(file) {
    try {
        const imported = await importSongsFromFile(file);
        songs = imported;
        saveSongs(songs);
        lastChosenSong = null;
        hideResult();
        renderSongList(songs);
        drawWheel(ctx, songs);
    } catch (err) {
        alert(`Import failed: ${err.message}`);
    }
}

/* ---------------------------------------------------------------------------
   Theme switching
   --------------------------------------------------------------------------- */

function handleThemeChange(themeId) {
    applyTheme(themeId);
    updateActiveThemeButton(themeId);
    // Redraw wheel with new theme colors
    drawWheel(ctx, songs);
}

/* ---------------------------------------------------------------------------
   Hold-to-spin mechanic with charge-up sound
   --------------------------------------------------------------------------- */

let holdStartTime = null;
let holdAnimFrame = null;

/**
 * Calculate spin power (0–1) based on hold duration.
 * @returns {number}
 */
function getHoldPower() {
    if (!holdStartTime) return 0;
    const elapsed = Date.now() - holdStartTime;
    return Math.min(elapsed / HOLD_CONFIG.maxHoldMs, 1);
}

/** Called on mousedown/touchstart on the spin button. */
function startHold() {
    if (isSpinning() || songs.length === 0) return;

    holdStartTime = Date.now();
    showPowerBar();
    startChargeSound();

    function updatePower() {
        if (!holdStartTime) return;
        const power = getHoldPower();
        setPowerLevel(power);
        updateChargeSound(power);
        holdAnimFrame = requestAnimationFrame(updatePower);
    }
    holdAnimFrame = requestAnimationFrame(updatePower);
}

/** Called on mouseup/touchend — release triggers the spin. */
async function endHold() {
    if (!holdStartTime) return;

    const power = getHoldPower();
    holdStartTime = null;

    if (holdAnimFrame) {
        cancelAnimationFrame(holdAnimFrame);
        holdAnimFrame = null;
    }

    // Play the release whoosh sound (also stops charge sound)
    playReleaseSound(power);
    hidePowerBar();

    // Now spin with the accumulated power
    if (isSpinning() || songs.length === 0) return;

    setSpinDisabled(true);
    hideResult();
    lastChosenSong = null;

    try {
        const winner = await spin(ctx, songs, power);
        lastChosenSong = winner;
        showResult(winner);
        playWinSound();
        launchConfetti();
    } catch (err) {
        console.error('[app] Spin failed:', err);
    } finally {
        setSpinDisabled(false);
    }
}

/** Cancel hold if mouse leaves the button area. */
function cancelHold() {
    if (!holdStartTime) return;
    holdStartTime = null;
    if (holdAnimFrame) {
        cancelAnimationFrame(holdAnimFrame);
        holdAnimFrame = null;
    }
    stopChargeSound();
    hidePowerBar();
}

/* ---------------------------------------------------------------------------
   Responsive canvas
   --------------------------------------------------------------------------- */

function resizeCanvas() {
    const wrapper = document.querySelector('.wheel-wrapper');
    const size = wrapper.clientWidth;
    canvas.width = size;
    canvas.height = size;
    drawWheel(ctx, songs);
}

/* ---------------------------------------------------------------------------
   Bootstrap
   --------------------------------------------------------------------------- */

function init() {
    // Load and apply saved theme (or default) before rendering
    loadTheme();

    initUI({
        onAdd: handleAddSong,
        onRemove: handleRemoveSong,
        onRemoveChosen: handleRemoveChosen,
        onExport: handleExport,
        onImport: handleImport,
        onThemeChange: handleThemeChange,
    });

    // Hold-to-spin: attach to the spin button
    const spinBtn = document.getElementById('spinBtn');

    // Mouse events
    spinBtn.addEventListener('mousedown', (e) => {
        if (e.button === 0) startHold();
    });
    spinBtn.addEventListener('mouseup', endHold);
    spinBtn.addEventListener('mouseleave', cancelHold);

    // Touch events (mobile / Steam Deck touchscreen)
    spinBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startHold();
    });
    spinBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        endHold();
    });
    spinBtn.addEventListener('touchcancel', cancelHold);

    // Search re-render
    document.addEventListener('search-changed', () => {
        renderSongList(songs);
    });

    // Responsive
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Initial render
    renderSongList(songs);
    drawWheel(ctx, songs);
}

init();
