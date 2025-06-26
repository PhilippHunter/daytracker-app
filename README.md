# DayTracker

DayTracker is a minimalist, modern app for tracking your daily activities, habits, and notes. The core of the app is a calendar view where you can quickly add "perks" (customizable tags) and a short text entry for each day. The goal is to make daily tracking fast, flexible, and visually appealing — helping you reflect on your habits and progress over time.

## Features

- **Calendar-based tracking:** Tap any day to view, create, or edit an entry.
    - **Perks:** Assign customizable tags (perks) to each day to represent habits, moods, or activities.
    - **Notes:** Add a short text note for each day.
- **Future-planned features:** 
    - **Nutrition tracking::** Nutrition tracking for daily food logs and personalized cooking recommendations.
    - **Social Contact tracking:** Create friend profiles and mention them in entries to track your social life.
    - **Native Calendar integration:** Add events and reminders to the calendar which will get synced with the devices native calendar API.
- **Stats:** View simple statistics like total entries, perk counts and day streaks.
- **Settings:** Customize your perks and manage app data.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app:**
   ```sh
   npx expo start
   ```

## Project Structure

- `/app` — Main app screens and navigation
- `/components` — Reusable UI components
- `/database` — DataService and StatsService for SQLite storage
- `/assets` — Fonts and images

---

**DayTracker** — Track your days, reflect on your habits, and grow.