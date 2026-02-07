# Azizi Yahya's Web Apps Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-brightgreen)](#)
[![Built with Vanilla JS](https://img.shields.io/badge/Built%20with-Vanilla%20JS-F7DF1E)](#)

Welcome to **Azizi Yahya's Web Apps Suite**, a collection of modern, responsive, and visually stunning web applications and tools. This repository houses a personal portfolio of utilities ranging from educational tools to creativity boosters, all built with a focus on premium aesthetics and seamless user experience.

**Supported Browsers:** Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)

## 🚀 Live Demo

https://aziziyahya563.github.io

## 📂 Project Overview

This monolithic repository contains several distinct web applications, all sharing a unified design language and theme system:

### 1. 🏠 **Main Dashboard (`index.html`)**
The central hub connecting to all other apps. It features a beautiful, responsive grid layout with glassmorphism effects and a "What's New" featured section.
- **Key Features:** Central navigation, unified dark/light mode toggle, responsive app grid.

### 2. 🧮 **Grade Calculator (`marks-calculator.html`)**
A powerful tool for students to track their academic performance.
- **Key Features:**
    - Real-time grade calculation.
    - Assessment weight management.
    - Interactive grade tiles with validation.
    - "Target Grade" projection.
    - Persistent data storage via LocalStorage.

### 3. 🎨 **Story Card Maker (`story-card-maker.html`)**
A creative tool designed for social media content creators.
- **Key Features:**
    - Generate beautiful gradient backgrounds.
    - Upload and mask images.
    - Customize text and stickers.
    - Export as high-quality images.
    - **New:** "Connected" dark mode support.

### 4. 🖥️ **Desk Setups Gallery (`desk-setups.html`)**
A curated gallery of inspiring workspace setups (in progress).
- **Key Features:**
    - Mobile-first "feed" layout.
    - Filter by category (Minimal, Gaming, etc.).
    - Affiliate product links integration.
    - Native "Pull to refresh" feel.

### 5. 🤖 **Arduino Projects (`arduino-projects.html`)**
A showcase for DIY electronics and coding projects.
- **Key Features:**
    - Project cards with difficulty ratings.
    - Detailed modals with component lists.
    - **Resource Downloads:** Access schematics, source code, and flowcharts directly from the UI.
    - Affiliate link support for components.

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Semantic markup and modern CSS variables for theming.
- **Vanilla JavaScript**: Lightweight, fast, and no heavy framework dependencies.
- **LocalStorage API**: For persisting user preferences (Dark Mode) and data (Grades) across sessions.
- **Responsive Design**: Mobile-first approach ensuring perfect rendering on all devices.
- **Glassmorphism**: Heavy use of `backdrop-filter` for a modern, premium aesthetic.

## ✨ Key Features Across All Apps

- **Connected Dark Mode**: Toggle dark mode on one app, and it instantly syncs across the entire suite using `localStorage`.
- **Unified Navigation**: Consistent header, menu system, and back-button navigation throughout.
- **Mobile-Web-App Feel**: Optimized touch targets, scroll snapping, and layout constraints (`max-width: 600px` on desktop) to mimic a native mobile app experience.

## 📦 Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aziziyahya563/aziziyahya563.github.io.git
   ```

2. **Navigate to the project folder:**
   ```bash
   cd aziziyahya563.github.io
   ```

3. **Run Locally:**
   Since these are static files, you can simply open `index.html` in your browser.
   
   *Recommended:* Use a local development server for the best experience (especially for avoiding CORS issues with modules/images):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # OR using VS Code Live Server extension
   ```

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests for any improvements, bug fixes, or new features.

## ✅ Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Latest | Full support including CSS Grid, Backdrop Filter |
| Firefox | ✅ Latest | Full support |
| Safari  | ✅ 14+ | Full support |
| Edge    | ✅ Latest | Full support |

## 🔗 Connect

- **GitHub:** [@aziziyahya563](https://github.com/aziziyahya563)
- **Portfolio:** [aziziyahya563.github.io](https://aziziyahya563.github.io)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <strong>Azizi Yahya</strong>
</p>
