# Digital Clock Suite ⏰

An intermediate vanilla JavaScript app with 3 modes: Digital Clock, Stopwatch with laps, and Countdown Timer. Built with ES6 classes, localStorage, and modern CSS.

## Features

## 1. Digital Clock

 12/24 hour format toggle
 Show/hide seconds
 Live date display
 Settings saved to localStorage

## 2. Stopwatch

 Start, pause, resume functionality
 Lap time recording with list
 Centisecond precision (00:00:00.00)
 Reset clears all laps

## 3. Countdown Timer

 Custom time input: hours, minutes, seconds
 Quick presets: 1, 5, 10, 25 minutes
 Visual progress bar
 Alarm sound on completion
 Pause/resume support

## Concepts Used

 ES6 Classes: Single `DigitalClockApp` class manages all modes
 setInterval/clearInterval: Time tracking for all modes
 LocalStorage: Saves clock format preferences
 Date Object: Realtime clock formatting
 Event Delegation: Mode switching system
 CSS Animations: Smooth mode transitions
 Web Audio API: Alarm sound on timer end
 Responsive Design: Works on mobile

## How to Use

### Clock Mode

1. Toggle 24hour format or seconds display
2. Settings autosave

## Stopwatch Mode

1. Click Start to begin
2. Click Lap to record split times
3. Pause/Resume as needed
4. Reset to clear

## Timer Mode

1. Set time using inputs or presets
2. Click Start to begin countdown
3. Pause/Resume if needed
4. Alarm plays when finished

## How to Run

1. Download all 4 files
2. Open `index.html` in browser
3. No dependencies or build needed

## Technical Highlights

 State Management: Separate state for each mode prevents conflicts
 Precision Timing: Stopwatch uses Date.now() for accuracy, not just interval counting
 Memory Safe: Clears intervals when switching modes
 Accessibility: Keyboard accessible buttons, semantic HTML
