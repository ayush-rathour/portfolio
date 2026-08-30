// ─────────────────────────────────────────────────────────────
// PREMIUM SIDEBAR + NAVBAR LOGIC
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const closeBtn = document.getElementById("sidebarClose");
  const header = document.getElementById("mainHeader");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);
  closeBtn.addEventListener("click", closeSidebar);

  // Close on any sidebar nav link click
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Header scroll state
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveLinks();
  };

  // Active link highlight on scroll
  const sections = [
    "home",
    "about",
    "skills",
    "milestones",
    "projects",
    "gallery",
    "contact",
  ];

  function updateActiveLinks() {
    let current = "";
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 90) current = id;
    });
    document.querySelectorAll(".nav-desktop a, .sidebar-nav a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateActiveLinks();

  // Close sidebar on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open"))
      closeSidebar();
  });
});

// ─────────────────────────────────────────────────────────────
// SMOOTH SCROLL TO SECTIONS (Anchor Click)
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          (headerHeight + 15);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────
// LOADING SCREEN - real event-driven boot sequence
// ─────────────────────────────────────────────────────────────
(function () {
  const SEG_COUNT = 20;
  const GRACEFUL_MIN_MS = 3000; // minimum *visual* time so it doesn't flash away instantly

  // Real milestone tracking - each resolves when the browser actually fires it
  const milestones = {
    dom: { weight: 15, done: false },
    fonts: { weight: 20, done: false },
    images: { weight: 40, done: false },
    load: { weight: 25, done: false },
  };

  let displayProgress = 0;
  let dismissed = false;
  let startTime = Date.now();
  let loadComplete = false; // window.load fired?

  // ── Compute real progress from milestones ──
  function getRealProgress() {
    let total = 0;
    for (const k in milestones) {
      if (milestones[k].done) total += milestones[k].weight;
    }
    return total; // 0–100
  }

  // ── Micro-stall engine: adds tiny random pauses so progress feels earned ──
  let stallUntil = 0;
  function getStallCeiling() {
    // Progress stalls at realistic checkpoints until the real event fires
    if (!milestones.dom.done) return 12;
    if (!milestones.fonts.done) return 34;
    if (!milestones.images.done) return 72;
    if (!milestones.load.done) return 94;
    return 100;
  }

  // ── Log line messages tied to real events ──
  const logMessages = [
    { id: "ls-log0", text: null }, // already in HTML, shown at 0%
    { id: "ls-log1", event: "dom" },
    { id: "ls-log2", event: "fonts" },
    { id: "ls-log3", event: "fonts" },
    { id: "ls-log4", event: "images" },
    { id: "ls-log5", event: "load" },
  ];

  function revealLog(id) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("visible")) el.classList.add("visible");
  }

  function markMilestone(key) {
    if (milestones[key].done) return;
    milestones[key].done = true;

    // Reveal corresponding log lines
    if (key === "dom") {
      revealLog("ls-log0");
      revealLog("ls-log1");
    }
    if (key === "fonts") {
      revealLog("ls-log2");
      revealLog("ls-log3");
    }
    if (key === "images") {
      revealLog("ls-log4");
    }
    if (key === "load") {
      revealLog("ls-log5");
      loadComplete = true;
    }

    // Add a small stall after each milestone for realism
    stallUntil = Date.now() + 120 + Math.random() * 180;
  }

  // ── Hook real browser events ──

  // 1. DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => markMilestone("dom"), {
      once: true,
    });
  } else {
    markMilestone("dom"); // already fired
  }

  // 2. Fonts (real async signal)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => markMilestone("fonts"));
  } else {
    // Fallback: assume fonts after DOM + 300ms
    setTimeout(() => markMilestone("fonts"), 300);
  }

  // 3. Images - track only above-the-fold critical images (loading="eager")
  function trackImages() {
    const imgs = Array.from(
      document.querySelectorAll('img[loading="eager"], img:not([loading])'),
    );
    if (!imgs.length) {
      markMilestone("images");
      return;
    }

    let loaded = 0;
    const total = imgs.length;
    function onImgLoad() {
      loaded++;
      if (loaded >= total) markMilestone("images");
    }
    imgs.forEach((img) => {
      if (img.complete) onImgLoad();
      else {
        img.addEventListener("load", onImgLoad, { once: true });
        img.addEventListener("error", onImgLoad, { once: true });
      }
    });
  }

  // 4. Full window load
  if (document.readyState === "complete") {
    markMilestone("load");
  } else {
    window.addEventListener("load", () => markMilestone("load"), {
      once: true,
    });
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ── Status text phrases ──
  const statusPhrases = [
    { at: 0, text: "Initializing systems…" },
    { at: 14, text: "DOM ready · Parsing markup…" },
    { at: 30, text: "Loading fonts & stylesheets…" },
    { at: 52, text: "Fetching images & assets…" },
    { at: 75, text: "Finalizing components…" },
    { at: 92, text: "Almost there…" },
  ];

  // ── DOM Ready: build segments + canvas ──
  document.addEventListener("DOMContentLoaded", () => {
    // Build segments
    const segRow = document.getElementById("ls-seg-row");
    if (segRow) {
      for (let i = 0; i < SEG_COUNT; i++) {
        const s = document.createElement("div");
        s.className = "ls-seg";
        s.id = "ls-seg-" + i;
        segRow.appendChild(s);
      }
    }

    trackImages();

    // Hex particle canvas
    const canvas = document.getElementById("ls-hex-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let W, H;
      const particles = [];

      function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      resize();
      window.addEventListener("resize", resize);

      for (let i = 0; i < 18; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 4 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          a: Math.random() * 0.5 + 0.05,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.5,
        });
      }

      function hexPath(x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + r * Math.cos(a);
          const py = y + r * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
      }

      function animHex() {
        if (dismissed) return;
        ctx.clearRect(0, 0, W, H);
        const t = Date.now() / 1000;
        const pctFrac = displayProgress / 100;
        const speedMult = 0.4 + pctFrac * 1.0; // accelerates as load progresses
        const loadAlpha = 0.25 + pctFrac * 0.75;

        particles.forEach((p) => {
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;
          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          if (p.y > H + 20) p.y = -20;

          const alpha =
            p.a * loadAlpha * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
          ctx.strokeStyle = `rgba(0,188,212,${alpha})`;
          ctx.lineWidth = 0.8;
          hexPath(p.x, p.y, p.r);
          ctx.stroke();
        });
        requestAnimationFrame(animHex);
      }
      animHex();
    }

    requestAnimationFrame(tickDisplay);
  });

  // ── Progress ticker ──
  function tickDisplay() {
    if (dismissed) return;

    const realPct = getRealProgress();
    const ceiling = getStallCeiling();
    const now = Date.now();

    // During a stall window: slow crawl only
    const inStall = now < stallUntil;
    const target = inStall
      ? Math.min(displayProgress + 0.08, ceiling - 1) // barely moves during stall
      : Math.min(realPct, ceiling);

    // Lerp toward target - faster when nearly done
    const lerpSpeed = loadComplete ? 0.12 : 0.045;
    if (displayProgress < target) {
      displayProgress = Math.min(
        displayProgress +
          Math.max(0.15, (target - displayProgress) * lerpSpeed),
        target,
      );
    }

    const pct = Math.round(displayProgress);

    // Update UI
    const pctEl = document.getElementById("ls-pct-num");
    const barEl = document.getElementById("ls-bar-fill");
    const txtEl = document.getElementById("ls-status-txt");

    if (pctEl) pctEl.textContent = pct;
    if (barEl) barEl.style.width = pct + "%";

    // Segments
    for (let i = 0; i < SEG_COUNT; i++) {
      const s = document.getElementById("ls-seg-" + i);
      if (!s) continue;
      const lit = Math.floor((pct / 100) * SEG_COUNT);
      s.className = "ls-seg" + (i < lit ? " full" : i === lit ? " lit" : "");
    }

    // Status phrase
    if (txtEl) {
      let phrase = statusPhrases[0].text;
      for (const p of statusPhrases) {
        if (pct >= p.at) phrase = p.text;
      }
      if (txtEl.textContent !== phrase) txtEl.textContent = phrase;
    }

    // Try dismiss: all milestones done + graceful min time elapsed + display caught up
    const elapsed = Date.now() - startTime;
    if (loadComplete && elapsed >= GRACEFUL_MIN_MS && displayProgress >= 99) {
      dismissLoader();
      return;
    }

    requestAnimationFrame(tickDisplay);
  }

  // ── Dismiss loader ──
  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;

    // Snap to 100
    displayProgress = 100;
    const pctEl = document.getElementById("ls-pct-num");
    const barEl = document.getElementById("ls-bar-fill");
    if (pctEl) pctEl.textContent = "100";
    if (barEl) barEl.style.width = "100%";

    for (let i = 0; i < SEG_COUNT; i++) {
      const s = document.getElementById("ls-seg-" + i);
      if (s) s.className = "ls-seg full";
    }
    for (let i = 0; i < 6; i++) revealLog("ls-log" + i);

    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    // Flash → slide up exit (more character than plain fade)
    loadingScreen.style.transition = "none";
    loadingScreen.style.background = "rgba(0,188,212,0.06)";
    setTimeout(() => {
      loadingScreen.style.transition =
        "opacity 0.45s ease, transform 0.55s cubic-bezier(0.4,0,0.2,1)";
      loadingScreen.style.opacity = "0";
      loadingScreen.style.transform = "translateY(-8px)";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 560);
    }, 80);
  }
})();

// ==============================
// SUPPORT POPUP
// ==============================
window.addEventListener("load", () => {
  const popup = document.getElementById("supportPopup");
  const closeBtn = document.getElementById("closeSupport");

  function openSupport() {
    popup.classList.add("show");
  }

  function closeSupport() {
    popup.classList.remove("show");
  }

  // Trigger buttons (navbar + sidebar)
  document
    .getElementById("navSupportBtn")
    ?.addEventListener("click", openSupport);
  document
    .getElementById("sidebarSupportBtn")
    ?.addEventListener("click", () => {
      // Close sidebar first, then open popup
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("sidebarOverlay");
      const menuToggle = document.getElementById("mobile-menu");
      if (sidebar) {
        sidebar.classList.remove("open");
        overlay?.classList.remove("visible");
        menuToggle?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
        sidebar.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
      setTimeout(openSupport, 280);
    });

  // Close button
  closeBtn?.addEventListener("click", closeSupport);

  // Escape key closes popup
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) closeSupport();
  });

  // Auto-show after 90 seconds (keep original behaviour)
  setTimeout(openSupport, 90000);
});

// ─────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Terminal typewriter ──────────────────────────────────
  const terminalLines = [
    { type: "comment", text: "// Developer profile · v2026" },
    { type: "arr", text: "{" },

    { type: "kv", key: '"Name"', val: '"Ayush Rathour"', comma: true },
    { type: "kv", key: '"Alias"', val: '"AR.dev"', comma: true },
    { type: "kv", key: '"Based"', val: '"Saharanpur, IN"', comma: true },

    {
      type: "kv",
      key: '"Role"',
      val: '"Frontend Dev & UI Designer"',
      comma: true,
    },

    {
      type: "kv",
      key: '"Stack"',
      val: '["HTML", "CSS", "JavaScript", "Python", "C"]',
      comma: true,
    },

    {
      type: "kv",
      key: '"Projects"',
      val: '"15+ Completed"',
      comma: true,
    },

    {
      type: "kv",
      key: '"Experience"',
      val: '"4+ Years Self-Taught"',
      comma: true,
    },

    {
      type: "kv",
      key: '"Status"',
      val: '"Building..."',
      comma: false,
      cursor: true,
    },

    { type: "arr", text: "}" },
  ];

  function buildLineHTML(l) {
    if (l.type === "comment")
      return `<span class="ab-tl"><span class="t-comment">${l.text}</span></span>`;
    if (l.type === "arr")
      return `<span class="ab-tl"><span class="t-arr">${l.text}</span></span>`;
    if (l.type === "kv") {
      const valClass = l.isBool ? "t-bool" : "t-str";
      const cursor = l.cursor ? `<span class="t-cursor"></span>` : "";
      const comma = l.comma ? `<span class="t-sym">,</span>` : "";
      return `<span class="ab-tl">&nbsp;&nbsp;<span class="t-key">${l.key}</span><span class="t-sym">:</span> <span class="${valClass}">${l.val}</span>${comma}${cursor}</span>`;
    }
    return "";
  }

  let terminalTriggered = false;

  function runTerminal() {
    if (terminalTriggered) return;
    terminalTriggered = true;

    const body = document.getElementById("ab-terminal-body");
    if (!body) return;
    body.innerHTML = "";

    terminalLines.forEach((line, i) => {
      setTimeout(() => {
        body.insertAdjacentHTML("beforeend", buildLineHTML(line));
      }, i * 90);
    });
  }

  // ── 2. Role cycling text ────────────────────────────────────
  const roles = [
    "Frontend Developer",
    "UI Designer",
    "Student",
    "Problem Solver",
  ];
  let roleIdx = 0;
  const roleEl = document.getElementById("abRoleText");

  if (roleEl) {
    setInterval(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      roleEl.style.opacity = "0";
      setTimeout(() => {
        roleEl.textContent = roles[roleIdx];
        roleEl.style.opacity = "1";
      }, 320);
    }, 2800);
  }

  // ── 3. Stats counters + bar animations ─────────────────────
  let statsTriggered = false;

  function runStats() {
    if (statsTriggered) return;
    statsTriggered = true;

    // Animate number counters
    document.querySelectorAll(".ab-stat-num[data-target]").forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const steps = 50;
      let i = 0;
      const iv = setInterval(() => {
        i++;
        const val = target * (i / steps);
        el.textContent = Math.round(val) + suffix;
        if (i >= steps) {
          el.textContent = target + suffix;
          clearInterval(iv);
        }
      }, 22);
    });

    // Animate stat underbar fills + build bar fills
    setTimeout(() => {
      document
        .querySelectorAll(".ab-stat-bar-fill, .ab-build-bar-fill")
        .forEach((el) => el.classList.add("ab-bar-animated"));
    }, 150);
  }

  // ── 4. Intersection observer - triggers all animations ──────
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  const aboutObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runTerminal();
          runStats();
        }
      });
    },
    { threshold: 0.12 },
  );

  aboutObs.observe(aboutSection);
});

// ─────────────────────────────────────────────────────────────
// SKILLS - scroll-triggered bar animation
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const SEG_COUNT = 16;

  document.querySelectorAll(".skill-block").forEach((card) => {
    const pct = parseInt(card.dataset.pct) || 0;
    const fill = card.querySelector(".sk-bar-fill");
    const pctEl = card.querySelector(".sk-bar-pct");
    const segRow = card.querySelector(".sk-seg-row");
    if (!fill || !pctEl || !segRow) return;

    // Build segments
    for (let i = 0; i < SEG_COUNT; i++) {
      const s = document.createElement("div");
      s.className = "sk-seg";
      segRow.appendChild(s);
    }

    let animated = false;

    function animateBar() {
      if (animated) return;
      animated = true;

      fill.style.width = pct + "%";
      fill.classList.add("sk-animated");

      let current = 0;
      const step = pct / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, pct);
        pctEl.textContent = Math.round(current) + "%";
        const lit = Math.floor((current / 100) * SEG_COUNT);
        segRow.querySelectorAll(".sk-seg").forEach((s, i) => {
          s.className = "sk-seg" + (i < lit ? " full" : i === lit ? " on" : "");
        });
        if (current >= pct) clearInterval(timer);
      }, 22);
    }

    // Wait for the card's reveal transition to finish, then fire the bar
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Small delay so bar starts after the card slides into view
            const delay =
              parseFloat(
                getComputedStyle(card).getPropertyValue("--reveal-delay"),
              ) || 0;
            setTimeout(animateBar, delay + 180);
            obs.unobserve(card);
          }
        });
      },
      { threshold: 0.25 },
    );

    obs.observe(card);
  });
});

// ─────────────────────────────────────────────────────────────
// GALLERY v2 - Filter tabs + scroll-entrance
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gl2Grid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".gl2-item"));
  const filterBtns = document.querySelectorAll(".gl2-filter");

  // ── Scroll-entrance animation ──
  const entranceObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("gl2-visible");
          entranceObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  items.forEach((item) => entranceObs.observe(item));

  // ── Filter logic ──
  function applyFilter(tag) {
    items.forEach((item) => {
      const match = tag === "all" || item.dataset.glTag === tag;
      item.classList.toggle("gl2-hidden", !match);
      if (match) {
        // Re-trigger entrance if it was hidden before
        if (!item.classList.contains("gl2-visible")) {
          entranceObs.observe(item);
        }
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.glFilter || "all");
    });
  });

  // Init
  applyFilter("all");
});

// ─────────────────────────────────────────────────────────────
// PROJECTS FILTER BAR
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".proj-filter-btn");
  const cards = document.querySelectorAll(".proj-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        if (filter === "all") {
          card.classList.remove("proj-hidden");
          return;
        }

        // data-status can be "live", "paid", "soon", or "live paid"
        const status = card.dataset.status || "";
        const match = status.split(" ").includes(filter);

        card.classList.toggle("proj-hidden", !match);
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────
// SCROLL REVEAL - single shared IntersectionObserver
// Targets: section h2s, about panels, skill cards,
//          milestone items, project cards, contact panels
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Register elements with their variant + stagger ──
  function register(selector, variant = "reveal", baseDelay = 0, step = 80) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(variant);
      el.style.setProperty("--reveal-delay", baseDelay + i * step + "ms");
    });
  }

  // Section headings - fire first, no stagger
  register("section:not(#home) h2", "reveal", 0, 0);

  // About panels - staggered left→right
  register(".about-panel", "reveal", 80, 90);

  // Skill cards - staggered
  register(".skill-block", "reveal", 60, 70);

  // Milestone items - slide from left (matches the left spine)
  register(".tl-item", "reveal-left", 80, 100);

  // Project cards - staggered up
  register(".proj-card", "reveal", 60, 80);

  // Contact panels - left info slides from left, form slides from right
  const contactLeft = document.querySelector(".contact-left");
  const contactRight = document.querySelector(".contact-right");
  if (contactLeft) {
    contactLeft.classList.add("reveal-left");
    contactLeft.style.setProperty("--reveal-delay", "0ms");
  }
  if (contactRight) {
    contactRight.classList.add("reveal-right");
    contactRight.style.setProperty("--reveal-delay", "120ms");
  }

  // ── 2. Single shared observer ──
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          revealObs.unobserve(e.target); // fire once only
        }
      });
    },
    {
      threshold: 0.12, // trigger when 12% visible
      rootMargin: "0px 0px -40px 0px", // small bottom offset so it feels natural
    },
  );

  // ── 3. Observe everything tagged ──
  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => revealObs.observe(el));
});

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  window.addEventListener(
    "scroll",
    () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─────────────────────────────────────────────────────────────
// HERO ENTRY ANIMATION
// Waits for loading screen to fully hide, then adds .hero-ready
// to #home which triggers the staggered CSS transitions.
// ─────────────────────────────────────────────────────────────
(function () {
  const homeSection = document.getElementById("home");
  if (!homeSection) return;

  // Loading screen hides via opacity → display:none after ~640ms total.
  // We hook the transitionend on #loading-screen for the cleanest trigger.
  const loadingScreen = document.getElementById("loading-screen");

  function triggerHero() {
    // Small extra delay so the hero reveal feels intentional, not rushed
    setTimeout(() => {
      homeSection.classList.add("hero-ready");
    }, 80);
  }

  if (loadingScreen) {
    loadingScreen.addEventListener(
      "transitionend",
      function onTransitionEnd(e) {
        // Only fire on the opacity transition of the loading screen itself
        if (e.target === loadingScreen && e.propertyName === "opacity") {
          loadingScreen.removeEventListener("transitionend", onTransitionEnd);
          triggerHero();
        }
      },
    );

    // Safety fallback: if loading screen is already hidden (e.g. cached page)
    // or transition never fires, trigger after 1 second
    setTimeout(() => {
      if (!homeSection.classList.contains("hero-ready")) {
        triggerHero();
      }
    }, 1000);
  } else {
    // No loading screen present - trigger immediately
    triggerHero();
  }
})();

// ─────────────────────────────────────────────────────────────
// CONTACT FORM INLINE VALIDATION
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("cfSuccessMsg");
  if (!form) return;

  // ── Field config: id, validator fn, error text ──
  const fields = [
    {
      id: "cf-name",
      validate: (v) => v.trim().length >= 2,
      error: "Please enter your name",
    },
    {
      id: "cf-email",
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      error: "Enter a valid email address",
    },
    {
      id: "cf-subject",
      validate: (v) => v.trim().length >= 2,
      error: "Please add a subject",
    },
    {
      id: "cf-message",
      validate: (v) => v.trim().length >= 10,
      error: "Please write a message",
    },
  ];

  // ── Set field state: valid / error / reset ──
  function setFieldState(field, state) {
    const wrapper = field.closest(".cf-field");
    if (!wrapper) return;

    wrapper.classList.remove("cf-valid", "cf-error");

    // Hide both icons first
    wrapper.querySelectorAll(".cf-field-icon").forEach((icon) => {
      icon.style.display = "none";
    });

    if (state === "valid") {
      wrapper.classList.add("cf-valid");
      const icon = wrapper.querySelector(".cf-field-icon.icon-valid");
      if (icon) icon.style.display = "flex";
    } else if (state === "error") {
      wrapper.classList.add("cf-error");
      const icon = wrapper.querySelector(".cf-field-icon.icon-error");
      if (icon) icon.style.display = "flex";
    }
  }

  // ── Validate a single field ──
  function validateField(id) {
    const fieldCfg = fields.find((f) => f.id === id);
    if (!fieldCfg) return true;

    const el = document.getElementById(id);
    if (!el) return true;

    // Only validate if the field has been touched (has value or was blurred)
    const isValid = fieldCfg.validate(el.value);
    if (el.value.trim() === "" && !el.dataset.touched) {
      setFieldState(el, "reset");
      return false;
    }

    setFieldState(el, isValid ? "valid" : "error");
    return isValid;
  }

  // ── Attach blur + input listeners to each required field ──
  fields.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;

    // On blur: mark as touched and validate
    el.addEventListener("blur", () => {
      el.dataset.touched = "true";
      validateField(id);
    });

    // On input: if already touched, re-validate live
    el.addEventListener("input", () => {
      if (el.dataset.touched) validateField(id);
    });
  });

  // ── Form submit ──
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Mark all fields as touched and validate
    let allValid = true;
    fields.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) el.dataset.touched = "true";
      if (!validateField(id)) allValid = false;
    });

    if (!allValid) {
      // Scroll to first error field
      const firstError = form.querySelector(
        ".cf-field.cf-error input, .cf-field.cf-error textarea",
      );
      if (firstError) firstError.focus();
      return;
    }

    // Show sending state
    const submitBtn = form.querySelector(".cf-submit");
    const submitSpan = submitBtn ? submitBtn.querySelector("span") : null;
    if (submitBtn) {
      submitBtn.classList.add("cf-sending");
      if (submitSpan) submitSpan.textContent = "Sending…";
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // Hide form, show success
        form.style.transition = "opacity 0.3s ease";
        form.style.opacity = "0";
        setTimeout(() => {
          form.style.display = "none";
          if (successMsg) successMsg.classList.add("show");
        }, 300);
      } else {
        throw new Error("Submit failed");
      }
    } catch {
      // Reset button on failure
      if (submitBtn) {
        submitBtn.classList.remove("cf-sending");
        if (submitSpan) submitSpan.textContent = "Send Message";
      }
      // Show a generic error on the message field
      const msgEl = document.getElementById("cf-message");
      if (msgEl) {
        const wrapper = msgEl.closest(".cf-field");
        if (wrapper) {
          wrapper.classList.add("cf-error");
          const errMsg = wrapper.querySelector(".cf-error-msg");
          if (errMsg)
            errMsg.innerHTML =
              '<i class="bx bx-info-circle"></i> Something went wrong - please try again';
        }
      }
    }
  });
});
