<div align="center">

# AR.dev

**Personal portfolio of Ayush Rathour: student developer & UI designer**

A multi-page, framework-free portfolio built with semantic HTML5, custom-property-driven CSS3 and vanilla ES6+ JavaScript. No build step, no dependencies.

[![Live](https://img.shields.io/badge/Live-ayushrathour.netlify.app-b8f36b?logo=netlify&logoColor=20221f)](https://ayushrathour.netlify.app)
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

|             |                                                                                      |
| :---------- | :----------------------------------------------------------------------------------- |
| **Type**    | Multi-page static portfolio (no build step, no package manager)                      |
| **Pages**   | Home, About, Skills, Projects, Milestones, Gallery, Contact, plus a custom 404       |
| **Scripts** | `main.js` (site-wide), `pages.js` (page features), `case-studies.js` (Projects only) |
| **Hosting** | Netlify (static, edge CDN)                                                           |
| **Design**  | "Hybrid Glass Editorial": warm paper background, ink text, lime accent               |
| **Fonts**   | `Manrope` (headings), `DM Sans` (body), `DM Mono` (labels and code)                  |
| **Icons**   | Inline SVG (Lucide), no icon library to load                                         |

**Palette**

| Role                   | Colour    |
| :--------------------- | :-------- |
| Background             | `#f4f2ed` |
| Surface                | `#ffffff` |
| Ink (text)             | `#20221f` |
| Muted text             | `#686b63` |
| Accent (lime)          | `#b8f36b` |
| Accent (dark, strokes) | `#719f36` |
| Success / status       | `#397a2b` |
| 404 terminal           | `#1d201c` |

---

## Features

### Experience

- **Glass editorial design.** Soft translucent cards, lime accent highlights and a mono-label system used consistently across every page.
- **Progressive motion.** Scroll-driven header shadow and reading-progress line, a timeline line that fills as you scroll, and cross-page view transitions. Browsers without support simply skip them.
- **Reduced-motion support.** A full `prefers-reduced-motion` ruleset turns animation off on request, and hover effects are disabled on touch screens.
- **Print stylesheet.** Navigation is hidden and link URLs are printed after each link.

### Navigation

- **Sticky header** with blur, scroll shadow and a glass-capsule nav. A lime pill rests on the current page (`aria-current="page"`) and glides to the link you hover or focus, then back again. Without JavaScript the current page simply gets the lime pill on its own link.
- **Mobile menu** with open/close icon swap, a staggered link reveal, an ink row for the current page, `Escape` to close, click-outside to close and `aria-expanded` state.
- **Skip link** to jump straight to the main content.

### Pages

| Page           | Highlights                                                                                                                                                         |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**       | Hero with stats, a "Now" strip (current learning plus latest GitHub commit), a GitHub contribution graph, featured projects, skills overview and a journey preview |
| **About**      | Long-form story, guiding principle, working approach and life beyond the code                                                                                      |
| **Skills**     | Evidence-based skill cards (no percentage bars), workflow tools, project-specific technology notes and certificates                                                |
| **Projects**   | Five projects with a full **case study overlay** each, live links and APK / ZIP downloads                                                                          |
| **Milestones** | Year-by-year timeline (2022 to 2026) with a jump-to-year bar and a self-drawing timeline line                                                                      |
| **Gallery**    | Filterable grid (All, Design, Upgrade, Video) with a native-`<dialog>` lightbox for images and MP4 walkthroughs                                                    |
| **Contact**    | Six contact channels, a validated form (Web3Forms), "what to include" guide and a UPI support section with QR code                                                 |
| **404**        | A standalone page with a working interactive terminal (`help`, `ls`, `projects`, `open <page>`, tab completion, command history and more)                          |

### Case Study Overlay

- One overlay for all projects, opened from each project card.
- Five sections per case study: **Why it exists, How it works, How it was built, The hardest part, Outcome**.
- Reading-progress line, sticky section chips, previous / next navigation and `←` `→` keyboard support.
- **Deep links:** `projects.html#case-fintrack` opens that case study directly.
- All writing lives in one `CASES` array in `js/case-studies.js`.

### "Now" Strip

- Static "currently learning" card, edited by hand once a month.
- A live **latest GitHub commit** card, fetched from the public GitHub API across the repos listed in `data-github-repos`. Results are cached for 15 minutes per tab, and the card falls back to a plain GitHub link if anything fails.

### GitHub Contribution Graph

- Sits on the home page under the "Now" strip, in the site theme (the lime scale from the palette, five levels).
- **Responsive by design:** only the latest weeks that fit the card are drawn, so the newest activity is always visible. That is about 15 weeks on a small phone and a full year on a wide screen. Squares stay between 10px and 16px and the graph redraws when the width changes.
- Hover (desktop) or tap (touch) a square to read the exact count and date.
- Grey placeholder squares show while loading. The response is cached for an hour per tab, and the card falls back to a plain GitHub link if anything fails.
- **Data source:** GitHub's REST API has no contribution calendar, so the graph uses the open [github-contributions-api](https://github.com/grubersjoe/github-contributions-api). It only sees **public** contributions, and visitors' browsers contact that service directly.

---

## Tech Stack

| Domain    | Technology                 | Used for                                                                     |
| :-------- | :------------------------- | :--------------------------------------------------------------------------- |
| Markup    | HTML5                      | Semantic structure, ARIA, native `<dialog>`                                  |
| Styling   | CSS3                       | Custom properties, Grid, Flexbox, scroll-driven animation, `backdrop-filter` |
| Scripting | JavaScript (ES6+)          | `<dialog>` API, `fetch`, `IntersectionObserver`, `sessionStorage`            |
| Fonts     | Google Fonts               | Manrope, DM Sans, DM Mono                                                    |
| Icons     | Lucide (inline SVG)        | UI icons, with no runtime library                                            |
| Forms     | Web3Forms                  | Serverless contact submission                                                |
| Data      | GitHub REST API            | Latest commit on the Now strip                                               |
| Data      | github-contributions-api   | Public contribution calendar for the contribution graph                      |
| Analytics | Google Analytics (gtag.js) | Traffic telemetry, loaded once from `main.js`                                |
| Hosting   | Netlify                    | Static hosting and CDN                                                       |

---

## Project Structure

```text
portfolio/
├── index.html                # Home page
├── 404.html                  # Standalone 404 (must stay at the root for Netlify)
├── google*.html              # Search Console verification file
├── sitemap.xml               # Lists every page for search engines
├── robots.txt                # Allows crawling and points to the sitemap
├── README.md
├── LICENSE
│
├── page/
│   ├── about.html
│   ├── skills.html
│   ├── projects.html
│   ├── milestones.html
│   ├── gallery.html
│   └── contact.html
│
├── css/
│   ├── styles.css            # Design tokens, shared components, home page
│   ├── about.css
│   ├── skills.css
│   ├── projects.css          # Includes the case study overlay styles
│   ├── milestones.css
│   ├── gallery.css           # Includes the lightbox styles
│   └── contact.css
│
├── js/
│   ├── main.js               # Site-wide behaviour
│   ├── pages.js              # Page-level features
│   └── case-studies.js       # Case study content and overlay (Projects page only)
│
└── assets/
    ├── favicon.png
    ├── profile_photo.png
    ├── upi_qr.png
    ├── Project_Images/       # Project card screenshots
    ├── Gallery_Images/       # Gallery mockups and design shots
    ├── Gallery_Thumb/        # Video poster thumbnails
    ├── Gallery_Videos/       # MP4 walkthroughs
    └── files/                # Downloads: FinTrack APK, Python and C project ZIPs
```

> **Heads-up:** Netlify serves from a case-sensitive file system. Folder and file names in the HTML and JS must match the repository exactly (for example `Gallery_Images/` vs `gallery_images/`).

---

## How It Works

Every script is organised as independent features. Each one checks that its markup exists before running, and one failing feature never stops the others.

**`js/main.js`: loaded on every page**

| Feature               | Responsibility                                                                                   |
| :-------------------- | :----------------------------------------------------------------------------------------------- |
| **Analytics**         | Loads Google Analytics once for all pages; skipped on `localhost`                                |
| **Footer year**       | Keeps the copyright year current                                                                 |
| **Mobile navigation** | Menu toggle, `Escape`, click-outside and reset when the screen grows                             |
| **Active nav link**   | Matches the current URL to a link, with or without `.html` (Netlify pretty URLs)                 |
| **Nav indicator**     | Desktop lime pill that rests on the current page and glides to the hovered or focused link       |
| **External links**    | Adds `rel="noopener noreferrer"` to every `target="_blank"` link                                 |
| **Gallery**           | Filters, "last card spans the row" fix, `<dialog>` lightbox, swipe on touch, video-safe controls |

**`js/pages.js`: loaded on every page, features run only where their markup exists**

| Feature           | Responsibility                                                                                |
| :---------------- | :-------------------------------------------------------------------------------------------- |
| **Contact form**  | Validation, honeypot check, `fetch` to Web3Forms with a 15 s timeout, live status             |
| **Scroll reveal** | Opt-in: add class `reveal` to any element and it fades in as it enters the viewport           |
| **Anchor focus**  | Moves keyboard focus to the target of in-page links                                           |
| **Now strip**     | Fetches and caches the latest GitHub commit, with a graceful fallback                         |
| **Contributions** | Draws the latest contribution weeks that fit the width, redraws on resize, caches for an hour |

**`js/case-studies.js`: Projects page only**

Holds the `CASES` array (all case study writing) and renders the overlay, deep links, progress line and keyboard navigation.

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

Open `http://localhost:8000`. Use a local server rather than opening the files directly, so fonts, videos and downloads behave like production.

> The custom `404.html` only appears on a real host such as Netlify. Local servers show their own error page for unknown URLs.

---

## Customisation

| What                | Where                                      | How                                                                                                                                                    |
| :------------------ | :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme colours       | `css/styles.css` → `:root`                 | Edit the colour tokens in the single `:root` block                                                                                                     |
| Hero text and stats | `index.html` → `#home`                     | Edit the text and the `.hero-stat` values                                                                                                              |
| "Now" strip         | `index.html` → `#now`                      | Edit the learning card and the `<time>` label once a month                                                                                             |
| GitHub commit repos | `index.html` → `#now-commit`               | Edit `data-github-user` and `data-github-repos` (repos must be public)                                                                                 |
| Contribution graph  | `index.html` → `#contrib`                  | Edit `data-github-user`. Smallest and largest square sizes live in `js/pages.js` (`CONTRIB_*`) and `css/styles.css` (`--contrib-*`), keep them in sync |
| Skills              | `page/skills.html`                         | Edit or add `.skill-card` blocks and their status chips                                                                                                |
| Projects            | `page/projects.html`                       | Add a `.project-card` and a button with `data-case="<id>"`                                                                                             |
| Case studies        | `js/case-studies.js` → `CASES`             | Edit the text. The `id` must match the button's `data-case`. Use `"first part\|second part"` for muted headings                                        |
| Milestones          | `page/milestones.html`                     | Add a `.milestone-card`, then update the year-nav counts and the archive number                                                                        |
| Gallery items       | `page/gallery.html`                        | Add a `<li data-gallery-item>` with `data-category`, `data-type`, `data-src`, then update the chip counts                                              |
| Contact form        | `page/contact.html` → `#contact-form`      | Replace the Web3Forms `access_key` with your own                                                                                                       |
| Analytics           | `js/main.js` → `GA_ID`                     | Replace the `G-` measurement ID with your own, or remove `initAnalytics`                                                                               |
| Support section     | `page/contact.html` → `.contact-support`   | Update the UPI link and `assets/upi_qr.png`, or remove the section                                                                                     |
| Contact details     | `index.html`, `page/contact.html`, footers | Update the email, phone, WhatsApp and social links                                                                                                     |

---

## Deployment

Any static host works (Netlify, GitHub Pages, Cloudflare Pages, Vercel).

**Netlify**

1. Connect the GitHub repository at [app.netlify.com](https://app.netlify.com/).
2. Leave the build command empty.
3. Set the publish directory to `.`
4. Deploy.

**After deploying**

- Keep `404.html` in the **root**. Netlify only serves it from there.
- Restrict your Web3Forms key to your domain in its dashboard, then send a test message.
- Open a made-up URL such as `/page/abc` to confirm the custom 404 appears.
- Open `/sitemap.xml` and `/robots.txt` to confirm they load, then submit the sitemap in Google Search Console.
- Check the Google Analytics Realtime report to confirm visits are recorded.

---

## Performance, SEO & Accessibility

**Performance**

- No framework, no build step and no icon library: only three small scripts and the CSS.
- Preconnect hints for Google Fonts.
- `loading="lazy"` on below-the-fold images, `fetchpriority="high"` on the hero image, and explicit `width` / `height` to avoid layout shift.
- Videos use `preload="metadata"` and are only loaded when opened.
- Passive touch listeners, cached GitHub calls (commit card and contribution graph) and a single shared `IntersectionObserver` for reveals.

**SEO**

- Unique `<title>` and meta description on every page.
- Open Graph tags, and `noindex` on the 404 page.
- Google Search Console verification file.
- `sitemap.xml` listing every page, and a `robots.txt` that allows crawling and points to it.

**Accessibility**

- Semantic landmarks, a skip link, labelled controls and `aria-current` on the active page.
- Native `<dialog>` for the lightbox and case studies, giving focus trapping and `Escape` to close.
- Live regions (`role="status"`, `aria-live`) for the form, gallery filter and 404 terminal, and a text summary (`role="img"` with a label) for the contribution graph.
- `:focus-visible` outlines and keyboard support (arrow keys in the gallery and case studies).
- `prefers-reduced-motion` handling, and `hover: none` handling so touch screens never get stuck hover states.

---

## Credits

- **Typography:** [Google Fonts](https://fonts.google.com/): Manrope, DM Sans and DM Mono (SIL Open Font License).
- **Icons:** [Lucide](https://lucide.dev/) (ISC License).
- **Forms:** [Web3Forms](https://web3forms.com/).
- **Data:** [GitHub REST API](https://docs.github.com/en/rest) for the latest-commit card, and [github-contributions-api](https://github.com/grubersjoe/github-contributions-api) for the contribution graph.

---

## Contact

**Ayush Rathour** · Student Developer & UI Designer · Saharanpur, Uttar Pradesh, India

Open to internships, open-source contributions and individual dev projects. I usually reply within a day.

- Email: [ayushrathour.dev@gmail.com](mailto:ayushrathour.dev@gmail.com)
- LinkedIn: [linkedin.com/in/ayushrathourrr](https://www.linkedin.com/in/ayushrathourrr/)
- GitHub: [github.com/ayush-rathour](https://github.com/ayush-rathour)
- Instagram: [@ayushrathourrr](https://www.instagram.com/ayushrathourrr)

---

## License & Usage

Source code is released under the [MIT License](LICENSE), © 2024-2026 Ayush Rathour.

**Personal content is excluded from the MIT License:** the name "Ayush Rathour", the "AR.dev" wordmark and branding, biographies, milestone text, project descriptions and case studies, personal photos and the author's own design assets. Names, screenshots and descriptions of client and collaboration work remain the property of their respective owners.

If you use this code as a template, replace all personal information, assets, analytics IDs, form keys and payment details with your own before publishing.

<div align="center">
  <sub>Built with curiosity · Refined with care · By <strong>Ayush Rathour</strong></sub>
</div>
