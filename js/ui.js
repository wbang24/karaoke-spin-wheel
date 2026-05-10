/**
 * DOM manipulation helpers for the song list panel, search, result display,
 * export/import controls, hold-to-spin power indicator, and theme picker.
 * @module ui
 */

import { MIN_SONGS } from './constants.js';
import { THEMES, getActiveTheme } from './themes.js';

/* ---------------------------------------------------------------------------
   DOM element cache (populated by init)
   --------------------------------------------------------------------------- */

/** @type {Record<string, HTMLElement>} */
const el = {};

/** @type {function(number): void} */
let onRemoveSong = () => {};
/** @type {function(): void} */
let onRemoveChosen = () => {};
/** @type {function(string, string): void} */
let onAddSong = () => {};
/** @type {function(): void} */
let onExport = () => {};
/** @type {function(File): void} */
let onImport = () => {};
/** @type {function(string): void} */
let onThemeChange = () => {};

/**
 * Initialize the UI module.
 *
 * @param {object} callbacks
 * @param {function(string, string): void} callbacks.onAdd
 * @param {function(number): void}         callbacks.onRemove
 * @param {function(): void}               callbacks.onRemoveChosen
 * @param {function(): void}               callbacks.onExport
 * @param {function(File): void}           callbacks.onImport
 * @param {function(string): void}         callbacks.onThemeChange
 */
export function initUI({ onAdd, onRemove, onRemoveChosen: removeChosen, onExport: exportCb, onImport: importCb, onThemeChange: themeCb }) {
    el.songInput = document.getElementById('songInput');
    el.urlInput = document.getElementById('urlInput');
    el.searchInput = document.getElementById('searchInput');
    el.clearSearchBtn = document.getElementById('clearSearchBtn');
    el.songCount = document.getElementById('songCount');
    el.songList = document.getElementById('songList');
    el.result = document.getElementById('result');
    el.removeChosenBtn = document.getElementById('removeChosenBtn');
    el.spinBtn = document.getElementById('spinBtn');
    el.addBtn = document.getElementById('addBtn');
    el.exportBtn = document.getElementById('exportBtn');
    el.importBtn = document.getElementById('importBtn');
    el.importFileInput = document.getElementById('importFileInput');
    el.powerBar = document.getElementById('powerBar');
    el.powerFill = document.getElementById('powerFill');
    el.themePicker = document.getElementById('themePicker');

    onAddSong = onAdd;
    onRemoveSong = onRemove;
    onRemoveChosen = removeChosen;
    onExport = exportCb;
    onImport = importCb;
    onThemeChange = themeCb || (() => {});

    // Event listeners
    el.songInput.addEventListener('keydown', handleAddKeydown);
    el.urlInput.addEventListener('keydown', handleAddKeydown);
    el.addBtn.addEventListener('click', handleAddClick);
    el.searchInput.addEventListener('input', handleSearchInput);
    el.clearSearchBtn.addEventListener('click', handleClearSearch);
    el.removeChosenBtn.addEventListener('click', handleRemoveChosen);
    el.songList.addEventListener('click', handleSongListClick);

    // Export / Import
    el.exportBtn.addEventListener('click', () => onExport());
    el.importBtn.addEventListener('click', () => el.importFileInput.click());
    el.importFileInput.addEventListener('change', handleFileSelect);

    // Build theme picker buttons
    renderThemePicker();
}

/* ---------------------------------------------------------------------------
   Theme picker
   --------------------------------------------------------------------------- */

/** Render theme picker buttons into the header. */
function renderThemePicker() {
    if (!el.themePicker) return;

    const activeId = getActiveTheme().id;

    // Keep the label, replace buttons
    const label = el.themePicker.querySelector('.theme-picker-label');
    el.themePicker.innerHTML = '';
    if (label) el.themePicker.appendChild(label);

    THEMES.forEach((theme) => {
        const btn = document.createElement('button');
        btn.className = `theme-btn${theme.id === activeId ? ' active' : ''}`;
        btn.type = 'button';
        btn.setAttribute('aria-label', theme.label);
        btn.title = theme.label;
        btn.textContent = theme.icon;
        btn.dataset.themeId = theme.id;
        btn.addEventListener('click', () => {
            onThemeChange(theme.id);
            updateActiveThemeButton(theme.id);
        });
        el.themePicker.appendChild(btn);
    });
}

/**
 * Update which theme button shows as active.
 * @param {string} themeId
 */
export function updateActiveThemeButton(themeId) {
    if (!el.themePicker) return;
    el.themePicker.querySelectorAll('.theme-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.themeId === themeId);
    });
}

/* ---------------------------------------------------------------------------
   Public render methods
   --------------------------------------------------------------------------- */

/**
 * Render the song list panel.
 * @param {import('./constants.js').Song[]} songs
 */
export function renderSongList(songs) {
    const query = el.searchInput.value.trim().toLowerCase();

    el.songCount.textContent = `${songs.length} song${songs.length !== 1 ? 's' : ''} on the wheel`;

    const entries = songs.map((song, index) => ({ song, index }));
    const filtered = query
        ? entries.filter((e) => e.song.title.toLowerCase().includes(query))
        : entries;

    if (filtered.length === 0 && query) {
        el.songList.innerHTML = `<div class="no-results">No songs matching "${escapeHtml(query)}"</div>`;
        return;
    }

    el.songList.innerHTML = filtered
        .map(({ song, index }) => {
            let display = escapeHtml(song.title);
            if (query) {
                const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
                display = display.replace(
                    regex,
                    '<mark style="background:var(--mark-bg);color:var(--mark-text);border-radius:2px;padding:0 2px;">$1</mark>',
                );
            }

            const youtubeIcon = song.url
                ? `<a href="${escapeHtml(song.url)}" target="_blank" rel="noopener noreferrer" class="yt-link" title="Open on YouTube">&#9654;</a>`
                : '';

            return `
                <div class="song-item${query ? ' highlight' : ''}" data-index="${index}">
                    <span title="${escapeHtml(song.title)}">${display}</span>
                    ${youtubeIcon}
                    <button class="delete-btn" title="Remove">&times;</button>
                </div>`;
        })
        .join('');
}

/**
 * Show the spin result.
 * @param {import('./constants.js').Song} song
 */
export function showResult(song) {
    const title = escapeHtml(song.title);
    const youtubeLink = song.url
        ? `<a href="${escapeHtml(song.url)}" target="_blank" rel="noopener noreferrer" class="yt-result-link">&#9654; Play on YouTube</a>`
        : '';

    el.result.innerHTML = `<strong>${title}</strong>${youtubeLink}`;
    el.result.classList.add('show');
    el.removeChosenBtn.classList.add('show');
}

/** Hide the result display and remove-chosen button. */
export function hideResult() {
    el.result.classList.remove('show');
    el.removeChosenBtn.classList.remove('show');
}

/**
 * Enable or disable the spin button.
 * @param {boolean} disabled
 */
export function setSpinDisabled(disabled) {
    el.spinBtn.disabled = disabled;
}

/** Flash the add-song input red for duplicates. */
export function flashDuplicateError() {
    el.songInput.style.borderColor = 'var(--danger)';
    setTimeout(() => { el.songInput.style.borderColor = ''; }, 1000);
}

/** Clear the add-song input fields. */
export function clearAddInputs() {
    el.songInput.value = '';
    el.urlInput.value = '';
}

/**
 * Update the power bar fill level.
 * @param {number} fraction - 0 to 1.
 */
export function setPowerLevel(fraction) {
    const pct = Math.max(0, Math.min(1, fraction)) * 100;
    el.powerFill.style.width = `${pct}%`;

    // Color transitions: green → yellow → red using theme vars
    if (pct < 40) {
        el.powerFill.style.background = 'var(--power-low)';
    } else if (pct < 75) {
        el.powerFill.style.background = 'var(--power-mid)';
    } else {
        el.powerFill.style.background = 'var(--power-high)';
    }
}

/** Show the power bar. */
export function showPowerBar() {
    el.powerBar.classList.add('visible');
}

/** Hide the power bar and reset fill. */
export function hidePowerBar() {
    el.powerBar.classList.remove('visible');
    el.powerFill.style.width = '0%';
}

/* ---------------------------------------------------------------------------
   Event handlers (private)
   --------------------------------------------------------------------------- */

/** @param {KeyboardEvent} e */
function handleAddKeydown(e) {
    if (e.key === 'Enter') submitNewSong();
}

function handleAddClick() {
    submitNewSong();
}

function submitNewSong() {
    const title = el.songInput.value.trim();
    const url = el.urlInput.value.trim();
    if (title) onAddSong(title, url);
}

function handleSearchInput() {
    const hasQuery = el.searchInput.value.trim().length > 0;
    el.clearSearchBtn.classList.toggle('visible', hasQuery);
    el.searchInput.dispatchEvent(new CustomEvent('search-changed', { bubbles: true }));
}

function handleClearSearch() {
    el.searchInput.value = '';
    el.clearSearchBtn.classList.remove('visible');
    el.searchInput.dispatchEvent(new CustomEvent('search-changed', { bubbles: true }));
}

function handleRemoveChosen() {
    onRemoveChosen();
}

/** @param {MouseEvent} e */
function handleSongListClick(e) {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;
    const item = btn.closest('.song-item');
    if (!item) return;
    const index = parseInt(item.dataset.index, 10);
    if (!Number.isNaN(index)) onRemoveSong(index);
}

/** @param {Event} e */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        onImport(file);
        // Reset so the same file can be re-imported
        e.target.value = '';
    }
}

/* ---------------------------------------------------------------------------
   Utility helpers (private)
   --------------------------------------------------------------------------- */

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
