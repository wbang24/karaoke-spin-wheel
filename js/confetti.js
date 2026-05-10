/**
 * Confetti particle animation for win celebrations.
 * Uses theme-aware colors from the active theme.
 * @module confetti
 */

import { CONFETTI_COUNT } from './constants.js';
import { getConfettiColors } from './themes.js';

/**
 * Launch a burst of confetti particles that fall from the top of the viewport.
 * Each particle is a temporary DOM element animated via the Web Animations API.
 */
export function launchConfetti() {
    const colors = getConfettiColors();

    for (let i = 0; i < CONFETTI_COUNT; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        // Randomize appearance
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = `${Math.random() * 8 + 5}px`;
        piece.style.height = `${Math.random() * 8 + 5}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.opacity = String(Math.random() * 0.7 + 0.3);

        document.body.appendChild(piece);

        // Animate fall
        const duration = Math.random() * 2000 + 1500;
        const xDrift = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720;

        const animation = piece.animate(
            [
                { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
                {
                    transform: `translateY(${window.innerHeight + 50}px) translateX(${xDrift}px) rotate(${rotation}deg)`,
                    opacity: 0,
                },
            ],
            {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },
        );

        animation.onfinish = () => piece.remove();
    }
}
