window.Pomodoro = window.Pomodoro || {};

Pomodoro.audio = (function() {
    'use strict';

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Ambient sound nodes (persist while playing)
    let ambientNodes = null;
    let cafeAudio = null;

    function playAlert() {
        if (!Pomodoro.state.settings.soundEnabled) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // First beep
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.setValueAtTime(1100, now + 0.15);
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc1.start(now);
        osc1.stop(now + 0.4);

        // Second beep
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1100, now + 0.5);
        osc2.frequency.setValueAtTime(1320, now + 0.65);
        gain2.gain.setValueAtTime(0, now + 0.5);
        gain2.gain.linearRampToValueAtTime(0.3, now + 0.55);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
        osc2.start(now + 0.5);
        osc2.stop(now + 0.9);
    }

    // ============ AMBIENT SOUNDS ============

    function createNoiseBuffer() {
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    function createPinkNoiseBuffer() {
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
        }
        return buffer;
    }

    function playAmbient(type, volume) {
        stopAmbient();

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const masterGain = audioCtx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(audioCtx.destination);

        if (type === 'white') {
            const buffer = createNoiseBuffer();
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 8000;

            source.connect(filter);
            filter.connect(masterGain);
            source.start();

            ambientNodes = { source, masterGain };
        }
        else if (type === 'rain') {
            const buffer = createPinkNoiseBuffer();
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 600;
            filter.Q.value = 0.5;

            // Amplitude modulation for rain texture
            const lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 12;
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 0.15;
            lfo.connect(lfoGain);

            const rainGain = audioCtx.createGain();
            rainGain.gain.value = 1;
            lfoGain.connect(rainGain.gain);

            source.connect(filter);
            filter.connect(rainGain);
            rainGain.connect(masterGain);
            lfo.start();
            source.start();

            ambientNodes = { source, masterGain, lfo };
        }
        else if (type === 'cafe') {
            // Play real café ambiance MP3
            cafeAudio = new Audio('audio/Cafe.mp3');
            cafeAudio.loop = true;
            cafeAudio.volume = 1;

            const source = audioCtx.createMediaElementSource(cafeAudio);
            source.connect(masterGain);

            cafeAudio.play().catch(e => console.log('Café audio play failed:', e));

            ambientNodes = { source, masterGain, cafeAudio };
        }
    }

    function stopAmbient() {
        if (!ambientNodes) return;
        try {
            if (ambientNodes.lfo) ambientNodes.lfo.stop();
            if (ambientNodes.source) ambientNodes.source.stop();
            if (ambientNodes.cafeAudio) {
                ambientNodes.cafeAudio.pause();
                ambientNodes.cafeAudio.currentTime = 0;
            }
        } catch (e) {
            // Already stopped
        }
        ambientNodes = null;
    }

    function setAmbientVolume(volume) {
        if (ambientNodes && ambientNodes.masterGain) {
            ambientNodes.masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
        }
    }

    function isAmbientPlaying() {
        return ambientNodes !== null;
    }

    return {
        playAlert,
        playAmbient,
        stopAmbient,
        setAmbientVolume,
        isAmbientPlaying
    };
})();

