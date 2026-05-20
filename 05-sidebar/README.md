# Sidebar Project

A beginner-friendly slide-out sidebar with overlay, dropdowns, and scroll-based active link highlighting.

## Features

1. Slide Animation: Sidebar slides in from left using `transform: translateX()`
2. Overlay: Dark overlay appears behind sidebar. Click it to close
3. Close Options: Close button, overlay click, or link click all close the sidebar
4. Dropdown Sub-Menus: Projects link expands to show nested links
5. Active Link Highlighting: Highlights current section as you scroll
6. Responsive: Full width on mobile, 400px width on desktop

## How It Works

- Sidebar starts hidden with `transform: translateX(-100%)`
- Clicking hamburger adds `.show-sidebar` which sets `transform: translateX(0)`
- Overlay uses `visibility` + `opacity` for smooth fade
- Dropdown uses `max-height` transition instead of `display` for animation
- Scroll event checks `pageYOffset` vs each section's `offsetTop` to find active section

## How to Run

1. Download all files in one folder
2. Open `index.html` in browser
3. Click hamburger icon top-right to open sidebar
4. Scroll to test active link highlighting

## What You'll Learn

- CSS `transform: translateX()` for slide animations
- `position: fixed` for overlays and sidebars
- `grid-template-rows` for sidebar layout
- Event delegation for dropdown toggles
- Scroll events and calculating section positions
- `max-height` transitions for smooth dropdowns

## Key Differences: Sidebar vs Navbar

| Navbar | Sidebar |
| --- | --- |
| Horizontal, top of page | Vertical, slides from side |
| Always visible on desktop | Hidden until toggled |
| `position: fixed` at top | `position: fixed` full height |
| Links in a row | Links stacked vertically |
