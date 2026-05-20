document.addEventListener('DOMContentLoaded', () => {
  const tabContainer = document.querySelector('.tab-container');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // 1. Tab switching with localStorage
  const savedTab = localStorage.getItem('freelanceActiveTab') || 'overview';
  switchTab(savedTab);

  tabContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn) {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
      localStorage.setItem('freelanceActiveTab', tabId);
    }
  });

  function switchTab(tabId) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
  }

  // 2. Keyboard nav
  tabContainer.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      const currentIndex = Array.from(tabButtons).indexOf(e.target);
      if (e.key === 'ArrowRight') tabButtons[(currentIndex + 1) % tabButtons.length].focus();
      if (e.key === 'ArrowLeft') tabButtons[(currentIndex - 1 + tabButtons.length) % tabButtons.length].focus();
    }
  });

  // 3. Task Manager with localStorage
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  let tasks = JSON.parse(localStorage.getItem('freelanceTasks')) || [
    { id: 1, text: 'Send invoice #1083 to Urban Threads', completed: false },
    { id: 2, text: 'Final review for Cafe Bean logo', completed: true },
    { id: 3, text: 'Schedule kickoff call with FitTrack', completed: false },
    { id: 4, text: 'Update portfolio with E-commerce Site v2', completed: false }
  ];

  function saveTasks() {
    localStorage.setItem('freelanceTasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <span>${task.text}</span>
        <button class="delete-btn" data-id="${task.id}">🗑️</button>
      `;
      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ id: Date.now(), text, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  });

  taskList.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.type === 'checkbox') {
      const task = tasks.find(t => t.id === id);
      task.completed = e.target.checked;
      saveTasks();
      renderTasks();
    }
    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id!== id);
      saveTasks();
      renderTasks();
    }
  });

  renderTasks();
});