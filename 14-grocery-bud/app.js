// ****** select items **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const loremBtn = document.querySelector(".lorem-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** Lorem data banks **********
const loremNames = [
  "Lorem Chair", "Ipsum Table", "Dolor Sofa", "Sit Lamp", "Amet Desk", 
  "Consectetur Shelf", "Adipiscing Mug", "Elit Vase", "Eiusmod Clock", "Tempor Rug"
];
const loremSentences = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Pellentesque habitant morbi tristique senectus et netus.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa."
];

// ****** event listeners **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
loremBtn.addEventListener("click", generateLoremItem);
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.trim();
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const itemData = createItemData(id, value);
    createListItem(itemData);
    displayAlert("item added to the list", "success");
    container.classList.add("show-container");
    addToLocalStorage(itemData);
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.querySelector('.title').textContent = value;
    displayAlert("value changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

// Generate full lorem product
function generateLoremItem() {
  const id = new Date().getTime().toString();
  const name = loremNames[Math.floor(Math.random() * loremNames.length)];
  const itemData = createItemData(id, name);
  createListItem(itemData);
  displayAlert("lorem item generated", "success");
  container.classList.add("show-container");
  addToLocalStorage(itemData);
}

// Create full item data object
function createItemData(id, name) {
  return {
    id,
    name,
    desc: loremSentences[Math.floor(Math.random() * loremSentences.length)],
    price: (Math.random() * 90 + 10).toFixed(2),
    img: `https://picsum.photos/seed/${id}/100/100`
  };
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  editElement = element;
  grocery.value = element.querySelector('.title').textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "add item";
}

// ****** local storage **********
function addToLocalStorage(itemData) {
  let items = getLocalStorage();
  items.push(itemData);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
   ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(item => item.id!== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(item => {
    if (item.id === id) {
      item.name = value; // only editing name for simplicity
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** setup items **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(item => createListItem(item));
    container.classList.add("show-container");
  }
}

function createListItem(item) {
  const element = document.createElement("article");
  element.setAttribute("data-id", item.id);
  element.classList.add("grocery-item");
  element.innerHTML = `
    <img src="${item.img}" alt="${item.name}" class="item-img" />
    <div class="item-info">
      <div class="item-header">
        <p class="title">${item.name}</p>
        <p class="price">$${item.price}</p>
      </div>
      <p class="desc">${item.desc}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fas fa-edit"></i> edit
        </button>
        <button type="button" class="delete-btn">
          <i class="fas fa-trash"></i> delete
        </button>
      </div>
    </div>
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
}