/**
 * Application constants and configuration.
 *
 * Songs are stored as objects: { title: string, url: string }
 * where `url` is an optional YouTube link (empty string if none).
 *
 * Color palettes for the wheel and confetti are managed by the theme system
 * in js/themes.js — not stored here.
 *
 * @module constants
 */

/** localStorage key for persisting the song list. */
export const STORAGE_KEY = 'songWheelSongs';

/** Minimum number of songs required on the wheel. */
export const MIN_SONGS = 2;

/**
 * @typedef {object} Song
 * @property {string} title - Display name of the song.
 * @property {string} url   - YouTube URL (or empty string if none).
 */

/** Default song list loaded on first visit. @type {readonly Song[]} */
export const DEFAULT_SONGS = Object.freeze([
    { title: 'Bohemian Rhapsody - Queen',              url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' },
    { title: 'Hotel California - Eagles',              url: 'https://www.youtube.com/watch?v=BciS5krYL80' },
    { title: 'Stairway to Heaven - Led Zeppelin',      url: 'https://www.youtube.com/watch?v=QkF3oxziUI4' },
    { title: 'Imagine - John Lennon',                  url: 'https://www.youtube.com/watch?v=YkgkThdzX-8' },
    { title: 'Smells Like Teen Spirit - Nirvana',      url: 'https://www.youtube.com/watch?v=hTWKbfoikeg' },
    { title: 'Billie Jean - Michael Jackson',          url: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y' },
    { title: "Sweet Child O' Mine - Guns N' Roses",    url: 'https://www.youtube.com/watch?v=1w7OgIMMRc4' },
    { title: 'Like a Rolling Stone - Bob Dylan',       url: 'https://www.youtube.com/watch?v=IwOfCgkyEj0' },
    { title: 'Hey Jude - The Beatles',                 url: 'https://www.youtube.com/watch?v=A_MjCqQoLLA' },
    { title: 'Superstition - Stevie Wonder',           url: 'https://www.youtube.com/watch?v=0CFuCYNx-1g' },
    { title: 'Purple Rain - Prince',                   url: 'https://www.youtube.com/watch?v=TvnYmWpD_T8' },
    { title: 'Wonderwall - Oasis',                     url: 'https://www.youtube.com/watch?v=bx1Bh8ZvH84' },
]);

/** Spin animation configuration. */
export const SPIN_CONFIG = Object.freeze({
    /** Minimum full rotations during a spin (quick tap). */
    minRotations: 5,
    /** Maximum full rotations during a spin (max hold). */
    maxRotations: 15,
    /** Minimum spin duration in ms (quick tap). */
    minDurationMs: 4000,
    /** Maximum spin duration in ms (max hold). */
    maxDurationMs: 12000,
});

/**
 * Hold-to-spin configuration.
 * Holding the spin button charges the spin power.
 */
export const HOLD_CONFIG = Object.freeze({
    /** Maximum hold time in ms — holding longer has no extra effect. */
    maxHoldMs: 3000,
    /** Minimum hold time to register (prevents accidental micro-taps from being too weak). */
    minHoldMs: 0,
});

/** Number of confetti pieces to launch on a win. */
export const CONFETTI_COUNT = 60;

/** Filename used when exporting the song list. */
export const EXPORT_FILENAME = 'karaoke-songs.json';
