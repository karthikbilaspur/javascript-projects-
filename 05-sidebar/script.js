const toggleBtn = document.querySelector(".sidebar-toggle");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".sidebar-overlay");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const dropdowns = document.querySelectorAll(".dropdown");

// Open sidebar
toggleBtn.addEventListener("click", function () {
  sidebar.classList.add("show-sidebar");
  overlay.classList.add("show-overlay");
});

// Close sidebar
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.classList.remove("show-sidebar");
  overlay.classList.remove("show-overlay");
}

// 1. Close sidebar when a link is clicked
links.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // Don't close if it's a dropdown toggle
    if (!e.currentTarget.classList.contains("dropdown-toggle")) {
      closeSidebar();
    }
  });
});

// 3. Dropdown sub-menus
dropdowns.forEach(function (dropdown) {
  const toggle = dropdown.querySelector(".dropdown-toggle");
  
  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    
    // Close other dropdowns
    dropdowns.forEach(function (item) {
      if (item !== dropdown) {
        item.classList.remove("active");
      }
    });
    
    dropdown.classList.toggle("active");
  });
});

// 5. Active link highlighting based on scroll
window.addEventListener("scroll", function () {
  let current = "";
  
  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });
  
  links.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});