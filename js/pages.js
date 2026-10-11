/**
 * AR.dev — pages.js
 * Page-level enhancements, loaded after main.js.
 *
 *   1. Contact form (Web3Forms)
 *   2. Scroll reveal
 *   3. In-page anchor focus
 *   4. "Now" strip: latest GitHub commit (home page)
 *
 * Site-wide behaviour (navigation, icons, gallery) lives in main.js.
 * Each feature does nothing when its markup is not on the page, and
 * one failing feature never stops the others.
 */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
     2. SCROLL REVEAL
     Opt in by adding class="reveal" (or "reveal-on-scroll") to any
     element. styles.css hides it until it enters the viewport.
  ========================= */

  const REVEAL_SELECTOR = ".reveal, .reveal-on-scroll";

  function initReveal() {
    const elements = $$(REVEAL_SELECTOR);

    if (!elements.length) return;

    // Without motion or observer support, show everything straight away.
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, current) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          current.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    elements.forEach((element) => {
      // Stagger siblings that reveal together (0, 60, 120, 180, 240ms).
      if (!element.style.getPropertyValue("--reveal-delay")) {
        const siblings = element.parentElement
          ? Array.from(element.parentElement.children).filter((child) =>
              child.matches(REVEAL_SELECTOR),
            )
          : [element];

        const position = Math.min(siblings.indexOf(element), 4);

        element.style.setProperty("--reveal-delay", `${position * 60}ms`);
      }

      observer.observe(element);
    });
  }

  /* =========================
     3. IN-PAGE ANCHOR FOCUS
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
    window.addEventListener("hashchange", () => {
      try {
        focusHashTarget();
      } catch {
        // A malformed hash is ignored.
      }
    });
  }

  /* =========================
     4. NOW STRIP: LATEST GITHUB COMMIT
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
      // Ignored: caching is only an optimisation.
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
     INITIALIZATION
  ========================= */

  const features = [initContactForm, initReveal, initAnchorFocus, initNowStrip];

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
