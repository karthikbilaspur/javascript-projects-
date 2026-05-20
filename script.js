const projects = [
  { folder: "02-counter", name: "Counter", desc: "Simple increment/decrement counter app" },
  { folder: "03-reviews", name: "Reviews", desc: "Review carousel with prev/next buttons" },
  { folder: "04-navbar", name: "Navbar", desc: "Responsive navbar with toggle" },
  { folder: "05-sidebar", name: "Sidebar", desc: "Collapsible sidebar menu" },
  { folder: "06-modal", name: "Modal", desc: "Popup modal window" },
  { folder: "07-FaqAccordian", name: "FAQ Accordion", desc: "Expandable FAQ section" },
  { folder: "8-Restuarant-Menu", name: "Restaurant Menu", desc: "Filterable menu items" },
  { folder: "09-video", name: "Video", desc: "Custom video player controls" },
  { folder: "10-scroll", name: "Scroll", desc: "Smooth scroll to sections" },
  { folder: "11-tabs", name: "Tabs", desc: "Tabbed content component" },
  { folder: "12-countdown-timer", name: "Countdown Timer", desc: "Event countdown with days/hrs/mins" },
  { folder: "13-lorem-ipsum", name: "Lorem Ipsum", desc: "Random text generator" },
  { folder: "14-grocery-bud", name: "Grocery Bud", desc: "Grocery list with localStorage" },
  { folder: "15-slider", name: "Slider v1", desc: "Image slider/carousel" },
  { folder: "16-counter", name: "Counter v2", desc: "Another counter variation" },
  { folder: "17-dad-jokes", name: "Dad Jokes", desc: "Fetch random dad jokes from API" },
  { folder: "18-notesapp", name: "Notes App", desc: "Create/delete notes with localStorage" },
  { folder: "19-random-user", name: "Random User", desc: "Fetch random user data from API" },
  { folder: "20-cocktails", name: "Cocktails DB", desc: "Search cocktails using API" },
  { folder: "21-slider", name: "Slider v2", desc: "Advanced slider component" },
  { folder: "22-stripe-submenus", name: "Stripe Submenus", desc: "Stripe-style dropdown menus" },
  { folder: "23-pagination", name: "Pagination", desc: "Client-side pagination" },
  { folder: "24-Collapsable", name: "Collapsable", desc: "Collapsable content sections" },
  { folder: "25-Placeholder", name: "Placeholder", desc: "Coming soon..." }
];

const grid = document.getElementById("projects-grid");
const searchInput = document.getElementById("search");

function displayProjects(projectList) {
  grid.innerHTML = "";
  projectList.forEach(project => {
    const num = project.folder.match(/\d+/)?.[0] || "";
    const card = document.createElement("a");
    card.href = `./${project.folder}/index.html`;
    card.className = "project-card";
    card.innerHTML = `
      <span class="project-num">#${num}</span>
      <h3>${project.name}</h3>
      <p>${project.desc}</p>
    `;
    grid.appendChild(card);
  });
}

// Initial load
displayProjects(projects);

// Search filter
searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(term) || 
    p.desc.toLowerCase().includes(term)
  );
  displayProjects(filtered);
});