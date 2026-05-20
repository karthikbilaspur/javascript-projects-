class VideoPlayer {
  constructor(playerId) {
    this.player = document.getElementById(playerId);
    this.video = this.player.querySelector('#video');
    this.controls = this.player.querySelector('#videoControls');
    
    // Buttons
    this.playBtn = this.player.querySelector('#playBtn');
    this.volumeBtn = this.player.querySelector('#volumeBtn');
    this.volumeSlider = this.player.querySelector('#volumeSlider');
    this.fullscreenBtn = this.player.querySelector('#fullscreenBtn');
    this.pipBtn = this.player.querySelector('#pipBtn');
    this.speedBtn = this.player.querySelector('#speedBtn');
    this.speedMenu = this.player.querySelector('#speedMenu');
    
    // Progress
    this.progressFilled = this.player.querySelector('#progressFilled');
    this.progressSlider = this.player.querySelector('#progressSlider');
    
    // Time
    this.currentTimeEl = this.player.querySelector('#currentTime');
    this.durationEl = this.player.querySelector('#duration');
    
    this.controlsTimeout = null;
    this.isMouseDown = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.video.volume = 1;
  }
  
  bindEvents() {
    // Play/Pause
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.video.addEventListener('click', () => this.togglePlay());
    this.video.addEventListener('play', () => this.updatePlayButton());
    this.video.addEventListener('pause', () => this.updatePlayButton());
    
    // Time update
    this.video.addEventListener('timeupdate', () => this.updateProgress());
    this.video.addEventListener('loadedmetadata', () => this.setDuration());
    
    // Progress bar
    this.progressSlider.addEventListener('input', (e) => this.setProgress(e));
    this.progressSlider.addEventListener('mousedown', () => this.isMouseDown = true);
    this.progressSlider.addEventListener('mouseup', () => this.isMouseDown = false);
    
    // Volume
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
    
    // Fullscreen
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    // PiP
    this.pipBtn.addEventListener('click', () => this.togglePip());
    
    // Speed
    this.speedBtn.addEventListener('click', () => this.toggleSpeedMenu());
    this.speedMenu.addEventListener('click', (e) => {
      if (e.target.dataset.speed) this.setSpeed(e.target.dataset.speed);
    });
    
    // Hide controls on mouse inactivity
    this.player.addEventListener('mousemove', () => this.showControls());
    this.player.addEventListener('mouseleave', () => this.hideControls());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Click outside speed menu
    document.addEventListener('click', (e) => {
      if (!this.speedBtn.contains(e.target) && !this.speedMenu.contains(e.target)) {
        this.speedMenu.classList.remove('show');
      }
    });
  }
  
  togglePlay() {
    this.video.paused? this.video.play() : this.video.pause();
  }
  
  updatePlayButton() {
    const icon = this.playBtn.querySelector('i');
    if (this.video.paused) {
      icon.className = 'fa-solid fa-play';
      this.playBtn.setAttribute('aria-label', 'Play');
    } else {
      icon.className = 'fa-solid fa-pause';
      this.playBtn.setAttribute('aria-label', 'Pause');
    }
  }
  
  updateProgress() {
    if (!this.isMouseDown) {
      const percent = (this.video.currentTime / this.video.duration) * 100;
      this.progressFilled.style.width = `${percent}%`;
      this.progressSlider.value = percent;
    }
    this.currentTimeEl.textContent = this.formatTime(this.video.currentTime);
  }
  
  setProgress(e) {
    const time = (e.target.value / 100) * this.video.duration;
    this.video.currentTime = time;
  }
  
  setDuration() {
    this.durationEl.textContent = this.formatTime(this.video.duration);
  }
  
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  setVolume(e) {
    this.video.volume = e.target.value;
    this.video.muted = e.target.value === '0';
    this.updateVolumeIcon();
  }
  
  toggleMute() {
    this.video.muted =!this.video.muted;
    if (this.video.muted) {
      this.volumeSlider.value = 0;
    } else {
      this.volumeSlider.value = this.video.volume;
    }
    this.updateVolumeIcon();
  }
  
  updateVolumeIcon() {
    const icon = this.volumeBtn.querySelector('i');
    if (this.video.muted || this.video.volume === 0) {
      icon.className = 'fa-solid fa-volume-xmark';
    } else if (this.video.volume < 0.5) {
      icon.className = 'fa-solid fa-volume-low';
    } else {
      icon.className = 'fa-solid fa-volume-high';
    }
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.player.requestFullscreen();
      this.fullscreenBtn.querySelector('i').className = 'fa-solid fa-compress';
    } else {
      document.exitFullscreen();
      this.fullscreenBtn.querySelector('i').className = 'fa-solid fa-expand';
    }
  }
  
  async togglePip() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.video.requestPictureInPicture();
      }
    } catch (error) {
      console.log('PiP not supported');
    }
  }
  
  toggleSpeedMenu() {
    this.speedMenu.classList.toggle('show');
  }
  
  setSpeed(speed) {
    this.video.playbackRate = parseFloat(speed);
    this.speedBtn.textContent = `${speed}x`;
    this.speedMenu.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.speed === speed);
    });
    this.speedMenu.classList.remove('show');
  }
  
  showControls() {
    this.player.classList.add('show-controls');
    clearTimeout(this.controlsTimeout);
    if (!this.video.paused) {
      this.controlsTimeout = setTimeout(() => {
        this.player.classList.remove('show-controls');
      }, 3000);
    }
  }
  
  hideControls() {
    if (!this.video.paused) {
      this.player.classList.remove('show-controls');
    }
  }
  
  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'm':
        this.toggleMute();
        break;
      case 'f':
        this.toggleFullscreen();
        break;
      case 'arrowleft':
        e.preventDefault();
        this.video.currentTime -= 5;
        break;
      case 'arrowright':
        e.preventDefault();
        this.video.currentTime += 5;
        break;
      case 'arrowup':
        e.preventDefault();
        this.video.volume = Math.min(1, this.video.volume + 0.1);
        this.volumeSlider.value = this.video.volume;
        this.updateVolumeIcon();
        break;
      case 'arrowdown':
        e.preventDefault();
        this.video.volume = Math.max(0, this.video.volume - 0.1);
        this.volumeSlider.value = this.video.volume;
        this.updateVolumeIcon();
        break;
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new VideoPlayer('videoPlayer');
});