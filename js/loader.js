/**
 * AR.dev — loader.js
 * Page loader, loaded first on every page (before main.js).
 *
 * The overlay's markup lives at the top of each page's <body>. This
 * script makes it real:
 *
 *   - Every row in the loader list is a task that finishes only when
 *     the real thing has loaded: web fonts, each <img> on the page
 *     (lazy images are forced to load), the GitHub data on the home
 *     page, and the page itself (styles, scripts, layout).
 *   - The progress shown is the smaller of "how much has really
 *     loaded" and "how much of the minimum time has passed", so the
 *     loader lasts at least MIN_MS even when everything is ready in
 *     one second, and the bar never claims more than is loaded.
 *   - It never traps a visitor: MAX_MS lifts it regardless, any error
 *     removes it, and without JavaScript it is hidden by CSS.
 *
 * Page data that loads later (see initContributions in pages.js)
 * reports back with a "ardev:contrib-settled" event on document.
 */

(() => {
  "use strict";

  /* =========================
     SETTINGS
  ========================= */

  const MIN_MS = 1000; // the loader always stays at least this long
  const MAX_MS = 20000; // and never blocks the page longer than this
  const DATA_MAX_MS = 6000; // slow third-party data keeps loading after this
  const HOLD_MS = 300; // pause on "Ready" before the overlay lifts
  const EXIT_MS = 750; // keep in sync with .page-loader.is-leaving

  // Set to true to show the loader only on the first page of a visit.
  const SHOW_ONCE_PER_SESSION = false;
  const SESSION_KEY = "ardev:loader-seen";

  // Faces the design uses, so "Typefaces" really waits for them.
  const FONT_FACES = [
    '800 1em "Manrope"',
    '700 1em "Manrope"',
    '400 1em "DM Sans"',
    '500 1em "DM Sans"',
    '400 1em "DM Mono"',
  ];

  const root = document.getElementById("page-loader");

  if (!root) return;

  const html = document.documentElement;
  const t0 = performance.now();

  /* =========================
     CLEAN-UP HELPERS
  ========================= */

  let inerted = [];

  function unlock() {
    html.classList.remove("is-loading");

    inerted.forEach((element) => element.removeAttribute("inert"));
    inerted = [];
  }

  function removeLoader() {
    unlock();
    root.remove();

    try {
      if (SHOW_ONCE_PER_SESSION) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage unavailable: the loader just shows again next time.
    }
  }

  // Restored from the back/forward cache: the page is already loaded.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) removeLoader();
  });

  try {
    if (SHOW_ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY)) {
      removeLoader();
      return;
    }
  } catch {
    // Storage unavailable: show the loader.
  }

  try {
    start();
  } catch (error) {
    console.error("[AR.dev] loader failed", error);
    removeLoader();
  }

  function start() {
    const page = root.dataset.page || document.title;
    const live = document.getElementById("page-loader-live");
    const mark = root.querySelector(".page-loader-mark");
    const track = root.querySelector(".pl-track");
    const percent = root.querySelector(".pl-percent");

    /* ---------- Lock the page while loading ---------- */

    html.classList.add("is-loading");

    // Keyboard and screen-reader users shouldn't reach the page hiding
    // behind the overlay.
    inerted = Array.from(document.body.children).filter(
      (element) =>
        element !== root &&
        !["SCRIPT", "NOSCRIPT", "STYLE"].includes(element.tagName) &&
        !element.hasAttribute("inert"),
    );

    inerted.forEach((element) => element.setAttribute("inert", ""));

    if (live) live.textContent = `Loading ${page}`;

    /* ---------- Tasks ---------- */

    const tasks = [];

    function makeTask(key, total) {
      const row = root.querySelector(`[data-task="${key}"]`);

      const task = {
        key,
        total,
        done: 0,
        failed: 0,
        note: "",
        row,
        name: row ? row.querySelector(".pl-name") : null,
        state: row ? row.querySelector(".pl-state") : null,
      };

      if (task.name && row.dataset.label) {
        task.name.textContent = row.dataset.label.replace("{n}", String(total));
      }

      tasks.push(task);
      paintTask(task);

      return task;
    }

    function paintTask(task) {
      if (!task.row || !task.state) return;

      const finished = task.done >= task.total;
      let text;
      let state = "active";

      if (finished) {
        state = task.failed ? "warn" : "done";

        if (task.note) {
          text = task.note;
        } else if (!task.failed) {
          text = "Ready";
        } else if (task.key === "data") {
          text = "Unavailable";
        } else {
          text = `Ready · ${task.failed} missing`;
        }
      } else {
        text = task.total > 1 ? `${task.done} of ${task.total}` : "Loading";
      }

      task.row.dataset.state = state;
      task.state.textContent = text;
    }

    function advance(task, ok = true, note = "") {
      if (task.done >= task.total) return;

      task.done += 1;
      if (!ok) task.failed += 1;
      if (note) task.note = note;

      paintTask(task);
    }

    const settled = () => tasks.every((task) => task.done >= task.total);

    // How much has really loaded, 0 to 1. Images count one each, so a
    // gallery of nine frames outweighs the single fonts or page task.
    function realProgress() {
      let done = 0;
      let total = 0;

      tasks.forEach((task) => {
        done += task.done;
        total += task.total;
      });

      return total ? done / total : 1;
    }

    // 1. Fonts
    const fonts = makeTask("fonts", 1);

    if (document.fonts && document.fonts.load) {
      Promise.all(
        FONT_FACES.map((face) => document.fonts.load(face).catch(() => [])),
      )
        .then(() => document.fonts.ready)
        .catch(() => {})
        .then(() => advance(fonts));
    } else {
      advance(fonts);
    }

    // 2. Images. Lazy images are made eager so they truly load now.
    const images = Array.from(document.images).filter(
      (img) => !root.contains(img),
    );

    if (images.length) {
      const imageTask = makeTask("images", images.length);

      images.forEach((img) => {
        if (img.loading === "lazy") img.loading = "eager";

        const loaded = () => {
          // Decode now, so the reveal doesn't stutter on large images.
          const finish = () => advance(imageTask, true);

          if (img.decode) {
            img.decode().then(finish, finish);
          } else {
            finish();
          }
        };

        if (img.complete) {
          if (img.naturalWidth > 0) loaded();
          else advance(imageTask, false);

          return;
        }

        img.addEventListener("load", loaded, { once: true });
        img.addEventListener("error", () => advance(imageTask, false), {
          once: true,
        });
      });
    }

    // 3. Page data (home page: GitHub contributions)
    if (document.getElementById("contrib")) {
      const data = makeTask("data", 1);

      document.addEventListener(
        "ardev:contrib-settled",
        (event) => advance(data, !(event.detail && event.detail.ok === false)),
        { once: true },
      );

      // Third-party data shouldn't hold the whole page: after
      // DATA_MAX_MS the page opens and the data fills in when it arrives.
      window.setTimeout(
        () => advance(data, true, "Loading in background"),
        DATA_MAX_MS,
      );
    }

    // 4. The page itself: styles, scripts and layout
    const pageTask = makeTask("page", 1);

    if (document.readyState === "complete") {
      advance(pageTask);
    } else {
      window.addEventListener("load", () => advance(pageTask), { once: true });
    }

    // A row whose task doesn't exist on this page is removed.
    Array.from(root.querySelectorAll("[data-task]")).forEach((row) => {
      if (!tasks.some((task) => task.row === row)) row.remove();
    });

    /* ---------- Progress ---------- */

    let shown = 0;
    let lastWhole = -1;
    let frameId = 0;
    let finished = false;

    function paint(value) {
      const whole = Math.round(value * 100);

      if (mark) mark.style.setProperty("--p", value.toFixed(4));
      if (track) {
        track.style.setProperty("--p", value.toFixed(4));

        if (whole !== lastWhole) track.setAttribute("aria-valuenow", whole);
      }

      if (percent && whole !== lastWhole) percent.textContent = `${whole}%`;

      lastWhole = whole;
    }

    function frame(now) {
      const elapsed = now - t0;
      const byTime = Math.min(1, elapsed / MIN_MS);
      const target = Math.min(realProgress(), byTime);

      shown += (target - shown) * 0.14;

      if (target - shown < 0.002) shown = target;

      paint(shown);

      const ready = shown >= 1 && settled() && elapsed >= MIN_MS;

      if (ready || elapsed >= MAX_MS) {
        finish();
        return;
      }

      frameId = window.requestAnimationFrame(frame);
    }

    /* ---------- Finish ---------- */

    function scrollToHash() {
      if (!window.location.hash) return;

      let target = null;

      try {
        target = document.getElementById(
          decodeURIComponent(window.location.hash.slice(1)),
        );
      } catch {
        return;
      }

      if (!target) return;

      try {
        target.scrollIntoView({ block: "start", behavior: "instant" });
      } catch {
        target.scrollIntoView();
      }
    }

    function leave() {
      unlock();
      scrollToHash();

      // Lets pages.js move focus to a #hash target now that the page
      // is no longer inert.
      document.dispatchEvent(new Event("ardev:loader-done"));

      root.classList.add("is-leaving");

      window.setTimeout(removeLoader, EXIT_MS);
    }

    function finish() {
      if (finished) return;

      finished = true;
      window.cancelAnimationFrame(frameId);

      // Reached by the safety limit: show everything as done.
      paint(1);

      if (live) live.textContent = `${page} is ready`;

      window.setTimeout(leave, HOLD_MS);
    }

    paint(0);
    frameId = window.requestAnimationFrame(frame);
  }
})();
