window.Pomodoro = window.Pomodoro || {};

Pomodoro.events = (function() {
    'use strict';

    const dom = Pomodoro.dom;
    const timer = Pomodoro.timer;
    const state = Pomodoro.state;

    function toggleAchievements() {
        const isExpanded = dom.badgesToggleBtn.getAttribute('aria-expanded') === 'true';
        dom.badgesToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        dom.badgesPanel.classList.toggle('hidden');
    }

    function toggleAnalytics() {
        const isExpanded = dom.analyticsToggleBtn.getAttribute('aria-expanded') === 'true';
        dom.analyticsToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        dom.analyticsPanel.classList.toggle('hidden');
    }

    function init() {
        dom.startBtn.addEventListener('click', timer.start);
        dom.pauseBtn.addEventListener('click', timer.pause);
        dom.resetBtn.addEventListener('click', timer.reset);

        dom.themeToggle.addEventListener('click', Pomodoro.theme.toggle);
        dom.settingsBtn.addEventListener('click', Pomodoro.settings.open);
        dom.closeModal.addEventListener('click', Pomodoro.settings.close);
        dom.saveSettings.addEventListener('click', Pomodoro.settings.save);
        dom.badgesToggleBtn.addEventListener('click', toggleAchievements);
        dom.analyticsToggleBtn.addEventListener('click', toggleAnalytics);

        dom.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (state.isRunning) {
                    if (!confirm('Timer is running. Switch session?')) return;
                    timer.pause();
                }
                timer.switchSession(btn.dataset.session);
            });
        });

        dom.settingsModal.addEventListener('click', (e) => {
            if (e.target === dom.settingsModal) {
                Pomodoro.settings.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input')) {
                e.preventDefault();
                state.isRunning ? timer.pause() : timer.start();
            }
            if (e.code === 'Escape') {
                Pomodoro.settings.close();
            }
        });
    }

    return { init };
})();
