// Mock plant database since there's no free plant API like TheCocktailDB
const PLANTS = [
  {
    id: '1', name: 'Monstera Deliciosa', scientific: 'Monstera deliciosa',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    light: 'Medium', difficulty: 'Easy', water: 'Weekly', petSafe: false,
    description: 'Iconic split-leaf plant. Great for beginners. Loves humidity.',
    care: { light: 'Bright indirect light', water: 'Water when top 2" of soil is dry', humidity: '50-60%', temp: '65-85°F' }
  },
  {
    id: '2', name: 'Snake Plant', scientific: 'Sansevieria trifasciata',
    image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400',
    light: 'Low', difficulty: 'Easy', water: 'Bi-weekly', petSafe: false,
    description: 'Nearly indestructible. Perfect for dark corners and forgetful owners.',
    care: { light: 'Low to bright indirect', water: 'Every 2-3 weeks', humidity: '30-50%', temp: '60-85°F' }
  },
  {
    id: '3', name: 'Fiddle Leaf Fig', scientific: 'Ficus lyrata',
    image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400',
    light: 'Bright', difficulty: 'Hard', water: 'Weekly', petSafe: false,
    description: 'Dramatic statement plant. Finicky but rewarding with proper care.',
    care: { light: 'Bright indirect light', water: 'Weekly, keep soil moist', humidity: '40-60%', temp: '65-75°F' }
  },
  {
    id: '4', name: 'Pothos', scientific: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1583906866618-5d33eb0f7f9c?w=400',
    light: 'Low', difficulty: 'Easy', water: 'Weekly', petSafe: false,
    description: 'Trailing vine that grows fast. Great for hanging baskets.',
    care: { light: 'Low to bright indirect', water: 'When soil is dry', humidity: '40-60%', temp: '65-85°F' }
  },
  {
    id: '5', name: 'Peace Lily', scientific: 'Spathiphyllum',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    light: 'Low', difficulty: 'Easy', water: 'Weekly', petSafe: false,
    description: 'Elegant white flowers. Tells you when it needs water by drooping.',
    care: { light: 'Low to medium indirect', water: 'Keep soil moist', humidity: '50-60%', temp: '65-80°F' }
  },
  {
    id: '6', name: 'Spider Plant', scientific: 'Chlorophytum comosum',
    image: 'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=400',
    light: 'Medium', difficulty: 'Easy', water: 'Weekly', petSafe: true,
    description: 'Pet-safe plant that produces baby spiderettes. Air purifying.',
    care: { light: 'Bright indirect light', water: 'Weekly', humidity: '40-60%', temp: '60-80°F' }
  },
  {
    id: '7', name: 'String of Pearls', scientific: 'Senecio rowleyanus',
    image: 'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=400',
    light: 'Bright', difficulty: 'Medium', water: 'Bi-weekly', petSafe: false,
    description: 'Unique succulent with pearl-like leaves. Great hanging plant.',
    care: { light: 'Bright direct light', water: 'Every 2-3 weeks', humidity: '30-40%', temp: '70-80°F' }
  },
  {
    id: '8', name: 'ZZ Plant', scientific: 'Zamioculcas zamiifolia',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400',
    light: 'Low', difficulty: 'Easy', water: 'Monthly', petSafe: false,
    description: 'Thrives on neglect. Glossy leaves and drought tolerant.',
    care: { light: 'Low to bright indirect', water: 'Every 3-4 weeks', humidity: '40-50%', temp: '65-75°F' }
  }
];

const grid = document.getElementById('plantGrid');
const searchInput = document.getElementById('searchInput');
const lightFilter = document.getElementById('lightFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const wishCount = document.getElementById('wishCount');

let debounceTimer;
let wishlist = JSON.parse(localStorage.getItem('plantWishlist') || '[]');
let plantOfTheDay = null;

document.addEventListener('DOMContentLoaded', () => {
  loadPlants();
  updateWishCount();
  initTestimonialSlider();
  loadPlantOfTheDay();

  searchInput.addEventListener('input', handleSearch);
  lightFilter.addEventListener('change', handleSearch);
  difficultyFilter.addEventListener('change', handleSearch);
  document.getElementById('randomBtn').addEventListener('click', getRandomPlant);
  document.getElementById('wishlistBtn').addEventListener('click', showWishlist);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
  document.getElementById('potdViewBtn').addEventListener('click', () => {
    if (plantOfTheDay) showDetails(plantOfTheDay.id);
  });
  document.getElementById('potdShareBtn').addEventListener('click', () => {
    if (plantOfTheDay) sharePlant(plantOfTheDay);
  });
});

function handleSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadPlants, 300);
}

function loadPlants() {
  const search = searchInput.value.toLowerCase().trim();
  const light = lightFilter.value;
  const difficulty = difficultyFilter.value;

  showLoader(true);

  setTimeout(() => {
    let filtered = PLANTS.filter(plant => {
      const matchesSearch =!search ||
        plant.name.toLowerCase().includes(search) ||
        plant.scientific.toLowerCase().includes(search);
      const matchesLight =!light || plant.light === light;
      const matchesDifficulty =!difficulty || plant.difficulty === difficulty;
      return matchesSearch && matchesLight && matchesDifficulty;
    });

    renderPlants(filtered);
    showLoader(false);
  }, 300);
}

function renderPlants(plants) {
  if (!plants || plants.length === 0) {
    showEmpty();
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = plants.map(plant => `
    <div class="card" onclick="showDetails('${plant.id}')">
      <div class="difficulty-badge difficulty-${plant.difficulty.toLowerCase()}">${plant.difficulty}</div>
      <img src="${plant.image}" alt="${plant.name}" loading="lazy">
      <div class="card-content">
        <h3>${plant.name}</h3>
        <p>${plant.light} Light · ${plant.water} Water</p>
      </div>
    </div>
  `).join('');
}

function showDetails(id) {
  const plant = PLANTS.find(p => p.id === id);
  if (!plant) return;

  const isWish = wishlist.includes(id);

  modalBody.innerHTML = `
    <div class="modal-body-content">
      <img src="${plant.image}" alt="${plant.name}">
      <div>
        <h2>${plant.name}</h2>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem; font-style: italic;">
          ${plant.scientific}
        </p>
        <p style="margin-bottom: 1.5rem;">${plant.description}</p>

        <h4 style="margin-bottom: 0.75rem;">Care Guide</h4>
        <div class="care-info">
          <div class="care-item">
            <div class="care-icon">☀️</div>
            <div class="care-text">
              <strong>Light</strong>
              <span>${plant.care.light}</span>
            </div>
          </div>
          <div class="care-item">
            <div class="care-icon">💧</div>
            <div class="care-text">
              <strong>Water</strong>
              <span>${plant.care.water}</span>
            </div>
          </div>
          <div class="care-item">
            <div class="care-icon">💨</div>
            <div class="care-text">
              <strong>Humidity</strong>
              <span>${plant.care.humidity}</span>
            </div>
          <div class="care-item">
            <div class="care-icon">🌡️</div>
            <div class="care-text">
              <strong>Temperature</strong>
              <span>${plant.care.temp}</span>
            </div>
          </div>
          <div class="care-item">
            <div class="care-icon">${plant.petSafe? '🐾' : '⚠️'}</div>
            <div class="care-text">
              <strong>Pet Safety</strong>
              <span>${plant.petSafe? 'Pet-safe' : 'Toxic to pets'}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button onclick="toggleWishlist('${id}')" class="btn-secondary" style="flex: 1;">
            ${isWish? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
          <button onclick='sharePlant(${JSON.stringify(plant).replace(/'/g, "&apos;")})' class="btn-primary" style="flex: 1;">
            Share Plant ↗
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function getRandomPlant() {
  const random = PLANTS[Math.floor(Math.random() * PLANTS.length)];
  showDetails(random.id);
}

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem('plantWishlist', JSON.stringify(wishlist));
  updateWishCount();
  loadPlants();
  closeModal();
}

function showWishlist() {
  if (wishlist.length === 0) {
    alert('No plants in wishlist yet! Add some 🌿');
    return;
  }
  const plants = PLANTS.filter(p => wishlist.includes(p.id));
  renderPlants(plants);
  searchInput.value = '';
}

function updateWishCount() {
  wishCount.textContent = wishlist.length;
}

// Plant of the Day
function loadPlantOfTheDay() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('potd') || '{}');

  if (saved.date === today && saved.plant) {
    plantOfTheDay = saved.plant;
    updatePOTDBanner(saved.plant);
    return;
  }

  plantOfTheDay = PLANTS[Math.floor(Math.random() * PLANTS.length)];
  localStorage.setItem('potd', JSON.stringify({ date: today, plant: plantOfTheDay }));
  updatePOTDBanner(plantOfTheDay);
}

function updatePOTDBanner(plant) {
  document.getElementById('potdName').textContent = plant.name;
  document.getElementById('potdDesc').textContent = `${plant.light} Light · ${plant.difficulty} Care`;
}

// Share Plant
function sharePlant(plant) {
  const text = `Check out the ${plant.name} on GreenLeaf! 🌿\n\nCare: ${plant.light} light, ${plant.water} water. ${plant.description}`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({ title: `${plant.name} Care Guide`, text: text, url: url })
     .catch(() => copyToClipboard(text + '\n' + url));
  } else {
    copyToClipboard(text + '\n' + url);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Plant link copied! 📋'));
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Testimonial Slider
function initTestimonialSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = track.children;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.children;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    [...dots].forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) { currentIndex = index; updateSlider(); }
  function nextSlide() { currentIndex = (currentIndex + 1) % totalSlides; updateSlider(); }
  function prevSlide() { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updateSlider(); }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  let autoPlay = setInterval(nextSlide, 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => autoPlay = setInterval(nextSlide, 5000));

  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function showLoader(show) { loader.classList.toggle('hidden',!show); }
function showEmpty() { emptyState.classList.remove('hidden '); grid.innerHTML = ''; }