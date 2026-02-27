# Azizi Yahya's Web Apps Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-brightgreen)](#)
[![Built with Vanilla JS](https://img.shields.io/badge/Built%20with-Vanilla%20JS-F7DF1E)](#)

Welcome to **Azizi Yahya's Web Apps Suite** — a collection of modern, responsive, and visually polished web applications built with a focus on premium aesthetics and seamless user experience.

**Supported Browsers:** Chrome (latest) · Firefox (latest) · Safari 14+ · Edge (latest)

## 🚀 Live Demo

**[aziziyahya563.github.io](https://aziziyahya563.github.io)**

---

## 📂 Apps & Tools

### 1. 🏠 **Main Dashboard** — `index.html`

The central hub connecting all apps. Features a responsive card grid, glassmorphism effects, and a unified dark/light mode toggle that syncs across all tools.

---

#### 🛠️ Tools

### 2. 🧮 **Grade Calculator** — `marks-calculator.html`

Track and project academic performance across multiple assessments.

- **Key Features:**
  - Real-time grade calculation as marks are entered
  - Assessment weight management
  - Interactive grade tiles with input validation
  - "Target Grade" projection based on remaining assessments
  - Persistent data via `localStorage`

---

### 3. 🎓 **GPA Calculator** — `gpa-calculator.html`

Project your semester GPA and estimated cumulative CGPA based on expected grades.

- **Key Features:**
  - Select expected grades (A to F) per subject for the current semester
  - Live semester GPA calculation weighted by credit hours
  - Enter previous CGPA + total credits to project the new cumulative CGPA
  - Persistent grade selections via `localStorage`
  - Reset data option via the settings menu

---

### 4. 🎨 **Story Card Maker** — `story-card-maker.html`

A creative tool for generating story card for social media.

- **Key Features:**
  - Generate beautiful gradient backgrounds
  - Upload and mask images
  - Export as high-quality images

---

#### 🖼️ Showcase

### 5. 🖥️ **Desk Setups** — `desk-setups.html`

A curated gallery of personal workspace configurations.

- **Key Features:**
  - Filter setups by category (Minimal, Gaming, etc.)
  - Product affiliate links per item
  - Smooth card-based gallery layout

---

### 6. 🤖 **Arduino Projects** — `arduino-projects.html`

A showcase of DIY electronics builds and experiments.

- **Key Features:**
  - Project cards with difficulty ratings
  - Detailed modals with component lists and descriptions
  - Downloadable resources: schematics, source code, flowcharts
  - Affiliate links for components

---

#### 🔧 Utilities

### 7. 🕌 **Hijri Converter** — `hijri-converter.html`

Convert any Gregorian date to the Hijri (Islamic) calendar using the Umm al-Qura method.

- **Design:** Scroll-less split-panel layout — deep-green display panel on the left, clean white control panel on the right.
- **Key Features:**
  - Instant Gregorian → Hijri conversion
  - Day-by-day navigation via `←` / `→` buttons
  - One-tap copy to clipboard
  - Fully responsive — stacks vertically on mobile

---

### 8. 📋 **Name List Utilities** — `namelistgen.html` / `namelistupd.html`

Two utilities for generating and updating formatted participant or student name lists.

- **Key Features:**
  - Fast list input, sorting, and formatting
  - Auto-copy formatted result to clipboard
  - Built-in sequential numbering

---

## 🛠️ Technology Stack

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| Structure   | HTML5 (semantic)                                                  |
| Styling     | Vanilla CSS3 — custom properties, `clamp()`, `dvh`, glassmorphism |
| Logic       | Vanilla JavaScript (ES2020+)                                      |
| Persistence | `localStorage` API                                                |
| Date i18n   | `Intl.DateTimeFormat` with `islamic-umalqura` calendar            |
| Fonts       | Inter (Google Fonts)                                              |

## ✨ Key Features Across All Apps

- **Connected Dark Mode** — toggling dark mode on any app instantly syncs it across the entire suite via `localStorage`.
- **Unified Navigation** — consistent header with back-button, settings popover, and dark mode toggle.
- **Scroll-less Design** — newer apps use `100dvh` locked layouts with fluid `clamp()` scaling for a native-app feel.
- **Frosted Glass UI** — `backdrop-filter: blur + saturate` used throughout headers, modals, popovers, and toasts.

## 📦 Installation & Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aziziyahya563/aziziyahya563.github.io.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd aziziyahya563.github.io
   ```

3. **Run locally:**

   Open `index.html` directly in your browser, or use a local server for the best experience:

   ```bash
   # Python 3
   python -m http.server 8000

   # VS Code — Live Server extension
   ```

## ✅ Browser Support

| Browser | Support   | Notes                                             |
| ------- | --------- | ------------------------------------------------- |
| Chrome  | ✅ Latest | Full support — CSS Grid, `backdrop-filter`, `dvh` |
| Firefox | ✅ Latest | Full support                                      |
| Safari  | ✅ 14+    | Full support                                      |
| Edge    | ✅ Latest | Full support                                      |

## 🤝 Contributing

Contributions are welcome! Fork the repository and submit a pull request for any improvements or bug fixes.

## 🔗 Connect

- **GitHub:** [@aziziyahya563](https://github.com/aziziyahya563)
- **Portfolio:** [aziziyahya563.github.io](https://aziziyahya563.github.io)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <strong>Azizi Yahya</strong>
</p>
