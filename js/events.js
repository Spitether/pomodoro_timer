window.Pomodoro = window.Pomodoro || {};

Pomodoro.events = (function() {
    'use strict';

    const dom = Pomodoro.dom;
    const timer = Pomodoro.timer;
    const state = Pomodoro.state;

    function toggleSidebarTab(tabName) {
        document.querySelectorAll('.sidebar-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sidebar === tabName);
            btn.setAttribute('aria-selected', String(btn.dataset.sidebar === tabName));
        });
        
        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            if (panel.id === 'badges-panel') {
                panel.classList.toggle('hidden', tabName !== 'achievements');
            } else if (panel.id === 'analytics-panel') {
                panel.classList.toggle('hidden', tabName !== 'analytics');
            }
        });
    }

    function init() {
        dom.startBtn.addEventListener('click', timer.start);
        dom.pauseBtn.addEventListener('click', timer.pause);
        dom.resetBtn.addEventListener('click', timer.reset);

        dom.themeToggle.addEventListener('click', Pomodoro.theme.toggle);
        dom.settingsBtn.addEventListener('click', Pomodoro.settings.open);
        dom.closeModal.addEventListener('click', Pomodoro.settings.close);
        dom.saveSettings.addEventListener('click', Pomodoro.settings.save);

        // Sidebar tab switching
        document.querySelectorAll('.sidebar-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleSidebarTab(btn.dataset.sidebar);
            });
        });

        if (dom.taskAddBtn) {
            dom.taskAddBtn.addEventListener('click', () => {
                Pomodoro.tasks.add(dom.taskInput.value);
                dom.taskInput.value = '';
            });
        }

        if (dom.taskInput) {
            dom.taskInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    Pomodoro.tasks.add(dom.taskInput.value);
                    dom.taskInput.value = '';
                }
            });
        }

        if (dom.ambientVolumeSlider) {
            dom.ambientVolumeSlider.addEventListener('input', (e) => {
                Pomodoro.focusAmbient.setVolume(e.target.value);
            });
        }

        document.querySelectorAll('.music-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Pomodoro.focusMusic.showMusicTab(btn.dataset.tab);
            });
        });

        if (dom.spotifyLoadBtn) {
            dom.spotifyLoadBtn.addEventListener('click', () => {
                Pomodoro.focusMusic.loadSpotifyPlaylist(dom.spotifyUrlInput.value);
            });
        }

        if (dom.spotifyUrlInput) {
            dom.spotifyUrlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    Pomodoro.focusMusic.loadSpotifyPlaylist(dom.spotifyUrlInput.value);
                }
            });
        }

        if (dom.soundcloudLoadBtn) {
            dom.soundcloudLoadBtn.addEventListener('click', () => {
                Pomodoro.focusMusic.loadSoundcloudPlaylist(dom.soundcloudUrlInput.value);
            });
        }

        if (dom.soundcloudUrlInput) {
            dom.soundcloudUrlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    Pomodoro.focusMusic.loadSoundcloudPlaylist(dom.soundcloudUrlInput.value);
                }
            });
        }

        if (dom.spotifyResetBtn) {
            dom.spotifyResetBtn.addEventListener('click', () => {
                Pomodoro.focusMusic.resetSpotify();
            });
        }

        if (dom.soundcloudResetBtn) {
            dom.soundcloudResetBtn.addEventListener('click', () => {
                Pomodoro.focusMusic.resetSoundcloud();
            });
        }

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
