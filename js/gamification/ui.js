window.Pomodoro = window.Pomodoro || {};

Pomodoro.gamificationUI = (function() {
    'use strict';

    const config = Pomodoro.GamificationConfig;
    const gamification = Pomodoro.state.gamification;
    const dom = Pomodoro.dom;

    function updateCharacter() {
        const level = gamification.level;
        dom.levelNum.textContent = level;

        dom.characterAvatar.classList.add('level-up');
        setTimeout(() => dom.characterAvatar.classList.remove('level-up'), 600);
    }

    function showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.textContent = `🎉 Level Up! You are now Level ${level}!`;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function showXPGain(amount, x, y) {
        const xpEl = document.createElement('div');
        xpEl.className = 'xp-gain';
        xpEl.textContent = `+${amount} XP`;
        xpEl.style.left = `${x}px`;
        xpEl.style.top = `${y}px`;
        document.body.appendChild(xpEl);

        setTimeout(() => xpEl.remove(), 1500);
    }

    function renderBadges(newlyEarned) {
        dom.badgesGrid.innerHTML = '';

        config.BADGES.forEach(badge => {
            const isEarned = gamification.earnedBadges.includes(badge.id);
            const isNew = newlyEarned.some(b => b.id === badge.id);

            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item ${isEarned ? 'earned' : ''} ${isNew ? 'newly-earned' : ''}`;
            badgeEl.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
                <span class="badge-tooltip">${badge.desc}</span>
            `;
            dom.badgesGrid.appendChild(badgeEl);
        });
    }

    function updateAll() {
        const progress = Pomodoro.xp.getLevelProgress();

        dom.xpText.textContent = `${progress.current} / ${progress.needed}`;
        dom.xpBar.style.width = `${progress.percent}%`;
        dom.streakCount.textContent = gamification.streak;
        dom.totalSessions.textContent = gamification.totalSessions;
        dom.totalXp.textContent = gamification.totalXP;
        dom.levelNum.textContent = gamification.level;

        // Color-code stat items
        const streakEl = document.getElementById('stat-streak');
        const sessionsEl = document.getElementById('stat-sessions');
        const xpEl = document.getElementById('stat-xp');

        if (streakEl) streakEl.classList.toggle('has-value', gamification.streak > 0);
        if (streakEl) streakEl.classList.toggle('is-empty', gamification.streak === 0);
        if (sessionsEl) sessionsEl.classList.toggle('has-value', gamification.totalSessions > 0);
        if (sessionsEl) sessionsEl.classList.toggle('is-empty', gamification.totalSessions === 0);
        if (xpEl) xpEl.classList.toggle('has-value', gamification.totalXP > 0);
        if (xpEl) xpEl.classList.toggle('is-empty', gamification.totalXP === 0);

        Pomodoro.dailyGoals.update();
        renderBadges([]);
        updateCharacter();
    }

    return {
        updateCharacter,
        showLevelUpNotification,
        showXPGain,
        renderBadges,
        updateAll
    };
})();

