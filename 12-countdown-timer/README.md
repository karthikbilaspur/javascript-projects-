# Pro Countdown Timer

An intermediate → advanced vanilla JS app with 5 pro features.

### New Features

1. **Multiple Countdowns**: Tabs let you track many events. Data persists in localStorage
2. **Browser Notifications**: Asks permission, then pops a notification when timer hits zero
3. **Shareable URLs**: `?target=20261231T2359&title=New%20Year` creates a countdown instantly
4. **Themes + Confetti**: Light/dark toggle. `canvas-confetti` fires on finish
5. **Google Calendar**: One-click export creates a 1-hour event at target time

### How It Works

| Feature | Tech Used |
| --- | --- |
| Multiple timers | Class-based architecture, template cloning |
| Notifications | `Notification` API with permission flow |
| Shareable URL | `URLSearchParams` + ISO date formatting |
| Themes | CSS custom properties + `data-theme` |
| Confetti | CDN import, triggered on `finish()` |
| GCal Export | Builds `calendar.google.com` URL with `TEMPLATE` action |

### To Run

Open `index.html`. Allow notifications if you want alerts.

### Notes

- Google Calendar is export-only. Full 2-way sync would need OAuth + Google API, which is beyond vanilla JS
- Confetti uses CDN. For offline, download the script
- Share links use local time. For UTC, adjust `target` parsing
