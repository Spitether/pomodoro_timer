window.Pomodoro = window.Pomodoro || {};

Pomodoro.analyticsData = (function() {
    'use strict';

    const gamification = Pomodoro.state.gamification;
    const settings = Pomodoro.state.settings;

    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const HOUR_LABELS = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];

    function logSession() {
        const now = new Date();
        const sessionRecord = {
            timestamp: now.toISOString(),
            duration: settings.work,
            dayOfWeek: now.getDay(),
            hour: now.getHours()
        };

        gamification.sessionHistory.push(sessionRecord);

        if (gamification.sessionHistory.length > 100) {
            gamification.sessionHistory = gamification.sessionHistory.slice(-100);
        }

        updateBestDay(now);
    }

    function updateBestDay(now) {
        const todayKey = formatDateKey(now);
        const todayCount = gamification.sessionHistory.filter(s => {
            const d = new Date(s.timestamp);
            return formatDateKey(d) === todayKey;
        }).length;

        if (todayCount > gamification.bestDay.count) {
            gamification.bestDay = { date: todayKey, count: todayCount };
        }
    }

    function formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatTimeAgo(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    function getWeeklyData() {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 86400000);

        gamification.sessionHistory.forEach(session => {
            const d = new Date(session.timestamp);
            if (d >= weekAgo && d <= today) {
                counts[d.getDay()]++;
            }
        });

        return counts;
    }

    function getDailyData() {
        const counts = new Array(24).fill(0);
        const today = new Date();
        const todayKey = formatDateKey(today);

        gamification.sessionHistory.forEach(session => {
            const d = new Date(session.timestamp);
            if (formatDateKey(d) === todayKey) {
                counts[d.getHours()]++;
            }
        });

        return counts;
    }

    function getHeatmapData() {
        const data = [];
        const today = new Date();
        for (let i = 27; i >= 0; i--) {
            const d = new Date(today.getTime() - i * 86400000);
            const key = formatDateKey(d);
            const count = gamification.sessionHistory.filter(s => {
                return formatDateKey(new Date(s.timestamp)) === key;
            }).length;
            data.push({ date: key, dayOfWeek: d.getDay(), count });
        }
        return data;
    }

    function getTotalFocusHours() {
        const totalMinutes = gamification.sessionHistory.length * settings.work;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        if (hours === 0) return `${mins}m`;
        return `${hours}h ${mins}m`;
    }

    return {
        logSession,
        formatDateKey,
        formatDate,
        formatTimeAgo,
        getWeeklyData,
        getDailyData,
        getHeatmapData,
        getTotalFocusHours
    };
})();

