const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';
const grid = document.getElementById('cocktailGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const alcoholFilter = document.getElementById('alcoholFilter');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const favCount = document.getElementById('favCount');

let debounceTimer;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadCocktails();
  updateFavCount();

  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleSearch);
  alcoholFilter.addEventListener('change', handleSearch);
  document.getElementById('randomBtn').addEventListener('click', getRandomCocktail);
  document.getElementById('favoritesBtn').addEventListener('click', showFavorites);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
});

function handleSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadCocktails, 400);
}

async function loadCocktails() {
  const search = searchInput.value.trim();
  const category = categoryFilter.value;
  const alcohol = alcoholFilter.value;

  showLoader(true);
  grid.innerHTML = '';

  try {
    let url = `${API_BASE}/search.php?s=${search}`;
    const res = await fetch(url);
    const data = await res.json();
    let drinks = data.drinks || [];

    // Filter client-side since API doesn't support multi-filter
    if (category) drinks = drinks.filter(d => d.strCategory === category);
    if (alcohol) drinks = drinks.filter(d => d.strAlcoholic === alcohol);

    renderCocktails(drinks);
  } catch (err) {
    console.error(err);
    showEmpty();
  } finally {
    showLoader(false);
  }
}

function renderCocktails(drinks) {
  if (!drinks || drinks.length === 0) {
    showEmpty();
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = drinks.map(drink => `
    <div class="card" onclick="showDetails('${drink.idDrink}')">
      ${favorites.includes(drink.idDrink)? '<div class="fav-badge">♥</div>' : ''}
      <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}" loading="lazy">
      <div class="card-content">
        <h3>${drink.strDrink}</h3>
        <p>${drink.strCategory} · ${drink.strAlcoholic}</p>
      </div>
    </div>
  `).join('');
}

async function showDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    const drink = data.drinks[0];

    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      if (drink[`strIngredient${i}`]) {
        ingredients.push(`${drink[`strMeasure${i}`] || ''} ${drink[`strIngredient${i}`]}`.trim());
      }
    }

    const isFav = favorites.includes(id);

    modalBody.innerHTML = `
      <div class="modal-body-content">
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <div>
          <h2>${drink.strDrink}</h2>
          <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">
            ${drink.strCategory} · ${drink.strAlcoholic} · ${drink.strGlass}
          </p>

          <h4 style="margin-bottom: 0.75rem;">Ingredients</h4>
          <ul class="ingredients">
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>

          <h4 style="margin: 1.5rem 0 0.75rem;">Instructions</h4>
          <p style="line-height: 1.7;">${drink.strInstructions}</p>

          <button onclick="toggleFavorite('${id}')" class="btn-secondary" style="margin-top: 1.5rem; width: 100%;">
            ${isFav? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error(err);
  }
}

async function getRandomCocktail() {
  showLoader(true);
  try {
    const res = await fetch(`${API_BASE}/random.php`);
    const data = await res.json();
    showDetails(data.drinks[0].idDrink);
  } catch (err) {
    console.error(err);
  } finally {
    showLoader(false);
  }
}

function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavCount();
  loadCocktails();
  closeModal();
}

function showFavorites() {
  if (favorites.length === 0) {
    alert('No favorites yet! Add some cocktails ♥');
    return;
  }
  Promise.all(favorites.map(id =>
    fetch(`${API_BASE}/lookup.php?i=${id}`).then(r => r.json())
  )).then(results => {
    const drinks = results.map(r => r.drinks[0]);
    renderCocktails(drinks);
    searchInput.value = '';
  });
}

function updateFavCount() {
  favCount.textContent = favorites.length;
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function showLoader(show) {
  loader.classList.toggle('hidden',!show);
}

function showEmpty() {
  emptyState.classList.remove('hidden');
  grid.innerHTML = '';
}