# Custom HTML5 Video Player

A fully featured video player built with vanilla HTML, CSS, and JavaScript. No dependencies.

## Features

 Custom Controls: Play/pause, volume, progress bar, fullscreen, PiP
 Playback Speed: 0.5x to 2x options
 Keyboard Shortcuts: Space/K, M, F, Arrow keys for full control
 Autohiding UI: Controls fade after 3s of inactivity
 Responsive: Mobilefriendly, touch support
 Accessible: ARIA labels, keyboard navigation, focus states
 PictureinPicture: Native browser PiP API support

## Files

| File | Description |
|  |  |
| `index.html` | Video element + custom controls markup |
| `styles.css` | Dark theme, smooth animations, responsive |
| `script.js` | Classbased player logic, event handling |

## Usage

1. Replace video `src` and `poster` URLs in `index.html`
2. Open in browser  all controls work out of the box
3. Click video or press Space to play

## Keyboard Shortcuts

| Key | Action |
|  |  |
| Space / K | Play / Pause |
| M | Mute / Unmute |
| F | Fullscreen |
| ← / → | Seek 5s / +5s |
| ↑ / ↓ | Volume up / down |

## Browser Support

Modern browsers with HTML5 video support. PiP requires Chrome/Edge/Safari.

## Customization

Change accent color: Update `accent` in `:root`  
Disable autohide: Remove `showControls()` calls in JS  
Add quality selector: Extend controls with source switching
