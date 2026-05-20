// local reviews data - uses your person1.png to person4.png files
const reviews = [
  {
    id: 1,
    name: "Sara Jones",
    job: "UX Designer",
    img: "person1.png",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto asperiores debitis incidunt, eius earum ipsam cupiditate libero? Iusto, itaque aut.",
  },
  {
    id: 2,
    name: "John Smith",
    job: "Web Developer",
    img: "person2.png",
    text: "Helvetica artisan kinfolk thundercats lumbersexual blue bottle. Disrupt glossier gastropub deep v vice franzen hell of brooklyn twee enamel pin fashion axe.",
  },
  {
    id: 3,
    name: "Emma Brown",
    job: "Project Manager",
    img: "person3.png",
    text: "Sriracha literally flexitarian irony, vape marfa unicorn. Glossier tattooed 8-bit, fixie waistcoat offal activated charcoal slow-carb marfa hell of pabst raclette.",
  },
  {
    id: 4,
    name: "Mike Wilson",
    job: "The Boss",
    img: "person4.png",
    text: "Edison bulb put a bird on it humblebrag, marfa pok pok heirloom fashion axe cray stumptown venmo actually seitan. VHS farm-to-table schlitz, edison bulb pop-up 3 wolf moon.",
  },
];

// select items
const img = document.getElementById("person-img");
const author = document.getElementById("author");
const job = document.getElementById("job");
const info = document.getElementById("info");

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const randomBtn = document.querySelector(".random-btn");

// set starting item
let currentItem = 0;

// load initial item
window.addEventListener("DOMContentLoaded", function () {
  showPerson(currentItem);
});

// show person based on item
function showPerson(person) {
  const item = reviews[person];
  img.src = item.img;
  author.textContent = item.name;
  job.textContent = item.job;
  info.textContent = item.text;
}

// show next person
nextBtn.addEventListener("click", function () {
  currentItem++;
  if (currentItem > reviews.length - 1) {
    currentItem = 0; // loop back to first person
  }
  showPerson(currentItem);
});

// show prev person
prevBtn.addEventListener("click", function () {
  currentItem--;
  if (currentItem < 0) {
    currentItem = reviews.length - 1; // loop to last person
  }
  showPerson(currentItem);
});

// show random person
randomBtn.addEventListener("click", function () {
  let randomNumber = Math.floor(Math.random() * reviews.length);
  // make sure we don't get the same person twice in a row
  while (randomNumber === currentItem) {
    randomNumber = Math.floor(Math.random() * reviews.length);
  }
  currentItem = randomNumber;
  showPerson(currentItem);
});