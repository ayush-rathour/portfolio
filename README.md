<!-- ═══════════════════════════════════════════════════════════════════════════
   AR.dev - Personal Portfolio Documentation & Overview
   Author: Ayush Rathour
   ═══════════════════════════════════════════════════════════════════════════ -->

# AR.dev - Personal Portfolio of Ayush Rathour

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![C](https://img.shields.io/badge/C-00599C?logo=c&logoColor=white)](https://en.cppreference.com/w/c)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://ayushrathour.netlify.app)

> A modern, high-performance personal portfolio website engineered with semantic **HTML5**, modern custom-property-driven **CSS3**, and framework-free **Vanilla JavaScript**. Designed and built by **Ayush Rathour**, a frontend developer and student based in Saharanpur, Uttar Pradesh, India.

**Live Deployment:** [ayushrathour.netlify.app](https://ayushrathour.netlify.app)

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Architecture & Features](#-key-architecture--features)
3. [Technology Stack & CDNs](#-technology-stack--cdns)
4. [Project Structure](#-project-structure)
5. [Sections Breakdown](#-sections-breakdown)
6. [Interactive Components Breakdown](#-interactive-components-breakdown)
7. [Getting Started Locally](#-getting-started-locally)
8. [Customisation Guide](#-customisation-guide)
9. [Deployment](#-deployment)
10. [Performance, SEO & Accessibility](#-performance-seo--accessibility)
11. [Third-Party Credits & Attributions](#-third-party-credits--attributions)
12. [Contact & Connect](#-contact--connect)
13. [License & Usage Terms](#-license--usage-terms)

---

## 🌐 Project Overview

**AR.dev** is a single-page portfolio engineered without heavyweight frameworks, package managers, or bundlers. The entire application runs natively in the browser via clean, modular files (`index.html`, `styles.css`, and `script.js`).

### Design System

- **Palette**: Deep navy background (`#0a1f3d`, `#060f1f`) contrasted with bright cyan accents (`#00bcd4`), emerald green status indicators (`#22d97a`), and gold highlights (`#ffc432`).
- **Aesthetic**: Modern glassmorphism with frosted card containers, radial glow effects, ambient particle grids, and micro-interactions.
- **Typography**: `Bitcount Prop Single` (display/numbers/wordmarks) and `SUSE` (body/technical monospace).

---

## ⚡ Key Architecture & Features

### 1. Multi-Stage Canvas Preloader (`#loading-screen`)

- **Dynamic Hexagonal Particles**: Lightweight HTML5 Canvas particle system tracking system milestones.
- **Milestone-Driven Loading**: Computes real load progress across DOM parsing, WebFonts readiness, critical image decode, and `window.onload`.
- **Diagnostics Log**: Real-time faux boot console (`SYS`, `ENV`, `CSS`, `JS`, `NET`, `READY`) with fallback safety timeouts.

### 2. Adaptive Navigation System

- **Sticky Desktop Navigation**: Scroll-aware header with dynamic backdrop blur (`backdrop-filter: blur(20px)`), automatic section spy, and underline animations.
- **Accessible Mobile Drawer**: Slide-in sidebar with staggered entrance transitions, overlay backdrop, focus management, and `Escape` key capture.

### 3. Interactive Terminal & Bento Grid (`#about`)

- **JSON Typewriter Terminal**: Scroll-triggered typewriter effect rendering structured developer identity metadata.
- **Rotating Role Switcher**: Dynamic text transition through frontend and UI roles.
- **Interactive Tech Flip-Cards**: 3D hover cards detailing tools across Web, Python, and C.

### 4. Interactive Projects Showcase (`#projects`)

- **Category Filtering**: Real-time filtering by status (`All`, `Live`, `Paid Work`).
- **Embedded Modal Lightbox (`#projLightbox`)**: Custom fullscreen image inspection modal with keyboard navigation (`Escape`, `Enter`, `Space`) and loader spinners.
- **Direct Asset Downloads**: Direct access to downloadable assets, including the **FinTrack APK** and **Python/C Project archives**.

### 5. Filterable Media Gallery (`#gallery`)

- **GLightbox Integration**: Fullscreen media viewer supporting responsive multi-device mockups, UI concepts, and embedded MP4 video walkthroughs.

### 6. Serverless Contact System (`#contact`)

- **Real-Time Client Validation**: Field-level validation for format, regex, and character limits with live status icons.
- **Web3Forms Integration**: Asynchronous API submission (`fetch`) without page reloads, transitioning seamlessly to a confirmation view.

### 7. Direct Support Modal (`#supportPopup`)

- **UPI Deep Linking & QR Code**: Native payment button integration (`upi://pay`) and scannable QR overlay.
- **Smart Engagement Trigger**: Automatically displays after 90 seconds or on manual button clicks.

---

## 🛠️ Technology Stack & CDNs

| Domain            | Technology / Resource        | Usage                                                          |
| :---------------- | :--------------------------- | :------------------------------------------------------------- |
| **Markup**        | HTML5                        | Semantic structure, Microdata, ARIA tags, JSON-LD schemas      |
| **Styling**       | CSS3                         | CSS Custom Properties, Flexbox, Grid, Glassmorphism, Keyframes |
| **Scripting**     | JavaScript (ES6+)            | IntersectionObserver, Canvas API, Async Form Submission        |
| **Typography**    | Google Fonts                 | `Bitcount Prop Single`, `SUSE`                                 |
| **Iconography**   | Boxicons & Font Awesome 7    | UI icons, tech logos, and social glyphs                        |
| **Lightbox**      | GLightbox v3.3.0             | Gallery modal viewer and video player                          |
| **Form Endpoint** | Web3Forms API                | Serverless message transport                                   |
| **Analytics**     | Google Analytics (`gtag.js`) | Site telemetry (Property ID: `G-14JH9PNNWP`)                   |
| **Hosting**       | Netlify                      | Edge CDN static site hosting                                   |

---

## 📂 Project Structure

```text
AR.dev/
├── index.html                      # Core semantic HTML5 document
├── styles.css                      # Design tokens, layouts, animations & media queries
├── script.js                       # Preloader, observers, lightbox & form logic
├── google333456a1430d0ff....html   # Google Search Console domain verification
├── LICENSE                         # MIT License and personal property conditions
├── README.md                       # Repository documentation
│
├── Assets/                         # Static visual assets
│   ├── Favicon.png                 # Browser tab favicon
│   ├── Profile_Photo.png           # Profile photo
│   ├── upi_qr.png                  # Support UPI QR payment code
│   │
│   ├── Gallery_Images/             # Visual Notes gallery items
│   │   ├── blogs_by_ar.png
│   │   ├── blogs_mockup.png
│   │   ├── fintrack_md_mockup.png
│   │   ├── fintrack_mockup.png
│   │   ├── fintrack_ui_mockup.png
│   │   ├── fintrack_upgrade.png
│   │   └── portfolio_upgrade.png
│   │
│   ├── Gallery_Thumb/              # Video poster thumbnails
│   │   ├── ardev_thumb.png
│   │   └── fintrack_thumb.png
│   │
│   ├── Gallery_Videos/             # Visual showcase video demos
│   │   ├── ardev_explained.mp4
│   │   └── fintrack_explained.mp4
│   │
│   └── Project_Images/             # Project showcase card screenshots
│       ├── c_programming_img.png
│       ├── fintrack_img.png
│       ├── python_img.png
│       ├── shaurya_ptf.png
│       └── varun_ptf.png
│
└── files/                          # Downloadable distribution files
    ├── C_Projects.zip              # Packaged foundational C source code
    ├── FinTrack_v17.apk          # Native Android build for FinTrack PWA
    └── Python_Projects.zip         # Packaged Python CLI utility suite
```

---

## 🧭 Sections Breakdown

```
[#home]        Hero section with animated wordmark, bio, metrics, and floating skill chips
  │
[#about]       Bento grid featuring the JSON terminal, active learning meters, and flip-cards
  │
[#skills]      Core stack indicators and segmented progress bars (Web, Python, C, UI/UX)
  │
[#milestones]  Chronological timeline covering learning milestones and project releases (2022-2026)
  │
[#projects]    Filterable project cards with direct links, modal lightboxes, and source downloads
  │
[#gallery]     Curated visual grid of UI mockups, conceptual drafts, and walkthrough videos
  │
[#contact]     Direct contact avenues, social cards, and validated Web3Forms message form
```

---

## 🧩 Interactive Components Breakdown

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      Page Boot Preloader Flow                          │
 └────────────────────────────────────────────────────────────────────────┘
        │
        ├── 1. Canvas initializes floating hexagonal particles
        ├── 2. Events attach to DOMContentLoaded, Fonts Ready & Image Decodes
        ├── 3. Terminal log updates in real time (SYS -> ENV -> CSS -> JS -> NET)
        └── 4. Smooth interpolation triggers dismiss animation when fully loaded

 ┌────────────────────────────────────────────────────────────────────────┐
 │                     Global Scroll Reveal Engine                        │
 └────────────────────────────────────────────────────────────────────────┘
        │
        ├── 1. `registerRevealElements()` calculates staggered delays
        ├── 2. Unified IntersectionObserver triggers hardware-accelerated transforms
        └── 3. Animates progress bars and timeline paths into viewport view
```

---

## 🚀 Getting Started Locally

Because **AR.dev** requires no compilation or package installation, local setup is quick and straightforward.

### 1. Clone the Repository

```bash
git clone https://github.com/ayush-rathour/portfolio.git
cd portfolio
```

### 2. Launch Local Server

Serving through a local server ensures asset requests, fonts, videos, and downloads load consistently across all browsers:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (via npx)
npx http-server -p 8000
```

### 3. Open in Browser

Navigate to `http://localhost:8000` in any modern web browser.

---

## 🎨 Customisation Guide

| Component                | Target Location               | Description                                                             |
| :----------------------- | :---------------------------- | :---------------------------------------------------------------------- |
| **Theme Colors**         | `styles.css` (`:root`)        | Adjust `--primary-color`, `--background-color`, and `--hover-bg-color`. |
| **Bio & Headings**       | `index.html` (`#home`)        | Update text nodes, call-to-actions, and hero statistics.                |
| **Identity Terminal**    | `script.js` (`terminalData`)  | Update the key-value JSON objects rendered inside the terminal window.  |
| **Skills & Percentages** | `index.html` (`#skills`)      | Modify skill titles, badges, and `data-pct` integer values (0–100).     |
| **Milestones**           | `index.html` (`#milestones`)  | Add or update timeline cards (`.tl-item`) with dates and badges.        |
| **Projects & Links**     | `index.html` (`#projects`)    | Update `.proj-card` entries, download links, and category tags.         |
| **Form Endpoint**        | `index.html` (`#contactForm`) | Replace the `access_key` value with your own Web3Forms key.             |
| **Google Analytics**     | `index.html` (`<head>`)       | Update the `G-XXXXXXXXXX` tag with your Google Analytics ID.            |

---

## 📦 Deployment

The static structure of AR.dev allows deployment to any modern static hosting provider.

### Netlify Deployment

1. Connect your GitHub repository to [Netlify](https://app.netlify.com/).
2. Set the **Build Command** to empty (no build step needed).
3. Set the **Publish Directory** to `.` (root directory).
4. Click **Deploy**.

_Compatible with GitHub Pages, Cloudflare Pages, and Vercel._

---

## 🔍 Performance, SEO & Accessibility

- **Preconnect & Prefetch**: Accelerates DNS lookup and stylesheet parsing for Google Fonts, CDNs, and Google Tag Manager.
- **Structured Data (JSON-LD)**: Includes Schema.org schemas (`@type: Person` and `@type: WebSite`) for rich snippet indexing.
- **Full ARIA Compliance**: Equipped with `role="status"`, `role="dialog"`, `aria-modal="true"`, `aria-live`, and clear label descriptors.
- **Accessibility & Reduced Motion**: Features `:focus-visible` ring outlines and a full `@media (prefers-reduced-motion: reduce)` ruleset to minimize animations when requested.
- **Image Optimization**: Utilizes eager decoding for above-the-fold assets alongside lazy loading for project galleries.

---

## 📜 Third-Party Credits & Attributions

- **Loading Animation Concept**: Adapted from [Uiverse.io](https://uiverse.io/) (by _andrew-manzyk_), customized for the AR.dev dark theme.
- **GLightbox**: Lightbox and video gallery library by [Biati Digital](https://biati-digital.github.io/glightbox/) (MIT License).
- **Icons**: [Boxicons](https://boxicons.com/) & [Font Awesome 7](https://fontawesome.com/) (Free Licenses).
- **Typography**: [Google Fonts](https://fonts.google.com/) — _Bitcount Prop Single_ and _SUSE_ (SIL Open Font License).
- **Form Infrastructure**: [Web3Forms](https://web3forms.com/) serverless form API.

---

## 📬 Contact & Connect

**Ayush Rathour**  
_Frontend Developer & UI Designer_  
Saharanpur, Uttar Pradesh, India (PIN: 247232)

- **Email**: [ayushrathour.dev@gmail.com](mailto:ayushrathour.dev@gmail.com)
- **Phone / WhatsApp**: [+91 95480 69160](tel:+919548069160) / [Chat on WhatsApp](https://wa.me/+919548069160)
- **LinkedIn**: [linkedin.com/in/ayushrathourrr](https://www.linkedin.com/in/ayushrathourrr/)
- **GitHub**: [github.com/ayush-rathour](https://github.com/ayush-rathour)
- **Instagram**: [@ayushrathourrr](https://www.instagram.com/ayushrathourrr)

---

## 📄 License & Usage Terms

The source code of this portfolio is licensed under the [MIT License](LICENSE) © 2024–2026 **Ayush Rathour**.

```
MIT License - Summary Condition:
Permission is granted to use, copy, modify, and distribute the software code,
provided that the copyright notice and this permission notice appear in all copies.
```

> **Personal Content Notice:** The personal brand assets, including the name **"Ayush Rathour"**, the **"AR.dev"** wordmark/branding, personal biographies, narrative milestone logs, project descriptions, and personal portrait photos, are excluded from the open MIT License. If you use this codebase as a template, please replace all personal information and assets with your own before publishing.

---

<div align="center">
  <sub>Crafted with curiosity and clean code • Built by <strong>Ayush Rathour</strong></sub>
</div>
