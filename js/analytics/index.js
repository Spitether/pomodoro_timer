window.Pomodoro = window.Pomodoro || {};

Pomodoro.analytics = (function() {
    'use strict';

    const data = Pomodoro.analyticsData;
    const render = Pomodoro.analyticsRender;

    function logSession() {
        data.logSession();
    }

    function updateAll() {
        render.updateAll();
    }

    return {
        logSession,
        updateAll,
        getWeeklyData: data.getWeeklyData,
        getHeatmapData: data.getHeatmapData,
        getTotalFocusHours: data.getTotalFocusHours
    };
})();

