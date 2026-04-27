window.Pomodoro = window.Pomodoro || {};

Pomodoro.theme = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;

    function apply() {
        document.body.classList.toggle('dark-mode', state.darkMode);
        if (dom.themeToggle) {
            dom.themeToggle.setAttribute('aria-pressed', String(state.darkMode));
            dom.themeToggle.title = state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
        if (dom.themeIcon) {
            dom.themeIcon.textContent = state.darkMode ? '☀️' : '🌙';
        }
    }

    function toggle() {
        state.darkMode = !state.darkMode;
        apply();
        localStorage.setItem('pomodoroDarkMode', JSON.stringify(state.darkMode));
    }

    function load() {
        const saved = localStorage.getItem('pomodoroDarkMode');
        if (saved !== null) {
            try {
                state.darkMode = JSON.parse(saved);
            } catch (e) {
                state.darkMode = false;
            }
        } else {
            state.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        apply();
    }

    return { apply, toggle, load };
})();

