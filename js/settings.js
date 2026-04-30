window.Pomodoro = window.Pomodoro || {};

Pomodoro.settings = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;

    function open() {
        dom.workDuration.value = state.settings.work;
        dom.shortBreakDuration.value = state.settings.shortBreak;
        dom.longBreakDuration.value = state.settings.longBreak;
        dom.dailyGoalTarget.value = state.gamification.dailyGoalTarget;
        dom.autoCycle.checked = state.settings.autoCycle;
        dom.soundEnabled.checked = state.settings.soundEnabled;
        if (dom.shieldEnabled) dom.shieldEnabled.checked = state.shield.enabled;
        if (dom.shieldStrictMode) dom.shieldStrictMode.checked = state.shield.strictMode;
        if (dom.shieldPenalty) dom.shieldPenalty.checked = state.shield.penaltyEnabled;
        if (dom.shieldThreshold) dom.shieldThreshold.value = state.shield.distractionThreshold;
        dom.settingsModal.classList.remove('hidden');
    }

function close() {
        dom.settingsModal.classList.add('hidden');
    }

    function save() {
        const work = parseInt(dom.workDuration.value, 10);
        const shortBreak = parseInt(dom.shortBreakDuration.value, 10);
        const longBreak = parseInt(dom.longBreakDuration.value, 10);
        const dailyGoal = parseInt(dom.dailyGoalTarget.value, 10);

        if (work < 1 || shortBreak < 1 || longBreak < 1) {
            alert('Durations must be at least 1 minute.');
            return;
        }
        if (work > 120) {
            alert('Work session cannot exceed 120 minutes.');
            return;
        }
        if (shortBreak > 30) {
            alert('Short break cannot exceed 30 minutes.');
            return;
        }
        if (longBreak > 60) {
            alert('Long break cannot exceed 60 minutes.');
            return;
        }
        if (dailyGoal < 1 || dailyGoal > 50) {
            alert('Daily goal must be between 1 and 50 Pomodoros.');
            return;
        }

        state.settings.work = work;
        state.settings.shortBreak = shortBreak;
        state.settings.longBreak = longBreak;
        state.settings.autoCycle = dom.autoCycle.checked;
        state.settings.soundEnabled = dom.soundEnabled.checked;
        state.gamification.dailyGoalTarget = dailyGoal;

        if (dom.shieldEnabled) state.shield.enabled = dom.shieldEnabled.checked;
        if (dom.shieldStrictMode) state.shield.strictMode = dom.shieldStrictMode.checked;
        if (dom.shieldPenalty) state.shield.penaltyEnabled = dom.shieldPenalty.checked;
        if (dom.shieldThreshold) {
            const threshold = parseInt(dom.shieldThreshold.value, 10);
            state.shield.distractionThreshold = isNaN(threshold) || threshold < 3 ? 10 : threshold;
        }

        localStorage.setItem('pomodoroShield', JSON.stringify(state.shield));

        localStorage.setItem('pomodoroSettings', JSON.stringify(state.settings));
        Pomodoro.gamificationStorage.save();

        if (!state.isRunning) {
            state.timeRemaining = state.settings[state.currentSession] * 60;
            Pomodoro.timer.updateDisplay();
        }

        Pomodoro.dailyGoals.update();
        close();
    }

    function load() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(state.settings, parsed);
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }

    return { open, close, save, load };
})();
