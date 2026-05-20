# HTML/CSS/JS FAQ Accordion

A lightweight, accessible FAQ accordion built with vanilla HTML, CSS, and JavaScript. No frameworks or build tools required.

## Features

- No dependencies: Pure HTML/CSS/JS. Font Awesome used only for icons and can be removed.
- Accessible: Uses `aria-expanded`, keyboard support for Enter/Space, focus styles.
- Responsive: Mobile-friendly layout and touch targets.
- Smooth animation: CSS transitions for expand/collapse.
- Single open: Only one FAQ item open at a time. Comment out that section in `script.js` to allow multiple.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup structure and FAQ content |
| `styles.css` | All styling, animations, and responsive rules |
| `script.js` | Click handling, ARIA updates, keyboard support |

## Usage

1. Clone or download the files into the same folder
2. Open `index.html` in any browser
3. To add new questions, duplicate an `.accordion-item` div in `index.html`

## Customization

Change colors: Edit the hex values in `styles.css`. Main accent is `#3182ce`  
Allow multiple open: In `script.js`, delete the "Close all other items" `forEach` block  
Remove icons: Delete the Font Awesome `<link>` and the `<i>` tags in HTML  

## Browser Support

Works in all modern browsers. Uses ES6 syntax and CSS Grid/Flexbox.

## License

MIT - use it however you want
