# Pomodoro Timer - Completed Tasks

## Bug Fixes
- [x] Fix auto-start timer bug — timer now resets `isRunning = false` before `start()` on session switch
- [x] Fix timer UI overlap — added responsive `.timer-progress-ring` sizes (300px→240px→200px)
- [x] Add session persistence across reloads — save/load timer state to localStorage every 10s + on control changes

## Task Folders
- [x] Add `taskFolders` and `activeFolderId` to app state
- [x] Rewrite `js/tasks.js` with full folder support:
  - Create, rename (right-click), delete folders
  - Folder tabs with active state and pending task badges
  - Tasks scoped to active folder
  - Move tasks between folders
  - Legacy task migration to "General" folder
  - Full persistence to localStorage
- [x] Add `folder-tabs` UI to `index.html`
- [x] Add `folderTabs` DOM reference in `js/dom.js`
- [x] Add folder tab + delete button styles in `css/tasks.css`
- [x] Sync active task badge to timer session label on session switches

## Analytics (from previous work)
- [x] Daily focus chart (hourly breakdown)
- [x] Weekly focus chart
- [x] Activity heatmap (28 days)
- [x] Best day tracking
- [x] Total focus time
- [x] Session history

## Focus Environment (from previous work)
- [x] Custom Spotify playlist support
- [x] Custom SoundCloud playlist support
- [x] Ambient sounds
- [x] Themes

