# Reviews Project

A beginner-friendly JavaScript slider that shows customer reviews. Cycles through people using Next, Previous, and Random buttons.

## Setup

1. Make sure you have these 4 image files in the same folder: `person1.png`, `person2.png`, `person3.png`, `person4.png`
2. Download: `index.html`, `styles.css`, `script.js`, `README.md`
3. Put all 8 files in one folder
4. Open `index.html` in your browser

## Features

- **Next/Previous Buttons**: Cycle through reviews. Loops back to start when you reach the end
- **Surprise Me Button**: Shows a random review, but never the same one twice in a row
- **Local Data**: All review info stored in a JavaScript array - easy to edit
- **Responsive Design**: Looks good on mobile and desktop
- **Font Awesome Icons**: Uses a CSS library for icons. Not a JS framework

## How It Works

1. All review data is stored in the `reviews` array in `script.js`
2. `currentItem` tracks which review we're showing. Starts at 0
3. `showPerson()` updates the image, name, job, and text on screen
4. Button clicks change `currentItem` up/down, then call `showPerson()`
5. If we go past the last review, we reset to 0. If we go before first, we jump to last

## What You'll Learn

- Working with arrays of objects
- DOM manipulation: `getElementById`, `querySelector`, `textContent`, `src`
- Event listeners: `addEventListener` for clicks and `DOMContentLoaded`
- Conditional logic: looping with `if` statements
- `Math.random()` and `Math.floor()` for random selection
- `while` loops to avoid repeats
