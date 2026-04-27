window.Pomodoro = window.Pomodoro || {};

Pomodoro.analyticsRender = (function() {
    'use strict';

    const dom = Pomodoro.dom;
    const data = Pomodoro.analyticsData;
    const gamification = Pomodoro.state.gamification;

    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const HOUR_LABELS = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];

    function renderDailyChart() {
        if (!dom.dailyChart) return;
        const counts = data.getDailyData();
        const max = Math.max(...counts, 1);

        let startHour = 6;
        let endHour = 23;
        for (let i = 0; i < 24; i++) {
            if (counts[i] > 0 && i < startHour) startHour = Math.max(0, i);
            if (counts[i] > 0 && i > endHour) endHour = Math.min(23, i);
        }

        let html = '<div class="chart-container daily-chart-container">';
        for (let i = startHour; i <= endHour; i++) {
            const count = counts[i];
            const height = (count / max) * 100;
            const barClass = count > 0 ? 'has-data' : '';
            html += `
                <div class="chart-bar-wrapper">
                    <div class="chart-bar ${barClass}" style="height: ${height}%">
                        ${count > 0 ? `<span class="chart-bar-value">${count}</span>` : ''}
                    </div>
                    <span class="chart-bar-label small">${HOUR_LABELS[i]}</span>
                </div>
            `;
        }
        html += '</div>';
        dom.dailyChart.innerHTML = html;
    }

    function renderWeeklyChart() {
        if (!dom.weeklyChart) return;
        const counts = data.getWeeklyData();
        const max = Math.max(...counts, 1);

        let html = '<div class="chart-container">';
        counts.forEach((count, index) => {
            const height = (count / max) * 100;
            const barClass = count > 0 ? 'has-data' : '';
            html += `
                <div class="chart-bar-wrapper">
                    <div class="chart-bar ${barClass}" style="height: ${height}%">
                        ${count > 0 ? `<span class="chart-bar-value">${count}</span>` : ''}
                    </div>
                    <span class="chart-bar-label">${DAY_NAMES[index]}</span>
                </div>
            `;
        });
        html += '</div>';
        dom.weeklyChart.innerHTML = html;
    }

    function renderHeatmap() {
        if (!dom.heatmapGrid) return;
        const heatmapData = data.getHeatmapData();

        let html = '<div class="heatmap-container">';
        html += '<div class="heatmap-header">';
        DAY_NAMES.forEach(d => {
            html += `<span class="heatmap-day-label">${d}</span>`;
        });
        html += '</div>';

        html += '<div class="heatmap-cells">';
        heatmapData.forEach(day => {
            const intensity = Math.min(day.count, 4);
            const tooltipDate = new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            html += `
                <div class="heatmap-cell intensity-${intensity}" 
                     title="${tooltipDate}: ${day.count} session${day.count !== 1 ? 's' : ''}">
                </div>
            `;
        });
        html += '</div></div>';

        html += `
            <div class="heatmap-legend">
                <span>Less</span>
                <div class="heatmap-cell intensity-0"></div>
                <div class="heatmap-cell intensity-1"></div>
                <div class="heatmap-cell intensity-2"></div>
                <div class="heatmap-cell intensity-3"></div>
                <div class="heatmap-cell intensity-4"></div>
                <span>More</span>
            </div>
        `;

        dom.heatmapGrid.innerHTML = html;
    }

    function renderSessionHistory() {
        if (!dom.sessionHistoryList) return;
        const history = [...gamification.sessionHistory].reverse().slice(0, 10);

        if (history.length === 0) {
            dom.sessionHistoryList.innerHTML = '<p class="empty-history">Complete a session to see history here!</p>';
            return;
        }

        let html = '';
        history.forEach(session => {
            const timeAgo = data.formatTimeAgo(session.timestamp);
            const date = new Date(session.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            html += `
                <div class="history-item">
                    <div class="history-icon">🍅</div>
                    <div class="history-info">
                        <span class="history-time">${timeStr}</span>
                        <span class="history-duration">${session.duration} min focus</span>
                    </div>
                    <span class="history-ago">${timeAgo}</span>
                </div>
            `;
        });

        dom.sessionHistoryList.innerHTML = html;
    }

    function renderBestDay() {
        if (!dom.bestDayValue || !dom.bestDayDate) return;

        if (gamification.bestDay.count === 0) {
            dom.bestDayValue.textContent = '—';
            dom.bestDayDate.textContent = 'Complete sessions to set a record';
            return;
        }

        dom.bestDayValue.textContent = `${gamification.bestDay.count} sessions`;
        const bestDate = new Date(gamification.bestDay.date);
        const today = new Date();
        const isToday = data.formatDateKey(bestDate) === data.formatDateKey(today);
        dom.bestDayDate.textContent = isToday ? 'Today! 🔥' : data.formatDate(gamification.bestDay.date);
    }

    function renderTotalFocusTime() {
        if (!dom.totalFocusTime) return;
        dom.totalFocusTime.textContent = data.getTotalFocusHours();
    }

    function updateAll() {
        renderDailyChart();
        renderWeeklyChart();
        renderHeatmap();
        renderSessionHistory();
        renderBestDay();
        renderTotalFocusTime();
    }

    return {
        renderDailyChart,
        renderWeeklyChart,
        renderHeatmap,
        renderSessionHistory,
        renderBestDay,
        renderTotalFocusTime,
        updateAll
    };
})();

