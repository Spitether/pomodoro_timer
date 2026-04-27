window.Pomodoro = window.Pomodoro || {};

Pomodoro.focusEnv = (function() {
    'use strict';

    const state = Pomodoro.state;
    const themes = Pomodoro.focusThemes;
    const ambient = Pomodoro.focusAmbient;
    const music = Pomodoro.focusMusic;

    function init() {
        loadPreferences();
        themes.applyTheme(state.theme);
        themes.renderThemeGrid();
        ambient.renderAmbientControls();
        ambient.updateAmbientUI();
    }

    function savePreferences() {
        localStorage.setItem('pomodoroFocusEnv', JSON.stringify({
            theme: state.theme,
            ambientSound: state.focusEnvironment.ambientSound,
            ambientVolume: state.focusEnvironment.ambientVolume,
            musicSource: state.focusEnvironment.musicSource,
            customSpotifyUrl: state.focusEnvironment.customSpotifyUrl,
            customSoundcloudUrl: state.focusEnvironment.customSoundcloudUrl
        }));
    }

    function loadPreferences() {
        const saved = localStorage.getItem('pomodoroFocusEnv');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.theme) state.theme = parsed.theme;
                if (parsed.ambientVolume !== undefined) state.focusEnvironment.ambientVolume = parsed.ambientVolume;
                if (parsed.musicSource) state.focusEnvironment.musicSource = parsed.musicSource;
                if (parsed.customSpotifyUrl !== undefined) state.focusEnvironment.customSpotifyUrl = parsed.customSpotifyUrl;
                if (parsed.customSoundcloudUrl !== undefined) state.focusEnvironment.customSoundcloudUrl = parsed.customSoundcloudUrl;
                if (parsed.ambientSound) state.focusEnvironment.ambientSound = parsed.ambientSound;
            } catch (e) {
                console.error('Failed to load focus environment:', e);
            }
        }
    }

    return {
        init,
        savePreferences,
        loadPreferences
    };
})();

