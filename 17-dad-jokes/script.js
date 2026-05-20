class DadJokeApp {
  constructor() {
    this.currentJoke = null;
    this.favorites = this.loadFavorites();

    // DOM elements
    this.jokeText = document.getElementById('joke-text');
    this.getJokeBtn = document.getElementById('get-joke');
    this.saveJokeBtn = document.getElementById('save-joke');
    this.copyJokeBtn = document.getElementById('copy-joke');
    this.shareJokeBtn = document.getElementById('share-joke');
    this.safeModeCheck = document.getElementById('safe-mode');
    this.jokeTypeSelect = document.getElementById('joke-type');
    this.favoritesList = document.getElementById('favorites-list');
    this.favoritesCount = document.getElementById('favorites-count');
    this.clearFavoritesBtn = document.getElementById('clear-favorites');
    this.toast = document.getElementById('toast');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderFavorites();
    this.getRandomJoke(); // Load first joke on start
  }

  bindEvents() {
    this.getJokeBtn.addEventListener('click', () => this.getRandomJoke());
    this.saveJokeBtn.addEventListener('click', () => this.saveCurrentJoke());
    this.copyJokeBtn.addEventListener('click', () => this.copyJoke());
    this.shareJokeBtn.addEventListener('click', () => this.shareJoke());
    this.clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
  }

  async getRandomJoke() {
    try {
      this.setLoading(true);

      // Using icanhazdadjoke.com API - free, no key needed
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dad Joke App - Learning Project'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch joke');

      const data = await response.json();
      this.currentJoke = {
        id: data.id,
        joke: data.joke,
        timestamp: Date.now()
      };

      this.displayJoke(this.currentJoke.joke);
      this.enableButtons();

    } catch (error) {
      this.displayError('Failed to load joke. Try again!');
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  displayJoke(joke) {
    this.jokeText.textContent = joke;
    this.jokeText.classList.add('fade-in');
    setTimeout(() => this.jokeText.classList.remove('fade-in'), 300);
  }

  displayError(message) {
    this.jokeText.textContent = message;
    this.jokeText.style.color = 'var(--clr-red-dark)';
    setTimeout(() => {
      this.jokeText.style.color = '';
    }, 2000);
  }

  setLoading(isLoading) {
    this.getJokeBtn.disabled = isLoading;
    this.getJokeBtn.textContent = isLoading? 'Loading...' : 'Get Joke';
  }

  enableButtons() {
    this.saveJokeBtn.disabled = false;
    this.copyJokeBtn.disabled = false;
    this.shareJokeBtn.disabled = false;
  }

  saveCurrentJoke() {
    if (!this.currentJoke) return;

    const exists = this.favorites.some(f => f.id === this.currentJoke.id);
    if (exists) {
      this.showToast('Already saved!');
      return;
    }

    this.favorites.unshift(this.currentJoke);
    this.saveFavorites();
    this.renderFavorites();
    this.showToast('Joke saved! ⭐');
  }

  async copyJoke() {
    if (!this.currentJoke) return;
    try {
      await navigator.clipboard.writeText(this.currentJoke.joke);
      this.showToast('Copied to clipboard! 📋');
    } catch {
      this.showToast('Failed to copy');
    }
  }

  async shareJoke() {
    if (!this.currentJoke) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dad Joke',
          text: this.currentJoke.joke
        });
      } catch (err) {
        if (err.name!== 'AbortError') this.copyJoke();
      }
    } else {
      this.copyJoke(); // Fallback to copy
    }
  }

  renderFavorites() {
    this.favoritesCount.textContent = `(${this.favorites.length})`;

    if (this.favorites.length === 0) {
      this.favoritesList.innerHTML = '<p class="empty-state">No saved jokes yet. Go save some groaners!</p>';
      return;
    }

    this.favoritesList.innerHTML = this.favorites.map(joke => `
      <div class="favorite-item" data-id="${joke.id}">
        <p>${joke.joke}</p>
        <div class="favorite-actions">
          <button class="btn-small copy-fav">Copy</button>
          <button class="btn-small delete-fav">Delete</button>
        </div>
      </div>
    `).join('');

    // Bind events for new elements
    this.favoritesList.querySelectorAll('.copy-fav').forEach((btn, idx) => {
      btn.addEventListener('click', () => this.copyFavorite(idx));
    });

    this.favoritesList.querySelectorAll('.delete-fav').forEach((btn, idx) => {
      btn.addEventListener('click', () => this.deleteFavorite(idx));
    });
  }

  async copyFavorite(index) {
    const joke = this.favorites[index];
    await navigator.clipboard.writeText(joke.joke);
    this.showToast('Copied! 📋');
  }

  deleteFavorite(index) {
    this.favorites.splice(index, 1);
    this.saveFavorites();
    this.renderFavorites();
    this.showToast('Deleted');
  }

  clearFavorites() {
    if (this.favorites.length === 0) return;
    if (confirm('Delete all saved jokes?')) {
      this.favorites = [];
      this.saveFavorites();
      this.renderFavorites();
      this.showToast('All jokes cleared');
    }
  }

  loadFavorites() {
    const data = localStorage.getItem('dadJokes');
    return data? JSON.parse(data) : [];
  }

  saveFavorites() {
    localStorage.setItem('dadJokes', JSON.stringify(this.favorites));
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2000);
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  new DadJokeApp();
});