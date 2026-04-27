window.Pomodoro = window.Pomodoro || {};

Pomodoro.xp = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;

    function getXPForLevel(level) {
        // Cumulative XP needed to reach this level
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += Math.floor(100 * Math.pow(1.5, i - 1));
        }
        return total;
    }

    function getLevelProgress() {
        const currentLevelXP = getXPForLevel(gamification.level);
        const nextLevelXP = getXPForLevel(gamification.level + 1);
        const xpIntoLevel = gamification.totalXP - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        return {
            current: xpIntoLevel,
            needed: xpNeeded,
            percent: Math.min(100, Math.max(0, (xpIntoLevel / xpNeeded) * 100))
        };
    }

    function checkLevelUp() {
        const nextLevelXP = getXPForLevel(gamification.level + 1);
        if (gamification.totalXP >= nextLevelXP) {
            gamification.level++;
            Pomodoro.gamificationUI.showLevelUpNotification(gamification.level);
            Pomodoro.gamificationUI.updateCharacter();
            return true;
        }
        return false;
    }

    function addXP(amount) {
        gamification.totalXP += amount;
    }

    return { getXPForLevel, getLevelProgress, checkLevelUp, addXP };
})();

