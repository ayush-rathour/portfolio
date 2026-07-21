# AR.dev - Personal Portfolio of Ayush Rathour

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Styled with CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://ayushrathour.netlify.app)

> A modern, fully responsive personal portfolio website built with semantic HTML5, hand-written CSS3, and vanilla JavaScript - designed and developed by **Ayush Rathour**, a frontend developer from Saharanpur, Uttar Pradesh, India.

**Live Site:** [ayushrathour.netlify.app](https://ayushrathour.netlify.app)

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Sections](#sections)
6. [Getting Started](#getting-started)
7. [Customisation Guide](#customisation-guide)
8. [Deployment](#deployment)
9. [Performance & Accessibility](#performance--accessibility)
10. [Browser Support](#browser-support)
11. [Credits & Attributions](#credits--attributions)
12. [Contact](#contact)
13. [License](#license)

---

## Overview

This repository contains the complete source code for **AR.dev**, a single-page portfolio website that showcases the projects, skills, milestones, and contact details of Ayush Rathour. The site is built without any frontend frameworks or build tooling - it is composed of a single `index.html` document, a single `styles.css` stylesheet, and a single `script.js` file, making it lightweight, easy to audit, and trivial to deploy on any static hosting provider.

The design follows a **dark, glassmorphism-driven aesthetic** with a cyan (`#00bcd4`) accent colour, subtle ambient backgrounds, scroll-triggered reveal animations, and a fully custom mobile navigation system.

---

## Key Features

### Design & UI

- **Premium glassmorphism interface** - frosted-glass cards, ambient glow orbs, and subtle grid textures throughout.
- **Fully custom AR.dev-themed page loader** with a two-phase progress system (indeterminate shimmer during load, determinate fill on completion), a non-scrollable frosted backdrop, and a hard safety timeout to guarantee it never gets stuck.
- **Sticky, scroll-aware header** that changes appearance on scroll and highlights the active section in real time.
- **Animated mobile sidebar navigation** with staggered entrance transitions, overlay backdrop, and full keyboard (Escape key) support.
- **macOS-style interactive terminal** in the About section, complete with a typewriter-animated command line and scroll-triggered, sequentially revealed output blocks.
- **Animated skill proficiency bars** with segmented progress indicators that animate into view on scroll.
- **Vertical timeline / milestones section** with an animated travelling glow along the spine.
- **Filterable projects grid** (All / Live / Paid Work) with a custom lightbox for full-screen image previews.
- **Filterable gallery** (All / Upgrade / Design / Video) with lazy-loaded images, hover overlays, and embedded video playback via GLightbox.
- **Floating "Support AR.dev" panel** with UPI payment integration and QR code.

### Functionality

- **Smooth-scroll navigation** with header-offset compensation for all anchor links.
- **Scroll-reveal animation system** - a single shared `IntersectionObserver` drives staggered fade/slide-in animations across headings, cards, panels, and timeline items.
- **Inline contact form validation** - real-time field validation (name, email, subject, message) with success/error iconography and accessible error messaging.
- **Form submission via Web3Forms** - serverless contact form handling with a success-state UI swap.
- **Scroll-to-top button** that appears after a scroll threshold.
- **Hero entrance animation sequence** with staggered element reveals on page load.

### SEO & Metadata

- Comprehensive **Open Graph** and **Twitter Card** metadata for rich social media link previews.
- **JSON-LD structured data** (Schema.org `Person` and `WebSite` types) for enhanced search engine understanding.
- **Local SEO** geo-tags for Saharanpur, Uttar Pradesh, India.
- Canonical URL, robots directives, and PWA-ready meta tags (Apple touch icons, theme colour, mobile web app capability).

---

## Tech Stack

| Category         | Technology |
|------------------|------------|
| Markup           | HTML5 (Semantic HTML, Accessibility, ARIA attributes) |
| Styling          | CSS3 (Custom Properties, Flexbox, CSS Grid, Animations, Media Queries) |
| Scripting        | Vanilla JavaScript (ES6+) |
| Fonts            | Bitcount Prop Single, SUSE (Google Fonts) |
| Icons            | Boxicons, Font Awesome 7 |
| Image & Video Gallery | GLightbox |
| Contact Form     | Web3Forms |
| Analytics        | Google Analytics (gtag.js) |
| Hosting          | Netlify |
| Version Control  | Git & GitHub |

**Build Process:** None (No package manager, bundler, or build tools required).

**CDNs Used:** Google Fonts, jsDelivr, Cloudflare CDN.

---

## Project Structure

```
.
├── index.html                      # Main HTML document
├── google333456a1430d0ff....html   # Google Search Console verification file
├── LICENSE
├── README.md
│
├── assets/
│   ├── favicon.png
│   ├── profile_photo.png
│   ├── upi_qr.png
│   │
│   ├── Gallery_Images/
│   │   ├── blogs_by_ar.png
│   │   ├── blogs_mockup.png
│   │   ├── fintrack_md_mockup.png
│   │   ├── fintrack_mockup.png
│   │   ├── fintrack_ui_mockup.png
│   │   ├── fintrack_upgrade.png
│   │   └── portfolio_upgrade.png
│   │
│   ├── Gallery_Thumb/
│   │   ├── ardev_thumb.png
│   │   └── fintrack_thumb.png
│   │
│   ├── Gallery_Videos/
│   │   ├── ardev_exp.mp4
│   │   └── fintrack_exp.mp4
│   │
│   └── Project_Images/
│       ├── fintrack_img.png
│       ├── python_img.png
│       ├── shaurya_ptf.png
│       └── varun_ptf.png
│
├── files/
│   ├── fintrack_v17.3.apk
│   └── python_projects.zip
│
├── styles.css                      # Complete stylesheet
└── script.js                       # Client-side JavaScript
```

> **Note:** The `assets/` and `files/` directories referenced in `index.html` must be present alongside the root files for images, icons, downloadable assets, and the favicon to resolve correctly.

---

## Sections

The portfolio is organised into the following single-page sections, each accessible via the navigation bar and sidebar:

| Section        | ID            | Description                                                                                                                        |
| -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Home**       | `#home`       | Hero section with name, bio, key statistics, and primary calls-to-action.                                                          |
| **About**      | `#about`      | Interactive terminal-style "about me" panel with identity, bio, tech stack, stats, links, and availability information.            |
| **Skills**     | `#skills`     | Grid of skill cards with animated proficiency bars (HTML/CSS, Responsive Design, UI/UX, Frontend Development, Deployment, Python). |
| **Milestones** | `#milestones` | Vertical timeline of career and learning milestones from May 2022 to April 2026.                                                   |
| **Projects**   | `#projects`   | Filterable showcase of shipped projects, including FinTrack, client collaborations, and Python utility tools.                      |
| **Gallery**    | `#gallery`    | Filterable visual log of mockups, design concepts, UI upgrades, and embedded walkthrough videos.                                   |
| **Contact**    | `#contact`    | Contact information cards, social links, and a validated contact form powered by Web3Forms.                                        |

---

## Getting Started

### Prerequisites

No build tools, package managers, or dependencies are required to run this project locally. A modern web browser is sufficient.

### Running Locally

1. **Clone or download** this repository to your local machine.

   ```bash
   git clone https://github.com/ayush-rathour/portfolio.git
   cd portfolio
   ```

2. **Ensure asset directories are present.** Confirm that `Assets/` and `files/` exist in the project root with the images, videos, and downloadable files referenced in `index.html`.

3. **Open the site.** Simply open `index.html` in a web browser, or serve it with a lightweight local server for accurate behaviour (recommended, since some browsers restrict certain features under the `file://` protocol):

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server .
   ```

4. **Visit** `http://localhost:8000` in your browser.

---

## Customisation Guide

This portfolio was built to be personalised. Key areas to edit when adapting this template:

| What to change                        | Where                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| Name, bio, hero stats                 | `index.html` → `#home` section                                                                |
| Meta tags, Open Graph, JSON-LD        | `index.html` → `<head>`                                                                       |
| About terminal content                | `index.html` → `#abtOutput` block                                                             |
| Skill cards & proficiency percentages | `index.html` → `.skill-block` elements (`data-pct` attribute)                                 |
| Timeline milestones                   | `index.html` → `.tl-item` elements                                                            |
| Project cards                         | `index.html` → `.proj-card` elements                                                          |
| Gallery items                         | `index.html` → `.gl2-item` elements                                                           |
| Contact details, social links         | `index.html` → `#contact` and footer                                                          |
| Web3Forms access key                  | `index.html` → `<input type="hidden" name="access_key">`                                      |
| Google Analytics ID                   | `index.html` → `gtag('config', 'G-XXXXXXXXXX')`                                               |
| Theme colours                         | `styles.css` → `:root` custom properties                                                      |
| Loader branding & timing              | `index.html` → `#pageLoader`, `styles.css` → "PAGE LOADER" section, `script.js` → loader IIFE |

### Theme Colours

All primary colours are defined as CSS custom properties at the top of `styles.css`:

```css
:root {
  --primary-color: #00bcd4;
  --secondary-color: #e0e0e0;
  --background-color: #0a1f3d;
  --header-bg-color: #00bcd4;
  --text-color: #fff;
  --content-bg-color: #1c2b48a6;
  --box-shadow-color: #00000060;
  --box-shadow-hover-color: #00000099;
  --hover-bg-color: #008fa2;
  --hover-text-color: #007c8c;
}
```

Adjusting `--primary-color` will cascade through navigation highlights, buttons, badges, the loader, and accent lines across the site.

---

## Deployment

This site is configured for static hosting and is currently deployed via **Netlify** at [ayushrathour.netlify.app](https://ayushrathour.netlify.app).
The complete source code is also available on **GitHub** at [github.com/ayush-rathour/portfolio](https://github.com/ayush-rathour/portfolio).

### Deploying to Netlify

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Create a new site on [Netlify](https://app.netlify.com/) and connect the repository.
3. Leave the build command empty and set the publish directory to the repository root (`.`).
4. Deploy. Netlify will automatically serve `index.html`.

### Deploying to Other Static Hosts

The project is equally compatible with GitHub Pages, Vercel, Cloudflare Pages, or any static file server, provided the directory structure (including `Assets/` and `files/`) is preserved.

---

## Performance & Accessibility

- **Font loading** is optimised via `preconnect`, `dns-prefetch`, and non-blocking stylesheet loading (`media="print"` swap technique) with `<noscript>` fallbacks.
- **Images** use `loading="lazy"` for below-the-fold content and `loading="eager"` / `fetchpriority="high"` for the hero avatar.
- **Reduced motion** is respected throughout via `@media (prefers-reduced-motion: reduce)` queries, which disable or simplify animations for users who have indicated this preference at the operating system level.
- **Keyboard navigation** is fully supported - the mobile sidebar, image lightboxes, and interactive elements all respond to `Escape`, `Enter`, and `Space` where appropriate, and visible focus outlines are provided via `:focus-visible`.
- **ARIA attributes** (`aria-label`, `aria-hidden`, `aria-expanded`, `aria-modal`, `aria-live`, `role`) are used throughout to support assistive technologies.
- **Semantic HTML** structure (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) supports both accessibility and SEO.

---

## Browser Support

The site uses modern CSS features including `backdrop-filter`, CSS Grid, custom properties, and `IntersectionObserver`. It is tested and supported on the latest stable versions of:

- Google Chrome / Chromium-based browsers (Edge, Brave, Opera)
- Mozilla Firefox
- Apple Safari (desktop and iOS)
- Samsung Internet

Users on significantly outdated browsers may experience degraded visual effects (e.g. backdrop blur), though core content and navigation will remain functional.

---

## Credits & Attributions

- **Page Loader Animation** - Cloud loader SVG/CSS originally sourced from [Uiverse.io](https://uiverse.io/) (by andrew-manzyk), recoloured and restructured for the AR.dev theme.
- **Icons** - [Boxicons](https://boxicons.com/) and [Font Awesome](https://fontawesome.com/), used under their respective free/open-source licenses.
- **Fonts** - [Bitcount Prop Single](https://fonts.google.com/specimen/Bitcount+Prop+Single) and [SUSE](https://fonts.google.com/specimen/SUSE), distributed under the [SIL Open Font License](https://scripts.sil.org/OFL).
- **Lightbox Library** - [GLightbox](https://biati-digital.github.io/glightbox/), licensed under MIT.

All photographs, project screenshots, branding, ASCII artwork, and written content within this repository are the original work (or creation) of [github.com/ayush-rathour](https://github.com/ayush-rathour) unless otherwise stated.

---

## Contact

**Ayush Rathour**
Frontend Developer · Saharanpur, Uttar Pradesh, India

- **Phone:** [+91 95480 69160](tel:+919548069160)
- **Email:** [ayushrathour.dev@gmail.com](mailto:ayushrathour.dev@gmail.com)
- **Instagram:** [@ayushrathourrr](https://www.instagram.com/ayushrathourrr)
- **GitHub:** [github.com/ayush-rathour](https://github.com/ayush-rathour)
- **Whatsapp:** [+91 95480 69160](https://wa.me/+919548069160)

For project inquiries, collaborations, or general questions, please use the [contact form](https://ayushrathour.netlify.app/#contact) on the live site or reach out directly via email.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full license text.

In summary, the MIT License permits anyone to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the source code, provided that the original copyright notice and license text are included in all copies or substantial portions of the software. The software is provided "as is", without warranty of any kind.

> **Please Note:** While the source code is openly licensed under MIT, the personal content of this portfolio - including but not limited to the name "Ayush Rathour," the "AR.dev" branding, profile photographs, project descriptions, and biographical information - represents the personal identity and original work of the author and is **not** intended for reuse as-is. If you use this codebase as a template for your own portfolio, please replace all personal content, branding, and assets with your own.

---

<p align="center">Built with care, curiosity, and a lot of cups of coffee ☕ - by <strong>Ayush Rathour</strong></p>
