# Placeholder Card Generator

A mini tool for designers/devs to generate fake profile cards with Lorem Ipsum bio, avatar, and social links.

## New Features Implemented

1. **Download as PNG**: Uses `html2canvas` to export any card as a high-res PNG
2. **Avatar Shape Toggle**: Switch between Round / Square avatars
3. **Fake Social Links**: Random 3 icons per card: 🐦 💼 📷 🎨 💻
4. **3x3 Grid Mode**: Generate 9 cards at once for quick mockup fills
5. **localStorage Gallery**: Save cards you like, view in gallery, delete individual cards

### How It Works

| Feature | Tech |
| --- | --- |
| PNG Export | `html2canvas` CDN, converts DOM → canvas → download |
| Shape Toggle | CSS classes `.round` / `.square` on `<img>` |
| Social Icons | Array shuffled + sliced, emoji links |
| Grid Mode | CSS Grid `repeat(3, 1fr)` + loop 9x |
| Gallery | Save card JSON to localStorage, render thumbnails |

### To Run

Open `index.html`. No build step. Works offline except for images + CDN.
