# Pomodoro Redesign Plan

## Completed Changes

### ✅ XP Formula Based on Session Ratio
- **Modified `js/gamification/config.js`**: Added `XP_BASE: 10`, `WORK_XP_PER_MINUTE: 2`, `BREAK_XP_PENALTY_PER_MINUTE: 0.5`
- **Modified `js/gamification/core.js`**: Added dynamic XP calculation based on work/break duration
  - Work session XP: `10 + (workMinutes * 2)` - longer work = more XP
  - Break session XP: `10 - (breakMinutes * 0.5)` - shorter break = more XP

### ✅ Sidebar for Achievements & Analytics
- **Modified `index.html`**: Added sidebar with tabs for Achievements and Analytics
- **Modified `css/layout.css`**: Created sidebar layout with flexbox
- Sidebar shows on desktop (right side), stacks below on mobile (<900px)

### ✅ Reordered Main Content
- **Modified `index.html`**: Timer → Tasks → Focus Environment (always visible)
- Tasks and Focus are now directly under Timer, no longer collapsible

### ✅ Profile Card in Sidebar
- **Modified `index.html`**: Moved profile card (character, level, XP, stats) to sidebar
- Sits at top of sidebar, always visible

### ✅ Updated Events Handler
- **Modified `js/events.js`**: Replaced toggle functions with sidebar tab switching

---

## Files Modified
1. `js/gamification/config.js` - XP configuration
2. `js/gamification/core.js` - XP calculation logic
3. `index.html` - HTML structure with sidebar
4. `css/layout.css` - Sidebar and layout styles
5. `js/events.js` - Event handlers for sidebar tabs

---

## XP Formula Explanation
With default settings (25min work, 5min short break, 15min long break):
- **Work session**: 10 + (25 × 2) = 60 XP
- **Short break**: 10 - (5 × 0.5) = 7.5 → 8 XP
- **Long break**: 10 - (15 × 0.5) = 2.5 → 3 XP

Longer work sessions and shorter breaks reward more XP!
