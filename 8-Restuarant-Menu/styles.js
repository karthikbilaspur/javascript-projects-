const buttons = document.querySelectorAll('.button');
const menus = document.querySelectorAll('.menu');

// Create sliding highlight element
const highlight = document.createElement('span');
highlight.classList.add('highlight');
document.querySelector('.buttons-container').appendChild(highlight);

// Set initial position of highlight
function moveHighlight(target) {
  const buttonRect = target.getBoundingClientRect();
  const containerRect = target.parentElement.getBoundingClientRect();

  highlight.style.width = `${buttonRect.width}px`;
  highlight.style.height = `${buttonRect.height}px`;
  highlight.style.transform = `translate(${buttonRect.left - containerRect.left}px, ${buttonRect.top - containerRect.top}px)`;
}

function setActiveTab(targetButton) {
  // Update button states + ARIA
  buttons.forEach(button => {
    const isActive = button === targetButton;
    button.classList.toggle('button--is-active', isActive);
    button.setAttribute('aria-selected', isActive);
  });

  // Move highlight
  moveHighlight(targetButton);

  // Show target menu, hide others
  const targetId = targetButton.dataset.target;
  menus.forEach(menu => {
    const isTarget = menu.id === targetId;
    menu.classList.toggle('menu--is-visible', isTarget);
    menu.hidden =!isTarget;
  });
}

function handleClick(e) {
  e.preventDefault();
  setActiveTab(this);
}

// Keyboard navigation for tabs
function handleKeydown(e) {
  const currentIndex = Array.from(buttons).indexOf(document.activeElement);
  let newIndex;

  switch(e.key) {
    case 'ArrowRight':
      e.preventDefault();
      newIndex = currentIndex + 1 < buttons.length? currentIndex + 1 : 0;
      buttons[newIndex].focus();
      setActiveTab(buttons[newIndex]);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = currentIndex - 1 >= 0? currentIndex - 1 : buttons.length - 1;
      buttons[newIndex].focus();
      setActiveTab(buttons[newIndex]);
      break;
    case 'Home':
      e.preventDefault();
      buttons[0].focus();
      setActiveTab(buttons[0]);
      break;
    case 'End':
      e.preventDefault();
      buttons[buttons.length - 1].focus();
      setActiveTab(buttons[buttons.length - 1]);
      break;
  }
}

// Init
window.addEventListener('load', () => {
  const activeButton = document.querySelector('.button--is-active');
  if (activeButton) moveHighlight(activeButton);
});

window.addEventListener('resize', () => {
  const activeButton = document.querySelector('.button--is-active');
  if (activeButton) moveHighlight(activeButton);
});

buttons.forEach(button => {
  button.addEventListener('click', handleClick);
  button.addEventListener('keydown', handleKeydown);
});