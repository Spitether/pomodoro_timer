

window.Pomodoro = window.Pomodoro || {};

Pomodoro.state = {
    timeRemaining: 25 * 60,
    isRunning: false,
    currentSession: 'work',
    workSessionsCompleted: 0,
    intervalId: null,
    settings: {
        work: 25,
        shortBreak: 5,
        longBreak: 15,
        autoCycle: true,
        soundEnabled: true
    },
    darkMode: false,
    theme: 'default',
    focusEnvironment: {
        ambientSound: null,
        ambientVolume: 0.5,
        musicSource: null,
        customSpotifyUrl: '',
        customSoundcloudUrl: ''
    },
    tasks: [],
    activeTaskId: null,
    taskFolders: [
        { id: 'folder_default', name: 'General', createdAt: new Date().toISOString() }
    ],
    activeFolderId: 'folder_default',
    gamification: {
        totalXP: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        todaySessions: 0,
        totalSessions: 0,
        dailyGoalCompleted: false,
        maxDailySessions: 0,
        nightOwl: false,
        earlyBird: false,
        earnedBadges: [],
        dailyGoalTarget: 6,
        sessionHistory: [],
        bestDay: { date: null, count: 0 }
    },
    shield: {
        enabled: true,
        strictMode: false,
        distractionThreshold: 10,
        penaltyEnabled: true,
        penaltyXP: 5
    },
    shieldStats: {
        distractionsToday: 0,
        totalTimeAway: 0,
        lastDistractionAt: null
    }
};

Pomodoro.sessionConfig = {
    work: {
        label: 'Work Session',
        next: 'shortBreak',
        countAsWork: true
    },
    shortBreak: {
        label: 'Short Break',
        next: 'work',
        countAsWork: false
    },
    longBreak: {
        label: 'Long Break',
        next: 'work',
        countAsWork: false
    }
};

