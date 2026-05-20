document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.getElementById('faqAccordion');
  
  // Use event delegation - one listener for all items
  accordion.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    
    const item = header.parentElement;
    const isOpen = item.classList.contains('active');
    
    // Close all other items - remove this block if you want multiple open
    accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
    header.setAttribute('aria-expanded', !isOpen);
  });
  
  // Keyboard support: Space/Enter to toggle
  accordion.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const header = e.target.closest('.accordion-header');
      if (header) {
        e.preventDefault();
        header.click();
      }
    }
  });
});