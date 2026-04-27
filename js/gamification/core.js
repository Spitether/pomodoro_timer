window.Pomodoro = window.Pomodoro || {};

Pomodoro.gamificationCore = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;

    function onSessionComplete(x, y) {
        Pomodoro.streaks.check();

        gamification.todaySessions++;
        gamification.totalSessions++;

        if (gamification.todaySessions > gamification.maxDailySessions) {
            gamification.maxDailySessions = gamification.todaySessions;
        }

        Pomodoro.streaks.checkTimeBasedAchievements();

        const xpGained = config.XP_PER_SESSION;
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

    return { onSessionComplete };
})();

