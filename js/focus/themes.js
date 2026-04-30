window.Pomodoro = window.Pomodoro || {};

Pomodoro.focusThemes = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;

    const THEMES = [
        { id: 'default', name: 'Classic', icon: '⚪', desc: 'Clean red & white' },
        { id: 'minimalist', name: 'Minimalist', icon: '◻️', desc: 'Pure simplicity' },
        { id: 'nature', name: 'Nature', icon: '🌿', desc: 'Green & earth tones' },
        { id: 'neon', name: 'Neon', icon: '💜', desc: 'Dark with neon glow' },
        { id: 'cozy', name: 'Cozy Room', icon: '🕯️', desc: 'Warm amber tones' }
    ];

    function applyTheme(themeId) {
        state.theme = themeId;

        document.body.classList.remove(
            'theme-minimalist',
            'theme-nature',
            'theme-neon',
            'theme-cozy'
        );

        if (themeId !== 'default') {
            document.body.classList.add('theme-' + themeId);
        }

        document.querySelectorAll('.theme-option').forEach(el => {
            el.classList.toggle('active', el.dataset.theme === themeId);
        });
    }

    function renderThemeGrid() {
        if (!dom.themeGrid) return;

        let html = '';
        THEMES.forEach(theme => {
            html += `
                <button class="theme-option ${theme.id === state.theme ? 'active' : ''}"
                        data-theme="${theme.id}"
                        title="${theme.desc}">
                    <span class="theme-icon">${theme.icon}</span>
                    <span class="theme-name">${theme.name}</span>
                </button>
            `;
        });
        dom.themeGrid.innerHTML = html;

        dom.themeGrid.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(btn.dataset.theme);
                Pomodoro.focusEnv.savePreferences();
            });
        });
    }

return {
        applyTheme,
        renderThemeGrid
    };
})();

// Auto-render themes immediately when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        Pomodoro.focusThemes.renderThemeGrid();
    });
} else {
    Pomodoro.focusThemes.renderThemeGrid();
}

