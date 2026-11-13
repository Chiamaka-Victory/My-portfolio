/*
  ==========================================================================
  js/planner.js — Academic Task Manager
  Supports:
  - Tasks stored in an array of objects ({ id, text, dueDate, category, priority, completed })
  - Separate functions: addTask(), toggleTask(), deleteTask(), renderTasks()
  - Priority levels (Low, Medium, High), categories, and due dates
  - Animated enter, completion fade, delete slide out, and completion progress bar
  - Persistent storage via localStorage
  ==========================================================================
*/

const STORAGE_KEY = 'victory_academic_planner_tasks';

let tasks = loadTasks();
let currentFilter = 'all';
let newestTaskId = null;

const plannerForm = document.getElementById('planner-form');
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date');
const taskCategorySelect = document.getElementById('task-category');
const taskPrioritySelect = document.getElementById('task-priority');
const taskError = document.getElementById('task-error');
const taskListEl = document.getElementById('task-list');
const emptyStateEl = document.getElementById('planner-empty');

const totalCountEl = document.getElementById('count-total');
const completedCountEl = document.getElementById('count-completed');
const remainingCountEl = document.getElementById('count-remaining');
const progressPercentEl = document.getElementById('planner-progress-percent');
const progressFillEl = document.getElementById('planner-progress-fill');

const filterButtons = document.querySelectorAll('.filter-btn[data-task-filter]');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

document.addEventListener('DOMContentLoaded', () => {
  if (!plannerForm) return;

  plannerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const rawText = taskInput.value.trim();

    if (!rawText) {
      showTaskError('Please enter a task description before adding.');
      taskInput.focus();
      return;
    }

    clearTaskError();
    const priority = taskPrioritySelect ? taskPrioritySelect.value : 'Medium';
    addTask(rawText, taskDateInput.value, taskCategorySelect.value, priority);

    taskInput.value = '';
    taskDateInput.value = '';
    if (taskPrioritySelect) taskPrioritySelect.value = 'Medium';
    taskInput.focus();
  });

  taskInput.addEventListener('input', () => {
    if (taskInput.value.trim().length > 0) {
      clearTaskError();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.getAttribute('data-task-filter') || 'all';

      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');

      renderTasks();
    });
  });

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });
  }

  renderTasks();
});

/**
 * Loads tasks safely from localStorage.
 * @returns {Array}
 */
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists tasks array to localStorage.
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage errors in restricted browsing modes
  }
}

/**
 * Adds a new task object with priority and category, then renders the list.
 * @param {string} text
 * @param {string} dueDate
 * @param {string} category
 * @param {string} priority
 */
function addTask(text, dueDate, category, priority) {
  const taskId = Date.now();
  const newTask = {
    id: taskId,
    text: text,
    dueDate: dueDate || '',
    category: category || 'General Study',
    priority: priority || 'Medium',
    completed: false
  };

  newestTaskId = taskId;
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

/**
 * Toggles completion state of a task by ID.
 * @param {number} id
 */
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

/**
 * Slides out a task item smoothly and removes it from the array.
 * @param {number} id
 * @param {HTMLElement} [listItemEl]
 */
function deleteTask(id, listItemEl) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (listItemEl && !prefersReduced) {
    listItemEl.classList.add('is-removing');
    window.setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }, 240);
    return;
  }

  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Renders filtered tasks into the DOM using createElement and appendChild.
 */
function renderTasks() {
  if (!taskListEl) return;

  taskListEl.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  updateCounters();

  if (filteredTasks.length === 0) {
    emptyStateEl.hidden = false;
    if (tasks.length === 0) {
      emptyStateEl.textContent = 'No tasks yet. Add an assignment, study goal, or deadline above.';
    } else if (currentFilter === 'active') {
      emptyStateEl.textContent = 'No active tasks remaining.';
    } else if (currentFilter === 'completed') {
      emptyStateEl.textContent = 'No completed tasks yet.';
    }
    return;
  }

  emptyStateEl.hidden = true;

  filteredTasks.forEach((task) => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    if (task.completed) {
      listItem.classList.add('completed');
    }
    if (task.id === newestTaskId) {
      listItem.classList.add('is-entering');
    }

    const leftGroup = document.createElement('div');
    leftGroup.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as completed`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const contentBox = document.createElement('div');
    contentBox.className = 'task-content';

    const label = document.createElement('label');
    label.className = 'task-title';
    label.setAttribute('for', `task-${task.id}`);
    label.textContent = task.text;

    const meta = document.createElement('span');
    meta.className = 'task-meta';

    const priorityValue = task.priority || 'Medium';
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority-${priorityValue.toLowerCase()}`;
    prioritySpan.textContent = `${priorityValue} priority`;

    meta.appendChild(prioritySpan);

    const extraParts = [task.category];
    if (task.dueDate) {
      extraParts.push(`Due ${formatDisplayDate(task.dueDate)}`);
    }
    if (task.completed) {
      extraParts.push('Completed');
    }

    meta.appendChild(document.createTextNode(` · ${extraParts.join(' · ')}`));

    contentBox.appendChild(label);
    contentBox.appendChild(meta);

    leftGroup.appendChild(checkbox);
    leftGroup.appendChild(contentBox);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id, listItem));

    listItem.appendChild(leftGroup);
    listItem.appendChild(deleteBtn);

    taskListEl.appendChild(listItem);
  });

  newestTaskId = null;
}

/**
 * Updates Total, Completed, Remaining counters and the completion progress bar.
 */
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (totalCountEl) totalCountEl.textContent = String(total);
  if (completedCountEl) completedCountEl.textContent = String(completed);
  if (remainingCountEl) remainingCountEl.textContent = String(remaining);

  if (progressPercentEl) {
    progressPercentEl.textContent = `${percent}%`;
  }
  if (progressFillEl) {
    progressFillEl.style.width = `${percent}%`;
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.hidden = completed === 0;
  }
}

function showTaskError(message) {
  if (taskError) {
    taskError.textContent = message;
  }
  if (taskInput) {
    taskInput.classList.add('is-invalid');
    taskInput.setAttribute('aria-invalid', 'true');
  }
}

function clearTaskError() {
  if (taskError) {
    taskError.textContent = '';
  }
  if (taskInput) {
    taskInput.classList.remove('is-invalid');
    taskInput.removeAttribute('aria-invalid');
  }
}

function formatDisplayDate(isoDate) {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
