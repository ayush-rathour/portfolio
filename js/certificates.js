/**
 * AR.dev — certificates.js
 * Certificates carousel on the About page: autoplay (pauses on hover,
 * focus, touch, preview and hidden tabs; off for reduced motion),
 * previous / next, dots, keyboard arrows, document switcher for grouped
 * certificates (which also auto-rotate between their documents as the
 * progress bar passes 1/2 or 1/3, 2/3), and a full-size preview dialog. Content works without JavaScript (the track
 * simply scrolls); this script only adds the controls.
 */

(() => {
  "use strict";

  const root = document.querySelector("[data-cert-carousel]");

  if (!root) return;

  const track = root.querySelector("[data-cert-track]");
  const slides = Array.from(track.querySelectorAll(".cert-slide"));
  const dotsWrap = root.querySelector("[data-cert-dots]");
  const count = root.querySelector("[data-cert-count]");
  const prev = root.querySelector("[data-cert-prev]");
  const next = root.querySelector("[data-cert-next]");
  const dialog = document.querySelector("[data-cert-dialog]");
  const dialogImg = dialog && dialog.querySelector("[data-cert-dialog-img]");
  const toggle = root.querySelector("[data-cert-toggle]");
  const progress = root.querySelector("[data-cert-progress]");
  const INTERVAL = 5000;
  const pad = (n) => String(n).padStart(2, "0");

  let index = 0;

  /* ---------- Dots ---------- */

  const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Certificate ${i + 1} of ${slides.length}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);

    return dot;
  });

  /* ---------- Navigation ---------- */

  function render() {
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-selected", String(i === index)),
    );

    if (count) count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;

    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft });
    render();
  }

  let frame = 0;

  track.addEventListener(
    "scroll",
    () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nearest = slides.reduce(
          (best, slide, i) =>
            Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft) <
            Math.abs(
              slides[best].offsetLeft - track.offsetLeft - track.scrollLeft,
            )
              ? i
              : best,
          0,
        );

        if (nearest !== index) {
          index = nearest;
          render();
        }
      });
    },
    { passive: true },
  );

  prev.addEventListener("click", () => {
    goTo(index - 1);
    restart();
  });
  next.addEventListener("click", () => {
    goTo(index + 1);
    restart();
  });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  });

  window.addEventListener("resize", () => goTo(index));

  /* ---------- Document views (certificate + badge, multi-page...) ---------- */

  const groups = slides.map((slide) => {
    const main = slide.querySelector("[data-cert-main]");
    const buttons = Array.from(slide.querySelectorAll(".cert-views button"));

    return { main, buttons, current: 0 };
  });

  function setView(group, view) {
    const button = group.buttons[view];

    if (!button) return;

    group.current = view;
    group.main.src = button.dataset.src;
    group.main.alt = button.dataset.alt;

    group.buttons.forEach((other) => {
      const active = other === button;

      other.classList.toggle("is-active", active);
      other.setAttribute("aria-pressed", String(active));
    });
  }

  /* ---------- Autoplay ---------- */

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let userWantsPlay = !reduceMotion.matches; // the pause button's state
  let paused = false; // temporary pauses (hover, focus, hidden...)
  let inView = false;
  let timer = 0;
  let viewTimers = [];
  let cycleSlide = 0; // slide the current progress cycle belongs to

  root.style.setProperty("--cert-interval", `${INTERVAL}ms`);

  function stopTimer() {
    window.clearTimeout(timer);
    viewTimers.forEach((id) => window.clearTimeout(id));
    viewTimers = [];

    if (progress) progress.classList.remove("is-running");
  }

  function restart() {
    stopTimer();

    // A new slide always starts on its first document.
    if (cycleSlide !== index) {
      setView(groups[cycleSlide], 0);
      cycleSlide = index;
    }

    if (!userWantsPlay || paused || !inView) return;

    if (progress) {
      // Restart the CSS animation from zero.
      void progress.offsetWidth;
      progress.classList.add("is-running");
    }

    // Rotate documents at 1/N, 2/N ... of the progress (1/2 for two
    // documents, 1/3 and 2/3 for three).
    const group = groups[index];
    const total = group.buttons.length;

    for (let view = group.current + 1; view < total; view += 1) {
      viewTimers.push(
        window.setTimeout(
          () => setView(group, view),
          (INTERVAL * view) / total,
        ),
      );
    }

    timer = window.setTimeout(() => {
      goTo(index === slides.length - 1 ? 0 : index + 1);
      restart();
    }, INTERVAL);
  }

  function setPaused(value) {
    if (paused === value) return;

    paused = value;
    restart();
  }

  function paintToggle() {
    toggle.setAttribute("aria-pressed", String(!userWantsPlay));
    toggle.setAttribute(
      "aria-label",
      userWantsPlay ? "Pause automatic slideshow" : "Play automatic slideshow",
    );
  }

  toggle.addEventListener("click", () => {
    userWantsPlay = !userWantsPlay;
    paintToggle();
    restart();
  });

  root.addEventListener("mouseenter", () => setPaused(true));
  root.addEventListener("mouseleave", () => setPaused(false));
  root.addEventListener("focusin", () => setPaused(true));
  root.addEventListener("focusout", () => setPaused(false));
  root.addEventListener("touchstart", () => setPaused(true), { passive: true });
  root.addEventListener("touchend", () => {
    // Give a swipe time to settle before the slideshow resumes.
    window.setTimeout(() => setPaused(false), 2500);
  });

  document.addEventListener("visibilitychange", () =>
    setPaused(document.hidden),
  );

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        restart();
      },
      { threshold: 0.35 },
    ).observe(root);
  } else {
    inView = true;
  }

  paintToggle();

  /* ---------- Document switcher (manual) ---------- */

  groups.forEach((group) => {
    group.buttons.forEach((button, view) => {
      button.addEventListener("click", () => {
        setView(group, view);
        restart();
      });
    });
  });

  /* ---------- Full-size preview ---------- */

  if (dialog && dialogImg && typeof dialog.showModal === "function") {
    root.querySelectorAll("[data-cert-zoom]").forEach((button) => {
      button.addEventListener("click", () => {
        const img = button.querySelector("img");

        dialogImg.src = img.currentSrc || img.src;
        dialogImg.alt = img.alt;
        dialog.showModal();
        setPaused(true);
      });
    });

    dialog.addEventListener("close", () => setPaused(false));

    dialog
      .querySelector("[data-cert-close]")
      .addEventListener("click", () => dialog.close());

    // Clicking the dark backdrop closes it too.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  render();
})();
