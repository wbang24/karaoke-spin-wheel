/**
 * Theme system for the Karaoke Spin Wheel.
 * Each theme defines CSS custom properties applied to :root.
 * Flat, modern design — no glows, no gradients, no shadows.
 * @module themes
 */

/** localStorage key for persisting the selected theme. */
export const THEME_STORAGE_KEY = 'karaokeWheelTheme';

/**
 * @typedef {object} Theme
 * @property {string} id          - Unique identifier.
 * @property {string} label       - Display name in the picker.
 * @property {string} icon        - Small icon/emoji for the picker.
 * @property {Record<string, string>} vars - CSS custom property values.
 * @property {string[]} wheelColors - Segment color palette for the canvas wheel.
 * @property {string[]} confettiColors - Colors for confetti particles.
 */

/** @type {Theme[]} */
export const THEMES = [
    /* ------------------------------------------------------------------ */
    /*  DARK (default)                                                     */
    /* ------------------------------------------------------------------ */
    {
        id: 'dark',
        label: 'Dark',
        icon: '🌙',
        vars: {
            '--bg-primary':       '#121220',
            '--bg-surface':       'rgba(255, 255, 255, 0.06)',
            '--bg-surface-hover': 'rgba(255, 255, 255, 0.10)',
            '--bg-input':         'rgba(255, 255, 255, 0.08)',
            '--border-subtle':    'rgba(255, 255, 255, 0.10)',
            '--border-focus':     '#6c63ff',
            '--text-primary':     '#e8e8f0',
            '--text-secondary':   'rgba(255, 255, 255, 0.55)',
            '--text-muted':       'rgba(255, 255, 255, 0.35)',
            '--accent':           '#6c63ff',
            '--accent-text':      '#ffffff',
            '--danger':           '#ef4444',
            '--danger-bg':        'rgba(239, 68, 68, 0.12)',
            '--wheel-hub':        '#1e1e3a',
            '--wheel-hub-border': 'rgba(255, 255, 255, 0.15)',
            '--wheel-label':      '#1a1a2e',
            '--pointer-color':    '#ef4444',
            '--panel-bg':         'rgba(255, 255, 255, 0.04)',
            '--btn-spin-bg':      '#6c63ff',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#22c55e',
            '--btn-add-text':     '#ffffff',
            '--yt-accent':        '#ef4444',
            '--yt-bg':            'rgba(239, 68, 68, 0.12)',
            '--scrollbar-thumb':  'rgba(255, 255, 255, 0.15)',
            '--highlight-bg':     'rgba(108, 99, 255, 0.10)',
            '--mark-bg':          '#6c63ff',
            '--mark-text':        '#ffffff',
            '--power-low':        '#22c55e',
            '--power-mid':        '#f59e0b',
            '--power-high':       '#ef4444',
        },
        wheelColors: [
            '#6c63ff', '#22c55e', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#f472b6', '#a3e635',
            '#fb923c', '#38bdf8', '#c084fc', '#34d399',
            '#fbbf24', '#f87171', '#818cf8', '#2dd4bf',
            '#e879f9', '#84cc16', '#fb7185', '#67e8f9',
            '#a78bfa', '#4ade80', '#fcd34d', '#93c5fd',
        ],
        confettiColors: [
            '#6c63ff', '#22c55e', '#f59e0b', '#ef4444',
            '#8b5cf6', '#f472b6', '#06b6d4', '#a5b4fc',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  LIGHT                                                              */
    /* ------------------------------------------------------------------ */
    {
        id: 'light',
        label: 'Light',
        icon: '☀️',
        vars: {
            '--bg-primary':       '#f5f5f5',
            '--bg-surface':       'rgba(0, 0, 0, 0.04)',
            '--bg-surface-hover': 'rgba(0, 0, 0, 0.07)',
            '--bg-input':         'rgba(0, 0, 0, 0.05)',
            '--border-subtle':    'rgba(0, 0, 0, 0.10)',
            '--border-focus':     '#4f46e5',
            '--text-primary':     '#1f2937',
            '--text-secondary':   'rgba(0, 0, 0, 0.55)',
            '--text-muted':       'rgba(0, 0, 0, 0.35)',
            '--accent':           '#4f46e5',
            '--accent-text':      '#ffffff',
            '--danger':           '#dc2626',
            '--danger-bg':        'rgba(220, 38, 38, 0.08)',
            '--wheel-hub':        '#ffffff',
            '--wheel-hub-border': 'rgba(0, 0, 0, 0.12)',
            '--wheel-label':      '#1f2937',
            '--pointer-color':    '#dc2626',
            '--panel-bg':         '#ffffff',
            '--btn-spin-bg':      '#4f46e5',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#16a34a',
            '--btn-add-text':     '#ffffff',
            '--yt-accent':        '#dc2626',
            '--yt-bg':            'rgba(220, 38, 38, 0.08)',
            '--scrollbar-thumb':  'rgba(0, 0, 0, 0.15)',
            '--highlight-bg':     'rgba(79, 70, 229, 0.08)',
            '--mark-bg':          '#c7d2fe',
            '--mark-text':        '#312e81',
            '--power-low':        '#16a34a',
            '--power-mid':        '#d97706',
            '--power-high':       '#dc2626',
        },
        wheelColors: [
            '#4f46e5', '#16a34a', '#d97706', '#dc2626',
            '#7c3aed', '#0891b2', '#db2777', '#65a30d',
            '#ea580c', '#0284c7', '#9333ea', '#059669',
            '#ca8a04', '#e11d48', '#6366f1', '#0d9488',
            '#c026d3', '#4d7c0f', '#be123c', '#0e7490',
            '#7c3aed', '#15803d', '#b45309', '#1d4ed8',
        ],
        confettiColors: [
            '#4f46e5', '#16a34a', '#d97706', '#dc2626',
            '#7c3aed', '#db2777', '#0891b2', '#6366f1',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  HALLOWEEN                                                          */
    /* ------------------------------------------------------------------ */
    {
        id: 'halloween',
        label: 'Halloween',
        icon: '🎃',
        vars: {
            '--bg-primary':       '#0d0d0d',
            '--bg-surface':       'rgba(255, 140, 0, 0.06)',
            '--bg-surface-hover': 'rgba(255, 140, 0, 0.10)',
            '--bg-input':         'rgba(255, 140, 0, 0.06)',
            '--border-subtle':    'rgba(255, 140, 0, 0.12)',
            '--border-focus':     '#f97316',
            '--text-primary':     '#fde8c8',
            '--text-secondary':   'rgba(253, 232, 200, 0.60)',
            '--text-muted':       'rgba(253, 232, 200, 0.35)',
            '--accent':           '#f97316',
            '--accent-text':      '#0d0d0d',
            '--danger':           '#dc2626',
            '--danger-bg':        'rgba(220, 38, 38, 0.15)',
            '--wheel-hub':        '#1a1008',
            '--wheel-hub-border': 'rgba(255, 140, 0, 0.20)',
            '--wheel-label':      '#0d0d0d',
            '--pointer-color':    '#a855f7',
            '--panel-bg':         'rgba(255, 140, 0, 0.04)',
            '--btn-spin-bg':      '#f97316',
            '--btn-spin-text':    '#0d0d0d',
            '--btn-add-bg':       '#65a30d',
            '--btn-add-text':     '#ffffff',
            '--yt-accent':        '#dc2626',
            '--yt-bg':            'rgba(220, 38, 38, 0.15)',
            '--scrollbar-thumb':  'rgba(255, 140, 0, 0.18)',
            '--highlight-bg':     'rgba(249, 115, 22, 0.10)',
            '--mark-bg':          '#f97316',
            '--mark-text':        '#0d0d0d',
            '--power-low':        '#65a30d',
            '--power-mid':        '#f97316',
            '--power-high':       '#dc2626',
        },
        wheelColors: [
            '#f97316', '#a855f7', '#1a1a1a', '#65a30d',
            '#dc2626', '#7c3aed', '#ea580c', '#581c87',
            '#fb923c', '#6b21a8', '#0d0d0d', '#84cc16',
            '#ef4444', '#9333ea', '#c2410c', '#4c1d95',
            '#fdba74', '#a855f7', '#292524', '#4d7c0f',
            '#b91c1c', '#7e22ce', '#9a3412', '#3b0764',
        ],
        confettiColors: [
            '#f97316', '#a855f7', '#dc2626', '#65a30d',
            '#fb923c', '#c084fc', '#ea580c', '#7c3aed',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  CHRISTMAS                                                          */
    /* ------------------------------------------------------------------ */
    {
        id: 'christmas',
        label: 'Christmas',
        icon: '🎄',
        vars: {
            '--bg-primary':       '#0c1a0c',
            '--bg-surface':       'rgba(220, 38, 38, 0.06)',
            '--bg-surface-hover': 'rgba(220, 38, 38, 0.10)',
            '--bg-input':         'rgba(255, 255, 255, 0.06)',
            '--border-subtle':    'rgba(255, 255, 255, 0.10)',
            '--border-focus':     '#dc2626',
            '--text-primary':     '#f0fdf4',
            '--text-secondary':   'rgba(240, 253, 244, 0.60)',
            '--text-muted':       'rgba(240, 253, 244, 0.35)',
            '--accent':           '#dc2626',
            '--accent-text':      '#ffffff',
            '--danger':           '#ef4444',
            '--danger-bg':        'rgba(239, 68, 68, 0.15)',
            '--wheel-hub':        '#132013',
            '--wheel-hub-border': 'rgba(255, 255, 255, 0.15)',
            '--wheel-label':      '#ffffff',
            '--pointer-color':    '#fbbf24',
            '--panel-bg':         'rgba(22, 163, 74, 0.05)',
            '--btn-spin-bg':      '#dc2626',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#16a34a',
            '--btn-add-text':     '#ffffff',
            '--yt-accent':        '#ef4444',
            '--yt-bg':            'rgba(239, 68, 68, 0.15)',
            '--scrollbar-thumb':  'rgba(255, 255, 255, 0.15)',
            '--highlight-bg':     'rgba(220, 38, 38, 0.10)',
            '--mark-bg':          '#dc2626',
            '--mark-text':        '#ffffff',
            '--power-low':        '#16a34a',
            '--power-mid':        '#fbbf24',
            '--power-high':       '#dc2626',
        },
        wheelColors: [
            '#dc2626', '#16a34a', '#fbbf24', '#15803d',
            '#b91c1c', '#22c55e', '#f59e0b', '#166534',
            '#ef4444', '#4ade80', '#eab308', '#14532d',
            '#f87171', '#059669', '#ca8a04', '#0f766e',
            '#dc2626', '#16a34a', '#fbbf24', '#15803d',
            '#b91c1c', '#22c55e', '#f59e0b', '#166534',
        ],
        confettiColors: [
            '#dc2626', '#16a34a', '#fbbf24', '#ef4444',
            '#22c55e', '#f59e0b', '#b91c1c', '#4ade80',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  OCEAN                                                              */
    /* ------------------------------------------------------------------ */
    {
        id: 'ocean',
        label: 'Ocean',
        icon: '🌊',
        vars: {
            '--bg-primary':       '#0a1628',
            '--bg-surface':       'rgba(56, 189, 248, 0.06)',
            '--bg-surface-hover': 'rgba(56, 189, 248, 0.10)',
            '--bg-input':         'rgba(56, 189, 248, 0.06)',
            '--border-subtle':    'rgba(56, 189, 248, 0.12)',
            '--border-focus':     '#0ea5e9',
            '--text-primary':     '#e0f2fe',
            '--text-secondary':   'rgba(224, 242, 254, 0.60)',
            '--text-muted':       'rgba(224, 242, 254, 0.35)',
            '--accent':           '#0ea5e9',
            '--accent-text':      '#ffffff',
            '--danger':           '#f43f5e',
            '--danger-bg':        'rgba(244, 63, 94, 0.12)',
            '--wheel-hub':        '#0f1d32',
            '--wheel-hub-border': 'rgba(56, 189, 248, 0.15)',
            '--wheel-label':      '#0a1628',
            '--pointer-color':    '#f43f5e',
            '--panel-bg':         'rgba(14, 165, 233, 0.04)',
            '--btn-spin-bg':      '#0ea5e9',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#2dd4bf',
            '--btn-add-text':     '#0a1628',
            '--yt-accent':        '#f43f5e',
            '--yt-bg':            'rgba(244, 63, 94, 0.12)',
            '--scrollbar-thumb':  'rgba(56, 189, 248, 0.18)',
            '--highlight-bg':     'rgba(14, 165, 233, 0.10)',
            '--mark-bg':          '#0ea5e9',
            '--mark-text':        '#ffffff',
            '--power-low':        '#2dd4bf',
            '--power-mid':        '#fbbf24',
            '--power-high':       '#f43f5e',
        },
        wheelColors: [
            '#0ea5e9', '#2dd4bf', '#fbbf24', '#f43f5e',
            '#0284c7', '#14b8a6', '#f59e0b', '#e11d48',
            '#38bdf8', '#5eead4', '#eab308', '#fb7185',
            '#0369a1', '#0d9488', '#ca8a04', '#be123c',
            '#7dd3fc', '#99f6e4', '#fcd34d', '#fda4af',
            '#075985', '#0f766e', '#a16207', '#9f1239',
        ],
        confettiColors: [
            '#0ea5e9', '#2dd4bf', '#fbbf24', '#f43f5e',
            '#38bdf8', '#5eead4', '#7dd3fc', '#fb7185',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  NEON                                                               */
    /* ------------------------------------------------------------------ */
    {
        id: 'neon',
        label: 'Neon',
        icon: '⚡',
        vars: {
            '--bg-primary':       '#050505',
            '--bg-surface':       'rgba(236, 72, 153, 0.06)',
            '--bg-surface-hover': 'rgba(236, 72, 153, 0.10)',
            '--bg-input':         'rgba(255, 255, 255, 0.05)',
            '--border-subtle':    'rgba(236, 72, 153, 0.15)',
            '--border-focus':     '#ec4899',
            '--text-primary':     '#f5f5f5',
            '--text-secondary':   'rgba(245, 245, 245, 0.60)',
            '--text-muted':       'rgba(245, 245, 245, 0.35)',
            '--accent':           '#ec4899',
            '--accent-text':      '#050505',
            '--danger':           '#ef4444',
            '--danger-bg':        'rgba(239, 68, 68, 0.15)',
            '--wheel-hub':        '#0a0a0a',
            '--wheel-hub-border': 'rgba(236, 72, 153, 0.20)',
            '--wheel-label':      '#050505',
            '--pointer-color':    '#a3e635',
            '--panel-bg':         'rgba(236, 72, 153, 0.03)',
            '--btn-spin-bg':      '#ec4899',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#a3e635',
            '--btn-add-text':     '#050505',
            '--yt-accent':        '#ef4444',
            '--yt-bg':            'rgba(239, 68, 68, 0.15)',
            '--scrollbar-thumb':  'rgba(236, 72, 153, 0.20)',
            '--highlight-bg':     'rgba(236, 72, 153, 0.10)',
            '--mark-bg':          '#ec4899',
            '--mark-text':        '#050505',
            '--power-low':        '#a3e635',
            '--power-mid':        '#facc15',
            '--power-high':       '#ef4444',
        },
        wheelColors: [
            '#ec4899', '#a3e635', '#06b6d4', '#facc15',
            '#be185d', '#84cc16', '#0891b2', '#eab308',
            '#f472b6', '#bef264', '#22d3ee', '#fde047',
            '#9d174d', '#65a30d', '#0e7490', '#ca8a04',
            '#f9a8d4', '#d9f99d', '#67e8f9', '#fef08a',
            '#831843', '#4d7c0f', '#155e75', '#a16207',
        ],
        confettiColors: [
            '#ec4899', '#a3e635', '#06b6d4', '#facc15',
            '#f472b6', '#bef264', '#22d3ee', '#fde047',
        ],
    },

    /* ------------------------------------------------------------------ */
    /*  BACHELORETTE                                                       */
    /* ------------------------------------------------------------------ */
    {
        id: 'bachelorette',
        label: 'Bachelorette',
        icon: '💕',
        vars: {
            '--bg-primary':       '#1a0a14',
            '--bg-surface':       'rgba(244, 114, 182, 0.08)',
            '--bg-surface-hover': 'rgba(244, 114, 182, 0.12)',
            '--bg-input':         'rgba(244, 114, 182, 0.08)',
            '--border-subtle':    'rgba(244, 114, 182, 0.15)',
            '--border-focus':     '#f472b6',
            '--text-primary':     '#fce7f3',
            '--text-secondary':   'rgba(252, 231, 243, 0.65)',
            '--text-muted':       'rgba(252, 231, 243, 0.40)',
            '--accent':           '#f472b6',
            '--accent-text':      '#ffffff',
            '--danger':           '#fb7185',
            '--danger-bg':        'rgba(251, 113, 133, 0.12)',
            '--wheel-hub':        '#2d1420',
            '--wheel-hub-border': 'rgba(244, 114, 182, 0.25)',
            '--wheel-label':      '#1a0a14',
            '--pointer-color':    '#fbbf24',
            '--panel-bg':         'rgba(244, 114, 182, 0.05)',
            '--btn-spin-bg':      '#f472b6',
            '--btn-spin-text':    '#ffffff',
            '--btn-add-bg':       '#fbbf24',
            '--btn-add-text':     '#1a0a14',
            '--yt-accent':        '#fb7185',
            '--yt-bg':            'rgba(251, 113, 133, 0.12)',
            '--scrollbar-thumb':  'rgba(244, 114, 182, 0.20)',
            '--highlight-bg':     'rgba(244, 114, 182, 0.12)',
            '--mark-bg':          '#f472b6',
            '--mark-text':        '#ffffff',
            '--power-low':        '#fbbf24',
            '--power-mid':        '#f472b6',
            '--power-high':       '#fb7185',
        },
        wheelColors: [
            '#f472b6', '#fbbf24', '#ec4899', '#fde047',
            '#db2777', '#f59e0b', '#f9a8d4', '#fef08a',
            '#be185d', '#d97706', '#fbcfe8', '#fef3c7',
            '#9d174d', '#b45309', '#f0abfc', '#fde68a',
            '#831843', '#92400e', '#e879f9', '#fcd34d',
            '#701a3f', '#78350f', '#d946ef', '#facc15',
        ],
        confettiColors: [
            '#f472b6', '#fbbf24', '#ec4899', '#fde047',
            '#f9a8d4', '#fef08a', '#fbcfe8', '#e879f9',
        ],
    },
];

/** Default theme ID. */
export const DEFAULT_THEME_ID = 'dark';

/* ---------------------------------------------------------------------------
   Theme application helpers
   --------------------------------------------------------------------------- */

/** @type {Theme|null} Currently active theme. */
let activeTheme = null;

/**
 * Apply a theme by ID. Sets CSS custom properties on :root and stores preference.
 * @param {string} themeId
 * @returns {Theme} The applied theme.
 */
export function applyTheme(themeId) {
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    // Set all CSS custom properties
    for (const [prop, value] of Object.entries(theme.vars)) {
        root.style.setProperty(prop, value);
    }

    // Set data attribute for any CSS selectors that need it
    root.dataset.theme = theme.id;

    // Persist choice
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    } catch {
        // Storage not available
    }

    activeTheme = theme;
    return theme;
}

/**
 * Load the saved theme from localStorage, or fall back to default.
 * @returns {Theme} The loaded/applied theme.
 */
export function loadTheme() {
    let savedId = DEFAULT_THEME_ID;
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored && THEMES.some((t) => t.id === stored)) {
            savedId = stored;
        }
    } catch {
        // Storage not available
    }
    return applyTheme(savedId);
}

/**
 * Get the currently active theme.
 * @returns {Theme}
 */
export function getActiveTheme() {
    return activeTheme || THEMES[0];
}

/**
 * Get wheel segment colors for the active theme.
 * @returns {string[]}
 */
export function getWheelColors() {
    return (activeTheme || THEMES[0]).wheelColors;
}

/**
 * Get confetti colors for the active theme.
 * @returns {string[]}
 */
export function getConfettiColors() {
    return (activeTheme || THEMES[0]).confettiColors;
}
