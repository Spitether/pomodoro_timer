window.Pomodoro = window.Pomodoro || {};

Pomodoro.gamificationCore = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;
    const state = Pomodoro.state;

    function calculateXP(sessionType, actualMinutes) {
        // Get the actual session duration that was completed
        // For work: actualMinutes is the actual time spent focusing
        // For breaks: actualMinutes is the actual break time taken
        const workMinutes = actualMinutes || state.settings.work || 25;
        const shortBreakMinutes = actualMinutes || state.settings.shortBreak || 5;
        const longBreakMinutes = actualMinutes || state.settings.longBreak || 15;

        let xpGained;

        if (sessionType === 'work') {
            // Work sessions: Base + (actual work minutes * multiplier)
            // Longer work session = more XP (reward productivity)
            xpGained = Math.round(config.XP_BASE + (workMinutes * config.WORK_XP_PER_MINUTE));
        } else {
            // Break sessions: Base - (actual break minutes * penalty)
            // Shorter break = more XP (less penalty), longer break = less XP
            // This encourages taking shorter breaks to maximize XP
            const breakMinutes = sessionType === 'shortBreak' ? shortBreakMinutes : longBreakMinutes;
            xpGained = Math.round(config.XP_BASE - (breakMinutes * config.BREAK_XP_PENALTY_PER_MINUTE));
            // Ensure minimum XP is at least 0 for breaks (but shorter breaks lose less XP)
            xpGained = Math.max(0, xpGained);
        }

        return xpGained;
    }

    function onSessionComplete(x, y, actualMinutes) {
        Pomodoro.streaks.check();

        gamification.todaySessions++;
        gamification.totalSessions++;

        if (gamification.todaySessions > gamification.maxDailySessions) {
            gamification.maxDailySessions = gamification.todaySessions;
        }

        Pomodoro.streaks.checkTimeBasedAchievements();

        // Calculate XP based on actual session duration
        // Longer work = more XP, shorter breaks = more XP
        const xpGained = calculateXP(state.currentSession, actualMinutes);
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

    function onBreakComplete(x, y, actualMinutes) {
        // Log break session for analytics (different from work - no XP reward)
        // Breaks don't give XP - they are just logged for productivity tracking
        
        Pomodoro.analytics.logBreakSession();
        Pomodoro.analytics.updateAll();
        Pomodoro.gamificationStorage.save();
        
        return { xpGained: 0 };
    }

    return { onSessionComplete, onBreakComplete, calculateXP };
})();

