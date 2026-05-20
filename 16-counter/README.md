# Dynamic Counter App

A vanilla JavaScript app with multiple dynamic counters. Each counter has independent state, limits, and step values. All data persists using localStorage.

## New Features

1. localStorage: All counters, values, and settings save automatically and reload on page refresh
2. Min/Max Limits: Set optional boundaries. Buttons disable when limits are reached
3. Step Input: Change increment/decrement step per counter
4. Dynamic Create/Delete: Add unlimited counters or delete them. Each gets a unique ID

## How to Use

1. Add Counter: Click "+ Add Counter" to create a new one
2. Set Limits: Use Min/Max inputs. Leave blank for no limit
3. Change Step: Edit Step input to change how much buttons increase/decrease
4. Delete: Click the × button on any counter
5. Clear All: Removes all counters and clears localStorage

## Technical Details

 CounterManager: Static class handles creating, deleting, and saving all counters
 localStorage: Stores array of counter objects as JSON under key `counters`
 Template: Uses `<template>` tag to clone new counter HTML
 Validation: Prevents invalid steps, clamps values to min/max, disables buttons at limits

## How to Run

Open `index.html` in a browser. No build step needed.
