window.Pomodoro = window.Pomodoro || {};

Pomodoro.focusAmbient = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;
    const audio = Pomodoro.audio;

    const AMBIENT_SOUNDS = [
        { id: 'rain', name: 'Rain', icon: '🌧️' },
        { id: 'cafe', name: 'Café', icon: '☕' },
        { id: 'minecraft', name: 'Minecraft', icon: '⛏️' }
    ];

    function renderAmbientControls() {
        if (!dom.ambientControls) return;

        let html = '';
        AMBIENT_SOUNDS.forEach(sound => {
            const isActive = state.focusEnvironment.ambientSound === sound.id && audio.isAmbientPlaying();
            html += `
                <div class="ambient-sound-item" data-sound="${sound.id}">
                    <button class="ambient-play-btn ${isActive ? 'playing' : ''}" aria-label="Play ${sound.name}">
                        <span class="ambient-icon">${sound.icon}</span>
                        <span class="ambient-play-icon">${isActive ? '⏸' : '▶'}</span>
                    </button>
                    <span class="ambient-name">${sound.name}</span>
                </div>
            `;
        });
        dom.ambientControls.innerHTML = html;

        dom.ambientControls.querySelectorAll('.ambient-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const soundId = btn.closest('.ambient-sound-item').dataset.sound;
                toggleAmbient(soundId);
            });
        });
    }

    function toggleAmbient(soundId) {
        const current = state.focusEnvironment.ambientSound;

        if (current === soundId && audio.isAmbientPlaying()) {
            audio.stopAmbient();
            state.focusEnvironment.ambientSound = null;
        } else {
            audio.playAmbient(soundId, state.focusEnvironment.ambientVolume);
            state.focusEnvironment.ambientSound = soundId;
        }

        updateAmbientUI();
        Pomodoro.focusEnv.savePreferences();
    }

    function setVolume(value) {
        state.focusEnvironment.ambientVolume = parseFloat(value);
        audio.setAmbientVolume(state.focusEnvironment.ambientVolume);
        Pomodoro.focusEnv.savePreferences();
    }

    function updateAmbientUI() {
        if (!dom.ambientControls) return;

        const currentSound = state.focusEnvironment.ambientSound;
        const isPlaying = audio.isAmbientPlaying();

        dom.ambientControls.querySelectorAll('.ambient-sound-item').forEach(item => {
            const btn = item.querySelector('.ambient-play-btn');
            const playIcon = item.querySelector('.ambient-play-icon');
            const soundId = item.dataset.sound;

            const active = soundId === currentSound && isPlaying;
            btn.classList.toggle('playing', active);
            playIcon.textContent = active ? '⏸' : '▶';
        });

        if (dom.ambientVolumeSlider) {
            dom.ambientVolumeSlider.value = state.focusEnvironment.ambientVolume;
        }
    }

    return {
        renderAmbientControls,
        toggleAmbient,
        setVolume,
        updateAmbientUI
    };
})();

