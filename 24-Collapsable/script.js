class Collapsible {
  constructor(groupSelector) {
    this.group = document.querySelector(groupSelector);
    if (!this.group) return;

    this.allowMultiple = this.group.dataset.allowMultiple === 'true';
    this.items = this.group.querySelectorAll('.collapsible');
    this.storageKey = 'collapsible-state';

    this.init();
  }

  init() {
    this.setupSearch();
    this.setupControls();
    this.bindEvents();
    this.restoreState();
    this.setupKeyboardNav();
  }

  bindEvents() {
    this.group.addEventListener('click', (e) => {
      const trigger = e.target.closest('.collapsible-trigger');
      if (!trigger) return;
      this.toggle(trigger);
    });
  }

  toggle(trigger) {
    const item = trigger.closest('.collapsible');
    const panel = item.querySelector('.collapsible-panel');
    const isOpen = item.classList.contains('is-open');

    // Close others if single mode
    if (!this.allowMultiple &&!isOpen) {
      this.items.forEach(other => {
        if (other!== item) this.close(other);
      });
    }

    isOpen? this.close(item) : this.open(item);
    this.saveState();
  }

  open(item) {
    const trigger = item.querySelector('.collapsible-trigger');
    const panel = item.querySelector('.collapsible-panel');

    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    // Announce to screen readers
    this.announce(`${trigger.querySelector('.trigger-title').textContent} expanded`);
  }

  close(item) {
    const trigger = item.querySelector('.collapsible-trigger');

    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  setupSearch() {
    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper';
    wrapper.innerHTML = `
      <i class="fa-solid fa-search"></i>
      <input type="search" placeholder="Search topics..." aria-label="Search collapsible sections">
    `;
    this.group.parentElement.insertBefore(wrapper, this.group);

    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'search-empty';
    emptyMsg.innerHTML = `
      <i class="fa-regular fa-folder-open"></i>
      <h3>No results found</h3>
      <p>Try a different search term</p>
    `;
    this.group.parentElement.appendChild(emptyMsg);

    const input = wrapper.querySelector('input');
    let timer;
    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => this.filter(e.target.value), 150);
    });
  }

  filter(query) {
    const q = query.toLowerCase().trim();
    let visibleCount = 0;

    this.items.forEach(item => {
      const matches = item.textContent.toLowerCase().includes(q);
      item.classList.toggle('is-hidden',!matches && q!== '');
      if (matches || q === '') visibleCount++;
    });

    const emptyMsg = this.group.parentElement.querySelector('.search-empty');
    emptyMsg.classList.toggle('show', visibleCount === 0 && q!== '');
  }

  setupControls() {
    const expandAll = document.getElementById('expandAll');
    const collapseAll = document.getElementById('collapseAll');

    if (expandAll) {
      expandAll.addEventListener('click', () => {
        this.items.forEach(item => {
          if (!item.classList.contains('is-hidden')) this.open(item);
        });
        this.saveState();
      });
    }

    if (collapseAll) {
      collapseAll.addEventListener('click', () => {
        this.items.forEach(item => this.close(item));
        this.saveState();
      });
    }
  }

  setupKeyboardNav() {
    const triggers = Array.from(this.group.querySelectorAll('.collapsible-trigger'));

    triggers.forEach((trigger, idx) => {
      trigger.addEventListener('keydown', (e) => {
        let newIdx;
        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            newIdx = idx + 1 < triggers.length? idx + 1 : 0;
            triggers[newIdx].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            newIdx = idx - 1 >= 0? idx - 1 : triggers.length - 1;
            triggers[newIdx].focus();
            break;
          case 'Home':
            e.preventDefault();
            triggers[0].focus();
            break;
          case 'End':
            e.preventDefault();
            triggers[triggers.length - 1].focus();
            break;
          case ' ':
          case 'Enter':
            e.preventDefault();
            trigger.click();
            break;
        }
      });
    });
  }

  saveState() {
    const openIds = [];
    this.items.forEach(item => {
      if (item.classList.contains('is-open')) {
        openIds.push(item.querySelector('.collapsible-panel').id);
      }
    });
    sessionStorage.setItem(this.storageKey, JSON.stringify(openIds));
  }

  restoreState() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(this.storageKey) || '[]');
      saved.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) this.open(panel.closest('.collapsible'));
      });
    } catch (e) {
      console.warn('Could not restore collapsible state');
    }
  }

  announce(message) {
    // ARIA live region for screen readers
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new Collapsible('#collapsibleGroup');
});