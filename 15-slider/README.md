# Web Dev Essentials Slider Pro

An interactive slider teaching core web development concepts. Built with vanilla HTML/CSS/JS as a mini project to master slider logic.

## ✨ Features Implemented

1. Progress Bar: Visual timer for auto-play showing time until next slide
2. Pause on Hover: Auto-play pauses when mouse enters slider area
3. 6 Topic Slides: HTML, CSS, JavaScript, HTTP, Git, React
4. PNG Export: Download current slide as high-res image via `html2canvas`
5. Code Snippets: Syntax highlighted examples using Prism.js for each topic
6. Full Navigation: Buttons, dots, keyboard arrows, touch swipe
7. Wikipedia Links: Deep-dive link at end of each slide

## 🛠️ Tech Stack

- HTML5 - Semantic structure, `data-*` attributes
- CSS3 - Flexbox, transitions, CSS variables, re
sponsive
- Vanilla JS - DOM, setInterval, event listeners, touch events
- Prism.js - Syntax highlighting for 6 languages
- html2canvas - DOM → PNG export

## 📁 Files

slider-pro/
├── index.html # 6 slides with code blocks + Wiki links
├── styles.css # Progress bar, syntax styles, responsive
├── script.js # Auto-play, pause, export, swipe logic
└── README.md # You are here

## 🚀 How To Run

1. Save all 4 files in one folder
2. Open `index.html` in browser
3. Needs internet for Prism.js + html2canvas CDNs

### 🎯 How To Use

| Action | Method |
| --- | --- |
| Next/Prev | Click arrows, press ← → keys, or swipe |
| Jump to slide | Click dots |
| Auto-play | Toggle checkbox, progress bar shows timer |
| Pause | Hover over slider during auto-play |
| Export PNG | Click 📸 icon in top-right |
| Learn more | Click Wikipedia link on each slide |

### 💡 Concepts Covered

| Topic | Key Points | Code Example |
| --- | --- | --- |
| HTML | Semantic tags, structure | `<article>` example |
| CSS | Grid, variables, responsive | `grid-template-columns` |
| JavaScript | Async/await, fetch API | `fetch()` example |
| HTTP | Methods, status codes | `GET` request example |
| Git | Branching, commits | `git checkout -b` workflow |
| React | Hooks, JSX, state | `useState` counter |
