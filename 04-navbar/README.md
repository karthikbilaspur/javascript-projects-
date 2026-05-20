# Responsive Navbar

A beginner-friendly responsive navbar with dropdowns, mobile menu, and scroll features.

## Features

1. Mobile Menu: Hamburger toggles to X icon when open
2. Auto-Close: Menu closes when you click a link
3. Dropdown Sub-Menus: Projects link has nested sub-links
4. Sticky Navbar: `position: fixed` keeps it visible on scroll
5. Active Link Highlighting: Current section highlights in nav based on scroll

## How It Works

- `classList.toggle()` shows/hides mobile menu
- Font Awesome icons swap between `fa-bars` and `fa-times`
- `scroll` event listener checks `pageYOffset` vs `section.offsetTop` to find current section
- Dropdown uses `preventDefault()` so clicking doesn't jump to `#`
- `position: fixed` + `margin-top` on main prevents content from hiding under navbar

## How to Run

1. Download all files in one folder
2. Open `index.html` in browser
3. Resize window to test mobile menu
4. Scroll to see active link + sticky behavior

## What You'll Learn

- Mobile-first responsive design
- DOM traversal with `closest()`
- Scroll events and `offsetTop`
- Toggling classes for UI state
- CSS `position: fixed` and z-index
- Smooth scroll with `scroll-behavior: smooth`
