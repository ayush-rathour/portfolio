/**
 * AR.dev — certificates.js
 * Resilient certificate carousel.
 *
 * - Keeps every certificate in the document.
 * - Supports touch/trackpad scrolling, arrows, dots and keyboard navigation.
 * - Autoplay pauses for hover, focus, touch, hidden tabs and reduced motion.
 * - Supports grouped document views and full-size preview dialog.
 */

(() => {
  "use strict";

  const init = () => {
    const root = document.querySelector("[data-cert-carousel]");
    if (!root) return;

    const track = root.querySelector("[data-cert-track]");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".cert-slide"));

    if (!slides.length) return;

    const dotsWrap = root.querySelector("[data-cert-dots]");
    const count = root.querySelector("[data-cert-count]");
    const prev = root.querySelector("[data-cert-prev]");
    const next = root.querySelector("[data-cert-next]");
    const toggle = root.querySelector("[data-cert-toggle]");
    const progress = root.querySelector("[data-cert-progress]");

    const dialog =
      root.querySelector("[data-cert-dialog]") ||
      document.querySelector("[data-cert-dialog]");

    const dialogImg = dialog?.querySelector("[data-cert-dialog-img]");

    const closeDialog = dialog?.querySelector("[data-cert-close]");

    const INTERVAL = 5000;

    const pad = (number) => String(number).padStart(2, "0");

    let index = 0;
    let timer = 0;
    let animationFrame = 0;
    let paused = false;
    let inView = false;

    let userWantsPlay = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let viewTimers = [];
    let cycleSlide = 0;

    // Certificate document groups
    const groups = slides.map((slide) => ({
      main: slide.querySelector("[data-cert-main]"),
      buttons: Array.from(slide.querySelectorAll(".cert-views button")),
      current: 0,
    }));

    // Build navigation dots
    const dots = dotsWrap
      ? slides.map((slide, i) => {
          const dot = document.createElement("button");

          dot.type = "button";
          dot.setAttribute("role", "tab");
          dot.setAttribute(
            "aria-label",
            `Certificate ${i + 1} of ${slides.length}`,
          );

          dot.addEventListener("click", () => {
            goTo(i);
            restart();
          });

          dotsWrap.appendChild(dot);

          return dot;
        })
      : [];

    // Update controls
    const render = () => {
      dots.forEach((dot, i) => {
        dot.setAttribute("aria-selected", String(i === index));

        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });

      if (count) {
        count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      }

      if (prev) {
        prev.disabled = index === 0;
      }

      if (next) {
        next.disabled = index === slides.length - 1;
      }
    };

    // Navigate to a certificate
    const goTo = (requestedIndex, behavior = "smooth") => {
      index = Math.max(0, Math.min(slides.length - 1, requestedIndex));

      const left = slides[index].offsetLeft - slides[0].offsetLeft;

      track.scrollTo({
        left,
        behavior,
      });

      render();
    };

    // Detect the currently visible certificate
    const findNearestSlide = () => {
      const scrollPosition = track.scrollLeft;

      return slides.reduce((best, slide, i) => {
        const distance = Math.abs(
          slide.offsetLeft - slides[0].offsetLeft - scrollPosition,
        );

        const bestDistance = Math.abs(
          slides[best].offsetLeft - slides[0].offsetLeft - scrollPosition,
        );

        return distance < bestDistance ? i : best;
      }, 0);
    };

    // Track manual scrolling
    track.addEventListener(
      "scroll",
      () => {
        window.cancelAnimationFrame(animationFrame);

        animationFrame = window.requestAnimationFrame(() => {
          const nearest = findNearestSlide();

          if (nearest !== index) {
            index = nearest;
            render();
            restart();
          }
        });
      },
      { passive: true },
    );

    // Previous button
    prev?.addEventListener("click", () => {
      goTo(index - 1);
      restart();
    });

    // Next button
    next?.addEventListener("click", () => {
      goTo(index + 1);
      restart();
    });

    // Keyboard navigation
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
        restart();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
        restart();
      }
    });

    // Switch between certificate and badge documents
    const setView = (group, view) => {
      const button = group.buttons[view];

      if (!button || !group.main) return;

      group.current = view;

      group.main.src = button.dataset.src;
      group.main.alt = button.dataset.alt || group.main.alt;

      group.buttons.forEach((other) => {
        const active = other === button;

        other.classList.toggle("is-active", active);

        other.setAttribute("aria-pressed", String(active));
      });
    };

    // Manual document switching
    groups.forEach((group) => {
      group.buttons.forEach((button, view) => {
        button.addEventListener("click", () => {
          setView(group, view);
          restart();
        });
      });
    });

    // Stop autoplay timers
    const stopTimer = () => {
      window.clearTimeout(timer);

      viewTimers.forEach((id) => {
        window.clearTimeout(id);
      });

      viewTimers = [];

      if (progress) {
        progress.classList.remove("is-running");
      }
    };

    // Restart autoplay
    const restart = () => {
      stopTimer();

      if (cycleSlide !== index) {
        setView(groups[cycleSlide], 0);
        cycleSlide = index;
      }

      if (!userWantsPlay || paused || !inView || slides.length < 2) {
        return;
      }

      if (progress) {
        void progress.offsetWidth;
        progress.classList.add("is-running");
      }

      const group = groups[index];
      const total = group.buttons.length;

      // Automatically switch grouped documents
      for (let view = group.current + 1; view < total; view++) {
        viewTimers.push(
          window.setTimeout(
            () => setView(group, view),
            (INTERVAL * view) / total,
          ),
        );
      }

      // Move to the next certificate
      timer = window.setTimeout(() => {
        goTo(index === slides.length - 1 ? 0 : index + 1);

        restart();
      }, INTERVAL);
    };

    // Temporary autoplay pause
    const setPaused = (value) => {
      if (paused === value) return;

      paused = value;
      restart();
    };

    // Play/pause button
    const paintToggle = () => {
      if (!toggle) return;

      toggle.setAttribute("aria-pressed", String(!userWantsPlay));

      toggle.setAttribute(
        "aria-label",
        userWantsPlay
          ? "Pause automatic slideshow"
          : "Play automatic slideshow",
      );
    };

    toggle?.addEventListener("click", () => {
      userWantsPlay = !userWantsPlay;

      paintToggle();
      restart();
    });

    // Pause on hover and focus
    root.addEventListener("mouseenter", () => {
      setPaused(true);
    });

    root.addEventListener("mouseleave", () => {
      setPaused(false);
    });

    root.addEventListener("focusin", () => {
      setPaused(true);
    });

    root.addEventListener("focusout", (event) => {
      if (!root.contains(event.relatedTarget)) {
        setPaused(false);
      }
    });

    // Pause while interacting with touch
    root.addEventListener("touchstart", () => setPaused(true), {
      passive: true,
    });

    root.addEventListener(
      "touchend",
      () => {
        window.setTimeout(() => {
          setPaused(false);
        }, 2500);
      },
      { passive: true },
    );

    // Pause when browser tab is hidden
    document.addEventListener("visibilitychange", () => {
      setPaused(document.hidden);
    });

    // Start autoplay when carousel enters viewport
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          inView = Boolean(entries[0]?.isIntersecting);

          restart();
        },
        { threshold: 0.15 },
      );

      observer.observe(root);
    } else {
      inView = true;
    }

    // Full-size certificate preview
    root.querySelectorAll("[data-cert-zoom]").forEach((button) => {
      button.addEventListener("click", () => {
        const img = button.querySelector("img");

        if (!img) return;

        if (dialog && dialogImg && typeof dialog.showModal === "function") {
          dialogImg.src = img.currentSrc || img.src;

          dialogImg.alt = img.alt;

          dialog.showModal();
          setPaused(true);
        } else {
          window.open(img.currentSrc || img.src, "_blank", "noopener");
        }
      });
    });

    // Close preview dialog
    if (dialog && closeDialog) {
      dialog.addEventListener("close", () => {
        setPaused(false);
      });

      closeDialog.addEventListener("click", () => {
        dialog.close();
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      });
    }

    // Recalculate position on resize
    window.addEventListener("resize", () => {
      goTo(index, "auto");
    });

    // Initialize carousel
    root.style.setProperty("--cert-interval", `${INTERVAL}ms`);

    render();
    paintToggle();
    goTo(0, "auto");
    restart();
  };

  // Safely initialize after the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
