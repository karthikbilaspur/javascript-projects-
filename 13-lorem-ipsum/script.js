document.addEventListener('DOMContentLoaded', () => {
  const styleSelect = document.getElementById('style-select');
  const typeSelect = document.getElementById('type-select');
  const countInput = document.getElementById('count-input');
  const htmlCheckbox = document.getElementById('html-checkbox');
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const txtBtn = document.getElementById('txt-btn');
  const jsonBtn = document.getElementById('json-btn');
  const output = document.getElementById('output');
  const stats = document.getElementById('stats');
  const previewContent = document.getElementById('preview-content');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // 1. Word banks for different styles
  const WORD_BANKS = {
    lorem: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'],
    bacon: ['bacon', 'ipsum', 'dolor', 'amet', 'porchetta', 'beef', 'pancetta', 'salami', 'turkey', 'shank', 'pork', 'chop', 'frankfurter', 'shankle', 'ham', 'hock', 'corned', 'beef', 'jerky', 'meatball', 'sirloin', 'swine', 'ground', 'round', 'drumstick'],
    cupcake: ['cupcake', 'ipsum', 'dolor', 'sit', 'amet', 'candy', 'chocolate', 'cheesecake', 'jelly', 'beans', 'marshmallow', 'sugar', 'plum', 'gummies', 'toffee', 'donut', 'tiramisu', 'caramels', 'cookie', 'pie', 'tart', 'brownie', 'pudding', 'macaroon'],
    pirate: ['pirate', 'ipsum', 'ahoy', 'matey', 'ye', 'scurvy', 'landlubber', 'yo-ho', 'booty', 'treasure', 'grog', 'heave', 'ho', 'cannons', 'jolly', 'roger', 'plank', 'walk', 'sea', 'shiver', 'me', 'timbers', 'buccaneer', 'corsair', 'doubloons'],
    hipster: ['hipster', 'ipsum', 'kale', 'chips', 'artisan', 'palo', 'santo', 'pour-over', 'single-origin', 'coffee', 'tote', 'bag', 'banjo', 'bicycle', 'rights', 'street', 'art', 'subway', 'tile', 'taxidermy', 'quinoa', 'small', 'batch', '8-bit', 'activated', 'charcoal']
  };

  const SENTENCE_TEMPLATES = [
    '{words}.',
    '{words}, {words}.',
    '{words} {words} {words}.',
    '{words}, {words} {words}.'
  ];

  // 2. Core generator functions
  function getRandomWord(style) {
    const bank = WORD_BANKS[style] || WORD_BANKS.lorem;
    return bank[Math.floor(Math.random() * bank.length)];
  }

  function generateWords(style, count) {
    const words = [];
    for (let i = 0; i < count; i++) {
      let word = getRandomWord(style);
      if (i === 0) word = word.charAt(0).toUpperCase() + word.slice(1);
      words.push(word);
    }
    return words.join(' ');
  }

  function generateSentence(style) {
    const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    return template.replace(/{words}/g, () => generateWords(style, Math.floor(Math.random() * 8) + 4));
  }

  function generateParagraph(style) {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(style));
    }
    return sentences.join(' ');
  }

  // 3. Main generate function
  function generate() {
    const style = styleSelect.value;
    const type = typeSelect.value;
    const count = parseInt(countInput.value);
    const useHTML = htmlCheckbox.checked;

    let result = '';
    let rawText = '';

    if (type === 'words') {
      rawText = generateWords(style, count);
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(style));
      }
      rawText = sentences.join(' ');
    } else if (type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(style));
      }
      rawText = paragraphs.join('\n\n');
    } else if (type === 'chars') {
      // 4. Character limit mode
      while (rawText.length < count) {
        rawText += getRandomWord(style) + ' ';
      }
      rawText = rawText.slice(0, count).trim();
      if (rawText[count - 1]!== '.' && rawText[count - 1]!== ' ') {
        rawText = rawText.slice(0, rawText.lastIndexOf(' ')) + '.';
      }
    }

    result = useHTML? rawText.split('\n\n').map(p => `<p>${p}</p>`).join('\n') : rawText;
    output.value = result;
    updateStats(rawText);
    updatePreview(result, useHTML);
  }

  function updateStats(text) {
    const words = text.trim()? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    stats.textContent = `${words} words • ${chars} characters`;
  }

  // 5. Rich text preview
  function updatePreview(text, isHTML) {
    previewContent.innerHTML = isHTML? text : text.replace(/\n\n/g, '<p>').replace(/\n/g, '<br>') + '</p>';
  }

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });

  // 2. Export functions
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy to Clipboard', 2000);
  });

  txtBtn.addEventListener('click', () => {
    downloadFile(output.value, 'lorem-ipsum.txt', 'text/plain');
  });

  jsonBtn.addEventListener('click', () => {
    const json = JSON.stringify({
      style: styleSelect.value,
      type: typeSelect.value,
      count: countInput.value,
      html: htmlCheckbox.checked,
      content: output.value
    }, null, 2);
    downloadFile(json, 'lorem-ipsum.json', 'application/json');
  });

  // 3. API mode from URL params
  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('type')) typeSelect.value = params.get('type');
    if (params.has('count')) countInput.value = params.get('count');
    if (params.has('style')) styleSelect.value = params.get('style');
    if (params.has('html')) htmlCheckbox.checked = params.get('html') === 'true';

    if (params.toString()) {
      generate();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  generateBtn.addEventListener('click', generate);

  // Character mode handling
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'chars') {
      countInput.value = 280;
      countInput.max = 1000;
    } else {
      countInput.max = 50;
      if (countInput.value > 50) countInput.value = 3;
    }
  });

  loadFromURL();
  generate(); // Initial generation
});