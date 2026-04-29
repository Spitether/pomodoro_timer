# Daily Work Session Reset

## Plan
1. [ ] Add `todayWorkSessions: 0` to state.gamification
2. [ ] Modify timer.js: increment `todayWorkSessions` instead of `workSessionsCompleted` for display
3. [ ] Keep `totalSessions` increment for permanent stats
4. [ ] Add resetDailyWorkSessions() to streaks.js using existing date check
5. [ ] Update app.js to call resetDailyWorkSessions()
6. [ ] Update session persistence to save only `workSessionsCompleted` for totals
7. [ ] Test: counter resets daily, totals persist

