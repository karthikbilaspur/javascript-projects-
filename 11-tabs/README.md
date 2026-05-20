# Freelance Dashboard Tabs

An intermediate vanilla JS tabbed dashboard with reallife content for freelancers.

### What's New vs Basic Tabs

1. Real Content: Stats, projects, invoices, activity feed
2. Task Manager: Add, check off, and delete tasks. Saves to localStorage
3. Progress Bars: Visual project completion
4. Status Badges: Colorcoded project + invoice states
5. Responsive Table: Invoices table hides columns on mobile
6. Dashboard Layout: Header with user avatar, icons on tabs

### Core Concepts Used

| Concept | Where |
|  |  |
| Event Delegation | One listener handles all tab clicks |
| localStorage | Remembers active tab + saves tasks |
| Array rendering | Tasks dynamically rendered from JS array |
| Data attributes | `datatab` and `dataid` link HTML to JS |
| CSS Grid/Flexbox | Stats, projects, and responsive layout |

### To Run

Open `index.html` in your browser. Data persists between refreshes.

### Next Level Ideas

1. Hook up the invoice table to real data with `fetch()`
2. Add a chart.js graph to the Overview tab
3. Draganddrop to reorder tasks
4. Export tasks/invoices as CSV
5. Add dark mode toggle
