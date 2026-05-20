# ScrollDriven UI Components

A collection of scrollbased interactions using vanilla HTML, CSS, and JavaScript. Zero dependencies.

## Features

| Feature | Description |
|  |  |
| Scroll Progress | Top bar shows scroll percentage through page |
| Scroll Spy | Nav links autohighlight based on visible section |
| Reveal Animations | Elements fade/slide in using IntersectionObserver |
| Back to Top | Button appears after 400px scroll, smooth scrolls up |
| Smooth Anchors | Nav clicks smoothly scroll to sections |
| Shrinking Nav | Navbar shrinks + adds shadow on scroll |
| Performance | Uses passive listeners + IntersectionObserver, no scroll jank |

## Files

| File | Purpose |
|  |  |
| `index.html` | Semantic sections with data attributes |
| `styles.css` | CSS variables, smooth scroll, animations |
| `script.js` | ScrollController class handling all interactions |

## How It Works

1. IntersectionObserver watches sections for scroll spy + reveals. More performant than scroll events.
2. scrollbehavior: smooth on `<html>` enables native smooth scrolling.
3. scrollpaddingtop prevents fixed nav from covering sections.
4. Passive event listeners for scroll to avoid blocking main thread.

## Browser Support

All modern browsers. IntersectionObserver has 96%+ global support.

## Customization

Change trigger point: Adjust `threshold` and `rootMargin` in IntersectionObserver options  
Disable animations: Users with `prefersreducedmotion` get instant reveals  
Add sections: Copy a `<section>` block and add matching nav link with `datasection`

## Performance Notes

 No `scroll` event for reveals  uses IntersectionObserver
 Progress bar uses `passive: true` listener
 CSS transforms only for animations  GPU accelerated

## License

MIT
