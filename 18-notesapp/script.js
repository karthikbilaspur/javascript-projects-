class NotesApp {
  constructor() {
    this.notes = this.loadNotes();
    this.currentNoteId = null;
    this.autoSaveTimeout = null;
    this.currentFilter = 'all';
    this.searchQuery = '';

    // DOM elements
    this.notesList = document.getElementById('notes-list');
    this.newNoteBtn = document.getElementById('new-note');
    this.searchInput = document.getElementById('search');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.emptyState = document.getElementById('empty-state');
    this.editorContainer = document.getElementById('editor-container');
    this.titleInput = document.getElementById('note-title');
    this.contentInput = document.getElementById('note-content');
    this.tagsInput = document.getElementById('note-tags');
    this.preview = document.getElementById('note-preview');
    this.pinBtn = document.getElementById('pin-note');
    this.deleteBtn = document.getElementById('delete-note');
    this.wordCount = document.getElementById('word-count');
    this.lastSaved = document.getElementById('last-saved');
    this.toggleBtns = document.querySelectorAll('.toggle-btn');
    this.toast = document.getElementById('toast');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderNotesList();
  }

  bindEvents() {
    this.newNoteBtn.addEventListener('click', () => this.createNote());
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
    });

    this.titleInput.addEventListener('input', () => this.autoSave());
    this.contentInput.addEventListener('input', () => {
      this.autoSave();
      this.updateWordCount();
      this.updatePreview();
    });
    this.tagsInput.addEventListener('input', () => this.autoSave());
    
    this.pinBtn.addEventListener('click', () => this.togglePin());
    this.deleteBtn.addEventListener('click', () => this.deleteCurrentNote());

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
    });
  }

  createNote() {
    const note = {
      id: Date.now(),
      title: 'Untitled',
      content: '',
      tags: [],
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.notes.unshift(note);
    this.saveNotes();
    this.renderNotesList();
    this.selectNote(note.id);
    this.showToast('New note created');
  }

  selectNote(id) {
    this.currentNoteId = id;
    const note = this.notes.find(n => n.id === id);
    if (!note) return;

    this.emptyState.classList.add('hidden');
    this.editorContainer.classList.remove('hidden');

    this.titleInput.value = note.title;
    this.contentInput.value = note.content;
    this.tagsInput.value = note.tags.join(', ');
    this.updateWordCount();
    this.updatePreview();
    this.updatePinButton(note.pinned);
    this.updateLastSaved(note.updatedAt);

    // Highlight in sidebar
    document.querySelectorAll('.note-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.id) === id);
    });
  }

  autoSave() {
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      if (!this.currentNoteId) return;

      const note = this.notes.find(n => n.id === this.currentNoteId);
      if (!note) return;

      note.title = this.titleInput.value || 'Untitled';
      note.content = this.contentInput.value;
      note.tags = this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
      note.updatedAt = Date.now();

      this.saveNotes();
      this.renderNotesList();
      this.updateLastSaved(note.updatedAt);
    }, 500); // Debounce 500ms
  }

  togglePin() {
    const note = this.notes.find(n => n.id === this.currentNoteId);
    if (!note) return;

    note.pinned =!note.pinned;
    note.updatedAt = Date.now();
    this.saveNotes();
    this.renderNotesList();
    this.updatePinButton(note.pinned);
    this.showToast(note.pinned? 'Note pinned' : 'Note unpinned');
  }

  deleteCurrentNote() {
    if (!this.currentNoteId) return;
    if (!confirm('Delete this note?')) return;

    this.notes = this.notes.filter(n => n.id!== this.currentNoteId);
    this.saveNotes();
    this.currentNoteId = null;
    this.editorContainer.classList.add('hidden');
    this.emptyState.classList.remove('hidden');
    this.renderNotesList();
    this.showToast('Note deleted');
  }

  handleSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.renderNotesList();
  }

  handleFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderNotesList();
  }

  getFilteredNotes() {
    return this.notes.filter(note => {
      // Filter
      if (this.currentFilter === 'pinned' &&!note.pinned) return false;

      // Search
      if (this.searchQuery) {
        const searchIn = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
        if (!searchIn.includes(this.searchQuery)) return false;
      }

      return true;
    }).sort((a, b) => {
      // Pinned first, then by updatedAt
      if (a.pinned &&!b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }

  renderNotesList() {
    const notes = this.getFilteredNotes();

    if (notes.length === 0) {
      this.notesList.innerHTML = '<p class="empty-list">No notes found</p>';
      return;
    }

    this.notesList.innerHTML = notes.map(note => `
      <div class="note-item ${note.id === this.currentNoteId? 'active' : ''}" data-id="${note.id}">
        <div class="note-item-header">
          <h3>${this.escapeHtml(note.title)}</h3>
          ${note.pinned? '<span class="pin-icon">📌</span>' : ''}
        </div>
        <p class="note-preview">${this.escapeHtml(note.content.slice(0, 80))}${note.content.length > 80? '...' : ''}</p>
        <div class="note-meta">
          <span>${this.formatDate(note.updatedAt)}</span>
          ${note.tags.length > 0? `<span class="tags">${note.tags.slice(0, 2).join(', ')}</span>` : ''}
        </div>
      </div>
    `).join('');

    this.notesList.querySelectorAll('.note-item').forEach(item => {
      item.addEventListener('click', () => this.selectNote(parseInt(item.dataset.id)));
    });
  }

  switchView(view) {
    this.toggleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    const content = document.getElementById('note-content');
    const preview = document.getElementById('note-preview');

    if (view === 'edit') {
      content.classList.remove('hidden');
      preview.classList.add('hidden');
      content.parentElement.classList.remove('split');
    } else if (view === 'preview') {
      content.classList.add('hidden');
      preview.classList.remove('hidden');
      content.parentElement.classList.remove('split');
      this.updatePreview();
    } else if (view === 'split') {
      content.classList.remove('hidden');
      preview.classList.remove('hidden');
      content.parentElement.classList.add('split');
      this.updatePreview();
    }
  }

  updatePreview() {
    // Simple markdown to HTML
    let html = this.contentInput.value
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');

    this.preview.innerHTML = html || '<p class="placeholder">Preview will appear here...</p>';
  }

  updateWordCount() {
    const words = this.contentInput.value.trim().split(/\s+/).filter(w => w).length;
    this.wordCount.textContent = `${words} word${words!== 1? 's' : ''}`;
  }

  updateLastSaved(timestamp) {
    this.lastSaved.textContent = `Saved ${this.formatDate(timestamp)}`;
  }

  updatePinButton(pinned) {
    this.pinBtn.classList.toggle('active', pinned);
  }

  loadNotes() {
    const data = localStorage.getItem('notes');
    return data? JSON.parse(data) : [];
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 2000);
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NotesApp();
});