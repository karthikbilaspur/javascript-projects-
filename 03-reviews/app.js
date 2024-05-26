// local reviews data
const reviews = [
  {
    id: 1,
    name: 'smitha',
    job: 'web developer',
    img: 'E\:javascript\javascript-basic-projects-master\reviews\person1.png',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto asperiores debitis incidunt, eius earum ipsam cupiditate libero?'
  },
  {
    id: 2,
    name: 'johnson',
    job: 'web designer',
    img: 'E\:javascript\javascript-basic-projects-master\reviews\person2.png',
    text:  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iustoasperiores debitis incidunt, eius earum ipsam cupiditate libero?'
   
  },
  {
    id: 3,
    name: 'Ahmad',
    job: 'intern',
    img: 'E\:javascript\javascript-basic-projects-master\reviews\person3.png',
    text: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Iustoasperiores debitis incidunt, eius earum ipsam cupiditate libero?,'
  },
  {
    id: 4,
    name: 'Mikasa',
    job: 'the boss',
    img: 'E\:javascript\javascript-basic-projects-master\reviews\person4.png',
    text: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Iustoasperiores debitis incidunt, eius earum ipsam cupiditate libero?',
  },
];
// select items
const img = document.getElementById('person-img');
const author = document.getElementById('author');
const job = document.getElementById('job');
const info = document.getElementById('info');

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const randomBtn = document.querySelector('.random-btn');

// set starting item
let currentItem = 0;

// load initial item
window.addEventListener('DOMContentLoaded', function () {
  const item = reviews[currentItem];
  img.src = item.img;
  author.textContent = item.name;
  job.textContent = item.job;
  info.textContent = item.text;
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
nextBtn.addEventListener('click', function () {
  currentItem++;
  if (currentItem > reviews.length - 1) {
    currentItem = 0;
  }
  showPerson(currentItem);
});
// show prev person
prevBtn.addEventListener('click', function () {
  currentItem--;
  if (currentItem < 0) {
    currentItem = reviews.length - 1;
  }
  showPerson(currentItem);
});
// show random person
randomBtn.addEventListener('click', function () {
  console.log('hello');

  currentItem = Math.floor(Math.random() * reviews.length);
  showPerson(currentItem);
});
