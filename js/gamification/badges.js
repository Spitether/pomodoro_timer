window.Pomodoro = window.Pomodoro || {};

Pomodoro.badges = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;

    function check() {
        const newlyEarned = [];

        config.BADGES.forEach(badge => {
            if (!gamification.earnedBadges.includes(badge.id)) {
                if (badge.condition(gamification)) {
                    gamification.earnedBadges.push(badge.id);
                    newlyEarned.push(badge);
                }
            }
        });

        Pomodoro.gamificationUI.renderBadges(newlyEarned);
        return newlyEarned.length > 0;
    }

    return { check };
})();

