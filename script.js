/* =============================================================================
   AR.dev - Main Script
   Author: Ayush Rathour
   ============================================================================= */

/* =============================================================================
   GLOBAL PRELOADER / BOOT SEQUENCE (#loading-screen)
   ============================================================================= */
(function initBootSequence() {
  const SEG_COUNT = 20;
  const GRACEFUL_MIN_MS = 3000; // Minimum display time to ensure smooth visual boot

  // Lifecycle weights for computing real progress
  const milestones = {
    dom: { weight: 15, done: false },
    fonts: { weight: 20, done: false },
    images: { weight: 40, done: false },
    load: { weight: 25, done: false },
  };

  let displayProgress = 0;
  let dismissed = false;
  let startTime = Date.now();
  let loadComplete = false;
  let stallUntil = 0;

  // Calculates percentage achieved from completed milestones
  function getRealProgress() {
    let total = 0;
    for (const key in milestones) {
      if (milestones[key].done) total += milestones[key].weight;
    }
    return total;
  }

  // Checkpoints to hold progress until real events confirm readiness
  function getStallCeiling() {
    if (!milestones.dom.done) return 12;
    if (!milestones.fonts.done) return 34;
    if (!milestones.images.done) return 72;
    if (!milestones.load.done) return 94;
    return 100;
  }

  function revealLog(id) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("visible")) {
      el.classList.add("visible");
    }
  }

  function markMilestone(key) {
    if (milestones[key].done) return;
    milestones[key].done = true;

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

    // Micro-stall to simulate real-time processing
    stallUntil = Date.now() + 120 + Math.random() * 180;
  }

  // --- Attach Real Browser Event Listeners ---
  // 1. DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => markMilestone("dom"), {
      once: true,
    });
  } else {
    markMilestone("dom");
  }

  // 2. WebFonts Ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => markMilestone("fonts"));
  } else {
    setTimeout(() => markMilestone("fonts"), 300);
  }

  // 3. Above-the-fold Critical Images Ready
  function trackCriticalImages() {
    const criticalImages = Array.from(
      document.querySelectorAll('img[loading="eager"], img:not([loading])'),
    );
    if (!criticalImages.length) {
      markMilestone("images");
      return;
    }

    let loadedCount = 0;
    const total = criticalImages.length;

    function onImageLoaded() {
      loadedCount++;
      if (loadedCount >= total) markMilestone("images");
    }

    criticalImages.forEach((img) => {
      if (img.complete) {
        onImageLoaded();
      } else {
        img.addEventListener("load", onImageLoaded, { once: true });
        img.addEventListener("error", onImageLoaded, { once: true });
      }
    });
  }

  // 4. Window Full Load
  if (document.readyState === "complete") {
    markMilestone("load");
  } else {
    window.addEventListener("load", () => markMilestone("load"), {
      once: true,
    });
  }

  // Preloader status phrases mapped to progress
  const statusPhrases = [
    { at: 0, text: "Initializing systems…" },
    { at: 14, text: "DOM ready · Parsing markup…" },
    { at: 30, text: "Loading fonts & stylesheets…" },
    { at: 52, text: "Fetching images & assets…" },
    { at: 75, text: "Finalizing components…" },
    { at: 92, text: "Almost there…" },
  ];

  // --- Canvas Particle Background & Preloader Segments Setup ---
  document.addEventListener("DOMContentLoaded", () => {
    const segRow = document.getElementById("ls-seg-row");
    if (segRow) {
      for (let i = 0; i < SEG_COUNT; i++) {
        const seg = document.createElement("div");
        seg.className = "ls-seg";
        seg.id = "ls-seg-" + i;
        segRow.appendChild(seg);
      }
    }

    trackCriticalImages();

    // Floating Hexagon Particle Canvas
    const canvas = document.getElementById("ls-hex-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let W, H;
      const particles = [];

      function resizeCanvas() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

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

      function drawHex(x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + r * Math.cos(angle);
          const py = y + r * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
      }

      function renderHexCanvas() {
        if (dismissed) return;
        ctx.clearRect(0, 0, W, H);
        const t = Date.now() / 1000;
        const pctFraction = displayProgress / 100;
        const speedMultiplier = 0.4 + pctFraction * 1.0;
        const loadAlpha = 0.25 + pctFraction * 0.75;

        particles.forEach((p) => {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;
          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          if (p.y > H + 20) p.y = -20;

          const alpha =
            p.a * loadAlpha * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
          ctx.strokeStyle = `rgba(0,188,212,${alpha})`;
          ctx.lineWidth = 0.8;
          drawHex(p.x, p.y, p.r);
          ctx.stroke();
        });

        requestAnimationFrame(renderHexCanvas);
      }
      renderHexCanvas();
    }

    requestAnimationFrame(tickDisplay);
  });

  // Smooth UI progress interpolation
  function tickDisplay() {
    if (dismissed) return;

    const realPct = getRealProgress();
    const ceiling = getStallCeiling();
    const now = Date.now();
    const inStall = now < stallUntil;

    const target = inStall
      ? Math.min(displayProgress + 0.08, ceiling - 1)
      : Math.min(realPct, ceiling);

    const lerpSpeed = loadComplete ? 0.12 : 0.045;
    if (displayProgress < target) {
      displayProgress = Math.min(
        displayProgress +
          Math.max(0.15, (target - displayProgress) * lerpSpeed),
        target,
      );
    }

    const pct = Math.round(displayProgress);

    // Update DOM indicators
    const pctEl = document.getElementById("ls-pct-num");
    const barEl = document.getElementById("ls-bar-fill");
    const txtEl = document.getElementById("ls-status-txt");

    if (pctEl) pctEl.textContent = pct;
    if (barEl) barEl.style.width = pct + "%";

    // Light up progress segments
    for (let i = 0; i < SEG_COUNT; i++) {
      const seg = document.getElementById("ls-seg-" + i);
      if (!seg) continue;
      const lit = Math.floor((pct / 100) * SEG_COUNT);
      seg.className = "ls-seg" + (i < lit ? " full" : i === lit ? " lit" : "");
    }

    // Update text log
    if (txtEl) {
      let phrase = statusPhrases[0].text;
      for (const p of statusPhrases) {
        if (pct >= p.at) phrase = p.text;
      }
      if (txtEl.textContent !== phrase) txtEl.textContent = phrase;
    }

    // Dismiss when all conditions are fulfilled
    const elapsed = Date.now() - startTime;
    if (loadComplete && elapsed >= GRACEFUL_MIN_MS && displayProgress >= 99) {
      dismissLoader();
      return;
    }

    requestAnimationFrame(tickDisplay);
  }

  // Gracefully transition the preloader out of view
  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;

    displayProgress = 100;
    const pctEl = document.getElementById("ls-pct-num");
    const barEl = document.getElementById("ls-bar-fill");
    if (pctEl) pctEl.textContent = "100";
    if (barEl) barEl.style.width = "100%";

    for (let i = 0; i < SEG_COUNT; i++) {
      const seg = document.getElementById("ls-seg-" + i);
      if (seg) seg.className = "ls-seg full";
    }
    for (let i = 0; i < 6; i++) revealLog("ls-log" + i);

    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

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

/* =============================================================================
   HEADER & MOBILE NAVIGATION SIDEBAR (#mainHeader, #sidebar)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");
  const menuToggle = document.getElementById("mobile-menu");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const closeBtn = document.getElementById("sidebarClose");

  const sections = [
    "home",
    "about",
    "skills",
    "milestones",
    "projects",
    "gallery",
    "contact",
  ];

  // --- Sidebar Drawer Controls ---
  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) overlay.addEventListener("click", closeSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

  // Close sidebar on clicking any internal navigation item
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Close drawer on Escape keypress
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });

  // --- Active Nav Highlighting & Header Scrolled State ---
  function updateActiveNavLinks() {
    let activeSectionId = "";
    sections.forEach((id) => {
      const sectionEl = document.getElementById(id);
      if (sectionEl && window.scrollY >= sectionEl.offsetTop - 90) {
        activeSectionId = id;
      }
    });

    document
      .querySelectorAll(".nav-desktop a, .sidebar-nav a")
      .forEach((anchor) => {
        anchor.classList.toggle(
          "active",
          anchor.getAttribute("href") === "#" + activeSectionId,
        );
      });
  }

  function handleHeaderScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
    updateActiveNavLinks();
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  updateActiveNavLinks(); // Initialize on page load
});

/* =============================================================================
   SMOOTH SCROLL ENGINE
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          (headerOffset + 15);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});

/* =============================================================================
   HERO SECTION (#home)
   ============================================================================= */
(function initHeroEntrance() {
  const homeSection = document.getElementById("home");
  const loadingScreen = document.getElementById("loading-screen");
  if (!homeSection) return;

  function triggerHeroSequence() {
    setTimeout(() => {
      homeSection.classList.add("hero-ready");
    }, 80);
  }

  if (loadingScreen) {
    loadingScreen.addEventListener("transitionend", function onFadeOut(e) {
      if (e.target === loadingScreen && e.propertyName === "opacity") {
        loadingScreen.removeEventListener("transitionend", onFadeOut);
        triggerHeroSequence();
      }
    });

    // Fallback safety timeout if transition does not fire
    setTimeout(() => {
      if (!homeSection.classList.contains("hero-ready")) {
        triggerHeroSequence();
      }
    }, 1000);
  } else {
    triggerHeroSequence();
  }
})();

/* =============================================================================
   ABOUT SECTION (#about)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  // --- Terminal JSON Output Config ---
  const terminalData = [
    { type: "comment", text: "// Developer profile · v2026" },
    { type: "bracket", text: "{" },
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
    { type: "kv", key: '"Projects"', val: '"15+ Completed"', comma: true },
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
    { type: "bracket", text: "}" },
  ];

  function formatTerminalLine(line) {
    if (line.type === "comment") {
      return `<span class="ab-tl"><span class="t-comment">${line.text}</span></span>`;
    }
    if (line.type === "bracket") {
      return `<span class="ab-tl"><span class="t-arr">${line.text}</span></span>`;
    }
    if (line.type === "kv") {
      const cursorHtml = line.cursor ? `<span class="t-cursor"></span>` : "";
      const commaHtml = line.comma ? `<span class="t-sym">,</span>` : "";
      return `<span class="ab-tl">&nbsp;&nbsp;<span class="t-key">${line.key}</span><span class="t-sym">:</span> <span class="t-str">${line.val}</span>${commaHtml}${cursorHtml}</span>`;
    }
    return "";
  }

  let terminalTriggered = false;
  function startTerminalTypewriter() {
    if (terminalTriggered) return;
    terminalTriggered = true;

    const terminalBody = document.getElementById("ab-terminal-body");
    if (!terminalBody) return;
    terminalBody.innerHTML = "";

    terminalData.forEach((line, index) => {
      setTimeout(() => {
        terminalBody.insertAdjacentHTML("beforeend", formatTerminalLine(line));
      }, index * 90);
    });
  }

  // --- Dynamic Rotating Role Text ---
  const roles = [
    "Frontend Developer",
    "UI Designer",
    "Student",
    "Problem Solver",
  ];
  let currentRoleIndex = 0;
  const roleTextEl = document.getElementById("abRoleText");

  if (roleTextEl) {
    setInterval(() => {
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      roleTextEl.style.opacity = "0";
      setTimeout(() => {
        roleTextEl.textContent = roles[currentRoleIndex];
        roleTextEl.style.opacity = "1";
      }, 320);
    }, 2800);
  }

  // --- Numeric Stat Counters & Progress Bar Animation ---
  let statsTriggered = false;
  function triggerStatsAndBars() {
    if (statsTriggered) return;
    statsTriggered = true;

    // Increment numeric counters
    document
      .querySelectorAll(".ab-stat-num[data-target]")
      .forEach((counterEl) => {
        const target = parseFloat(counterEl.dataset.target);
        const suffix = counterEl.dataset.suffix || "";
        const totalSteps = 50;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          const currentVal = target * (step / totalSteps);
          counterEl.textContent = Math.round(currentVal) + suffix;

          if (step >= totalSteps) {
            counterEl.textContent = target + suffix;
            clearInterval(timer);
          }
        }, 22);
      });

    // Expand bar fills
    setTimeout(() => {
      document
        .querySelectorAll(".ab-stat-bar-fill, .ab-build-bar-fill")
        .forEach((bar) => bar.classList.add("ab-bar-animated"));
    }, 150);
  }

  // --- Scroll Observer for About Animations ---
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startTerminalTypewriter();
          triggerStatsAndBars();
          aboutObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  aboutObserver.observe(aboutSection);
});

/* =============================================================================
   SKILLS SECTION (#skills)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const SEGMENT_COUNT = 16;

  // --- Core & Compact Skill Cards (Linear Progress) ---
  document.querySelectorAll(".skill-block").forEach((card) => {
    const targetPct = parseInt(card.dataset.pct, 10) || 0;
    const barFill = card.querySelector(".sk-bar-fill");
    const pctLabel = card.querySelector(".sk-bar-pct");
    const segRow = card.querySelector(".sk-seg-row");

    if (!barFill || !pctLabel || !segRow) return;

    // Generate segmented blocks
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const seg = document.createElement("div");
      seg.className = "sk-seg";
      segRow.appendChild(seg);
    }

    let isAnimated = false;
    function runBarAnimation() {
      if (isAnimated) return;
      isAnimated = true;

      barFill.style.width = targetPct + "%";
      barFill.classList.add("sk-animated");

      let currentVal = 0;
      const stepIncrement = targetPct / 40;

      const animTimer = setInterval(() => {
        currentVal = Math.min(currentVal + stepIncrement, targetPct);
        pctLabel.textContent = Math.round(currentVal) + "%";

        const activeSegments = Math.floor((currentVal / 100) * SEGMENT_COUNT);
        segRow.querySelectorAll(".sk-seg").forEach((seg, idx) => {
          seg.className =
            "sk-seg" +
            (idx < activeSegments
              ? " full"
              : idx === activeSegments
                ? " on"
                : "");
        });

        if (currentVal >= targetPct) clearInterval(animTimer);
      }, 22);
    }

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay =
              parseFloat(
                getComputedStyle(card).getPropertyValue("--reveal-delay"),
              ) || 0;
            setTimeout(runBarAnimation, delay + 180);
            skillObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.25 },
    );

    skillObserver.observe(card);
  });

  // --- Mini Skill Indicators (Circular SVG Rings) ---
  const SVG_CIRCUMFERENCE = 2 * Math.PI * 26; // r="26"

  document.querySelectorAll(".sk-mini").forEach((card) => {
    const targetPct = parseInt(card.dataset.pct, 10) || 0;
    const ringFill = card.querySelector(".skm-ring-fill");
    const pctLabel = card.querySelector(".skm-pct");

    if (!ringFill || !pctLabel) return;

    let isAnimated = false;
    function runRingAnimation() {
      if (isAnimated) return;
      isAnimated = true;

      ringFill.style.strokeDashoffset =
        SVG_CIRCUMFERENCE - (targetPct / 100) * SVG_CIRCUMFERENCE;

      let currentVal = 0;
      const stepIncrement = targetPct / 30;

      const animTimer = setInterval(() => {
        currentVal = Math.min(currentVal + stepIncrement, targetPct);
        pctLabel.textContent = Math.round(currentVal) + "%";
        if (currentVal >= targetPct) clearInterval(animTimer);
      }, 25);
    }

    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runRingAnimation();
            ringObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.3 },
    );

    ringObserver.observe(card);
  });
});

/* =============================================================================
   PROJECTS SECTION (#projects)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // --- Category Filtering ---
  const filterBtns = document.querySelectorAll(".proj-filter-btn");
  const projectCards = document.querySelectorAll(".proj-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const selectedFilter = btn.dataset.filter;

      projectCards.forEach((card) => {
        if (selectedFilter === "all") {
          card.classList.remove("proj-hidden");
          return;
        }
        const cardStatus = card.dataset.status || "";
        const matches = cardStatus.split(" ").includes(selectedFilter);
        card.classList.toggle("proj-hidden", !matches);
      });
    });
  });
});

// --- Custom Image Lightbox (#projLightbox) ---
(function initProjectLightbox() {
  const lightbox = document.getElementById("projLightbox");
  const lightboxImg = document.getElementById("projLbImg");
  const closeBtn = document.getElementById("projLbClose");
  const captionEl = document.getElementById("projLbCaption");
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, title) {
    lightboxImg.src = "";
    lightboxImg.alt = title || "";
    if (captionEl) captionEl.textContent = title || "";

    lightbox.classList.add("proj-lb--open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxImg.classList.remove("proj-lb-img--loaded");

    const tempImg = new Image();
    tempImg.onload = () => {
      lightboxImg.src = src;
      lightboxImg.classList.add("proj-lb-img--loaded");
    };
    tempImg.src = src;
  }

  function closeLightbox() {
    lightbox.classList.remove("proj-lb--open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImg.src = "";
    }, 300);
  }

  // Trigger preview on card overlay click or Enter/Space keys
  document.querySelectorAll(".proj-preview-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(trigger.dataset.img, trigger.dataset.title);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(trigger.dataset.img, trigger.dataset.title);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  const backdrop = lightbox.querySelector(".proj-lb-backdrop");
  if (backdrop) backdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("proj-lb--open")) {
      closeLightbox();
    }
  });
})();

/* =============================================================================
   GALLERY SECTION (#gallery)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("gl2Grid");
  if (!galleryGrid) return;

  const galleryItems = Array.from(galleryGrid.querySelectorAll(".gl2-item"));
  const filterTabs = document.querySelectorAll(".gl2-filter");

  // Entrance animations for gallery items
  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("gl2-visible");
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  galleryItems.forEach((item) => galleryObserver.observe(item));

  // Category tab filtering
  function applyGalleryFilter(filterTag) {
    galleryItems.forEach((item) => {
      const match = filterTag === "all" || item.dataset.glTag === filterTag;
      item.classList.toggle("gl2-hidden", !match);
      if (match && !item.classList.contains("gl2-visible")) {
        galleryObserver.observe(item);
      }
    });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyGalleryFilter(tab.dataset.glFilter || "all");
    });
  });

  applyGalleryFilter("all");
});

/* =============================================================================
   CONTACT FORM (#contactForm)
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("cfSuccessMsg");
  if (!form) return;

  const validationFields = [
    {
      id: "cf-name",
      validate: (val) => val.trim().length >= 2,
      errorText: "Please enter your name",
    },
    {
      id: "cf-email",
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorText: "Enter a valid email address",
    },
    {
      id: "cf-subject",
      validate: (val) => val.trim().length >= 2,
      errorText: "Please add a subject",
    },
    {
      id: "cf-message",
      validate: (val) => val.trim().length >= 10,
      errorText: "Please write a message",
    },
  ];

  function updateFieldState(fieldEl, state) {
    const wrapper = fieldEl.closest(".cf-field");
    if (!wrapper) return;

    wrapper.classList.remove("cf-valid", "cf-error");
    wrapper
      .querySelectorAll(".cf-field-icon")
      .forEach((icon) => (icon.style.display = "none"));

    if (state === "valid") {
      wrapper.classList.add("cf-valid");
      const iconValid = wrapper.querySelector(".cf-field-icon.icon-valid");
      if (iconValid) iconValid.style.display = "flex";
    } else if (state === "error") {
      wrapper.classList.add("cf-error");
      const iconError = wrapper.querySelector(".cf-field-icon.icon-error");
      if (iconError) iconError.style.display = "flex";
    }
  }

  function validateFieldById(fieldId) {
    const config = validationFields.find((f) => f.id === fieldId);
    if (!config) return true;

    const inputEl = document.getElementById(fieldId);
    if (!inputEl) return true;

    const isValid = config.validate(inputEl.value);

    if (inputEl.value.trim() === "" && !inputEl.dataset.touched) {
      updateFieldState(inputEl, "reset");
      return false;
    }

    updateFieldState(inputEl, isValid ? "valid" : "error");
    return isValid;
  }

  // Attach real-time validation events
  validationFields.forEach(({ id }) => {
    const inputEl = document.getElementById(id);
    if (!inputEl) return;

    inputEl.addEventListener("blur", () => {
      inputEl.dataset.touched = "true";
      validateFieldById(id);
    });

    inputEl.addEventListener("input", () => {
      if (inputEl.dataset.touched) validateFieldById(id);
    });
  });

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isFormValid = true;
    validationFields.forEach(({ id }) => {
      const inputEl = document.getElementById(id);
      if (inputEl) inputEl.dataset.touched = "true";
      if (!validateFieldById(id)) isFormValid = false;
    });

    if (!isFormValid) {
      const firstInvalidField = form.querySelector(
        ".cf-field.cf-error input, .cf-field.cf-error textarea",
      );
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    const submitBtn = form.querySelector(".cf-submit");
    const submitLabel = submitBtn ? submitBtn.querySelector("span") : null;

    if (submitBtn) {
      submitBtn.classList.add("cf-sending");
      if (submitLabel) submitLabel.textContent = "Sending…";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });
      const data = await response.json();

      if (data.success) {
        form.style.transition = "opacity 0.3s ease";
        form.style.opacity = "0";

        setTimeout(() => {
          form.style.display = "none";
          if (successMsg) successMsg.classList.add("show");
        }, 300);
      } else {
        throw new Error("Form submission rejected by endpoint");
      }
    } catch (err) {
      if (submitBtn) {
        submitBtn.classList.remove("cf-sending");
        if (submitLabel) submitLabel.textContent = "Send Message";
      }

      const msgField = document.getElementById("cf-message");
      if (msgField) {
        const wrapper = msgField.closest(".cf-field");
        if (wrapper) {
          wrapper.classList.add("cf-error");
          const errorDisplay = wrapper.querySelector(".cf-error-msg");
          if (errorDisplay) {
            errorDisplay.innerHTML =
              '<i class="bx bx-info-circle"></i> Something went wrong - please try again';
          }
        }
      }
    }
  });
});

/* =============================================================================
   SUPPORT MODAL POPUP (#supportPopup)
   ============================================================================= */
window.addEventListener("load", () => {
  const supportPopup = document.getElementById("supportPopup");
  const closeBtn = document.getElementById("closeSupport");
  const navSupportBtn = document.getElementById("navSupportBtn");
  const sidebarSupportBtn = document.getElementById("sidebarSupportBtn");

  function openSupportModal() {
    if (supportPopup) supportPopup.classList.add("show");
  }

  function closeSupportModal() {
    if (supportPopup) supportPopup.classList.remove("show");
  }

  if (navSupportBtn) navSupportBtn.addEventListener("click", openSupportModal);

  if (sidebarSupportBtn) {
    sidebarSupportBtn.addEventListener("click", () => {
      // Close mobile sidebar before displaying support popup
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("sidebarOverlay");
      const menuToggle = document.getElementById("mobile-menu");

      if (sidebar) {
        sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("visible");
        if (menuToggle) {
          menuToggle.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
        sidebar.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
      setTimeout(openSupportModal, 280);
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeSupportModal);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      supportPopup &&
      supportPopup.classList.contains("show")
    ) {
      closeSupportModal();
    }
  });

  // Automatically prompt after 90 seconds of engagement
  setTimeout(openSupportModal, 90000);
});

/* =============================================================================
   GLOBAL SCROLL REVEAL & BACK-TO-TOP BUTTON
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Helper to register reveal directions & staggered transition delays
  function registerRevealElements(
    selector,
    variant = "reveal",
    baseDelay = 0,
    step = 80,
  ) {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add(variant);
      el.style.setProperty("--reveal-delay", `${baseDelay + index * step}ms`);
    });
  }

  // --- Tag Elements with Respective Reveal Directions ---
  registerRevealElements("section:not(#home) h2", "reveal", 0, 0); // Headings
  registerRevealElements(".about-panel", "reveal", 80, 90); // About bento panels
  registerRevealElements(".skill-block", "reveal", 60, 70); // Skills grid cards
  registerRevealElements(".tl-item", "reveal-left", 80, 100); // Milestones timeline
  registerRevealElements(".proj-card", "reveal", 60, 80); // Project articles

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

  // --- Shared IntersectionObserver ---
  const globalRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          globalRevealObserver.unobserve(entry.target); // Trigger once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => globalRevealObserver.observe(el));

  // --- Back-to-Top Button (#scrollTop) ---
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
});
