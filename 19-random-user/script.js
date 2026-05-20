class DigitalClockApp {
  constructor() {
    this.currentMode = 'clock';
    this.settings = this.loadSettings();
    
    // Clock
    this.clockInterval = null;
    
    // Stopwatch
    this.swRunning = false;
    this.swStartTime = 0;
    this.swElapsed = 0;
    this.swInterval = null;
    this.laps = [];
    
    // Timer
    this.tmRunning = false;
    this.tmTotalSeconds = 0;
    this.tmRemaining = 0;
    this.tmInterval = null;
    this.tmInitialTime = 0;

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadSettingsToUI();
    this.startClock();
    this.switchMode('clock');
  }

  cacheElements() {
    // Mode switcher
    this.modeBtns = document.querySelectorAll('.mode-btn');
    this.modeContainers = document.querySelectorAll('.mode-container');
    
    // Clock
    this.clockTime = document.getElementById('clock-time');
    this.clockDate = document.getElementById('clock-date');
    this.format24h = document.getElementById('format-24h');
    this.showSeconds = document.getElementById('show-seconds');
    
    // Stopwatch
    this.swTime = document.getElementById('stopwatch-time');
    this.swStart = document.getElementById('sw-start');
    this.swLap = document.getElementById('sw-lap');
    this.swReset = document.getElementById('sw-reset');
    this.lapsList = document.getElementById('laps-list');
    
    // Timer
    this.tmTime = document.getElementById('timer-time');
    this.tmProgress = document.getElementById('timer-progress');
    this.tmSetup = document.getElementById('timer-setup');
    this.hoursInput = document.getElementById('hours');
    this.minutesInput = document.getElementById('minutes');
    this.secondsInput = document.getElementById('seconds');
    this.presetBtns = document.querySelectorAll('.preset-btn');
    this.tmStart = document.getElementById('tm-start');
    this.tmPause = document.getElementById('tm-pause');
    this.tmReset = document.getElementById('tm-reset');
    
    this.toast = document.getElementById('toast');
    this.alarmSound = document.getElementById('alarm-sound');
  }

  bindEvents() {
    // Mode switching
    this.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
    });

    // Clock settings
    this.format24h.addEventListener('change', () => this.saveSettings());
    this.showSeconds.addEventListener('change', () => this.saveSettings());

    // Stopwatch
    this.swStart.addEventListener('click', () => this.toggleStopwatch());
    this.swLap.addEventListener('click', () => this.recordLap());
    this.swReset.addEventListener('click', () => this.resetStopwatch());

    // Timer
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => this.setTimerPreset(parseInt(btn.dataset.time)));
    });
    this.tmStart.addEventListener('click', () => this.startTimer());
    this.tmPause.addEventListener('click', () => this.pauseTimer());
    this.tmReset.addEventListener('click', () => this.resetTimer());
  }

  // ===== MODE SWITCHING =====
  switchMode(mode) {
    this.currentMode = mode;
    
    this.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    this.modeContainers.forEach(container => {
      container.classList.toggle('active', container.id === `${mode}-mode`);
    });

    // Pause other modes when switching
    if (mode!== 'stopwatch' && this.swRunning) this.toggleStopwatch();
    if (mode!== 'timer' && this.tmRunning) this.pauseTimer();
  }

  // ===== CLOCK =====
  startClock() {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();
    const use24h = this.format24h.checked;
    const showSec = this.showSeconds.checked;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    let timeString;
    if (use24h) {
      timeString = `${String(hours).padStart(2, '0')}:${minutes}`;
    } else {
      const ampm = hours >= 12? 'PM' : 'AM';
      hours = hours % 12 || 12;
      timeString = `${hours}:${minutes} ${ampm}`;
    }
    
    if (showSec) {
      timeString = use24h? `${String(now.getHours()).padStart(2, '0')}:${minutes}:${seconds}` 
                           : `${hours}:${minutes}:${seconds} ${now.getHours() >= 12? 'PM' : 'AM'}`;
    }

    this.clockTime.textContent = timeString;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.clockDate.textContent = now.toLocaleDateString('en-US', options);
  }

  // ===== STOPWATCH =====
  toggleStopwatch() {
    if (this.swRunning) {
      this.pauseStopwatch();
    } else {
      this.startStopwatch();
    }
  }

  startStopwatch() {
    this.swRunning = true;
    this.swStartTime = Date.now() - this.swElapsed;
    this.swInterval = setInterval(() => this.updateStopwatch(), 10);
    
    this.swStart.textContent = 'Pause';
    this.swLap.disabled = false;
    this.swReset.disabled = false;
  }

  pauseStopwatch() {
    this.swRunning = false;
    clearInterval(this.swInterval);
    this.swStart.textContent = 'Resume';
  }

  resetStopwatch() {
    this.pauseStopwatch();
    this.swElapsed = 0;
    this.laps = [];
    this.swTime.textContent = '00:00:00.00';
    this.swStart.textContent = 'Start';
    this.swLap.disabled = true;
    this.swReset.disabled = true;
    this.renderLaps();
  }

  updateStopwatch() {
    this.swElapsed = Date.now() - this.swStartTime;
    this.swTime.textContent = this.formatStopwatchTime(this.swElapsed);
  }

  recordLap() {
    if (!this.swRunning) return;
    this.laps.unshift({
      time: this.swElapsed,
      total: this.formatStopwatchTime(this.swElapsed)
    });
    this.renderLaps();
    this.showToast(`Lap ${this.laps.length} recorded`);
  }

  renderLaps() {
    if (this.laps.length === 0) {
      this.lapsList.innerHTML = '<p class="empty-laps">No laps yet</p>';
      return;
    }

    this.lapsList.innerHTML = this.laps.map((lap, idx) => `
      <div class="lap-item">
        <span class="lap-number">Lap ${this.laps.length - idx}</span>
        <span class="lap-time">${lap.total}</span>
      </div>
    `).join('');
  }

  formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }

  // ===== TIMER =====
  setTimerPreset(seconds) {
    this.hoursInput.value = Math.floor(seconds / 3600);
    this.minutesInput.value = Math.floor((seconds % 3600) / 60);
    this.secondsInput.value = seconds % 60;
  }

  startTimer() {
    if (this.tmRunning) return;

    if (this.tmRemaining === 0) {
      const h = parseInt(this.hoursInput.value) || 0;
      const m = parseInt(this.minutesInput.value) || 0;
      const s = parseInt(this.secondsInput.value) || 0;
      this.tmTotalSeconds = h * 3600 + m * 60 + s;
      
      if (this.tmTotalSeconds === 0) {
        this.showToast('Set a time first!');
        return;
      }
      
      this.tmRemaining = this.tmTotalSeconds;
      this.tmInitialTime = this.tmTotalSeconds;
    }

    this.tmRunning = true;
    this.tmInterval = setInterval(() => this.updateTimer(), 1000);
    
    this.tmStart.disabled = true;
    this.tmPause.disabled = false;
    this.tmReset.disabled = false;
    this.tmSetup.classList.add('disabled');
  }

  pauseTimer() {
    this.tmRunning = false;
    clearInterval(this.tmInterval);
    this.tmStart.disabled = false;
    this.tmPause.disabled = true;
  }

  resetTimer() {
    this.pauseTimer();
    this.tmRemaining = 0;
    this.tmTotalSeconds = 0;
    this.tmTime.textContent = '00:00:00';
    this.tmProgress.style.width = '0%';
    this.tmStart.disabled = false;
    this.tmReset.disabled = true;
    this.tmSetup.classList.remove('disabled');
  }

  updateTimer() {
    this.tmRemaining--;
    
    if (this.tmRemaining <= 0) {
      this.timerComplete();
      return;
    }

    this.renderTimerDisplay();
  }

  renderTimerDisplay() {
    const h = Math.floor(this.tmRemaining / 3600);
    const m = Math.floor((this.tmRemaining % 3600) / 60);
    const s = this.tmRemaining % 60;
    
    this.tmTime.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    
    const progress = ((this.tmInitialTime - this.tmRemaining) / this.tmInitialTime) * 100;
    this.tmProgress.style.width = `${progress}%`;
  }

  timerComplete() {
    this.pauseTimer();
    this.alarmSound.play();
    this.showToast('⏰ Timer finished!');
    this.resetTimer();
  }

  // ===== SETTINGS =====
  loadSettings() {
    const data = localStorage.getItem('clockSettings');
    return data? JSON.parse(data) : { format24h: false, showSeconds: true };
  }

  loadSettingsToUI() {
    this.format24h.checked = this.settings.format24h;
    this.showSeconds.checked = this.settings.showSeconds;
  }

  saveSettings() {
    this.settings = {
      format24h: this.format24h.checked,
      showSeconds: this.showSeconds.checked
    };
    localStorage.setItem('clockSettings', JSON.stringify(this.settings));
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DigitalClockApp();
});