/**
 * Persistence layer for song data using localStorage.
 * Also handles JSON export/import for sharing song lists.
 * @module storage
 */

import { STORAGE_KEY, DEFAULT_SONGS, EXPORT_FILENAME } from './constants.js';

/**
 * Load the song list from localStorage.
 * Automatically migrates old string-only entries to { title, url } objects.
 *
 * @returns {import('./constants.js').Song[]}
 */
export function loadSongs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const migrated = parsed.map(migrateSong);
                saveSongs(migrated);
                return migrated;
            }
        }
    } catch (err) {
        console.warn('[storage] Failed to load songs:', err);
    }
    return DEFAULT_SONGS.map((s) => ({ ...s }));
}

/**
 * Persist the current song list to localStorage.
 *
 * @param {import('./constants.js').Song[]} songs
 */
export function saveSongs(songs) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch (err) {
        console.warn('[storage] Failed to save songs:', err);
    }
}

/**
 * Export the song list as a downloadable JSON file.
 *
 * @param {import('./constants.js').Song[]} songs
 */
export function exportSongsToFile(songs) {
    const data = JSON.stringify(songs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = EXPORT_FILENAME;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Import a song list from a JSON file.
 * Returns a Promise that resolves with the parsed song array,
 * or rejects if the file is invalid.
 *
 * @param {File} file - The JSON file selected by the user.
 * @returns {Promise<import('./constants.js').Song[]>}
 */
export function importSongsFromFile(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.name.endsWith('.json')) {
            reject(new Error('Please select a .json file'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);

                if (!Array.isArray(parsed) || parsed.length === 0) {
                    reject(new Error('JSON must be a non-empty array of songs'));
                    return;
                }

                // Validate and migrate each entry
                const songs = parsed.map((entry) => {
                    const migrated = migrateSong(entry);
                    if (!migrated.title || typeof migrated.title !== 'string') {
                        throw new Error(`Invalid song entry: missing title`);
                    }
                    return migrated;
                });

                resolve(songs);
            } catch (err) {
                reject(new Error(`Invalid JSON: ${err.message}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Migrate a single entry from old format (plain string) to new object format.
 *
 * @param {string|import('./constants.js').Song} entry
 * @returns {import('./constants.js').Song}
 */
function migrateSong(entry) {
    if (typeof entry === 'string') {
        return { title: entry, url: '' };
    }
    return {
        title: entry.title || '',
        url: entry.url || '',
    };
}
