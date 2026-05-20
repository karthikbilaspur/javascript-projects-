# Notes App 📝

An intermediate-level vanilla JavaScript notes app with markdown support, search, tags, pinning, and localStorage persistence. No frameworks, no dependencies.

## Features

- Create/Edit/Delete Notes: Full CRUD operations
- Markdown Preview: Write with bold, *italic*, headers
- Split View: See editor and preview side-by-side
- Search: Real-time search across title, content, and tags
- Pin Notes: Keep important notes at top
- Tags System: Organize notes with comma-separated tags
- Auto-Save: Debounced saving to localStorage every 500ms
- Word Count: Live word counter
- Filters: View all notes or pinned only
- Responsive: Works on desktop, collapses sidebar on mobile

## Concepts Used

- ES6 Classes: `NotesApp` class manages entire app state
- LocalStorage: Persist notes array as JSON
- Debouncing: Auto-save doesn't fire on every keystroke
- Regex: Simple markdown parser for preview
- Array Methods: filter, sort, map for search and display
- Event Delegation: Dynamic note list click handlers
- Date Formatting: Relative time "2h ago" display
- CSS Grid: Split editor layout

## How to Use

1. Click "+ New Note" to create
2. Type title, content, and tags
3. Use Edit/Preview/Split buttons to toggle views
4. Click 📌 to pin important notes
5. Search bar filters notes in real-time
6. All changes auto-save to localStorage

## Markdown Support

- `# Heading 1`
- `## Heading 2`
- `### Heading 3`
- `bold text`
- `*italic text*`

## How to Run

1. Download all 4 files
2. Open `index.html` in browser
3. Start writing notes
