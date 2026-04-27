window.Pomodoro = window.Pomodoro || {};

Pomodoro.tasks = (function() {
    'use strict';

    const state = Pomodoro.state;
    const dom = Pomodoro.dom;

    let nextTaskId = 1;
    let nextFolderId = 1;

    function init() {
        loadData();
        migrateLegacyTasks();
        renderFolders();
        render();
    }

    function generateTaskId() {
        return 'task_' + Date.now() + '_' + (nextTaskId++);
    }

    function generateFolderId() {
        return 'folder_' + Date.now() + '_' + (nextFolderId++);
    }

    // ---- Folders ----

    function addFolder(name) {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (state.taskFolders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) return;

        const folder = {
            id: generateFolderId(),
            name: trimmed,
            createdAt: new Date().toISOString()
        };
        state.taskFolders.push(folder);
        state.activeFolderId = folder.id;
        saveData();
        renderFolders();
        render();
    }

    function renameFolder(folderId, newName) {
        const folder = state.taskFolders.find(f => f.id === folderId);
        if (!folder || folder.id === 'folder_default') return;
        const trimmed = newName.trim();
        if (!trimmed) return;
        if (state.taskFolders.some(f => f.id !== folderId && f.name.toLowerCase() === trimmed.toLowerCase())) return;

        folder.name = trimmed;
        saveData();
        renderFolders();
    }

    function deleteFolder(folderId) {
        if (folderId === 'folder_default') return;
        state.taskFolders = state.taskFolders.filter(f => f.id !== folderId);

        // Move or delete tasks in this folder
        const tasksInFolder = state.tasks.filter(t => t.folderId === folderId);
        tasksInFolder.forEach(t => {
            t.folderId = 'folder_default';
        });

        if (state.activeFolderId === folderId) {
            state.activeFolderId = 'folder_default';
        }

        saveData();
        renderFolders();
        render();
    }

    function setActiveFolder(folderId) {
        if (!state.taskFolders.find(f => f.id === folderId)) return;
        state.activeFolderId = folderId;
        saveData();
        renderFolders();
        render();
    }

    function getActiveFolder() {
        return state.taskFolders.find(f => f.id === state.activeFolderId) || state.taskFolders[0];
    }

    // ---- Tasks ----

    function add(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const task = {
            id: generateTaskId(),
            text: trimmed,
            completed: false,
            sessionsCompleted: 0,
            targetSessions: 4,
            folderId: state.activeFolderId,
            createdAt: new Date().toISOString()
        };

        state.tasks.push(task);
        if (!state.activeTaskId) {
            state.activeTaskId = task.id;
        }

        saveData();
        render();
    }

    function toggleComplete(taskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        saveData();
        render();
    }

    function remove(taskId) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        if (state.activeTaskId === taskId) {
            state.activeTaskId = state.tasks.length > 0 ? state.tasks[0].id : null;
        }
        saveData();
        render();
    }

    function setActive(taskId) {
        if (!state.tasks.find(t => t.id === taskId)) return;
        state.activeTaskId = taskId;
        saveData();
        render();
    }

    function setTarget(taskId, target) {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;
        task.targetSessions = Math.max(1, Math.min(50, parseInt(target, 10) || 4));
        saveData();
        render();
    }

    function moveTaskToFolder(taskId, folderId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || !state.taskFolders.find(f => f.id === folderId)) return;
        task.folderId = folderId;
        saveData();
        render();
    }

    function onSessionComplete() {
        if (!state.activeTaskId) return;

        const task = state.tasks.find(t => t.id === state.activeTaskId);
        if (!task || task.completed) return;

        task.sessionsCompleted++;
        if (task.sessionsCompleted >= task.targetSessions) {
            task.completed = true;
        }
        saveData();
        render();
    }

    function getActiveTask() {
        if (!state.activeTaskId) return null;
        return state.tasks.find(t => t.id === state.activeTaskId) || null;
    }

    // ---- Persistence ----

    function saveData() {
        localStorage.setItem('pomodoroTasks', JSON.stringify({
            tasks: state.tasks,
            activeTaskId: state.activeTaskId,
            taskFolders: state.taskFolders,
            activeFolderId: state.activeFolderId,
            nextTaskId: nextTaskId,
            nextFolderId: nextFolderId
        }));
    }

    function loadData() {
        const saved = localStorage.getItem('pomodoroTasks');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.tasks) state.tasks = parsed.tasks;
                if (parsed.activeTaskId !== undefined) state.activeTaskId = parsed.activeTaskId;
                if (parsed.taskFolders) state.taskFolders = parsed.taskFolders;
                if (parsed.activeFolderId) state.activeFolderId = parsed.activeFolderId;
                if (parsed.nextTaskId) nextTaskId = parsed.nextTaskId;
                if (parsed.nextFolderId) nextFolderId = parsed.nextFolderId;
            } catch (e) {
                console.error('Failed to load tasks:', e);
            }
        }
    }

    function migrateLegacyTasks() {
        // If tasks exist without folderId, assign them to General
        let migrated = false;
        state.tasks.forEach(task => {
            if (!task.folderId) {
                task.folderId = 'folder_default';
                migrated = true;
            }
        });
        if (migrated) saveData();

        // Ensure at least General folder exists
        if (!state.taskFolders || state.taskFolders.length === 0) {
            state.taskFolders = [
                { id: 'folder_default', name: 'General', createdAt: new Date().toISOString() }
            ];
            state.activeFolderId = 'folder_default';
            saveData();
        }
    }

    // ---- Rendering ----

    function renderFolders() {
        const container = document.getElementById('folder-tabs');
        if (!container) return;

        let html = '';
        state.taskFolders.forEach(folder => {
            const isActive = folder.id === state.activeFolderId;
            const taskCount = state.tasks.filter(t => t.folderId === folder.id && !t.completed).length;
            const isDefault = folder.id === 'folder_default';
            html += `
                <button class="folder-tab ${isActive ? 'active' : ''}" data-folder-id="${folder.id}">
                    <span class="folder-name">${escapeHtml(folder.name)}</span>
                    ${taskCount > 0 ? `<span class="folder-badge">${taskCount}</span>` : ''}
                    ${!isDefault ? `<span class="folder-delete" data-folder-del="${folder.id}" title="Delete folder">×</span>` : ''}
                </button>
            `;
        });
        html += `
            <button class="folder-tab folder-add-btn" id="folder-add-btn" title="New folder">+</button>
        `;
        container.innerHTML = html;

        // Attach listeners
        container.querySelectorAll('.folder-tab[data-folder-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('folder-delete')) return;
                setActiveFolder(btn.dataset.folderId);
            });
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const folderId = btn.dataset.folderId;
                if (folderId === 'folder_default') return;
                const newName = prompt('Rename folder:', state.taskFolders.find(f => f.id === folderId)?.name || '');
                if (newName !== null) renameFolder(folderId, newName);
            });
        });

        container.querySelectorAll('.folder-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const folderId = btn.dataset.folderDel;
                if (folderId === 'folder_default') return;
                const folder = state.taskFolders.find(f => f.id === folderId);
                if (confirm(`Delete "${folder?.name || ''}" folder? Tasks will move to General.`)) {
                    deleteFolder(folderId);
                }
            });
        });

        const addBtn = document.getElementById('folder-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const name = prompt('Folder name:');
                if (name) addFolder(name);
            });
        }
    }

    function render() {
        if (!dom.taskList) return;

        const folder = getActiveFolder();
        const folderTasks = state.tasks.filter(t => t.folderId === folder.id);

        // Update task count badge
        if (dom.tasksCount) {
            const completed = state.tasks.filter(t => t.completed).length;
            dom.tasksCount.textContent = `${completed}/${state.tasks.length}`;
        }

        if (folderTasks.length === 0) {
            dom.taskList.innerHTML = '<p class="empty-tasks">Add a task to start focusing!</p>';
            renderActiveTaskBadge();
            return;
        }

        let html = '';
        folderTasks.forEach(task => {
            const isActive = task.id === state.activeTaskId;
            const progressPct = Math.min((task.sessionsCompleted / task.targetSessions) * 100, 100);
            const progressText = `${task.sessionsCompleted}/${task.targetSessions}`;

            html += `
                <div class="task-item ${task.completed ? 'completed' : ''} ${isActive ? 'active' : ''}" data-task-id="${task.id}">
                    <div class="task-row">
                        <button class="task-checkbox ${task.completed ? 'checked' : ''}" aria-label="Toggle complete">
                            ${task.completed ? '✓' : ''}
                        </button>
                        <div class="task-content">
                            <span class="task-text">${escapeHtml(task.text)}</span>
                            <div class="task-meta">
                                <span class="task-progress-text">${progressText} sessions</span>
                                ${isActive ? '<span class="task-active-badge">● Active</span>' : ''}
                            </div>
                        </div>
                        <div class="task-actions">
                            ${!task.completed ? `
                                <button class="task-target-btn" title="Set target sessions">🎯</button>
                                ${!isActive ? `<button class="task-activate-btn" title="Focus on this task">▶</button>` : ''}
                            ` : ''}
                            <button class="task-move-btn" title="Move to folder">📁</button>
                            <button class="task-delete-btn" title="Delete task">🗑</button>
                        </div>
                    </div>
                    <div class="task-progress-bar-container">
                        <div class="task-progress-bar" style="width: ${progressPct}%"></div>
                    </div>
                    <div class="task-target-editor hidden">
                        <label>Target sessions:</label>
                        <input type="number" class="task-target-input" min="1" max="50" value="${task.targetSessions}">
                        <button class="task-target-save">Save</button>
                    </div>
                    <div class="task-move-editor hidden">
                        <label>Move to:</label>
                        <select class="task-move-select">
                            ${state.taskFolders.map(f => `<option value="${f.id}" ${f.id === task.folderId ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
                        </select>
                        <button class="task-move-save">Move</button>
                    </div>
                </div>
            `;
        });

        dom.taskList.innerHTML = html;
        attachTaskListeners();
        renderActiveTaskBadge();
    }

    function renderActiveTaskBadge() {
        if (!dom.sessionLabel) return;
        const active = getActiveTask();
        const baseLabel = Pomodoro.sessionConfig[Pomodoro.state.currentSession].label;

        if (active && !active.completed && Pomodoro.state.currentSession === 'work') {
            dom.sessionLabel.innerHTML = `${baseLabel} <span class="task-inline-badge">📝 ${escapeHtml(active.text)}</span>`;
        } else {
            dom.sessionLabel.textContent = baseLabel;
        }
    }

    function attachTaskListeners() {
        dom.taskList.querySelectorAll('.task-item').forEach(item => {
            const taskId = item.dataset.taskId;

            item.querySelector('.task-checkbox')?.addEventListener('click', () => toggleComplete(taskId));
            item.querySelector('.task-delete-btn')?.addEventListener('click', () => remove(taskId));
            item.querySelector('.task-activate-btn')?.addEventListener('click', () => setActive(taskId));

            const targetBtn = item.querySelector('.task-target-btn');
            const targetEditor = item.querySelector('.task-target-editor');
            const targetSave = item.querySelector('.task-target-save');
            const targetInput = item.querySelector('.task-target-input');

            targetBtn?.addEventListener('click', () => {
                targetEditor.classList.toggle('hidden');
            });

            targetSave?.addEventListener('click', () => {
                setTarget(taskId, targetInput.value);
                targetEditor.classList.add('hidden');
            });

            targetInput?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    setTarget(taskId, targetInput.value);
                    targetEditor.classList.add('hidden');
                }
            });

            // Move to folder
            const moveBtn = item.querySelector('.task-move-btn');
            const moveEditor = item.querySelector('.task-move-editor');
            const moveSave = item.querySelector('.task-move-save');
            const moveSelect = item.querySelector('.task-move-select');

            moveBtn?.addEventListener('click', () => {
                moveEditor.classList.toggle('hidden');
            });

            moveSave?.addEventListener('click', () => {
                moveTaskToFolder(taskId, moveSelect.value);
                moveEditor.classList.add('hidden');
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    return {
        init,
        add,
        toggleComplete,
        remove,
        setActive,
        onSessionComplete,
        getActiveTask,
        renderActiveTaskBadge,
        addFolder,
        renameFolder,
        deleteFolder,
        setActiveFolder
    };
})();

