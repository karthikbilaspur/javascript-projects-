# Counter App

A beginner-friendly vanilla JavaScript counter with extra features.

## Features

1. **Increase/Decrease by 1 and 10**: Multiple buttons for different step sizes
2. **Lower Limit**: Counter won’t go below 0
3. **Sound Effect**: Plays a click sound using Web Audio API - no audio files needed
4. **Persistent Storage**: Saves count to `localStorage`, so it survives page refresh
5. **Visual Feedback**: Number turns green for positive, red for negative, black for zero

## How to Run

1. Put `index.html`, `styles.css`, `script.js` in one folder
2. Open `index.html` in your browser
3. Click buttons and refresh the page - your count will still be there

## Concepts Covered

- `querySelectorAll` and `forEach` for multiple buttons
- `classList.contains()` to check which button was clicked
- `localStorage.setItem()` and `localStorage.getItem()` for persistence
- `Number()` to convert string from localStorage back to number
- Web Audio API for generating sounds without files
- Conditional logic to prevent going below 0
