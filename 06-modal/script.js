// Select all modal buttons and overlays
const modalBtns = document.querySelectorAll('.modal-btn');
const modals = document.querySelectorAll('.modal-overlay');

// 1. Multiple Modals - open based on data attribute
modalBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const modalId = btn.dataset.modal;
    const modal = document.getElementById(modalId);
    
    // 4. Check localStorage for "don't show again"
    if (localStorage.getItem(`hide-${modalId}`) === 'true') {
      alert('You chose not to see this modal again. Clear localStorage to reset.');
      return;
    }
    
    openModal(modal);
  });
});

function openModal(modal) {
  modal.classList.add('open-modal');
  document.body.classList.add('modal-open'); // 3. Prevent page scroll
}

function closeModal(modal) {
  modal.classList.remove('open-modal');
  document.body.classList.remove('modal-open'); // 3. Re-enable scroll
  
  // Reset modal position after closing
  const container = modal.querySelector('.modal-container');
  container.style.transform = 'scale(1) translate(0px, 0px)';
}

// Close modal with X button
modals.forEach(function (modal) {
  const closeBtn = modal.querySelector('.close-btn');
  closeBtn.addEventListener('click', function () {
    closeModal(modal);
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    modals.forEach(function (modal) {
      if (modal.classList.contains('open-modal')) {
        closeModal(modal);
      }
    });
  }
});

// 4. Don't show again functionality
const checkboxes = document.querySelectorAll('.dont-show');
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    const modalId = checkbox.dataset.modal;
    if (checkbox.checked) {
      localStorage.setItem(`hide-${modalId}`, 'true');
    } else {
      localStorage.removeItem(`hide-${modalId}`);
    }
  });
});

// 5. Make modal draggable
modals.forEach(function (modal) {
  const container = modal.querySelector('.modal-container');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  container.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    // Only drag from header area, not buttons/inputs
    if (e.target.closest('.close-btn') || e.target.closest('.checkbox-label')) {
      return;
    }
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
    container.classList.add('dragging');
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      
      container.style.transform = `scale(1) translate(${currentX}px, ${currentY}px)`;
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    container.classList.remove('dragging');
  }
  
  // Reset position when modal closes
  modal.addEventListener('transitionend', function () {
    if (!modal.classList.contains('open-modal')) {
      xOffset = 0;
      yOffset = 0;
      container.style.transform = 'scale(0.7) translate(0px, 0px)';
    }
  });
});