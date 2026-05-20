# Enhanced Collapsible Component

A modern, accessible collapsible UI built with vanilla HTML, CSS, and JavaScript. No frameworks required.

## Features

- Multiple Open: Set `data-allow-multiple="true"` on the group to allow multiple sections open
- CSS Grid Animation: Smooth height transitions using `grid-template-rows` - no JS height calculations
- Live Search: Auto-generated search box filters sections by content
- Expand/Collapse All: Control buttons for bulk actions
- Keyboard Navigation: Arrow keys, Home/End, Space/Enter support
- State Persistence: Remembers open sections via `sessionStorage`
- Accessible: Full ARIA support, screen reader announcements, focus management
- Category Colors: Icons color-coded by topic: HTML, CSS, JS, Tools
- Responsive: Mobile-optimized, respects `prefers-reduced-motion`

## File Structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic markup with ARIA attributes |
| `styles.css` | CSS variables, grid animations, dark theme |
| `script.js` | Class-based logic, event delegation, search |

## Usage

1. Clone all files to same directory
2. Open `index.html` in browser
3. Add sections by copying `<article class="collapsible">` blocks

## Customization

Single-open mode: Change `data-allow-multiple="true"` to `"false"` in HTML
Add category: Add `data-category="yourname"` and define color in CSS `:root`
Disable search: Remove `this.setupSearch()` call in JS `init()`
Theme: Edit CSS variables in `:root` to change colors

## Browser Support

Modern browsers with CSS Grid support. Uses ES6+ JavaScript.

## Accessibility Notes

- Uses `aria-expanded` and `aria-controls` for screen readers
- `role="region"` on panels
- Focus visible styles for keyboard users
- Live region announces expand/collapse actions

## License

MIT
