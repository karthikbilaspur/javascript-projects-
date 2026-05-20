document.addEventListener('DOMContentLoaded', () => {
  const tabBar = document.getElementById('tab-bar');
  const timersWrapper = document.getElementById('timers-wrapper');
  const addTabBtn = document.getElementById('add-tab-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const template = document.getElementById('timer-template');

  let timers = [];
  let activeTimerId = null;

  // 1. Theme toggle
  const savedTheme = localStorage.getItem('countdownTheme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark'? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light'? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('countdownTheme', newTheme);
    themeToggle.textContent = newTheme === 'dark'? '☀️' : '🌙';
  });

  // 2. Load from URL param?target=20261231T2359&title=Launch
  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    const title = params.get('title') || 'Shared Countdown';

    if (target) {
      // Parse YYYYMMDDTHHMM format
      const year = target.slice(0,4);
      const month = target.slice(4,6);
      const day = target.slice(6,8);
      const hour = target.slice(9,11) || '00';
      const min = target.slice(11,13) || '00';
      const dateStr = `${year}-${month}-${day}T${hour}:${min}`;
      createTimer(title, new Date(dateStr));
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  // 3. Timer class to manage each countdown
  class CountdownTimer {
    constructor(id, title = 'Untitled Event', targetDate = null) {
      this.id = id;
      this.title = title;
      this.targetDate = targetDate;
      this.interval = null;
      this.isPaused = false;
      this.remainingTime = 0;
      this.hasNotified = false;

      this.createDOM();
      this.attachListeners();
      if (targetDate) this.start();
    }

    createDOM() {
      const clone = template.content.cloneNode(true);
      this.el = clone.querySelector('.timer-container');
      this.el.dataset.id = this.id;

      this.titleInput = this.el.querySelector('.timer-title');
      this.titleInput.value = this.title;

      this.daysEl = this.el.querySelector('.days');
      this.hoursEl = this.el.querySelector('.hours');
      this.minutesEl = this.el.querySelector('.minutes');
      this.secondsEl = this.el.querySelector('.seconds');
      this.statusEl = this.el.querySelector('.status-message');
      this.dateInput = this.el.querySelector('.date-input');
      this.startBtn = this.el.querySelector('.start-btn');
      this.pauseBtn = this.el.querySelector('.pause-btn');
      this.resetBtn = this.el.querySelector('.reset-btn');
      this.shareBtn = this.el.querySelector('.share-btn');
      this.gcalBtn = this.el.querySelector('.gcal-btn');
      this.notifyBtn = this.el.querySelector('.notify-btn');
      this.deleteBtn = this.el.querySelector('.delete-tab-btn');

      if (this.targetDate) {
        this.dateInput.value = this.toLocalDateTimeString(this.targetDate);
      }

      timersWrapper.appendChild(this.el);
      this.createTab();
    }

    createTab() {
      this.tabEl = document.createElement('button');
      this.tabEl.className = 'tab-chip';
      this.tabEl.textContent = this.title;
      this.tabEl.dataset.id = this.id;
      tabBar.appendChild(this.tabEl);
    }

    attachListeners() {
      this.titleInput.addEventListener('input', (e) => {
        this.title = e.target.value;
        this.tabEl.textContent = this.title || 'Untitled';
        this.save();
      });

      this.startBtn.addEventListener('click', () => this.handleStart());
      this.pauseBtn.addEventListener('click', () => this.handlePause());
      this.resetBtn.addEventListener('click', () => this.handleReset());
      this.deleteBtn.addEventListener('click', () => this.destroy());
      this.shareBtn.addEventListener('click', () => this.shareLink());
      this.gcalBtn.addEventListener('click', () => this.addToGoogleCalendar());
      this.notifyBtn.addEventListener('click', () => this.requestNotification());
      this.tabEl.addEventListener('click', () => setActiveTimer(this.id));
    }

    toLocalDateTimeString(date) {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      return localDate.toISOString().slice(0, 16);
    }

    update() {
      if (this.isPaused) return;

      const now = new Date().getTime();
      const distance = this.targetDate - now;

      if (distance <= 0) {
        this.finish();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.daysEl.textContent = String(days).padStart(2, '0');
      this.hoursEl.textContent = String(hours).padStart(2, '0');
      this.minutesEl.textContent = String(minutes).padStart(2, '0');
      this.secondsEl.textContent = String(seconds).padStart(2, '0');

      this.statusEl.textContent = `Counting down to ${this.targetDate.toLocaleString()}`;
    }

    start() {
      if (!this.targetDate) return;
      clearInterval(this.interval);
      this.isPaused = false;
      this.hasNotified = false;
      this.update();
      this.interval = setInterval(() => this.update(), 1000);
      this.startBtn.disabled = true;
      this.pauseBtn.disabled = false;
      this.pauseBtn.textContent = 'Pause';
      this.save();
    }

    handleStart() {
      if (!this.dateInput.value) {
        this.statusEl.textContent = 'Please select a target date first';
        return;
      }
      this.targetDate = new Date(this.dateInput.value);
      if (this.targetDate <= new Date()) {
        this.statusEl.textContent = 'Please select a future date';
        return;
      }
      this.start();
    }

    handlePause() {
      if (!this.interval) return;
      if (this.isPaused) {
        this.targetDate = new Date(new Date().getTime() + this.remainingTime);
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pause';
        this.interval = setInterval(() => this.update(), 1000);
        this.statusEl.textContent = `Counting down to ${this.targetDate.toLocaleString()}`;
      } else {
        this.isPaused = true;
        this.remainingTime = this.targetDate - new Date().getTime();
        clearInterval(this.interval);
        this.pauseBtn.textContent = 'Resume';
        this.statusEl.textContent = 'Countdown paused';
      }
    }

    handleReset() {
      clearInterval(this.interval);
      this.interval = null;
      this.targetDate = null;
      this.isPaused = false;
      this.remainingTime = 0;
      this.hasNotified = false;

      this.daysEl.textContent = '00';
      this.hoursEl.textContent = '00';
      this.minutesEl.textContent = '00';
      this.secondsEl.textContent = '00';
      this.dateInput.value = '';
      this.statusEl.textContent = 'Set a target date to begin';
      this.statusEl.classList.remove('ended');

      this.startBtn.disabled = false;
      this.pauseBtn.disabled = true;
      this.pauseBtn.textContent = 'Pause';
      this.save();
    }

    finish() {
      clearInterval(this.interval);
      this.daysEl.textContent = '00';
      this.hoursEl.textContent = '00';
      this.minutesEl.textContent = '00';
      this.secondsEl.textContent = '00';
      this.statusEl.textContent = `🎉 ${this.title} is happening now!`;
      this.statusEl.classList.add('ended');
      this.startBtn.disabled = false;
      this.pauseBtn.disabled = true;

      // 4. Confetti animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 2. Browser notification
      if (!this.hasNotified && Notification.permission === 'granted') {
        new Notification('Countdown Finished!', {
          body: `${this.title} is happening now!`,
          icon: 'https://cdn-icons-png.flaticon.com/512/3114/3114812.png'
        });
        this.hasNotified = true;
      }
    }

    // 3. Shareable URL
    shareLink() {
      if (!this.targetDate) {
        alert('Set a target date first');
        return;
      }
      const d = this.targetDate;
      const target = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
      const url = `${window.location.origin}${window.location.pathname}?target=${target}&title=${encodeURIComponent(this.title)}`;
      navigator.clipboard.writeText(url);
      this.statusEl.textContent = 'Link copied to clipboard!';
      setTimeout(() => this.update(), 2000);
    }

    // 5. Google Calendar export
    addToGoogleCalendar() {
      if (!this.targetDate) {
        alert('Set a target date first');
        return;
      }
      const start = this.targetDate.toISOString().replace(/-|:|\.\d+/g, '');
      const end = new Date(this.targetDate.getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d+/g, '');
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(this.title)}&dates=${start}/${end}&details=${encodeURIComponent('Countdown created with Pro Countdown Timer')}`;
      window.open(url, '_blank');
    }

    // 2. Request notification permission
    async requestNotification() {
      if (!('Notification' in window)) {
        alert('Browser does not support notifications');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.notifyBtn.textContent = '✅ Notifications On';
        this.notifyBtn.disabled = true;
      } else {
        alert('Notification permission denied');
      }
    }

    save() {
      const data = timers.map(t => ({
        id: t.id,
        title: t.title,
        targetDate: t.targetDate? t.targetDate.toISOString() : null
      }));
      localStorage.setItem('proCountdowns', JSON.stringify(data));
    }

    show() {
      this.el.classList.add('active');
      this.tabEl.classList.add('active');
    }

    hide() {
      this.el.classList.remove('active');
      this.tabEl.classList.remove('active');
    }

    destroy() {
      clearInterval(this.interval);
      this.el.remove();
      this.tabEl.remove();
      timers = timers.filter(t => t.id!== this.id);
      if (activeTimerId === this.id) {
        activeTimerId = timers[0]?.id || null;
        if (activeTimerId) setActiveTimer(activeTimerId);
      }
      this.save();
    }
  }

  function createTimer(title = 'New Countdown', targetDate = null) {
    const id = Date.now();
    const timer = new CountdownTimer(id, title, targetDate);
    timers.push(timer);
    setActiveTimer(id);
    timer.save();
    return timer;
  }

  function setActiveTimer(id) {
    activeTimerId = id;
    timers.forEach(t => t.id === id? t.show() : t.hide());
  }

  // Init
  addTabBtn.addEventListener('click', () => createTimer());

  // Load saved timers
  const saved = JSON.parse(localStorage.getItem('proCountdowns') || '[]');
  if (saved.length) {
    saved.forEach(s => createTimer(s.title, s.targetDate? new Date(s.targetDate) : null));
  } else {
    createTimer('Product Launch', new Date(Date.now() + 7*24*60*60*1000));
  }

  loadFromURL();
});