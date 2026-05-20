// Mock art database - replace with real API if needed
const ARTWORKS = Array.from({ length: 47 }, (_, i) => ({
  id: String(i + 1),
  title: `Masterpiece #${i + 1}`,
  artist: ['Leonardo da Vinci', 'Vincent van Gogh', 'Frida Kahlo', 'Pablo Picasso', 'Claude Monet'][i % 5],
  year: 1400 + Math.floor(Math.random() * 600),
  era: ['Renaissance', 'Baroque', 'Impressionism', 'Modern', 'Contemporary'][i % 5],
  type: ['Painting', 'Sculpture', 'Photography', 'Digital'][i % 4],
  image: `https://picsum.photos/seed/art${i + 1}/600/400`,
  description: 'A stunning piece showcasing the artist\'s mastery of form, color, and emotion. This work represents a pivotal moment in art history.',
  medium: ['Oil on Canvas', 'Marble', 'Watercolor', 'Digital'][i % 4],
  dimensions: `${50 + Math.floor(Math.random() * 100)} × ${40 + Math.floor(Math.random() * 80)} cm`
}));

let currentPage = 1;
let itemsPerPage = 12;
let filteredArtworks = [...ARTWORKS];
let savedArtworks = JSON.parse(localStorage.getItem('savedArt') || '[]');

// DOM Elements
const grid = document.getElementById('artGrid');
const searchInput = document.getElementById('searchInput');
const eraFilter = document.getElementById('eraFilter');
const typeFilter = document.getElementById('typeFilter');
const perPageSelect = document.getElementById('perPageSelect');
const resultCount = document.getElementById('resultCount');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const savedCount = document.getElementById('savedCount');
const pagination = document.getElementById('pagination');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

document.addEventListener('DOMContentLoaded', () => {
  loadArtworks();
  updateSavedCount();

  searchInput.addEventListener('input', debounce(handleFilter, 300));
  eraFilter.addEventListener('change', handleFilter);
  typeFilter.addEventListener('change', handleFilter);
  perPageSelect.addEventListener('change', handlePerPageChange);
  document.getElementById('shuffleBtn').addEventListener('click', shuffleGallery);
  document.getElementById('savedBtn').addEventListener('click', showSaved);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
  prevPage.addEventListener('click', () => changePage(currentPage - 1));
  nextPage.addEventListener('click', () => changePage(currentPage + 1));
});

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function handleFilter() {
  currentPage = 1;
  loadArtworks();
}

function handlePerPageChange() {
  itemsPerPage = parseInt(perPageSelect.value);
  currentPage = 1;
  loadArtworks();
}

function loadArtworks() {
  showLoader(true);
  const search = searchInput.value.toLowerCase().trim();
  const era = eraFilter.value;
  const type = typeFilter.value;

  setTimeout(() => {
    filteredArtworks = ARTWORKS.filter(art => {
      const matchesSearch =!search ||
        art.title.toLowerCase().includes(search) ||
        art.artist.toLowerCase().includes(search);
      const matchesEra =!era || art.era === era;
      const matchesType =!type || art.type === type;
      return matchesSearch && matchesEra && matchesType;
    });

    renderArtworks();
    renderPagination();
    showLoader(false);
  }, 300);
}

function renderArtworks() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredArtworks.slice(start, end);

  resultCount.textContent = `Showing ${start + 1}-${Math.min(end, filteredArtworks.length)} of ${filteredArtworks.length} artworks`;

  if (pageItems.length === 0) {
    showEmpty();
    pagination.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  pagination.classList.remove('hidden');

  grid.innerHTML = pageItems.map(art => `
    <div class="card" onclick="showDetails('${art.id}')">
      <img src="${art.image}" alt="${art.title}" loading="lazy">
      <div class="card-content">
        <h3>${art.title}</h3>
        <p>${art.artist} · ${art.year}</p>
      </div>
    </div>
  `).join('');
}

function renderPagination() {
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);

  if (totalPages <= 1) {
    pagination.classList.add('hidden');
    return;
  }

  pagination.classList.remove('hidden');
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;

  pageNumbers.innerHTML = '';
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    pageNumbers.appendChild(createPageNum(1));
    if (startPage > 2) pageNumbers.appendChild(createDots());
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.appendChild(createPageNum(i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.appendChild(createDots());
    pageNumbers.appendChild(createPageNum(totalPages));
  }
}

function createPageNum(num) {
  const btn = document.createElement('button');
  btn.className = `page-num ${num === currentPage? 'active' : ''}`;
  btn.textContent = num;
  btn.onclick = () => changePage(num);
  return btn;
}

function createDots() {
  const dots = document.createElement('span');
  dots.className = 'page-num dots';
  dots.textContent = '...';
  return dots;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderArtworks();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDetails(id) {
  const art = ARTWORKS.find(a => a.id === id);
  if (!art) return;

  const isSaved = savedArtworks.includes(id);

  modalBody.innerHTML = `
    <div class="modal-body-content">
      <img src="${art.image}" alt="${art.title}">
      <div>
        <h2>${art.title}</h2>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">
          by ${art.artist}, ${art.year}
        </p>
        <p style="margin-bottom: 1.5rem;">${art.description}</p>

        <div class="art-meta">
          <div class="meta-item">
            <strong>Era</strong>
            <span>${art.era}</span>
          </div>
          <div class="meta-item">
            <strong>Type</strong>
            <span>${art.type}</span>
          </div>
          <div class="meta-item">
            <strong>Medium</strong>
            <span>${art.medium}</span>
          </div>
          <div class="meta-item">
            <strong>Dimensions</strong>
            <span>${art.dimensions}</span>
          </div>
        </div>

        <button onclick="toggleSaved('${id}')" class="btn-primary" style="width: 100%; margin-top: 1rem;">
          ${isSaved? 'Remove from Collection' : 'Save to Collection'} ★
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function shuffleGallery() {
  filteredArtworks = [...ARTWORKS].sort(() => Math.random() - 0.5);
  currentPage = 1;
  searchInput.value = '';
  eraFilter.value = '';
  typeFilter.value = '';
  renderArtworks();
  renderPagination();
}

function toggleSaved(id) {
  const idx = savedArtworks.indexOf(id);
  if (idx > -1) {
    savedArtworks.splice(idx, 1);
  } else {
    savedArtworks.push(id);
  }
  localStorage.setItem('savedArt', JSON.stringify(savedArtworks));
  updateSavedCount();
  closeModal();
}

function showSaved() {
  if (savedArtworks.length === 0) {
    alert('No artworks saved yet! Start your collection ★');
    return;
  }
  filteredArtworks = ARTWORKS.filter(a => savedArtworks.includes(a.id));
  currentPage = 1;
  searchInput.value = '';
  eraFilter.value = '';
  typeFilter.value = '';
  renderArtworks();
  renderPagination();
}

function updateSavedCount() {
  savedCount.textContent = savedArtworks.length;
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function showLoader(show) { loader.classList.toggle('hidden',!show); }
function showEmpty() { emptyState.classList.remove('hidden'); grid.innerHTML = ''; }