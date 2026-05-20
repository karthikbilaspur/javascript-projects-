# Setup

1. Download all 3 files to one folder
2. Open `index.html` in your browser
3. Click "Shuffle Gallery" to randomize or use filters

## Pagination Features

| Feature | Details |
|  |  |
| Items Per Page | Userselectable: 6, 12, or 24 |
| Page Numbers | Smart display with ellipsis for large sets |
| Navigation | Prev/Next buttons + clickable page numbers |
| State | Resets to page 1 on filter change |
| URL | Doesn’t use URL params — all clientside |

## Tech Stack

 HTML5: Semantic markup
 CSS3: Custom properties, grid, backdropfilter
 Vanilla JS: Array filtering, slicing for pagination, localStorage
 Images: Picsum Photos for random placeholders

## Customization

1. Add Real Art: Replace `ARTWORKS` array with API calls to Met Museum, Art Institute of Chicago, etc.
2. Colors: Change `accent` in `:root` to rebrand
3. Per Page Options: Edit `<select id="perPageSelect">` in HTML
