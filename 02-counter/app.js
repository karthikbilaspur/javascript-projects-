// DOM elements
const value = document.getElementById("value");
const btns = document.querySelectorAll(".btn");

// Load count from localStorage, default to 0
let count = Number(localStorage.getItem("count")) || 0;

// Set initial value + color
value.textContent = count;
updateColor();

// Sound effect - uses built-in Web Audio API so no file needed
function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Update color based on value
function updateColor() {
  if (count < 0) {
    value.style.color = "red";
  } else if (count > 0) {
    value.style.color = "green";
  } else {
    value.style.color = "#222";
  }
}

// Save to localStorage
function saveCount() {
  localStorage.setItem("count", count);
}

// Button logic
btns.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    playClickSound(); // Challenge 3: sound effect
    
    const classes = e.currentTarget.classList;
    
    if (classes.contains("decrease")) {
      count--;
    } else if (classes.contains("increase")) {
      count++;
    } else if (classes.contains("reset")) {
      count = 0;
    } else if (classes.contains("decrease-by-10")) {
      count -= 10; // Challenge 1: decrease by 10
    } else if (classes.contains("increase-by-10")) {
      count += 10; // Challenge 1: increase by 10
    }
    
    // Challenge 2: prevent counter from going below 0
    if (count < 0) {
      count = 0;
    }
    
    value.textContent = count;
    updateColor();
    saveCount(); // Challenge 4: persist to localStorage
  });
});