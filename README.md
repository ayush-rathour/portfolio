<div align="center">

# AR.dev

**Personal portfolio of Ayush Rathour: frontend developer & UI designer**

A single-page, framework-free portfolio built with semantic HTML5, custom-property-driven CSS3 and vanilla ES6+ JavaScript.

[![Live](https://img.shields.io/badge/Live-ayushrathour.netlify.app-00C7B7?logo=netlify&logoColor=white)](https://ayushrathour.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

[Live Site](https://ayushrathour.netlify.app) · [Report an Issue](https://github.com/ayush-rathour/portfolio/issues) · [Contact](#contact)

</div>

---

## Contents

1. [At a Glance](#at-a-glance)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [How It Works](#how-it-works)
6. [Getting Started](#getting-started)
7. [Customisation](#customisation)
8. [Deployment](#deployment)
9. [Performance, SEO & Accessibility](#performance-seo--accessibility)
10. [Roadmap](#roadmap)
11. [Credits](#credits)
12. [Contact](#contact)
13. [License & Usage](#license--usage)

---

## At a Glance

|              |                                                                  |
| :----------- | :--------------------------------------------------------------- |
| **Type**     | Single-page static portfolio (no build step, no package manager) |
| **Files**    | `index.html`, `styles.css`, `script.js`                          |
| **Sections** | Home, About, Skills, Milestones, Projects, Gallery, Contact      |
| **Hosting**  | Netlify (static, edge CDN)                                       |
| **Design**   | Dark navy glassmorphism, cyan accent, gold highlights            |
| **Fonts**    | `Bitcount Prop Single` (display), `SUSE` (body)                  |

**Palette**

| Role                           | Colour               |
| :----------------------------- | :------------------- |
| Background                     | `#0a1f3d`, `#060f1f` |
| Primary accent                 | `#00bcd4`            |
| Success / status               | `#22d97a`            |
| Highlight (paid work, support) | `#ffc432`            |

---

## Features

### Experience

- **Boot-sequence preloader.** A canvas of floating hexagons and a faux boot console (`SYS`, `ENV`, `CSS`, `JS`, `NET`, `READY`). Progress is driven by real milestones: DOM ready, fonts ready, critical images decoded and `window.onload`.
- **Scroll-reveal engine.** One shared `IntersectionObserver` handles staggered, directional reveals across all sections.
- **Reduced-motion support.** A full `prefers-reduced-motion` ruleset disables animation on request.

### Navigation

- **Sticky header** with blur, scrolled state and active-section highlighting.
- **Mobile drawer** with staggered entrance, overlay, `Escape` to close and `aria-expanded` state.
- **Offset-aware smooth scrolling** that accounts for the sticky header height.

### Content Sections

| Section        | Highlights                                                                                                                    |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Home**       | Animated wordmark, bio, stats, floating skill chips, staggered entrance after the preloader                                   |
| **About**      | Bento grid: bio panel, JSON typewriter terminal, rotating role badge, "currently building" progress bars, flip-card interests |
| **Skills**     | Core and compact skill cards with animated linear and segmented progress bars (`data-pct`)                                    |
| **Milestones** | Vertical timeline (2022 to 2026) with year filter and highlighted paid-work card                                              |
| **Projects**   | Filterable cards (`All`, `Live`, `Paid`), fullscreen image lightbox, APK and ZIP downloads                                    |
| **Gallery**    | Filterable media grid powered by GLightbox, with image mockups and MP4 walkthroughs                                           |
| **Contact**    | Validated form with live status icons, Web3Forms submission and an animated success state                                     |

### Support Modal

- UPI deep link (`upi://pay`) plus a scannable QR code.
- Opens from the header or sidebar button, or automatically after 90 seconds.

---

## Tech Stack

| Domain    | Technology                     | Used for                                                       |
| :-------- | :----------------------------- | :------------------------------------------------------------- |
| Markup    | HTML5                          | Semantic structure, ARIA, JSON-LD                              |
| Styling   | CSS3                           | Custom properties, Grid, Flexbox, keyframes, `backdrop-filter` |
| Scripting | JavaScript (ES6+)              | IntersectionObserver, Canvas API, `fetch`                      |
| Fonts     | Google Fonts                   | Bitcount Prop Single, SUSE                                     |
| Icons     | Boxicons 2.1.4, Font Awesome 7 | UI icons, brand and tech glyphs                                |
| Lightbox  | GLightbox 3.3.0                | Gallery images and video                                       |
| Forms     | Web3Forms                      | Serverless contact submission                                  |
| Analytics | Google Analytics (gtag.js)     | Traffic telemetry                                              |
| Hosting   | Netlify                        | Static hosting and CDN                                         |

---

## Project Structure

```text
portfolio/
├── index.html                # Page markup, meta tags, JSON-LD
├── styles.css                # Design tokens, layout, animations, media queries
├── script.js                 # All interactive behaviour (see "How It Works")
├── README.md
├── LICENSE
├── google*.html              # Search Console verification file
│
├── assets/
│   ├── favicon.png
│   ├── profile_photo.png
│   ├── upi_qr.png
│   ├── Project_Images/       # Project card screenshots
│   ├── Gallery_Images/       # Gallery mockups and design shots
│   ├── Gallery_Thumb/        # Video poster thumbnails
│   └── Gallery_Videos/       # MP4 walkthroughs
│
└── files/                    # Downloadable files
    ├── fintrack_v17.apk
    ├── python_projects.zip
    └── c_projects.zip
```

> **Heads-up:** Netlify serves from a case-sensitive file system. Folder and file names in `index.html` must match the repository exactly (for example `assets/` vs `Assets/`).

---

## How It Works

`script.js` is organised as independent blocks, one per section. Each block guards for missing elements, so removing a section from the HTML will not break the rest.

| Block                | Responsibility                                                                                                         |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Boot sequence**    | Tracks load milestones, interpolates the progress display, draws hexagon particles, dismisses the loader (minimum 3 s) |
| **Header & sidebar** | Drawer open/close, section spy, scrolled header state                                                                  |
| **Smooth scroll**    | Header-offset scrolling for in-page anchors                                                                            |
| **Hero entrance**    | Adds `hero-ready` once the preloader fades out (with a 1 s fallback)                                                   |
| **About**            | Terminal typewriter (`terminalData`), role rotation, build bars                                                        |
| **Skills**           | Builds segment rows and animates bars when cards enter view                                                            |
| **Milestones**       | Year filter and last-visible-item spacing fix                                                                          |
| **Projects**         | Status filter and the custom fullscreen lightbox                                                                       |
| **Gallery**          | Reveal observer and tag filter (GLightbox is initialised in `index.html`)                                              |
| **Contact form**     | Per-field validation, `fetch` submission, success and error states                                                     |
| **Support modal**    | Open/close logic and the 90-second auto-prompt                                                                         |
| **Global reveal**    | `registerRevealElements()` tagging, shared observer, back-to-top button                                                |

**Boot flow**

```text
Canvas starts  →  listeners attach (DOM, fonts, images, load)
      →  boot log reveals line by line  →  progress eases toward real milestones
      →  all milestones done + minimum time passed  →  loader fades, hero animates in
```

---

## Getting Started

No installation or build is required.

```bash
git clone https://github.com/ayush-rathour/portfolio.git
cd portfolio

# Serve locally (pick one)
python -m http.server 8000
npx http-server -p 8000
```

Open `http://localhost:8000`. Use a local server rather than opening the file directly, so fonts, videos and downloads behave like production.

---

## Customisation

| What                | Where                                               | How                                                                         |
| :------------------ | :-------------------------------------------------- | :-------------------------------------------------------------------------- |
| Theme colours       | `styles.css` → `:root`                              | Edit `--primary-color`, `--background-color`, `--hover-bg-color`            |
| Hero text and stats | `index.html` → `#home`                              | Edit the text nodes and `.hs-num` / `.hs-label` values                      |
| Terminal identity   | `script.js` → `terminalData`                        | Edit the key/value entries                                                  |
| Rotating roles      | `script.js` → `roles`                               | Edit the array                                                              |
| Skill levels        | `index.html` → `#skills`                            | Set `data-pct` (0 to 100) on each `.skill-block`                            |
| Milestones          | `index.html` → `#milestones`                        | Add or edit `.tl-item` blocks and keep `data-year` correct                  |
| Projects            | `index.html` → `#projects`                          | Add `.proj-card` entries and set `data-status` (`live`, `paid`, `archived`) |
| Gallery items       | `index.html` → `#gallery`                           | Add `.gl2-item` entries with a `data-gl-tag` that matches a filter button   |
| Contact form        | `index.html` → `#contactForm`                       | Replace the `access_key` with your own Web3Forms key                        |
| Analytics           | `index.html` → bottom scripts                       | Replace the `G-` measurement ID with your own, or remove it                 |
| Support modal       | `index.html` → `#supportPopup`                      | Update the UPI link and QR image, or remove the block                       |
| Auto popup delay    | `script.js` → `setTimeout(openSupportModal, 90000)` | Change or delete the timer                                                  |

---

## Deployment

Any static host works (Netlify, GitHub Pages, Cloudflare Pages, Vercel).

**Netlify**

1. Connect the GitHub repository at [app.netlify.com](https://app.netlify.com/).
2. Leave the build command empty.
3. Set the publish directory to `.`
4. Deploy.

After deploying, restrict your Web3Forms key to your domain in its dashboard.

---

## Performance, SEO & Accessibility

**Performance**

- Preconnect and DNS-prefetch hints for fonts and CDNs.
- Non-blocking font and icon stylesheet loading.
- `loading="lazy"` on below-the-fold images, `fetchpriority="high"` on the hero image.
- Passive scroll listeners and a single shared reveal observer.

**SEO**

- Canonical URL, Open Graph and Twitter Card tags.
- Schema.org JSON-LD (`Person` and `WebSite`).
- Geo meta tags for local search.

**Accessibility**

- Semantic landmarks, ARIA roles (`dialog`, `status`) and labelled controls.
- `:focus-visible` outlines and keyboard support (`Escape`, `Enter`, `Space`) in the drawer and lightbox.
- `prefers-reduced-motion` and `color-scheme` handling.

---

## Roadmap

Planned improvements, roughly in priority order:

- [ ] Verify asset path casing between `index.html` and the repository
- [ ] Add a "Mockup" gallery filter and fix the "Rewamped" typo
- [ ] Shorten the preloader and show it once per session
- [ ] Add a dedicated 1200×630 Open Graph image
- [ ] Add resume download and project case studies
- [ ] Replace the 90-second support popup with a less intrusive prompt
- [ ] Merge to a single icon set and convert images to WebP/AVIF
- [ ] Add `sitemap.xml`, `robots.txt`, a web manifest and a service worker
- [ ] Add a Netlify `_headers` file with a Content Security Policy
- [ ] Improve dialog and drawer focus management (`inert`, focus trap)

---

## Credits

- **Loading animation concept:** adapted from [Uiverse.io](https://uiverse.io/) (by _andrew-manzyk_).
- **GLightbox:** [Biati Digital](https://biati-digital.github.io/glightbox/) (MIT).
- **Icons:** [Boxicons](https://boxicons.com/) and [Font Awesome](https://fontawesome.com/) (free licences).
- **Typography:** [Google Fonts](https://fonts.google.com/) (SIL Open Font License).
- **Forms:** [Web3Forms](https://web3forms.com/).

---

## Contact

**Ayush Rathour** · Frontend Developer & UI Designer · Saharanpur, Uttar Pradesh, India

- Email: [ayushrathour.dev@gmail.com](mailto:ayushrathour.dev@gmail.com)
- LinkedIn: [linkedin.com/in/ayushrathourrr](https://www.linkedin.com/in/ayushrathourrr/)
- GitHub: [github.com/ayush-rathour](https://github.com/ayush-rathour)
- Instagram: [@ayushrathourrr](https://www.instagram.com/ayushrathourrr)

---

## License & Usage

Source code is released under the [MIT License](LICENSE), © 2024–2026 Ayush Rathour.

**Personal content is excluded from the MIT License:** the name "Ayush Rathour", the "AR.dev" wordmark and branding, biographies, milestone text, project descriptions and personal photos. If you use this code as a template, replace all personal information, assets, analytics IDs, form keys and payment details with your own before publishing.

<div align="center">
  <sub>Crafted with curiosity and clean code · Built by <strong>Ayush Rathour</strong></sub>
</div>
