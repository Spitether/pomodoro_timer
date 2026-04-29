window.Pomodoro = window.Pomodoro || {};

Pomodoro.timer = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;
    const sessionConfig = Pomodoro.sessionConfig;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return {
            minutes: m.toString().padStart(2, '0'),
            seconds: s.toString().padStart(2, '0')
        };
    }

    function updateDisplay() {
        const formatted = formatTime(state.timeRemaining);
        dom.minutes.textContent = formatted.minutes;
        dom.seconds.textContent = formatted.seconds;
        document.title = `${formatted.minutes}:${formatted.seconds} - Pomodoro Timer`;
        updateProgressRing();
    }

    function updateProgressRing() {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;
        const totalDuration = state.settings[state.currentSession] * 60;
        const circumference = 339.292;
        const offset = (state.timeRemaining / totalDuration) * circumference;
        progressFill.style.strokeDashoffset = offset;
    }

    function updateModeColors() {
        const body = document.body;
        const ring = document.querySelector('.timer-progress-ring');
        const progressFill = document.querySelector('.progress-fill');
        const session = state.currentSession;

        // Remove all mode classes
        body.classList.remove('mode-work', 'mode-short-break', 'mode-long-break');
        body.classList.add(`mode-${session}`);

        // Set CSS custom properties for dynamic coloring
        let color, glow;
        if (session === 'work') {
            color = 'var(--work-color)';
            glow = 'var(--work-glow)';
        } else if (session === 'shortBreak') {
            color = 'var(--short-break-color)';
            glow = 'var(--short-break-glow)';
        } else {
            color = 'var(--long-break-color)';
            glow = 'var(--long-break-glow)';
        }

        if (ring) {
            ring.style.setProperty('--timer-color', color);
            ring.style.setProperty('--timer-glow', glow);
        }
        if (progressFill) {
            progressFill.style.stroke = color;
        }
    }

    function updateSessionUI() {
        const config = sessionConfig[state.currentSession];
        dom.sessionLabel.textContent = config.label;

        dom.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.session === state.currentSession);
        });

        updateModeColors();

        if (state.currentSession === 'work') {
            dom.sessionCount.textContent = `#${state.gamification.todayWorkSessions + 1}`;
            dom.sessionCount.style.display = 'inline';
        } else {
            dom.sessionCount.style.display = 'none';
        }


        // Update active task badge if tasks module is loaded
        if (Pomodoro.tasks && Pomodoro.tasks.renderActiveTaskBadge) {
            Pomodoro.tasks.renderActiveTaskBadge();
        }
    }

    function updateControls() {
        if (state.isRunning) {
            dom.startBtn.classList.add('hidden');
            dom.pauseBtn.classList.remove('hidden');
        } else {
            dom.startBtn.classList.remove('hidden');
            dom.pauseBtn.classList.add('hidden');
        }
    }

    function switchSession(sessionType) {
        state.currentSession = sessionType;
        state.timeRemaining = state.settings[sessionType] * 60;
        updateSessionUI();
        updateDisplay();
        saveSession();
    }

    function determineNextSession() {
        if (state.currentSession === 'work') {
            state.gamification.todayWorkSessions++;
            state.workSessionsCompleted++;
            if (state.workSessionsCompleted % 4 === 0) {
                return 'longBreak';
            }
            return 'shortBreak';
        }
        return sessionConfig[state.currentSession].next;
    }


    function onTimerComplete() {
        Pomodoro.audio.playAlert();

        if (state.currentSession === 'work') {
            const rect = dom.timerDisplay ? dom.timerDisplay.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
            Pomodoro.gamificationCore.onSessionComplete(rect.left + rect.width / 2, rect.top);
        }

        // Always auto-switch session
        const nextSession = determineNextSession();
        switchSession(nextSession);
        
        if (state.settings.autoCycle) {
            state.isRunning = false; // Reset so start() works
            start();
        } else {
            state.isRunning = false;
            updateControls();
        }
    }

    function tick() {
        if (state.timeRemaining > 0) {
            state.timeRemaining--;
            updateDisplay();
            // Save every 10 seconds while running
            if (state.timeRemaining % 10 === 0) {
                saveSession();
            }
        } else {
            clearInterval(state.intervalId);
            state.intervalId = null;
            onTimerComplete();
        }
    }

    function start() {
        if (state.isRunning) return;
        state.isRunning = true;
        updateControls();
        state.intervalId = setInterval(tick, 1000);
        saveSession();
    }

    function pause() {
        if (!state.isRunning) return;
        state.isRunning = false;
        clearInterval(state.intervalId);
        state.intervalId = null;
        updateControls();
        saveSession();
    }

    function reset() {
        pause();
        state.timeRemaining = state.settings[state.currentSession] * 60;
        updateDisplay();
        saveSession();
    }

    function saveSession() {
        const sessionData = {
            timeRemaining: state.timeRemaining,
            currentSession: state.currentSession,
            workSessionsCompleted: state.workSessionsCompleted, // Permanent total
            isRunning: state.isRunning,
            lastSaved: Date.now()
        };
        localStorage.setItem('pomodoroSession', JSON.stringify(sessionData));
    }


    function loadSession() {
        const saved = localStorage.getItem('pomodoroSession');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            // Only restore if saved within last 24 hours
            if (Date.now() - data.lastSaved > 86400000) {
                localStorage.removeItem('pomodoroSession');
                return false;
            }

            state.timeRemaining = data.timeRemaining;
            state.currentSession = data.currentSession || 'work';
            state.workSessionsCompleted = data.workSessionsCompleted || 0;
            // Don't restore todayWorkSessions - let streaks.resetDailyIfNeeded() handle it
            return true;

        } catch (e) {
            return false;
        }
    }

    return {
        start,
        pause,
        reset,
        updateDisplay,
        updateSessionUI,
        updateControls,
        switchSession,
        saveSession,
        loadSession
    };
})();

