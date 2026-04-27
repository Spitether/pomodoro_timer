window.Pomodoro = window.Pomodoro || {};

Pomodoro.gamificationStorage = (function() {
    'use strict';

    const gamification = Pomodoro.state.gamification;

    function save() {
        localStorage.setItem('pomodoroGamification', JSON.stringify(gamification));
    }

    function load() {
        const saved = localStorage.getItem('pomodoroGamification');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(gamification, parsed);
            } catch (e) {
                console.error('Failed to load gamification data:', e);
            }
        }
    }

    return { save, load };
})();

