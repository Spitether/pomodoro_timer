window.Pomodoro = window.Pomodoro || {};

Pomodoro.streaks = (function() {
    'use strict';

    const gamification = Pomodoro.state.gamification;

    function check() {
        const today = new Date().toDateString();
        const lastActive = gamification.lastActiveDate;

        if (!lastActive) {
            gamification.streak = 1;
        } else {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Same day
            } else if (diffDays === 1) {
                gamification.streak++;
            } else {
                gamification.streak = 1;
            }
        }

        gamification.lastActiveDate = today;
    }

    function checkTimeBasedAchievements() {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 2) {
            gamification.nightOwl = true;
        }
        if (hour >= 5 && hour < 7) {
            gamification.earlyBird = true;
        }
    }

    function resetDailyIfNeeded() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('pomodoroLastDate');

        if (savedDate !== today) {
            gamification.todaySessions = 0;
            gamification.dailyGoalCompleted = false;
            localStorage.setItem('pomodoroLastDate', today);
        }
    }

    return { check, checkTimeBasedAchievements, resetDailyIfNeeded };
})();

