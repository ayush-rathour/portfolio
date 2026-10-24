/**
 * AR.dev — pages.js
 * Page-level enhancements, loaded after main.js.
 *
 *   1. Contact form (Web3Forms)
 *   2. In-page anchor focus
 *   3. "Now" strip: latest GitHub commit (home page)
 *   4. GitHub contribution graph (home page)
 *
 * Site-wide behavior (navigation, icons, gallery) lives in main.js.
 * Each feature does nothing when its markup is not on the page, and
 * one failing feature never stops the others.
 */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  /* =========================
     1. CONTACT FORM
     Sends the form to Web3Forms and reports the result in
     the #form-status live region.
  ========================= */

  const FORM_ENDPOINT = "https://api.web3forms.com/submit";
  const FORM_TIMEOUT_MS = 15000;

  function initContactForm() {
    const form = $("[data-contact-form]");

    if (!form) return;

    const status = $("#form-status");
    const button = $('button[type="submit"]', form);

    let sending = false;

    function setStatus(message, state = "") {
      if (!status) return;

      status.textContent = message;
      status.dataset.state = state;
    }

    function setSending(value) {
      sending = value;

      form.setAttribute("aria-busy", String(value));

      if (button) button.disabled = value;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (sending) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);

      // The hidden honeypot is only ever ticked by bots.
      if (data.get("botcheck")) return;

      const controller = new AbortController();
      const timer = window.setTimeout(
        () => controller.abort(),
        FORM_TIMEOUT_MS,
      );

      setSending(true);
      setStatus("Sending…");

      try {
        const response = await fetch(
          form.getAttribute("action") || FORM_ENDPOINT,
          {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data,
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (response.ok && result.success) {
          form.reset();
          setStatus("Message sent. Expect a reply within a day.", "success");
        } else {
          setStatus(
            result.message ||
              "Something went wrong. Please try again or email me.",
            "error",
          );
        }
      } catch (error) {
        setStatus(
          error.name === "AbortError"
            ? "That took too long. Please try again or email me directly."
            : "Couldn't send your message. Check your connection or email me directly.",
          "error",
        );
      } finally {
        window.clearTimeout(timer);
        setSending(false);
      }
    });
  }

  /* =========================
     2. IN-PAGE ANCHOR FOCUS
     Scrolling is left to the browser: html has scroll-behavior and
     scroll-padding-top in styles.css, and the native jump keeps the
     :target highlight on the Milestones year links working.
     This only moves keyboard and screen-reader focus to the
     destination.
  ========================= */

  function focusHashTarget() {
    const id = decodeURIComponent(window.location.hash.slice(1));

    if (!id) return;

    const target = document.getElementById(id);

    if (!target) return;

    if (!target.matches("a, button, input, select, textarea, [tabindex]")) {
      target.setAttribute("tabindex", "-1");
    }

    target.focus({ preventScroll: true });
  }

  function initAnchorFocus() {
    const focusSafely = () => {
      try {
        focusHashTarget();
      } catch {
        // A malformed hash is ignored.
      }
    };

    window.addEventListener("hashchange", focusSafely);

    // A page opened straight at a #hash (for example milestones.html#year-2026).
    focusSafely();
  }

  /* =========================
     3. NOW STRIP: LATEST GITHUB COMMIT
     Looks at the newest commit of each repo listed in
     data-github-repos on #now-commit and shows the most recent one.
     The result is cached for 15 minutes per tab, because the public
     GitHub API allows only 60 requests an hour per visitor. If anything
     fails, the card quietly falls back to a link to the GitHub profile.
  ========================= */

  const COMMIT_CACHE_KEY = "ardev:latest-commit";
  const COMMIT_CACHE_MS = 15 * 60 * 1000;
  const COMMIT_TIMEOUT_MS = 8000;

  function timeAgo(isoDate) {
    const seconds = Math.round(
      (new Date(isoDate).getTime() - Date.now()) / 1000,
    );
    const units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    for (const [unit, size] of units) {
      if (Math.abs(seconds) >= size) {
        return formatter.format(Math.round(seconds / size), unit);
      }
    }

    return "just now";
  }

  function readCommitCache() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(COMMIT_CACHE_KEY));

      if (cached && Date.now() - cached.savedAt < COMMIT_CACHE_MS) {
        return cached.commit;
      }
    } catch {
      // Storage unavailable or corrupted: fetch fresh data instead.
    }

    return null;
  }

  function writeCommitCache(commit) {
    try {
      sessionStorage.setItem(
        COMMIT_CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), commit }),
      );
    } catch {
      // Ignored: caching is only an optimization.
    }
  }

  async function fetchLatestCommit(user, repos) {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      COMMIT_TIMEOUT_MS,
    );

    try {
      const results = await Promise.allSettled(
        repos.map(async (repo) => {
          const response = await fetch(
            `https://api.github.com/repos/${user}/${repo}/commits?per_page=1`,
            {
              headers: { Accept: "application/vnd.github+json" },
              signal: controller.signal,
            },
          );

          if (!response.ok) throw new Error(`${repo}: ${response.status}`);

          const [latest] = await response.json();

          if (!latest) throw new Error(`${repo}: no commits`);

          return {
            repo,
            message: String(latest.commit.message || "")
              .split("\n")[0]
              .trim(),
            date: latest.commit.committer?.date || latest.commit.author?.date,
            url: latest.html_url,
          };
        }),
      );

      const commits = results
        .filter((result) => result.status === "fulfilled" && result.value.date)
        .map((result) => result.value)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return commits[0] || null;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function initNowStrip() {
    const box = $("#now-commit");

    if (!box) return;

    const user = box.dataset.githubUser;
    const repos = (box.dataset.githubRepos || "")
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    const messageEl = $("[data-commit-message]", box);
    const metaEl = $("[data-commit-meta]", box);
    const repoEl = $("[data-commit-repo]", box);
    const timeEl = $("[data-commit-time]", box);
    const linkEl = $("[data-commit-link]", box);

    if (!user || !repos.length || !messageEl) return;

    function showCommit(commit) {
      const message =
        commit.message.length > 90
          ? `${commit.message.slice(0, 87)}…`
          : commit.message;

      messageEl.textContent = message || "New commit";

      if (repoEl) repoEl.textContent = commit.repo;

      if (timeEl) {
        timeEl.textContent = timeAgo(commit.date);
        timeEl.setAttribute("datetime", commit.date);
        timeEl.title = new Date(commit.date).toLocaleString();
      }

      if (metaEl) metaEl.hidden = false;

      if (linkEl) {
        linkEl.href = commit.url;
        linkEl.firstChild.textContent = "View commit ";
      }

      box.classList.remove("is-loading");
    }

    function showFallback() {
      messageEl.textContent = "See what I've been building on GitHub.";
      box.classList.remove("is-loading");
    }

    const cached = readCommitCache();

    if (cached) {
      showCommit(cached);
      return;
    }

    try {
      const commit = await fetchLatestCommit(user, repos);

      if (commit) {
        writeCommitCache(commit);
        showCommit(commit);
      } else {
        showFallback();
      }
    } catch {
      showFallback();
    }
  }

  /* =========================
     4. GITHUB CONTRIBUTION GRAPH
     Draws the public contribution calendar for the GitHub user in
     data-github-user on #contrib. GitHub's own REST API has no
     contribution calendar, so the data comes from the open
     github-contributions-api (public contributions only). Only the
     latest weeks that fit the width are drawn, so the newest activity
     is always visible: about 15 weeks on a small phone, a full year
     on a wide screen. The graph redraws when the width changes.
     The response is cached for an hour per tab, and if anything fails
     the card falls back to a plain link to the GitHub profile.
     Keep CONTRIB_LABEL and CONTRIB_GAP in sync with --contrib-label
     and --contrib-gap in styles.css.
  ========================= */

  const CONTRIB_API = "https://github-contributions-api.jogruber.de/v4/";
  const CONTRIB_CACHE_KEY = "ardev:contributions";
  const CONTRIB_CACHE_MS = 60 * 60 * 1000;
  const CONTRIB_TIMEOUT_MS = 10000;

  const CONTRIB_LABEL = 30;
  const CONTRIB_GAP = 4;
  const CONTRIB_MIN_CELL = 10;
  const CONTRIB_MIN_WEEKS = 8;
  const CONTRIB_MAX_WEEKS = 53;

  const CONTRIB_DEFAULT_READOUT = "Hover or tap a square for details.";

  const monthFormat = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  });

  const dayFormat = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  function readContribCache(user) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CONTRIB_CACHE_KEY));

      if (
        cached &&
        cached.user === user &&
        Date.now() - cached.savedAt < CONTRIB_CACHE_MS
      ) {
        return cached.days;
      }
    } catch {
      // Storage unavailable or corrupted: fetch fresh data instead.
    }

    return null;
  }

  function writeContribCache(user, days) {
    try {
      sessionStorage.setItem(
        CONTRIB_CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), user, days }),
      );
    } catch {
      // Ignored: caching is only an optimization.
    }
  }

  async function fetchContributions(user) {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      CONTRIB_TIMEOUT_MS,
    );

    try {
      const response = await fetch(
        `${CONTRIB_API}${encodeURIComponent(user)}?y=last`,
        { headers: { Accept: "application/json" }, signal: controller.signal },
      );

      if (!response.ok) throw new Error(`contributions: ${response.status}`);

      const data = await response.json();

      if (!data || !Array.isArray(data.contributions)) {
        throw new Error("contributions: unexpected response");
      }

      const days = data.contributions
        .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date))
        .map((day) => ({
          date: day.date,
          count: Number(day.count) || 0,
          level: Math.min(4, Math.max(0, Number(day.level) || 0)),
        }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));

      if (!days.length) throw new Error("contributions: no days");

      return days;
    } finally {
      window.clearTimeout(timer);
    }
  }

  // Splits a sorted list of days into Sunday-first weeks of 7 slots.
  // Slots outside the data (before the first day, after today) stay null.
  function groupIntoWeeks(days) {
    const weeks = [];
    let week = new Array(7).fill(null);

    days.forEach((day, index) => {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();

      if (index > 0 && weekday === 0) {
        weeks.push(week);
        week = new Array(7).fill(null);
      }

      week[weekday] = day;
    });

    weeks.push(week);

    return weeks;
  }

  // How many week columns fit while each square stays at least
  // CONTRIB_MIN_CELL wide. Every column also takes one gap.
  function weeksThatFit(width) {
    const fit = Math.floor(
      (width - CONTRIB_LABEL) / (CONTRIB_MIN_CELL + CONTRIB_GAP),
    );

    return Math.min(CONTRIB_MAX_WEEKS, Math.max(CONTRIB_MIN_WEEKS, fit));
  }

  function initContributions() {
    const root = $("#contrib");

    if (!root) return;

    const user = root.dataset.githubUser;
    const graph = $("#contrib-graph", root);
    const scroll = $(".contrib-scroll", root);
    const summary = $("#contrib-summary", root);
    const readout = $("#contrib-readout", root);

    if (!user || !graph || !scroll) return;

    let days = null;
    let drawn = 0;
    let selected = null;

    const pluralize = (n) =>
      `${n.toLocaleString("en")} contribution${n === 1 ? "" : "s"}`;

    function cell(level, row, column, text) {
      const element = document.createElement("span");

      element.className = "contrib-cell";
      element.dataset.level = String(level);
      element.style.gridArea = `${row} / ${column}`;

      if (text) element.dataset.text = text;

      return element;
    }

    function label(className, text, row, column) {
      const element = document.createElement("span");

      element.className = className;
      element.textContent = text;
      element.style.gridArea = `${row} / ${column}`;
      element.setAttribute("aria-hidden", "true");

      return element;
    }

    // Month names above the first week of each month, dropping any
    // that would sit closer than three columns to the one before.
    function monthLabels(weeks) {
      const labels = [];
      let previousMonth = -1;

      weeks.forEach((week, index) => {
        const first = week.find(Boolean);

        if (!first) return;

        const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();

        if (month === previousMonth) return;

        previousMonth = month;

        const entry = {
          column: index,
          text: monthFormat.format(new Date(`${first.date}T00:00:00Z`)),
        };
        const last = labels[labels.length - 1];

        if (last && entry.column - last.column < 3) labels.pop();

        labels.push(entry);
      });

      return labels;
    }

    function draw(count) {
      const all = days ? groupIntoWeeks(days) : null;
      const weeks = all
        ? all.slice(-count)
        : Array.from({ length: count }, () => new Array(7).fill({ level: 0 }));

      const fragment = document.createDocumentFragment();

      // Row 1 holds month names, rows 2 to 8 are Sunday to Saturday.
      [
        ["Mon", 3],
        ["Wed", 5],
        ["Fri", 7],
      ].forEach(([name, row]) => {
        fragment.appendChild(label("contrib-day", name, row, 1));
      });

      if (all) {
        monthLabels(weeks).forEach((entry) => {
          fragment.appendChild(
            label("contrib-month", entry.text, 1, entry.column + 2),
          );
        });
      }

      let total = 0;

      weeks.forEach((week, index) => {
        week.forEach((day, weekday) => {
          if (!day) return;

          let text = "";

          if (day.date) {
            total += day.count;
            text = `${day.count ? pluralize(day.count) : "No contributions"} on ${dayFormat.format(new Date(`${day.date}T00:00:00Z`))}`;
          }

          fragment.appendChild(cell(day.level, weekday + 2, index + 2, text));
        });
      });

      graph.replaceChildren(fragment);
      graph.style.setProperty("--weeks", String(weeks.length));
      selected = null;

      if (readout) readout.textContent = CONTRIB_DEFAULT_READOUT;

      if (all) {
        const span =
          weeks.length >= 52
            ? "the last year"
            : `the last ${weeks.length} weeks`;
        const message = `${pluralize(total)} in ${span}`;

        if (summary) summary.textContent = message;

        graph.setAttribute("role", "img");
        graph.setAttribute(
          "aria-label",
          `GitHub contribution graph: ${message}.`,
        );
      }
    }

    function redraw(force = false) {
      const count = weeksThatFit(scroll.clientWidth);

      if (!force && count === drawn) return;

      drawn = count;
      draw(count);
    }

    // Hover on desktop, tap on touch screens.
    function showCell(event) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const square = target.closest(".contrib-cell[data-text]");

      if (!square || !readout) return;

      if (selected) selected.classList.remove("is-selected");

      selected = square;

      if (event.type === "click") square.classList.add("is-selected");

      readout.textContent = square.dataset.text;
    }

    graph.addEventListener("mouseover", showCell);
    graph.addEventListener("click", showCell);

    graph.addEventListener("mouseleave", () => {
      if (readout && !selected) readout.textContent = CONTRIB_DEFAULT_READOUT;
    });

    let frame = 0;

    function onResize() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => redraw());
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(onResize).observe(scroll);
    } else {
      window.addEventListener("resize", onResize, { passive: true });
    }

    function showDays(data) {
      days = data;
      root.classList.remove("is-loading", "is-error");
      redraw(true);
    }

    function showError() {
      root.classList.remove("is-loading");
      root.classList.add("is-error");

      if (summary) {
        summary.textContent =
          "The graph couldn't load right now. You can see it on GitHub.";
      }
    }

    // Grey placeholder squares while the data loads.
    redraw(true);

    const cached = readContribCache(user);

    if (cached) {
      showDays(cached);
      return;
    }

    fetchContributions(user)
      .then((data) => {
        writeContribCache(user, data);
        showDays(data);
      })
      .catch(showError);
  }

  /* =========================
     INITIALIZATION
  ========================= */

  const features = [
    initContactForm,
    initAnchorFocus,
    initNowStrip,
    initContributions,
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
