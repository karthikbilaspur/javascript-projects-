# Tabbed Menu with Sliding Highlight

Restaurant menu component with animated tab indicator. Built with vanilla HTML, CSS, and JS.

## Features

 Sliding highlight: Smooth animation tracks active tab using `transform`
 Accessible tabs: Full ARIA roles, keyboard nav with Arrow keys, Home/End
 Responsive grid: Menu items use 2 columns on desktop, 1 on mobile
 Fade transitions: Menus fade + slide in when switching
 No dependencies: Pure vanilla JS, no frameworks
 Wes Bos style: Yellow accent `#ffc600` and Cookie font for menu items

## File Structure

| File | Purpose |
|  |  |
| `index.html` | Markup with ARIA roles for tabs/tabpanels |
| `styles.css` | Wes Bos inspired theme, CSS Grid layout |
| `script.js` | Tab switching logic + highlight positioning |

## How It Works

1. Each `.button` has `datatarget` pointing to a menu ID
2. JS moves the `.highlight` span to match the active button's position
3. `menuisvisible` toggles display + opacity for fade effect
4. `hidden` attribute used on inactive panels for accessibility

## Browser Support

Works in all modern browsers. Uses `getBoundingClientRect()` and CSS `transform`.

## Customization

Change accent color: Update `wesbos` in `:root`
Disable animation: Wrap transitions in `@media (prefersreducedmotion: nopreference)`
Add menu: Copy a `.menu` div and add corresponding `.button` with matching `datatarget`
