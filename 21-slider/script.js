// Testimonial Slider Logic
function initTestimonialSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = track.children;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Create dots
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
    [...dots].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Auto-play every 5s
  let autoPlay = setInterval(nextSlide, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => {
    autoPlay = setInterval(nextSlide, 5000);
  });

  // Touch/swipe support for mobile
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  loadCocktails();
  updateFavCount();
  initTestimonialSlider(); // Add this line

  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleSearch);
  alcoholFilter.addEventListener('change', handleSearch);
  document.getElementById('randomBtn').addEventListener('click', getRandomCocktail);
  document.getElementById('favoritesBtn').addEventListener('click', showFavorites);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
});


let cocktailOfTheDay = null;

// Add this inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadCocktails();
  updateFavCount();
  initTestimonialSlider();
  loadCocktailOfTheDay(); // NEW

  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleSearch);
  alcoholFilter.addEventListener('change', handleSearch);
  document.getElementById('randomBtn').addEventListener('click', getRandomCocktail);
  document.getElementById('favoritesBtn').addEventListener('click', showFavorites);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
  document.getElementById('cotdViewBtn').addEventListener('click', () => {
    if (cocktailOfTheDay) showDetails(cocktailOfTheDay.idDrink);
  });
  document.getElementById('cotdShareBtn').addEventListener('click', () => {
    if (cocktailOfTheDay) shareRecipe(cocktailOfTheDay);
  });
});

// NEW: Cocktail of the Day
async function loadCocktailOfTheDay() {
  try {
    // Use date as seed so same cocktail shows all day
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('cotd') || '{}');

    if (saved.date === today && saved.drink) {
      cocktailOfTheDay = saved.drink;
      updateCOTDBanner(saved.drink);
      return;
    }

    const res = await fetch(`${API_BASE}/random.php`);
    const data = await res.json();
    cocktailOfTheDay = data.drinks[0];

    localStorage.setItem('cotd', JSON.stringify({
      date: today,
      drink: cocktailOfTheDay
    }));

    updateCOTDBanner(cocktailOfTheDay);
  } catch (err) {
    document.getElementById('cotdBanner').style.display = 'none';
  }
}

function updateCOTDBanner(drink) {
  document.getElementById('cotdName').textContent = drink.strDrink;
  document.getElementById('cotdDesc').textContent = `${drink.strCategory} · ${drink.strAlcoholic}`;
}

// NEW: Share Recipe Function
function shareRecipe(drink) {
  const text = `Check out this ${drink.strDrink} recipe on Mixology Hub! 🍸\n\nIngredients: ${getIngredientsList(drink).slice(0, 3).join(', ')}...`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: `${drink.strDrink} Recipe`,
      text: text,
      url: url
    }).catch(() => copyToClipboard(text + '\n' + url));
  } else {
    copyToClipboard(text + '\n' + url);
  }
}

function getIngredientsList(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    if (drink[`strIngredient${i}`]) {
      ingredients.push(drink[`strIngredient${i}`]);
    }
  }
  return ingredients;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Recipe link copied! 📋');
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

