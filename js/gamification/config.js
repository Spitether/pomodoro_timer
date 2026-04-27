window.Pomodoro = window.Pomodoro || {};

Pomodoro.GamificationConfig = {
    XP_PER_SESSION: 25,
    DAILY_GOAL_TARGET: 6,

    LEVEL_TITLES: [
        'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5',
        'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10'
    ],

    CHARACTER_AVATARS: ['👤', '👤', '👤', '👤', '👤', '👤', '👤', '👤', '👤', '👤'],

    BADGES: [
        { id: 'first_session', name: 'First Step', icon: '👣', desc: 'Complete your first Pomodoro', condition: (s) => s.totalSessions >= 1 },
        { id: 'ten_sessions', name: 'Getting Started', icon: '🔥', desc: 'Complete 10 Pomodoros', condition: (s) => s.totalSessions >= 10 },
        { id: 'fifty_sessions', name: 'On Fire', icon: '⚡', desc: 'Complete 50 Pomodoros', condition: (s) => s.totalSessions >= 50 },
        { id: 'hundred_sessions', name: 'Centurion', icon: '🏆', desc: 'Complete 100 Pomodoros', condition: (s) => s.totalSessions >= 100 },
        { id: 'three_day_streak', name: 'Consistent', icon: '📅', desc: '3-day streak', condition: (s) => s.streak >= 3 },
        { id: 'seven_day_streak', name: 'Unstoppable', icon: '🔥', desc: '7-day streak', condition: (s) => s.streak >= 7 },
        { id: 'thirty_day_streak', name: 'Legend', icon: '👑', desc: '30-day streak', condition: (s) => s.streak >= 30 },
        { id: 'daily_goal', name: 'Goal Crusher', icon: '🎯', desc: 'Complete daily goal', condition: (s) => s.dailyGoalCompleted },
        { id: 'level_5', name: 'Rising Star', icon: '⭐', desc: 'Reach level 5', condition: (s) => s.level >= 5 },
        { id: 'level_10', name: 'Master', icon: '💎', desc: 'Reach level 10', condition: (s) => s.level >= 10 },
        { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Complete a session after 10 PM', condition: (s) => s.nightOwl },
        { id: 'early_bird', name: 'Early Bird', icon: '🐦', desc: 'Complete a session before 7 AM', condition: (s) => s.earlyBird },
        { id: 'deep_focus', name: 'Deep Focus', icon: '🧠', desc: 'Complete 4 Pomodoros in one day', condition: (s) => s.maxDailySessions >= 4 },
        { id: 'marathon', name: 'Marathon', icon: '🏃', desc: 'Complete 12 Pomodoros in one day', condition: (s) => s.maxDailySessions >= 12 }
    ]
};

