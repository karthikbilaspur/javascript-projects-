# Dad Joke Generator 😂

An intermediate vanilla JavaScript app that fetches random dad jokes from an API. Save your favorites, copy to clipboard, and share with friends. All data persists with localStorage.

## Features

 Fetch Random Jokes: Uses icanhazdadjoke.com API  no API key needed
 Save Favorites: Store jokes you love with localStorage
 Copy & Share: Oneclick copy or native share API
 Toast Notifications: Visual feedback for actions
 Responsive Design: Works on mobile and desktop
 Error Handling: Graceful fallbacks if API fails
 Loading States: Button shows "Loading..." during fetch

## Concepts Used

 Fetch API + Async/Await: Get data from external API
 LocalStorage: Persist favorites across sessions
 ES6 Classes: Organized with `DadJokeApp` class
 Event Delegation: Dynamic favorite list buttons
 Clipboard API: Copy jokes to clipboard
 Web Share API: Native sharing on mobile
 CSS Animations: Fadein effects, toast popups
 Error Handling: Try/catch with user feedback

## How to Run

1. Download all 4 files into a folder
2. Open `index.html` in your browser
3. Click "Get Joke" to start
4. No build step or dependencies needed

## API Used

[icanhazdadjoke.com](https://icanhazdadjoke.com/)  Free dad joke API.
Returns JSON with `id` and `joke` fields.

## File Structure

dadjokeapp/
├── index.html  App structure + template
├── script.js  DadJokeApp class + API logic
├── styles.css  Modern gradient UI + animations
└── README.md  Documentation
