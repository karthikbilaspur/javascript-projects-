class ScrollController {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.scrollProgress = document.getElementById('scrollProgress');
    this.backToTop = document.getElementById('backToTop');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.scrollToBtn = document.getElementById('scrollToFeatures');
    
    this.init();
  }
  
  init() {
    this.setupScrollProgress();
    this.setupScrollSpy();
    this.setupRevealAnimations();
    this.setupBackToTop();
    this.setupSmoothAnchors();
    this.setupNavShrink();
    
    if (this.scrollToBtn) {
      this.scrollToBtn.addEventListener('click', () => {
        document.getElementById('features').scrollIntoView();
      });
    }
  }
  
  // 1. Scroll Progress Bar
  setupScrollProgress() {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      this.scrollProgress.style.width = `${scrollPercent}%`;
    };
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call
  }
  
  // 2. Scroll Spy - highlight nav link for current section
  setupScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, observerOptions);
    
    this.sections.forEach(section => observer.observe(section));
  }
  
  // 3. Reveal on Scroll
  setupRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.15
    });
    
    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  }
  
  // 4. Back to Top Button
  setupBackToTop() {
    const toggleButton = () => {
      if (window.scrollY > 400) {
        this.backToTop.classList.add('visible');
      } else {
        this.backToTop.classList.remove('visible');
      }
    };
    
    window.addEventListener('scroll', toggleButton, { passive: true });
    
    this.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // 5. Smooth Anchor Links
  setupSmoothAnchors() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  // 6. Shrink Navbar on Scroll
  setupNavShrink() {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ScrollController();
});