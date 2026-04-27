window.Pomodoro = window.Pomodoro || {};

Pomodoro.shield = (function() {
    'use strict';

    const state = Pomodoro.state;
    const shield = state.shield;
    const shieldStats = state.shieldStats;

    let tabHiddenAt = null;
    let warningShown = false;

    function init() {
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('beforeunload', onBeforeUnload);
        loadStats();
    }

    function onVisibilityChange() {
        if (!shield.enabled) return;

        if (document.hidden) {
            // User switched away from the tab
            if (state.isRunning && state.currentSession === 'work') {
                tabHiddenAt = Date.now();

                if (shield.strictMode) {
                    // Strict mode: auto-pause timer immediately
                    Pomodoro.timer.pause();
                    showStrictOverlay('Timer paused — stay focused!');
                }
            }
        } else {
            // User returned to the tab
            if (tabHiddenAt && state.currentSession === 'work') {
                const timeAway = Math.floor((Date.now() - tabHiddenAt) / 1000);
                tabHiddenAt = null;

                if (timeAway >= shield.distractionThreshold) {
                    handleDistraction(timeAway);
                }
            }

            if (shield.strictMode) {
                hideStrictOverlay();
            }
        }
    }

    function handleDistraction(timeAway) {
        shieldStats.distractionsToday++;
        shieldStats.totalTimeAway += timeAway;
        shieldStats.lastDistractionAt = new Date().toISOString();
        saveStats();

        if (shield.penaltyEnabled) {
            const penalty = Math.min(shield.penaltyXP, Pomodoro.state.gamification.totalXP);
            if (penalty > 0) {
                Pomodoro.state.gamification.totalXP -= penalty;
                Pomodoro.gamificationUI.updateAll();
                Pomodoro.gamificationStorage.save();
            }
        }

        showWarning(timeAway);
    }

    function showWarning(timeAway) {
        if (warningShown) return;
        warningShown = true;

        const minutes = Math.floor(timeAway / 60);
        const seconds = timeAway % 60;
        const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        const penaltyText = shield.penaltyEnabled
            ? `<p class="shield-penalty">-${shield.penaltyXP} XP penalty applied</p>`
            : '';

        const overlay = document.createElement('div');
        overlay.id = 'shield-warning-overlay';
        overlay.className = 'shield-overlay';
        overlay.innerHTML = `
            <div class="shield-card">
                <div class="shield-icon">🛡️</div>
                <h3>Focus Broken</h3>
                <p>You were away for <strong>${timeStr}</strong> during a work session.</p>
                ${penaltyText}
                <p class="shield-tip">💡 Tip: Keep this tab visible while the timer is running.</p>
                <button id="shield-dismiss" class="control-btn primary">Got it — Back to Focus</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => overlay.classList.add('show'));

        document.getElementById('shield-dismiss').addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                warningShown = false;
            }, 300);
        });
    }

    function showStrictOverlay(message) {
        if (document.getElementById('shield-strict-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'shield-strict-overlay';
        overlay.className = 'shield-strict-overlay';
        overlay.innerHTML = `
            <div class="shield-strict-content">
                <div class="shield-strict-icon">🔒</div>
                <h2>Strict Mode Active</h2>
                <p>${message}</p>
                <p class="shield-strict-sub">Switching away pauses your timer automatically.</p>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));
    }

    function hideStrictOverlay() {
        const overlay = document.getElementById('shield-strict-overlay');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }

    function onBeforeUnload() {
        if (!shield.enabled) return;
        if (state.isRunning && state.currentSession === 'work') {
            // Browser shows default confirmation dialog
            // We can't customize the message in modern browsers
        }
    }

    function saveStats() {
        localStorage.setItem('pomodoroShieldStats', JSON.stringify(shieldStats));
    }

    function loadStats() {
        const saved = localStorage.getItem('pomodoroShieldStats');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Reset daily stats if it's a new day
                const lastDate = parsed.lastDistractionAt
                    ? new Date(parsed.lastDistractionAt).toDateString()
                    : null;
                const today = new Date().toDateString();

                if (lastDate === today) {
                    Object.assign(shieldStats, parsed);
                } else {
                    shieldStats.distractionsToday = 0;
                    shieldStats.totalTimeAway = 0;
                    shieldStats.lastDistractionAt = null;
                }
            } catch (e) {
                console.error('Failed to load shield stats:', e);
            }
        }
    }

    function getStats() {
        return { ...shieldStats };
    }

    function resetDailyStats() {
        shieldStats.distractionsToday = 0;
        shieldStats.totalTimeAway = 0;
        shieldStats.lastDistractionAt = null;
        saveStats();
    }

    return {
        init,
        showWarning,
        showStrictOverlay,
        hideStrictOverlay,
        getStats,
        resetDailyStats
    };
})();

