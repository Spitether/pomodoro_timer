window.Pomodoro = window.Pomodoro || {};

Pomodoro.gamificationCore = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;
    const state = Pomodoro.state;

    function calculateXP(sessionType) {
        // Get session duration from settings
        const workMinutes = state.settings.work || 25;
        const shortBreakMinutes = state.settings.shortBreak || 5;
        const longBreakMinutes = state.settings.longBreak || 15;

        let xpGained;

        if (sessionType === 'work') {
            // Work sessions: Base + (work minutes * multiplier)
            // Longer work = more XP
            xpGained = Math.round(config.XP_BASE + (workMinutes * config.WORK_XP_PER_MINUTE));
        } else {
            // Break sessions: Base - (break minutes * penalty)
            // Shorter break = more XP (less penalty)
            const breakMinutes = sessionType === 'shortBreak' ? shortBreakMinutes : longBreakMinutes;
            xpGained = Math.round(config.XP_BASE - (breakMinutes * config.BREAK_XP_PENALTY_PER_MINUTE));
            // Ensure minimum XP is at least 0 for breaks
            xpGained = Math.max(0, xpGained);
        }

        return xpGained;
    }

    function onSessionComplete(x, y) {
        Pomodoro.streaks.check();

        gamification.todaySessions++;
        gamification.totalSessions++;

        if (gamification.todaySessions > gamification.maxDailySessions) {
            gamification.maxDailySessions = gamification.todaySessions;
        }

        Pomodoro.streaks.checkTimeBasedAchievements();

        // Calculate XP based on session type and duration ratio
        const xpGained = calculateXP(state.currentSession);
        Pomodoro.xp.addXP(xpGained);
        Pomodoro.gamificationUI.showXPGain(xpGained, x, y);

        Pomodoro.xp.checkLevelUp();
        Pomodoro.badges.check();
        Pomodoro.dailyGoals.update();
        Pomodoro.gamificationUI.updateAll();
        Pomodoro.analytics.logSession();
        Pomodoro.analytics.updateAll();
        Pomodoro.tasks.onSessionComplete();
        Pomodoro.gamificationStorage.save();

        return { xpGained };
    }

    return { onSessionComplete, calculateXP };
})();

