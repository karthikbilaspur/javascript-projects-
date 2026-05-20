# Lorem Ipsum Generator Pro

A mini project that generates placeholder text with 5 pro features.

### Features Added

1. **Multiple Styles**: Lorem, Bacon, Cupcake, Pirate, Hipster Ipsum
2. **Export**: Download as `.txt` or `.json` with metadata
3. **API Mode**: Use URL params like `?type=paragraphs&count=5&style=pirate&html=true`
4. **Character Limit**: Generate exactly 280 chars for Twitter/X posts
5. **Rich Text Preview**: See how HTML renders with real `<p>` tags

### Concepts Used

| Concept | Where |
| --- | --- |
| URLSearchParams | API mode reads `?type=...` from URL |
| Blob API | Creates downloadable.txt/.json files |
| contenteditable preview | Renders HTML output safely |
| Character counting | Truncates at exact length for Twitter |
| Word banks | Arrays of themed words per style |

### To Try API Mode

`index.html?type=sentences&count=10&style=bacon&html=true`

This generates 10 Bacon Ipsum sentences wrapped in `<p>` tags on load.
