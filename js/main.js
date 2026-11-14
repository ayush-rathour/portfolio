/**
 * AR.dev — main.js
 * Site-wide behavior, loaded on every page.
 *
 * Each feature is a self-contained function that quietly does nothing
 * when its markup is not on the page. One failing feature never stops
 * the others from running.
 */

(() => {
  "use strict";

  const MOBILE_QUERY = "(max-width: 820px)";

  const $ = (selector, root = document) => root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /* =========================
     0. ANALYTICS
     Google Analytics lives here once, so every page that loads
     main.js is tracked. Skipped on localhost so local testing
     doesn't pollute the stats.
  ========================= */

  const GA_ID = "G-8RCQ5DT2B3";

  function initAnalytics() {
    const local = ["localhost", "127.0.0.1", ""].includes(
      window.location.hostname,
    );

    if (local || window.gtag) return;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    const script = document.createElement("script");

    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    document.head.appendChild(script);
  }

  /* =========================
     1. FOOTER YEAR
  ========================= */

  function initCurrentYear() {
    const year = String(new Date().getFullYear());

    $$("#current-year").forEach((element) => {
      element.textContent = year;
    });
  }

  /* =========================
     2. MENU ICONS
     Every other icon is inline SVG in the HTML. Only the menu
     toggle swaps its icon at runtime, so both are kept here and
     nothing depends on an external icon library.
  ========================= */

  const MENU_ICONS = {
    menu: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16" /> <path d="M4 12h16" /> <path d="M4 19h16" /></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-x" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18" /> <path d="m6 6 12 12" /></svg>',
  };

  /* =========================
     3. MOBILE NAVIGATION
  ========================= */

  function initNavigation() {
    const toggle = $("#menu-toggle");
    const nav = $("#main-nav");

    if (!toggle || !nav) return;

    const media = window.matchMedia(MOBILE_QUERY);

    const isOpen = () => nav.classList.contains("is-open");

    function setIcon(name) {
      toggle.innerHTML = MENU_ICONS[name];
    }

    function setOpen(open, { returnFocus = false } = {}) {
      const changed = open !== isOpen();

      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-active", open);

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );

      document.body.classList.toggle("menu-open", open && media.matches);

      if (changed) setIcon(open ? "x" : "menu");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setOpen(!isOpen());
    });

    // Close after choosing a destination on mobile.
    nav.addEventListener("click", (event) => {
      if (!media.matches) return;

      const target = event.target;

      if (target instanceof Element && target.closest("a[href]")) {
        setOpen(false);
      }
    });

    // Close with Escape and return focus to the toggle.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false, { returnFocus: true });
      }
    });

    // Close when clicking outside the open menu.
    document.addEventListener("click", (event) => {
      if (!media.matches || !isOpen()) return;

      const target = event.target;

      if (!(target instanceof Node)) return;

      if (!nav.contains(target) && !toggle.contains(target)) {
        setOpen(false);
      }
    });

    // Reset when the viewport grows past the mobile breakpoint.
    media.addEventListener("change", (event) => {
      if (!event.matches) setOpen(false);
    });
  }

  /* =========================
     4. ACTIVE NAVIGATION LINK
  ========================= */

  // "/page/about.html", "/page/about" and "/page/about/" are the same page.
  // Hosts such as Cloudflare Pages serve pages without the ".html", so both
  // sides of the comparison are normalized before they are matched.
  function normalizePath(path) {
    return (
      path
        .replace(/\/index\.html$/, "/")
        .replace(/\.html$/, "")
        .replace(/\/+$/, "") || "/"
    );
  }

  function initActiveNavigation() {
    const currentPath = normalizePath(window.location.pathname);

    $$(".main-nav a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      let url;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Skips mailto:, tel: and links to other sites.
      if (url.origin !== window.location.origin) return;

      const isActive = normalizePath(url.pathname) === currentPath;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* =========================
     4b. NAVIGATION INDICATOR
     Desktop only. A lime pill rests on the current page and glides to
     the link that is hovered or focused, then back again. It is placed
     with two CSS variables (--nav-x, --nav-w) that match the link's
     position inside the nav. On mobile the indicator is hidden and the
     menu uses plain row styles instead.
  ========================= */

  function initNavIndicator() {
    const nav = $("#main-nav");

    if (!nav) return;

    const links = $$(".nav-link", nav);

    if (!links.length) return;

    const mobile = window.matchMedia(MOBILE_QUERY);

    const indicator = document.createElement("span");

    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");

    nav.appendChild(indicator);
    nav.classList.add("has-indicator");

    const current = () =>
      links.find((link) => link.getAttribute("aria-current") === "page") ||
      null;

    function place(link, hover) {
      if (!link || mobile.matches) {
        indicator.classList.remove("is-visible", "is-hover");
        return;
      }

      indicator.style.setProperty("--nav-x", `${link.offsetLeft}px`);
      indicator.style.setProperty("--nav-w", `${link.offsetWidth}px`);

      indicator.classList.toggle("is-hover", hover);
      indicator.classList.add("is-visible");
    }

    const rest = () => place(current(), false);

    // Jump to the right place without gliding there (first paint,
    // resize, fonts loading), then switch the glide back on.
    function snap() {
      indicator.classList.remove("is-ready");
      rest();

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => indicator.classList.add("is-ready"));
      });
    }

    function follow(event) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const link = target.closest(".nav-link");

      if (link) place(link, link !== current());
    }

    nav.addEventListener("mouseover", follow);
    nav.addEventListener("focusin", follow);

    // Back to the current page when the pointer leaves, unless the
    // keyboard is still inside the nav.
    nav.addEventListener("mouseleave", () => {
      if (!nav.matches(":focus-within")) rest();
    });

    nav.addEventListener("focusout", (event) => {
      const next = event.relatedTarget;

      if (!(next instanceof Node) || !nav.contains(next)) rest();
    });

    window.addEventListener("resize", snap, { passive: true });
    mobile.addEventListener("change", snap);

    snap();

    // Link widths change once the web fonts have loaded.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(snap).catch(() => {});
    }
  }

  /* =========================
     5. EXTERNAL LINK SAFETY
  ========================= */

  function initExternalLinks() {
    $$('a[target="_blank"]').forEach((link) => {
      const rel = new Set(
        (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean),
      );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute("rel", [...rel].join(" "));
    });
  }

  /* =========================
     6. GALLERY
     Filters and lightbox for images and videos.
  ========================= */

  function initGallery() {
    const grid = $("#gallery-grid");

    if (!grid) return;

    const items = $$("[data-gallery-item]", grid);
    const chips = $$("[data-gallery-filter]");
    const status = $("#gallery-status");

    const dialog = $("#lightbox");
    const hasLightbox =
      Boolean(dialog) && typeof dialog.showModal === "function";

    const pad = (n) => String(n).padStart(2, "0");

    let visible = items.slice();
    let index = 0;
    let lastTrigger = null;

    /* ---------- Filtering ---------- */

    // When an odd number of frames is visible, the last one spans the
    // full row in the two-column layout. Hidden items are excluded, so
    // this stays correct after filtering (CSS :nth-child counts them).
    function markLastWide() {
      items.forEach((item) => item.classList.remove("is-last-wide"));

      if (visible.length % 2 === 1) {
        visible[visible.length - 1].classList.add("is-last-wide");
      }
    }

    function applyFilter(filter) {
      items.forEach((item) => {
        const categories = (item.dataset.category || "")
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        item.hidden = !(filter === "all" || categories.includes(filter));
      });

      visible = items.filter((item) => !item.hidden);
      markLastWide();

      chips.forEach((chip) => {
        const active = chip.dataset.galleryFilter === filter;

        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
      });

      if (status) {
        const noun = visible.length === 1 ? "frame" : "frames";

        status.textContent =
          filter === "all"
            ? `Showing all ${visible.length} ${noun}`
            : `Showing ${visible.length} ${filter} ${noun}`;
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        applyFilter(chip.dataset.galleryFilter || "all");
      });
    });

    markLastWide();

    /* ---------- Lightbox ---------- */

    // Without <dialog> support the filters still work, and each
    // frame simply opens its file in a new tab.
    if (!hasLightbox) {
      items.forEach((item) => {
        const trigger = $(".gallery-open", item);

        if (!trigger) return;

        trigger.addEventListener("click", () => {
          if (item.dataset.src) {
            window.open(item.dataset.src, "_blank", "noopener,noreferrer");
          }
        });
      });

      return;
    }

    const stage = $("#lightbox-stage");
    const titleEl = $("#lightbox-title");
    const captionEl = $("#lightbox-caption");
    const countEl = $("#lightbox-count");
    const closeBtn = $("#lightbox-close");
    const prevBtn = $("#lightbox-prev");
    const nextBtn = $("#lightbox-next");
    const eyebrowEl = $("#lightbox-eyebrow");
    const statusEl = $("#lightbox-status");
    const metaEl = $("#lightbox-meta");
    const linkEl = $("#lightbox-link");
    const scroller = $("#lightbox-scroll");
    const progressEl = $("#lightbox-progress-bar");
    const nextCardBtn = $("#lightbox-next-card");
    const nextLabelEl = $("#lightbox-next-label");

    if (!stage || !titleEl || !captionEl || !countEl || !scroller) return;

    const ICON_ARROW =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10" /> <path d="M7 17 17 7" /></svg>';

    const CATEGORY_LABELS = {
      design: "Design & mockups",
      upgrade: "Upgrade",
      video: "Video",
    };

    function setMeta(rows) {
      if (!metaEl) return;

      metaEl.replaceChildren();

      rows.forEach(([label, value]) => {
        if (!value) return;

        const row = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        dt.textContent = label;
        dd.textContent = value;
        row.append(dt, dd);
        metaEl.appendChild(row);
      });
    }

    function clearStage() {
      const video = $("video", stage);

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      stage.replaceChildren();
    }

    // Warm the cache for the frames on either side of the current one.
    function preloadNeighbours() {
      [index - 1, index + 1].forEach((position) => {
        const neighbour = visible[(position + visible.length) % visible.length];

        if (neighbour && neighbour.dataset.type === "image") {
          new Image().src = neighbour.dataset.src;
        }
      });
    }

    function render() {
      const item = visible[index];

      if (!item) return;

      clearStage();

      const {
        type,
        src,
        poster,
        title,
        caption,
        alt,
        project,
        link,
        linkLabel,
      } = item.dataset;
      const tag = $(".gallery-tag", item);
      const category = (item.dataset.category || "").split(/\s+/)[0];
      let media;

      if (type === "video") {
        media = document.createElement("video");
        media.controls = true;
        media.autoplay = true;
        media.playsInline = true;
        media.preload = "metadata";

        if (poster) media.poster = poster;

        media.src = src;
        media.setAttribute("aria-label", title || "Video");
      } else {
        media = document.createElement("img");
        media.src = src;
        media.alt = alt || title || "";
      }

      stage.appendChild(media);

      const total = visible.length;
      const tagText = tag ? tag.textContent.trim() : "";

      titleEl.textContent = title || "";
      captionEl.textContent = caption || "";
      countEl.textContent = `FRAME · ${pad(index + 1)} / ${pad(total)}`;

      if (eyebrowEl) {
        eyebrowEl.textContent = `${pad(index + 1)} / ${tagText || "Frame"}`;
      }

      if (statusEl) {
        statusEl.textContent = CATEGORY_LABELS[category] || "Gallery";
      }

      setMeta([
        ["Type", type === "video" ? "Video walkthrough" : "Image"],
        ["Category", CATEGORY_LABELS[category] || ""],
        ["Project", project],
        ["Frame", `${pad(index + 1)} of ${pad(total)}`],
      ]);

      if (linkEl) {
        linkEl.hidden = !link;

        if (link) {
          linkEl.href = link;
          linkEl.replaceChildren(
            document.createTextNode(`${linkLabel || "Related page"} `),
          );
          linkEl.insertAdjacentHTML("beforeend", ICON_ARROW);
        }
      }

      const single = total < 2;

      if (prevBtn) prevBtn.disabled = single;
      if (nextBtn) nextBtn.disabled = single;

      if (nextCardBtn) {
        nextCardBtn.hidden = single;

        if (nextLabelEl && !single) {
          const next = visible[(index + 1) % total];

          nextLabelEl.textContent = `Next: ${next.dataset.title || "next frame"}`;
        }
      }

      // The progress line shows where this frame sits in the gallery.
      if (progressEl) {
        progressEl.style.transform = `scaleX(${(index + 1) / total})`;
      }

      scroller.scrollTop = 0;

      preloadNeighbours();
    }

    function openViewer(item) {
      visible = items.filter((entry) => !entry.hidden);
      index = Math.max(0, visible.indexOf(item));
      lastTrigger = $(".gallery-open", item);

      render();

      dialog.showModal();
      document.body.classList.add("lightbox-open");
      scroller.focus({ preventScroll: true });
    }

    function step(direction) {
      if (visible.length < 2) return;

      index = (index + direction + visible.length) % visible.length;
      render();
    }

    items.forEach((item) => {
      const trigger = $(".gallery-open", item);

      if (trigger) {
        trigger.addEventListener("click", () => openViewer(item));
      }
    });

    if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => step(1));
    if (nextCardBtn) nextCardBtn.addEventListener("click", () => step(1));
    if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());

    // A click on the dark backdrop or empty stage space closes the viewer.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });

    // Swipe between images on touch screens. Videos are skipped so
    // dragging the seek bar never changes the frame.
    let touchStartX = null;

    stage.addEventListener(
      "touchstart",
      (event) => {
        touchStartX =
          event.target instanceof HTMLImageElement
            ? event.changedTouches[0].clientX
            : null;
      },
      { passive: true },
    );

    stage.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;

        const distance = event.changedTouches[0].clientX - touchStartX;

        touchStartX = null;

        if (Math.abs(distance) > 60) step(distance < 0 ? 1 : -1);
      },
      { passive: true },
    );

    // Fires for the close button, Esc and backdrop clicks alike.
    dialog.addEventListener("close", () => {
      clearStage();
      document.body.classList.remove("lightbox-open");

      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    });
  }

  /* =========================
     INITIALIZATION
  ========================= */

  const features = [
    initAnalytics,
    initCurrentYear,
    initNavigation,
    initActiveNavigation,
    initNavIndicator,
    initExternalLinks,
    initGallery,
  ];

  function init() {
    features.forEach((feature) => {
      try {
        feature();
      } catch (error) {
        console.error(`[AR.dev] ${feature.name} failed`, error);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
