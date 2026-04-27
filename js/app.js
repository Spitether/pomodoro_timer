// Pomodoro Timer - Entry Point
(function() {
    'use strict';

    function init() {
        Pomodoro.settings.load();
        Pomodoro.theme.load();
        Pomodoro.gamificationStorage.load();
        Pomodoro.streaks.resetDailyIfNeeded();
        Pomodoro.events.init();

        // Load saved session state if available (within 24h)
        const hasSavedSession = Pomodoro.timer.loadSession();
        if (!hasSavedSession) {
            Pomodoro.state.timeRemaining = Pomodoro.state.settings.work * 60;
        }

        Pomodoro.timer.updateDisplay();
        Pomodoro.timer.updateSessionUI();
        Pomodoro.timer.updateControls();
        Pomodoro.gamificationUI.updateAll();
        Pomodoro.analytics.updateAll();
        Pomodoro.focusEnv.init();
        Pomodoro.focusMusic.restoreCustomPlaylists();
        Pomodoro.tasks.init();
        Pomodoro.shield.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

