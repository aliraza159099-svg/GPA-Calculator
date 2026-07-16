<div align="center">

# 🎓 ARB 
### *University GPA Calculator*

**Calculate your Semester GPA instantly and accurately.**

[![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![Made with CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-1B4D3E?style=for-the-badge&logo=github&logoColor=white)](#)

</div>

---

## 📖 Overview

**ARB Site** is a premium, single-page GPA calculator built for university students. It walks a student through entering their courses, validates every input, and returns an animated result card with their **Semester GPA**, **Total Quality Points**, and a performance rating — all wrapped in a registrar-office aesthetic with dark/light themes, voice guidance, and sound feedback.

No frameworks. No build step. Just **HTML, CSS, and vanilla JavaScript**.

---

## ✨ Features

| Category | Details |
|---|---|
| 🌗 **Theming** | Dark & light mode toggle, remembered via `localStorage` |
| 🔊 **Voice Guidance** | Speaks instructions using the Web Speech API |
| 🎵 **Sound Effects** | Self-contained UI tones via the Web Audio API (no audio files) |
| 📐 **GPA Engine** | `Σ(Credit Hours × GPA) ÷ Total Credit Hours`, rounded to 2 decimals |
| ✅ **Validation** | Rejects empty, negative, and out-of-range (0.00–4.00) entries with animated inline errors |
| 🖼️ **Result Card** | Animated GPA ring, quality-point breakdown, and tiered performance badge |
| 📱 **Responsive** | Fluid layout from small phones to large desktops, no horizontal scroll |
| ♿ **Accessible** | Semantic labels, ARIA live regions, visible focus states, skip link |

---

## 🔤 Typography

The interface pairs three typefaces for a distinct "official transcript" feel:

| Role | Typeface | Used For |
|---|---|---|
| **Display** | [`Fraunces`](https://fonts.google.com/specimen/Fraunces) | Headings, hero title, result labels |
| **Body** | [`Inter`](https://fonts.google.com/specimen/Inter) | Paragraphs, labels, buttons |
| **Mono / Figures** | [`JetBrains Mono`](https://fonts.google.com/specimen/JetBrains+Mono) | GPA numbers, credit hours, live clock |

Fonts load from **Google Fonts** and are already linked in `index.html` — no local font files required.

---

## 🎨 Color Palette

| Swatch | Name | Hex (Light) | Hex (Dark) |
|---|---|---|---|
| 🟦 | Oxford Navy | `#0B1F3A` | `#0A1526` |
| 🟨 | Antique Gold | `#B8902F` | `#D9AD4A` |
| 🟥 | Crest Crimson | `#8C2438` | `#D1657B` |
| 🟩 | Emerald | `#1F5C46` | `#4FA383` |
| ⬜ | Parchment | `#F6F3EA` | — |

---

## 📁 Project Structure

```
├── index.html   → Page structure & markup
├── style.css    → Theming, layout, and animations
├── script.js    → GPA logic, validation, speech & sound
└── README.md    → You are here
```

---

## 🚀 Getting Started

### Run locally
1. Download or clone this repository.
2. Open `index.html` in any modern browser — that's it, no build step or server required.

### Deploy on GitHub Pages
1. Push `index.html`, `style.css`, and `script.js` to your repository's root.
2. Go to **Settings → Pages** → set source to your default branch, root folder.
3. Your site goes live at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

---

## 🧮 How It Works

1. **Enter Number of Subjects** — tell the calculator how many courses to include.
2. **Fill in Course Entries** — enter each course's credit hours and GPA (0.00–4.00).
3. **Calculate GPA** — instantly see your Semester GPA, total credit hours, total quality points, and a performance rating from *Outstanding* to *Needs Improvement*.
4. **Reset** anytime to start a new semester.

---

## 🛠️ Built With

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, Grid, Flexbox, `backdrop-filter`, `clamp()`
- **JavaScript (ES6)** — no dependencies, no frameworks
- **Web Speech API** — spoken guidance
- **Web Audio API** — synthesized UI sound effects

---

<div align="center">

*Built for students, by students.*

</div>
