# Advanced Modal Project

A vanilla JavaScript modal system with multiple modals, animations, localStorage, and drag-and-drop.

## Features

1. Multiple Modals: Three different modals open based on which button you click
2. Fade Animation: Overlay fades in/out with `opacity` + `visibility` transition
3. Scroll Lock: `body { overflow: hidden }` prevents background scrolling when modal is open
4. Don't Show Again: Checkbox saves preference to `localStorage` per modal
5. Draggable: Click and drag modal header to move it around the screen

## How Each Feature Works

### 1. Multiple Modals

Each button has `data-modal="modal-1"`. JS finds the modal with that ID and opens only that one. All modals share the same `.modal-overlay` styling but have unique IDs.

### 2. Fade-in Animation

Instead of `display: none`, we use `visibility: hidden` + `opacity: 0`. This allows CSS transitions. `z-index: -10` ensures it doesn't block clicks when hidden.

### 3. Prevent Page Scroll

`document.body.classList.add('modal-open')` adds `overflow: hidden` to body. Removed when modal closes.

### 4. Don't Show Again

On checkbox change, save `localStorage.setItem('hide-modal-1', 'true')`. Before opening, check if that key exists. Use DevTools → Application → Local Storage to clear.

### 5. Draggable

Tracks `mousedown`, `mousemove`, `mouseup`. Calculates distance moved and updates `transform: translate()`. `e.preventDefault()` stops text selection while dragging.

## What You'll Learn

- `dataset` to read `data-*` attributes
- `localStorage.setItem()` and `getItem()` for persistence
- Mouse events: `mousedown`, `mousemove`, `mouseup`
- `e.target` vs `e.currentTarget` for event delegation
- CSS `transform` for position + scale
- `classList.add/remove` for state management
- `transitionend` event to run code after CSS animation

## How to Run

1. Download all 4 files in one folder
2. Open `index.html`
3. Try opening different modals, dragging them, and checking "Don't show again"
