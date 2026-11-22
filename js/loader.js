/**
 * AR.dev — loader.js
 * Page loader and page transitions. Loaded first on every page.
 *
 * Three behaviours, one script:
 *
 *   1. FIRST VISIT of a session: the full loader card. Every row in
 *      it is a task that finishes only when the real thing has loaded
 *      (web fonts, the images you can see on arrival, the GitHub data
 *      on the home page, and the page itself).
 *
 *   2. LATER PAGES: no card. A slim progress bar runs along the top
 *      edge and the page is revealed as soon as the type is ready.
 *      The decision is made before first paint by a tiny inline script
 *      in each page's <head>, which adds `loader-slim` to <html>, so
 *      the card never flashes.
 *
 *   3. PAGE TRANSITIONS: clicking an internal link wipes a lime
 *      curtain up over the page, then navigates. The next page opens
 *      under the same curtain (`pt-enter`, set in <head>) and lifts it.
 *
 * Progress is honest but never choppy: it is the smaller of "how much
 * has really loaded" (weighted per task) and an ease-out time curve,
 * smoothed with frame-rate independent easing. MAX_MS lifts the
 * overlay regardless, any error removes it, and without JavaScript it
 * is hidden by CSS.
 *
 * Page data that loads later (see initContributions in pages.js)
 * reports back with an "ardev:contrib-settled" event on document.
 * When the page is ready, "ardev:loader-done" is dispatched.
 */

(() => {
  "use strict";

  /* =========================
     SETTINGS
  ========================= */

  const MIN_MS = 900; // the full loader stays at least this long
  const MAX_MS = 15000; // and never blocks the page longer than this
  const DATA_MAX_MS = 2500; // slow third-party data keeps loading after this
  const HOLD_MS = 260; // pause on "Ready" before the overlay lifts
  const EXIT_MS = 800; // keep in sync with .page-loader.is-leaving
  const CURTAIN_MS = 520; // keep in sync with .page-curtain
  const REVEAL_MS = 700; // keep in sync with html.pt-reveal
  const SLIM_FONT_WAIT_MS = 700; // slim mode never waits longer than this

  const SEEN_KEY = "ardev:loader-seen"; // full loader already shown
  const PT_KEY = "ardev:transition"; // set by a link click; read in <head>

  // Faces the design uses, so "Typefaces" really waits for them.
  const FONT_FACES = [
    '800 1em "Manrope"',
    '700 1em "Manrope"',
    '400 1em "DM Sans"',
    '500 1em "DM Sans"',
    '400 1em "DM Mono"',
  ];

  // How much each task counts toward the bar.
  const WEIGHTS = { fonts: 1.5, images: 2.5, data: 1, page: 2 };

  const html = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const store = {
    get(key) {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // Storage unavailable: loader just behaves like a first visit.
      }
    },
  };

  // Deferred scripts all run before DOMContentLoaded, so anything that
  // announces itself to the other scripts waits for it.
  function afterScripts(callback) {
    if (document.readyState === "complete") callback();
    else document.addEventListener("DOMContentLoaded", callback, { once: true });
  }

  /* =========================
     PAGE TRANSITIONS
  ========================= */

  let curtain = null;
  let leavingPage = false;

  function leaveTo(href) {
    if (leavingPage) return;
    leavingPage = true;

    store.set(PT_KEY, String(Date.now()));

    curtain = document.createElement("div");
    curtain.className = "page-curtain";
    curtain.setAttribute("aria-hidden", "true");
    document.body.appendChild(curtain);

    // Force a layout so the slide-in actually animates.
    void curtain.offsetWidth;
    curtain.classList.add("is-in");

    window.setTimeout(() => window.location.assign(href), CURTAIN_MS);
  }

  function shouldTransition(event, link) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }
    if (reduceMotion.matches) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    let url;

    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return false;
    }

    if (!["http:", "https:", "file:"].includes(url.protocol)) return false;
    if (url.origin !== window.location.origin) return false;

    // Same page (in-page #anchors, or a link back to where you are).
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }

    // Files, not pages.
    if (/\.(zip|apk|pdf|png|jpe?g|webp|gif|svg|mp4|txt|xml)$/i.test(url.pathname)) {
      return false;
    }

    return true;
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href]");

    if (!link || !shouldTransition(event, link)) return;

    event.preventDefault();
    leaveTo(link.href);
  });

  // Coming back with the browser's back button can restore this page
  // from memory with the curtain still up. Put everything back.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    leavingPage = false;
    if (curtain) curtain.remove();
    curtain = null;
    html.classList.remove("pt-enter", "pt-reveal");
  });

  // Lift the curtain the previous page dropped (see <head> script).
  function liftEntrance() {
    if (!html.classList.contains("pt-enter")) return;

    window.requestAnimationFrame(() => {
      html.classList.add("pt-reveal");

      window.setTimeout(
        () => html.classList.remove("pt-enter", "pt-reveal"),
        REVEAL_MS + 60,
      );
    });
  }

  /* =========================
     MODE
  ========================= */

  const root = document.getElementById("page-loader");
  const seen = Boolean(store.get(SEEN_KEY));

  if (html.classList.contains("loader-slim") || seen) {
    startSlim();
    return;
  }

  if (!root) {
    afterScripts(liftEntrance);
    return;
  }

  try {
    startFull();
  } catch (error) {
    console.error("[AR.dev] loader failed", error);
    html.classList.remove("is-loading");
    root.remove();
    liftEntrance();
  }

  /* =========================
     SLIM MODE (every page after the first)
  ========================= */

  function startSlim() {
    html.classList.add("loader-slim");
    if (root) root.remove();

    const bar = document.createElement("div");
    const fill = document.createElement("span");

    bar.className = "page-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.appendChild(fill);
    document.body.appendChild(bar);

    const t0 = performance.now();
    let frameId = 0;
    let done = false;

    const setBar = (value) => bar.style.setProperty("--p", value.toFixed(3));

    function tick(now) {
      if (done) return;

      // Eases toward 90% and waits there for the real load event.
      setBar(Math.max(0.08, 0.9 * (1 - Math.exp(-(now - t0) / 600))));
      frameId = window.requestAnimationFrame(tick);
    }

    function complete() {
      if (done) return;

      done = true;
      window.cancelAnimationFrame(frameId);
      setBar(1);

      window.setTimeout(() => {
        bar.classList.add("is-done");
        window.setTimeout(() => bar.remove(), 350);
      }, 160);
    }

    setBar(0.08);
    frameId = window.requestAnimationFrame(tick);

    if (document.readyState === "complete") complete();
    else window.addEventListener("load", complete, { once: true });

    window.setTimeout(complete, MAX_MS);

    // Reveal as soon as the type is ready (or shortly after), not
    // after every image: the page fills in under the bar.
    afterScripts(() => {
      const fontsReady =
        document.fonts && document.fonts.ready
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

      Promise.race([
        fontsReady,
        new Promise((resolve) => window.setTimeout(resolve, SLIM_FONT_WAIT_MS)),
      ]).then(() => {
        liftEntrance();
        document.dispatchEvent(new Event("ardev:loader-done"));
      });
    });
  }

  /* =========================
     FULL MODE (first page of a visit)
  ========================= */

  function startFull() {
    const t0 = performance.now();
    const page = root.dataset.page || document.title;
    const live = document.getElementById("page-loader-live");
    const mark = root.querySelector(".page-loader-mark");
    const track = root.querySelector(".pl-track");
    const percent = root.querySelector(".pl-percent");

    let inerted = [];

    function unlock() {
      html.classList.remove("is-loading");

      inerted.forEach((element) => element.removeAttribute("inert"));
      inerted = [];
    }

    function removeLoader() {
      unlock();
      root.remove();
    }

    // Restored from the back/forward cache: already loaded.
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) removeLoader();
    });

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

    if (live) live.textContent = `Loading the ${page} page`;

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
          text = "Skipped";
        } else {
          text = `Ready · ${task.failed} missing`;
        }
      } else {
        text = task.total > 1 ? `${task.done} of ${task.total}` : "Fetching";
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

    // How much has really loaded, 0 to 1. Each task has a weight and
    // contributes its own fraction, so the bar moves per image rather
    // than jumping when a whole group finishes.
    function realProgress() {
      let done = 0;
      let total = 0;

      tasks.forEach((task) => {
        const weight = WEIGHTS[task.key] || 1;

        done += weight * Math.min(1, task.done / task.total);
        total += weight;
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

    // 2. Images you see on arrival. Only those within roughly the first
    //    screen and a half hold the loader; anything further down keeps
    //    loading lazily afterwards, so the reveal is quick.
    const viewport = window.innerHeight || 800;

    const images = Array.from(document.images).filter((img) => {
      if (root.contains(img)) return false;

      const box = img.getBoundingClientRect();

      if (!box.width && !box.height) return false; // hidden (dialogs, tabs)

      return box.top < viewport * 1.5 && box.bottom > -viewport * 0.5;
    });

    if (images.length) {
      const imageTask = makeTask("images", images.length);

      images.forEach((img) => {
        if (img.loading === "lazy") img.loading = "eager";

        const loaded = () => {
          // Decode now, so the reveal doesn't stutter on large images.
          const finish = () => advance(imageTask, true);

          if (img.decode) img.decode().then(finish, finish);
          else finish();
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
        () => advance(data, true, "Finishing in background"),
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
    let last = t0;
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
      const dt = Math.min(64, now - last);
      const elapsed = now - t0;
      const t = Math.min(1, elapsed / MIN_MS);

      last = now;

      // Ease-out: a quick start, a soft landing.
      const byTime = 1 - Math.pow(1 - t, 3);
      const target = Math.min(realProgress(), byTime);

      // Frame-rate independent smoothing.
      shown += (target - shown) * (1 - Math.exp(-dt / 110));

      if (target - shown < 0.0015) shown = target;

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
      // Later pages get the slim bar instead of this card.
      store.set(SEEN_KEY, "1");

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
      root.classList.add("is-complete");

      if (live) live.textContent = `The ${page} page is ready`;

      window.setTimeout(leave, HOLD_MS);
    }

    paint(0);
    frameId = window.requestAnimationFrame(frame);
  }
})();
