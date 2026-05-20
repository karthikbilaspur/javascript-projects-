const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const dropdowns = document.querySelectorAll(".dropdown");

// Toggle mobile menu
navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("show-links");
  
  // 2. Change hamburger icon to X when menu is open
  const icon = navToggle.querySelector("i");
  if (navLinks.classList.contains("show-links")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// 1. Close menu when a link is clicked
links.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // Don't close if clicking dropdown toggle on mobile
    if (!e.currentTarget.classList.contains("dropdown-toggle")) {
      navLinks.classList.remove("show-links");
      navToggle.querySelector("i").classList.remove("fa-times");
      navToggle.querySelector("i").classList.add("fa-bars");
    }
  });
});

// 3. Toggle dropdown sub-menus
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

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  }
});

// 5. Active link highlighting based on scroll position
window.addEventListener("scroll", function () {
  let current = "";
  
  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // 70px offset for fixed navbar
    if (pageYOffset >= sectionTop - 100) {
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