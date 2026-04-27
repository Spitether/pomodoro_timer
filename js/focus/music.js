window.Pomodoro = window.Pomodoro || {};

Pomodoro.focusMusic = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;

    const DEFAULT_SPOTIFY_URL = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo?utm_source=generator&theme=0';
    const DEFAULT_SOUNDCLOUD_URL = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1472378785&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true';

    function showMusicTab(tab) {
        state.focusEnvironment.musicSource = tab;

        const spotifyContent = document.getElementById('spotify-tab-content');
        const soundcloudContent = document.getElementById('soundcloud-tab-content');

        if (spotifyContent) spotifyContent.classList.toggle('hidden', tab !== 'spotify');
        if (soundcloudContent) soundcloudContent.classList.toggle('hidden', tab !== 'soundcloud');

        document.querySelectorAll('.music-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        Pomodoro.focusEnv.savePreferences();
    }

    function loadSpotifyPlaylist(url) {
        if (!url || !dom.spotifyIframe) return;

        const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
        if (!match) {
            alert('Invalid Spotify URL. Please paste a link like:\nhttps://open.spotify.com/playlist/PLAYLIST_ID');
            return;
        }

        const type = match[1];
        const id = match[2];
        const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;

        dom.spotifyIframe.src = embedUrl;
        state.focusEnvironment.customSpotifyUrl = url;
        Pomodoro.focusEnv.savePreferences();
    }

    function loadSoundcloudPlaylist(url) {
        if (!url || !dom.soundcloudIframe) return;

        const encodedUrl = encodeURIComponent(url);
        const embedUrl = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

        dom.soundcloudIframe.src = embedUrl;
        state.focusEnvironment.customSoundcloudUrl = url;
        Pomodoro.focusEnv.savePreferences();
    }

    function resetSpotify() {
        if (dom.spotifyIframe) dom.spotifyIframe.src = DEFAULT_SPOTIFY_URL;
        state.focusEnvironment.customSpotifyUrl = '';
        if (dom.spotifyUrlInput) dom.spotifyUrlInput.value = '';
        Pomodoro.focusEnv.savePreferences();
    }

    function resetSoundcloud() {
        if (dom.soundcloudIframe) dom.soundcloudIframe.src = DEFAULT_SOUNDCLOUD_URL;
        state.focusEnvironment.customSoundcloudUrl = '';
        if (dom.soundcloudUrlInput) dom.soundcloudUrlInput.value = '';
        Pomodoro.focusEnv.savePreferences();
    }

    function restoreCustomPlaylists() {
        if (state.focusEnvironment.customSpotifyUrl && dom.spotifyUrlInput) {
            dom.spotifyUrlInput.value = state.focusEnvironment.customSpotifyUrl;
            loadSpotifyPlaylist(state.focusEnvironment.customSpotifyUrl);
        }
        if (state.focusEnvironment.customSoundcloudUrl && dom.soundcloudUrlInput) {
            dom.soundcloudUrlInput.value = state.focusEnvironment.customSoundcloudUrl;
            loadSoundcloudPlaylist(state.focusEnvironment.customSoundcloudUrl);
        }
    }

    return {
        showMusicTab,
        loadSpotifyPlaylist,
        loadSoundcloudPlaylist,
        resetSpotify,
        resetSoundcloud,
        restoreCustomPlaylists
    };
})();

