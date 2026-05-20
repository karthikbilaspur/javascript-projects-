document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cards-container');
  const gallery = document.getElementById('gallery');
  const generateBtn = document.getElementById('generate-btn');
  const clearGalleryBtn = document.getElementById('clear-gallery');
  const shapeBtns = document.querySelectorAll('[data-shape]');
  const modeBtns = document.querySelectorAll('[data-mode]');

  let avatarShape = 'round';
  let generateMode = 'single';
  let savedCards = JSON.parse(localStorage.getItem('cardGallery') || '[]');

  const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  const names = ['Alex Johnson', 'Priya Sharma', 'Marcus Chen', 'Sofia Garcia', 'David Kim', 'Emma Wilson', 'Liam Brown', 'Olivia Davis', 'Noah Martinez', 'Ava Taylor'];
  const titles = ['Product Designer', 'Frontend Developer', 'UX Researcher', 'Marketing Manager', 'Data Scientist', 'Content Strategist', 'DevOps Engineer', 'Brand Manager'];
  const socialIcons = ['🐦', '💼', '📷', '🎨', '💻'];

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateLorem(sentences = 2) {
    let text = '';
    for (let i = 0; i < sentences; i++) {
      const sentenceLength = 8 + Math.floor(Math.random() * 8);
      const words = Array.from({ length: sentenceLength }, () => randomItem(loremWords));
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      text += words.join(' ') + '. ';
    }
    return text.trim();
  }

  function generateCard() {
    const id = Date.now() + Math.random();
    const name = randomItem(names);
    const seed = name.toLowerCase().replace(' ', '');

    return {
      id,
      name,
      title: randomItem(titles),
      bio: generateLorem(2),
      avatar: `https://i.pravatar.cc/150?u=${seed}`,
      banner: `https://picsum.photos/seed/${seed}/400/100`,
      socials: socialIcons.sort(() => 0.5 - Math.random()).slice(0, 3)
    };
  }

  function renderCard(data) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
      <div class="card-banner" style="background-image: url(${data.banner}); background-size: cover;"></div>
      <div class="card-body">
        <img src="${data.avatar}" alt="${data.name}" class="avatar ${avatarShape}">
        <h3 class="card-name">${data.name}</h3>
        <p class="card-title">${data.title}</p>
        <p class="card-bio">${data.bio}</p>
        <div class="social-links">
          ${data.socials.map(icon => `<a href="#" onclick="return false">${icon}</a>`).join('')}
        </div>
        <div class="card-actions">
          <button class="btn primary save-btn">💾 Save</button>
          <button class="btn download-btn">⬇️ PNG</button>
        </div>
      </div>
    `;

    // Save to gallery
    card.querySelector('.save-btn').addEventListener('click', () => {
      savedCards.push(data);
      localStorage.setItem('cardGallery', JSON.stringify(savedCards));
      renderGallery();
    });

    // Download as PNG
    card.querySelector('.download-btn').addEventListener('click', () => {
      html2canvas(card, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${data.name.replace(' ', '-')}-card.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });

    return card;
  }

  function renderGallery() {
    gallery.innerHTML = '';
    savedCards.forEach(cardData => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = cardData.avatar;
      img.alt = cardData.name;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-saved';
      delBtn.textContent = '×';
      delBtn.onclick = () => {
        savedCards = savedCards.filter(c => c.id!== cardData.id);
        localStorage.setItem('cardGallery', JSON.stringify(savedCards));
        renderGallery();
      };

      item.appendChild(img);
      item.appendChild(delBtn);
      gallery.appendChild(item);
    });
  }

  function generateCards() {
    cardsContainer.innerHTML = '';
    const count = generateMode === 'grid'? 9 : 1;
    cardsContainer.classList.toggle('grid-mode', generateMode === 'grid');

    for (let i = 0; i < count; i++) {
      const cardData = generateCard();
      cardsContainer.appendChild(renderCard(cardData));
    }
  }

  // Event listeners
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      avatarShape = btn.dataset.shape;
      document.querySelectorAll('.avatar').forEach(av => {
        av.className = `avatar ${avatarShape}`;
      });
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      generateMode = btn.dataset.mode;
    });
  });

  generateBtn.addEventListener('click', generateCards);
  clearGalleryBtn.addEventListener('click', () => {
    if (confirm('Clear all saved cards?')) {
      savedCards = [];
      localStorage.removeItem('cardGallery');
      renderGallery();
    }
  });

  // Init
  generateCards();
  renderGallery();
});