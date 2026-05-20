document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.querySelector('.dots');
  const autoplayToggle = document.getElementById('autoplay-toggle');
  const progressFill = document.querySelector('.progress-fill');
  const exportBtn = document.getElementById('export-btn');
  const slider = document.querySelector('.slider');

  let currentSlide = 0;
  let autoplayInterval = null;
  let progressInterval = null;
  let isPaused = false;
  const AUTOPLAY_DELAY = 5000; // 5 seconds
  const PROGRESS_UPDATE = 50; // Update progress every 50ms

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    // Re-run Prism highlighting for new slide
    if (window.Prism) Prism.highlightAll();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlides();
    resetAutoplay();
  }

  // 1. Progress Bar + 2. Pause on Hover
  function startAutoplay() {
    stopAutoplay();
    let progress = 0;
    progressFill.style.width = '0%';

    progressInterval = setInterval(() => {
      if (!isPaused) {
        progress += (PROGRESS_UPDATE / AUTOPLAY_DELAY) * 100;
        progressFill.style.width = `${progress}%`;

        if (progress >= 100) {
          nextSlide();
          progress = 0;
          progressFill.style.width = '0%';
        }
      }
    }, PROGRESS_UPDATE);
  }

  function stopAutoplay() {
    if (progressInterval) clearInterval(progressInterval);
    progressFill.style.width = '0%';
  }

  function resetAutoplay() {
    if (autoplayToggle.checked) {
      startAutoplay();
    }
  }

  // 2. Pause on hover
  slider.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  slider.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // 4. Export current slide as PNG
  exportBtn.addEventListener('click', () => {
    const activeSlide = document.querySelector('.slide.active');
    html2canvas(activeSlide, {
      backgroundColor: '#ffffff',
      scale: 2
    }).then(canvas => {
      const topic = activeSlide.dataset.topic;
      const link = document.createElement('a');
      link.download = `web-dev-slide-${topic}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  autoplayToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoplay();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoplay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isPaused = true;
  });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
    isPaused = false;
    resetAutoplay();
  });

  // Init
  updateSlides();
});