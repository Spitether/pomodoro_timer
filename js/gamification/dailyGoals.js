window.Pomodoro = window.Pomodoro || {};

Pomodoro.dailyGoals = (function() {
    'use strict';

    const gamification = Pomodoro.state.gamification;
    const dom = Pomodoro.dom;

    function update() {
        const progress = gamification.todaySessions;
        const target = gamification.dailyGoalTarget;

        dom.dailyProgress.textContent = `${progress}/${target}`;
        dom.dailyGoalText.textContent = `${progress} / ${target} Pomodoros`;

        const percent = Math.min(100, (progress / target) * 100);
        dom.dailyGoalBar.style.width = `${percent}%`;

        if (progress >= target) {
            gamification.dailyGoalCompleted = true;
            dom.dailyGoalBar.classList.add('goal-complete');
        } else {
            dom.dailyGoalBar.classList.remove('goal-complete');
        }
    }

    return { update };
})();

