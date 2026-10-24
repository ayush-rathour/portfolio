/**
 * AR.dev — case-studies.js
 * Case-study overlay for the Projects page.
 *
 * All the writing lives in the CASES array below. To edit a case study,
 * change the text there. Nothing else needs to be touched.
 *
 * How it connects:
 *   - Any element with data-case="<id>" opens that case study.
 *   - The overlay is the <dialog id="case"> in projects.html.
 *   - Each case study is deep-linkable: projects.html#case-fintrack
 *   - Headings use "first part|second part": the second part is shown
 *     in the muted tone, like the headings across the rest of the site.
 */

(() => {
  "use strict";

  /* =========================
     CONTENT
  ========================= */

  const CASES = [
    /* ---------- 01 · FinTrack ---------- */
    {
      id: "fintrack",
      type: "Web app",
      title: "FinTrack",
      tagline: "Privacy-first expense tracker",
      status: "Live · PWA",
      lead: "An expense tracker that runs entirely in your browser. Record your spending, search and filter it instantly, understand it through charts and insights, and keep every byte on your own device.",
      meta: [
        ["Role", "Designer & developer"],
        ["Timeline", "Oct 2024 - present"],
        ["Version", "v17.7"],
        ["Platforms", "Web, PWA, Android APK"],
      ],
      image: {
        src: "../assets/Project_Images/fintrack_img.png",
        alt: "FinTrack dashboard preview",
      },
      links: [
        {
          label: "Open live app",
          href: "https://fintrack-ar.pages.dev/",
        },
        {
          label: "Source on GitHub",
          href: "https://github.com/ayush-rathour/fintrack",
        },
        {
          label: "Download APK",
          href: "../assets/files/fintrack_v17.apk",
          download: true,
        },
      ],
      why: {
        title: "Money apps ask for a lot.|FinTrack asks for nothing.",
        body: [
          "Most expense apps follow the same pattern: create an account, sync to a cloud, put up with ads or upsells. For something as personal as money, that is a lot to hand over just to log a coffee.",
          "FinTrack started from a simpler idea. Tracking your spending should be quick, easy to understand and private. There is no sign-up, no backend and no analytics, and your data never leaves your device unless you choose to export it.",
        ],
        points: [
          "Log an expense in seconds",
          "Search, sort and filter a long history instantly",
          "Charts and insights that explain where the money goes",
          "Works offline and installs like a real app",
        ],
      },
      how: {
        title: "From a quick entry|to a clear picture.",
        intro:
          "FinTrack is a four-tab app (Home, Insights, Charts and Settings). Everything follows one loop: record something, find it, understand it and stay in control of your data.",
        steps: [
          {
            title: "Log it",
            text: "Add an expense with a description, amount, date and one of eight categories. Edit it in place, or delete it and undo within five seconds.",
          },
          {
            title: "Find it",
            text: "Instant search across description, amount, date and category, plus sorting by date or amount and a category filter.",
          },
          {
            title: "See it",
            text: "Chart.js draws a daily spending trend, a category breakdown and an eight-week comparison, for periods from 7 days to all time.",
          },
          {
            title: "Understand it",
            text: "Six insight cards are generated from your own data, from your top category and weekly trend to recurring expenses it detects automatically.",
          },
          {
            title: "Protect it",
            text: "A 4-digit PIN, salted and hashed with SHA-256, locks the app for 30 seconds after three wrong tries and re-locks itself when idle.",
          },
          {
            title: "Take it with you",
            text: "Export PDF reports and JSON, import CSV or JSON, and share a monthly summary. Install it as a PWA or Android APK, and it keeps working offline.",
          },
        ],
      },
      built: {
        title: "Built by hand,|without a framework.",
        body: [
          "I launched FinTrack in October 2024, five months after moving from a phone to a laptop. It is written in plain HTML, CSS and JavaScript with no framework and no build step, so every piece of behaviour is code I wrote myself and can explain.",
          "It has grown through many versions. Version 16 refined the card hierarchy and spacing. Version 17 was a complete redesign, with the four-tab app shell, light and dark themes, PIN security with auto-lock, the insights engine, the weekly comparison chart and CSV/JSON import. It is now at v17.7.",
        ],
        decisions: [
          {
            title: "Everything stays in localStorage",
            text: "The expense ledger, budget, theme and PIN hash all live on the device. With no accounts, backend or sync, privacy comes from how the app is built, not from a promise.",
          },
          {
            title: "No framework",
            text: "Vanilla JavaScript keeps the app small and fast, and taught me how state, rendering and DOM updates really work.",
          },
          {
            title: "Offline-first with a service worker",
            text: "The service worker caches the app shell and libraries, serves them instantly and refreshes them in the background. Cache names are tied to the app version, so old caches are removed on update.",
          },
          {
            title: "Security that is real",
            text: "The PIN is salted and hashed with the browser's Web Crypto API, and the lockout survives a page refresh, so it cannot be bypassed by reloading.",
          },
        ],
        stackLabel: "Built with",
        stack: [
          "HTML5",
          "CSS3",
          "Vanilla JavaScript",
          "Chart.js",
          "jsPDF",
          "Service Worker",
          "localStorage",
          "Web App Manifest",
          "Cloudflare Pages",
          "Git & GitHub",
        ],
      },
      hard: {
        title: "Search and filtering that stays accurate.",
        text: "It began as a simple text box. Making it accurate and dependable on a large history was the hard part. Search had to match description, amount, formatted date and category, work together with sorting and the category filter, and stay fast as the data grew. I debounced the input and used keyed list diffing, so results update without flicker even when the list is long.",
      },
      outcome: {
        body: "FinTrack is the project I am proudest of: a complete app, from design to security to offline support, built without a framework.",
        stats: [
          { value: "v17.7", label: "Current version" },
          { value: "6", label: "Insight cards" },
          { value: "3", label: "Chart types" },
          { value: "SHA-256", label: "PIN hashing" },
        ],
      },
      next: [
        "Income tracking and full balance management",
        "Multiple budgets and savings goals",
        "Multi-currency support",
        "Automatic logging of recurring expenses",
      ],
    },

    /* ---------- 02 · Varun's Artist Portfolio ---------- */
    {
      id: "varun-portfolio",
      type: "Client work",
      title: "Varun's Artist Portfolio",
      tagline: "A shop window for his sketches",
      status: "Paid · Archived",
      lead: "A platform where Varun could showcase his sketch artwork and collect orders. My first paid project, built with Shaurya and launched in seven days.",
      meta: [
        ["Role", "UI/UX & navigation"],
        ["Timeline", "7 days to first launch"],
        ["Delivered", "July 2025"],
        ["Team", "With Shaurya"],
      ],
      image: {
        src: "../assets/Project_Images/varun_ptf.png",
        alt: "Preview of Varun's artist portfolio",
      },
      links: [],
      why: {
        title: "An artist needs a shop window,|not just a gallery.",
        body: [
          "Varun works with sketch art and needed one place to show it and to collect orders. Visitors arrive to look at the work first, so everything else, including ordering, has to feel like a natural next step instead of something in the way.",
          "A page full of artwork is also heavy. It had to load quickly and work comfortably on phones as well as laptops.",
        ],
        points: [
          "The artwork comes first, the interface second",
          "A simple way for visitors to place orders",
          "Many artworks that still load quickly",
          "A comfortable experience on every screen size",
        ],
      },
      how: {
        title: "Design that stays|out of the way.",
        intro:
          "Four ideas shaped the interface and the interaction on the site.",
        steps: [
          {
            title: "Lead with the art",
            text: "Spacing and hierarchy are arranged so the eye lands on the sketches before anything else.",
          },
          {
            title: "Navigate without friction",
            text: "JavaScript-driven navigation moves visitors smoothly between sections, so exploring feels effortless.",
          },
          {
            title: "Load many artworks quickly",
            text: "Speed was treated as part of the design, because a slow gallery would undermine the art itself.",
          },
          {
            title: "Adapt to every screen",
            text: "The layout is responsive, so the artwork keeps its impact from small phones to large displays.",
          },
        ],
      },
      built: {
        title: "My first real|client project.",
        body: [
          "Shaurya built the basic foundation of the site. I worked on the UI/UX enhancement and the JavaScript navigation. Together we delivered the first launch in seven days, working with limited resources and tools.",
          "It was my first paid project: real requirements, a deadline and a client to keep happy. Varun was pleased with the result and gave positive feedback.",
        ],
        decisions: [
          {
            title: "Split the work by strength",
            text: "Shaurya owned the foundation while I owned the UX and navigation, so we could work in parallel within a very short deadline.",
          },
          {
            title: "Subtle, mood-led animation",
            text: "Movement was kept gentle and designed to echo the mood of the artwork, never to compete with it.",
          },
          {
            title: "Speed as a requirement",
            text: "With so many images on the page, load time shaped decisions throughout the build.",
          },
        ],
        stackLabel: "Focus areas",
        stack: [
          "UI/UX design",
          "JavaScript navigation",
          "Responsive design",
          "Animation",
          "Collaboration",
          "Client delivery",
        ],
      },
      hard: {
        title: "Loading all the art quickly.",
        text: "A portfolio of artwork is a lot of images. Getting all of them to load in less time, inside a seven-day schedule and with limited tools, was the hardest part of the project, and the one that most affected how the site felt to use.",
      },
      outcome: {
        body: "The site launched within a week, and the client was happy with it. It has since been archived, so there is no live link, but the preview on the Projects page shows how it looked.",
        stats: [
          { value: "7 days", label: "To first launch" },
          { value: "1st", label: "Paid client project" },
          { value: "Jul 2025", label: "Delivered" },
        ],
      },
      next: [
        "Add a short walkthrough video of the archived site",
        "Ask Varun for a written testimonial",
        "Document the image-loading approach for future projects",
      ],
    },

    /* ---------- 03 · Shaurya's Developer Portfolio ---------- */
    {
      id: "shaurya-portfolio",
      type: "Collaboration",
      title: "Shaurya's Developer Portfolio",
      tagline: "Responsive, refined and smoother",
      status: "Archived",
      lead: "A refinement of an existing developer portfolio: a stronger responsive layout, a better UI/UX and scroll-triggered transitions for a smoother browsing experience.",
      meta: [
        ["Role", "UI/UX & responsiveness"],
        ["Focus", "Responsive layout, transitions"],
        ["Type", "Collaboration"],
        ["Team", "With Shaurya"],
      ],
      image: {
        src: "../assets/Project_Images/shaurya_ptf.png",
        alt: "Preview of Shaurya's developer portfolio",
      },
      links: [],
      why: {
        title: "A portfolio is judged|in the first few seconds.",
        body: [
          "A developer's portfolio is often the first thing a recruiter or client opens, and very often on a phone. If the layout breaks or the interface feels rough, the work behind it gets judged by that first impression.",
          "Shaurya's portfolio already had the content. The two areas that needed the most work were responsiveness and the overall UI/UX.",
        ],
        points: [
          "A layout that holds up on every screen size",
          "A cleaner, more consistent interface",
          "Smoother movement between sections",
          "No rebuild, only careful improvement",
        ],
      },
      how: {
        title: "Refine what is there,|then add flow.",
        intro:
          "The work followed a simple order: fix the foundations, then add movement.",
        steps: [
          {
            title: "Review the interface",
            text: "Go through each section to find where spacing, hierarchy and styling felt inconsistent.",
          },
          {
            title: "Fix responsiveness",
            text: "Rework how the layout behaves across screen sizes, starting with small screens.",
          },
          {
            title: "Add scroll transitions",
            text: "Introduce transitions triggered by scrolling, built with suitable libraries, so content arrives smoothly as the visitor moves down the page.",
          },
          {
            title: "Keep it light",
            text: "Check that the new motion stays subtle and does not get in the way of reading.",
          },
        ],
      },
      built: {
        title: "Collaboration over|reinvention.",
        body: [
          "I worked with Shaurya to refine the portfolio's interface, improve its responsiveness and add scroll-triggered transitions.",
          "Working inside someone else's project taught me to respect existing decisions and to make changes that fit the design instead of overwriting it.",
        ],
        decisions: [
          {
            title: "Polish over rebuild",
            text: "Improving what already worked kept the portfolio recognisably Shaurya's while making it feel more finished.",
          },
          {
            title: "Use libraries where they help",
            text: "For the scroll-triggered transitions I used established libraries instead of reinventing them, which saved time and kept the behaviour reliable.",
          },
          {
            title: "Responsive as a core requirement",
            text: "Responsive behaviour was treated as a main goal of the project, not a final check.",
          },
        ],
        stackLabel: "Focus areas",
        stack: [
          "UI/UX",
          "Responsive design",
          "Scroll transitions",
          "Libraries",
          "Collaboration",
        ],
      },
      hard: {
        title: "Making it responsive.",
        text: "Getting the layout to behave properly across different screen sizes was the hardest part of this project, and the part that most improved the final result.",
      },
      outcome: {
        body: "The portfolio shipped with a stronger responsive layout, a cleaner interface and smoother transitions. The site is now archived, so there is no live link.",
        stats: [
          { value: "Responsive", label: "Main improvement" },
          { value: "UI/UX", label: "Refinement focus" },
          { value: "Archived", label: "No live link" },
        ],
      },
      next: [
        "Write up the responsive fixes as notes for my own projects",
        "Reuse the transition approach in my own portfolio",
      ],
    },

    /* ---------- 04 · Python Utilities ---------- */
    {
      id: "python-utilities",
      type: "Python",
      title: "Python Utilities",
      tagline: "Mini projects for everyday problems",
      status: "CLI tools",
      lead: "A collection of beginner-friendly command-line projects written while learning Python, from a calculator and converters to ATM, ticket-booking and billing systems.",
      meta: [
        ["Role", "Author"],
        ["Started", "June 2024"],
        ["In the repo", "14 programs"],
        ["Language", "Python 3"],
      ],
      image: {
        src: "../assets/Project_Images/python_img.png",
        alt: "Python Utilities collection preview",
      },
      links: [
        {
          label: "View on GitHub",
          href: "https://github.com/ayush-rathour/python-projects",
        },
        {
          label: "Download ZIP",
          href: "../assets/files/python_projects.zip",
          download: true,
        },
      ],
      why: {
        title: "Learn on problems|you can recognise.",
        body: [
          "I started learning Python in June 2024 and wanted practice with problems I could understand straight away. Tip calculators, converters, ATMs and booking systems are all things people use, which makes it easy to tell whether a program does the right thing.",
          "Small console programs are a good way to learn. They use functions, loops, conditionals and user input, and they make you think about the person at the keyboard.",
        ],
        points: [
          "Practice with familiar, real-world problems",
          "Functions, loops, conditions and input in every program",
          "Python's standard library only, with nothing to install",
          "Output written for the person using it",
        ],
      },
      how: {
        title: "Run it,|answer, get the result.",
        intro: "Every program follows the same simple pattern in the terminal.",
        steps: [
          {
            title: "Launch the program",
            text: "Run the script with Python 3 from the command line.",
          },
          {
            title: "Enter your values",
            text: "The program asks for what it needs, such as an amount, a temperature or a booking choice.",
          },
          {
            title: "The logic runs",
            text: "Functions, loops and conditions do the calculation or process the request.",
          },
          {
            title: "Read the result",
            text: "The answer is printed in a clear, readable format, ready to use.",
          },
        ],
      },
      built: {
        title: "From small tools|to small systems.",
        body: [
          "The collection began with simple tools such as a calculator, converters and a tip calculator. It grew into larger console systems: ATM simulation, car rental, cinema and flight ticket booking, food delivery, restaurant services and mall billing.",
          "Each program is self-contained, uses only Python's standard library, and handles invalid input instead of crashing. The full set is on GitHub and also available as a ZIP download.",
        ],
        decisions: [
          {
            title: "One program, one job",
            text: "Keeping each program focused made the logic easier to understand and improve.",
          },
          {
            title: "Standard library only",
            text: "No dependencies means anyone with Python 3 can download a program and run it immediately.",
          },
          {
            title: "Fixed rates in the converter",
            text: "The currency converter uses fixed rates instead of a live service, which keeps it simple and lets it work offline.",
          },
          {
            title: "Handle bad input",
            text: "Programs check what the user enters, so they behave like tools rather than fragile scripts.",
          },
        ],
        stackLabel: "Built with",
        stack: ["Python 3", "Standard library", "CLI", "Git & GitHub"],
      },
      hard: {
        title: "Making a script feel like a tool.",
        text: "A calculator is easy to make work once. The harder part is making it behave sensibly with unexpected input and present results clearly, and keeping that discipline as the programs grew from simple tools into larger systems.",
      },
      outcome: {
        body: "The collection gave me a solid foundation in Python logic and a habit of finishing small programs properly before moving on to bigger ones.",
        stats: [
          { value: "14", label: "Programs in the repo" },
          { value: "Python 3", label: "Language" },
          { value: "0", label: "Dependencies" },
        ],
      },
      next: [
        "Add automated tests for each program",
        "Package the best tools so they install as a single command",
        "Turn a favourite program into a small web version",
      ],
    },

    /* ---------- 05 · C Projects ---------- */
    {
      id: "c-projects",
      type: "C programming",
      title: "C Projects",
      tagline: "Fundamentals, written from scratch",
      status: "Foundations",
      lead: "A growing collection of console programs written while learning C: an airline ticket booking system, an ATM banking system and a movie ticket booking system.",
      meta: [
        ["Role", "Author"],
        ["Started", "August 2026"],
        ["In the repo", "3 programs so far"],
        ["Tools", "VS Code, MinGW"],
      ],
      image: {
        src: "../assets/Project_Images/c_programming_img.png",
        alt: "C Projects collection preview",
      },
      links: [
        {
          label: "View on GitHub",
          href: "https://github.com/ayush-rathour/c-projects",
        },
        {
          label: "Download ZIP",
          href: "../assets/files/c_projects.zip",
          download: true,
        },
      ],
      why: {
        title: "Frameworks hide a lot.|C hides almost nothing.",
        body: [
          "Most of my earlier work sits on top of tools that handle memory and structure for me. In August 2026, alongside my first year of Computer Science and Engineering, I went back to C to understand what is happening underneath.",
          "C makes you deal with logic and, later, memory directly. Learning it deliberately is an investment in every other language I will use.",
        ],
        points: [
          "A solid grasp of programming logic",
          "Confidence with variables, conditions, loops and functions",
          "A smooth write, compile, run and fix routine",
          "A base for pointers, memory and data structures next",
        ],
      },
      how: {
        title: "Write it, compile it,|run it.",
        intro:
          "Each program is a console application, built with the same simple workflow.",
        steps: [
          {
            title: "Write it",
            text: "Code the program in VS Code, using variables, conditionals, loops, functions and user input.",
          },
          {
            title: "Compile it",
            text: "Build it with the MinGW compiler and fix whatever the compiler reports.",
          },
          {
            title: "Run it",
            text: "Run the program in the terminal and try the cases a real user might try.",
          },
          {
            title: "Refine it",
            text: "Tidy the logic and the output, then commit the result to GitHub.",
          },
          {
            title: "Up next: pointers and memory",
            text: "Pointers, memory management and core data structures are where the collection goes next.",
          },
        ],
      },
      built: {
        title: "Fundamentals|before frameworks.",
        body: [
          "These programs are the practice stage of learning C: small console systems that apply the basics. I started in August 2026, and the code lives on GitHub, which also builds my version-control habits.",
          "Using realistic scenarios such as booking and banking gives each program a clear reason to exist and makes logic mistakes easy to spot.",
        ],
        decisions: [
          {
            title: "Real-world scenarios",
            text: "Airline, ATM and movie booking systems turn abstract exercises into programs with clear expected behaviour.",
          },
          {
            title: "Standard C only",
            text: "Using the standard C libraries keeps the focus on the language itself.",
          },
          {
            title: "Public from the start",
            text: "Committing to GitHub as I go gives my C practice a real history.",
          },
        ],
        stackLabel: "Built with",
        stack: ["C", "MinGW", "VS Code", "Git & GitHub"],
      },
      hard: {
        title: "The hard part is still ahead.",
        text: "At this level the programs feel comfortable. The genuine challenge begins with pointers and memory management, which I am learning now and which will shape the next programs in the collection.",
      },
      outcome: {
        body: "This is a young collection and an honest start. It already shows the habit I care about most: going back to fundamentals on purpose.",
        stats: [
          { value: "3", label: "Programs so far" },
          { value: "Aug 2026", label: "Started" },
          { value: "C", label: "Language" },
        ],
      },
      next: [
        "Learn pointers and memory management",
        "Build core data structures from scratch",
        "Keep adding programs as the concepts grow",
      ],
    },
  ];

  /* =========================
     SETUP
  ========================= */

  const dialog = document.getElementById("case");
  const triggers = Array.from(document.querySelectorAll("[data-case]"));

  if (!dialog || !triggers.length) return;

  // Without <dialog> support the buttons would do nothing, so remove them.
  if (typeof dialog.showModal !== "function") {
    triggers.forEach((button) => button.remove());
    return;
  }

  const article = document.getElementById("case-content");
  const scroller = document.getElementById("case-scroll");
  const countEl = document.getElementById("case-count");
  const progressEl = document.getElementById("case-progress-bar");
  const prevBtn = document.getElementById("case-prev");
  const nextBtn = document.getElementById("case-next");
  const closeBtn = document.getElementById("case-close");

  if (!article || !scroller) return;

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = (n) => String(n).padStart(2, "0");

  const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  const ICON_ARROW =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10" /> <path d="M7 17 17 7" /></svg>';

  const ICON_DOWNLOAD =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /> <path d="m7 10 5 5 5-5" /></svg>';

  const ICON_NEXT =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></svg>';

  // The five reading sections, in order.
  const SECTIONS = [
    ["why", "Why it exists"],
    ["how", "How it works"],
    ["built", "How it was built"],
    ["hard", "The hardest part"],
    ["outcome", "Outcome"],
  ];

  let current = -1;
  let lastTrigger = null;

  /* =========================
     RENDERING
  ========================= */

  // "Main part|muted part" -> main part <span>muted part</span>
  function heading(text) {
    const [main, rest] = text.split("|");

    return rest ? `${esc(main)} <span>${esc(rest)}</span>` : esc(main);
  }

  function sectionHead(index, text) {
    return `
      <p class="eyebrow">${pad(index + 1)} / ${esc(SECTIONS[index][1])}</p>
      <h3>${heading(text)}</h3>`;
  }

  function renderLink(link) {
    const external = /^https?:/.test(link.href);
    const attrs = [
      `href="${esc(link.href)}"`,
      external ? 'target="_blank" rel="noopener noreferrer"' : "",
      link.download ? "download" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `<a class="text-link" ${attrs}>${esc(link.label)}${
      link.download ? ICON_DOWNLOAD : ICON_ARROW
    }</a>`;
  }

  function renderCase(index) {
    const c = CASES[index];
    const next = CASES[(index + 1) % CASES.length];

    return `
      <header class="case-hero">
        <p class="eyebrow">${pad(index + 1)} / ${esc(c.type)}</p>
        <h2 id="case-title">${esc(c.title)}<span>${esc(c.tagline)}</span></h2>
        <p class="case-lead">${esc(c.lead)}</p>
        <p class="case-status">${esc(c.status)}</p>

        <dl class="case-meta">
          ${c.meta
            .map(
              ([label, value]) =>
                `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`,
            )
            .join("")}
        </dl>

        <figure class="case-cover">
          <img src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" width="1200" height="800" />
        </figure>
      </header>

      <nav class="case-jump" aria-label="Case study sections">
        ${SECTIONS.map(
          ([key, label]) =>
            `<button type="button" data-jump="${key}">${esc(label)}</button>`,
        ).join("")}
      </nav>

      <section class="case-section" id="case-sec-why" data-case-section="why">
        ${sectionHead(0, c.why.title)}
        <div class="case-prose">
          ${c.why.body.map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <ul class="case-points">
          ${c.why.points.map((p) => `<li>${esc(p)}</li>`).join("")}
        </ul>
      </section>

      <section class="case-section" id="case-sec-how" data-case-section="how">
        ${sectionHead(1, c.how.title)}
        <div class="case-prose"><p>${esc(c.how.intro)}</p></div>
        <ol class="case-steps">
          ${c.how.steps
            .map(
              (step, i) => `
            <li>
              <span class="case-step-n">${pad(i + 1)}</span>
              <h4>${esc(step.title)}</h4>
              <p>${esc(step.text)}</p>
            </li>`,
            )
            .join("")}
        </ol>
      </section>

      <section class="case-section" id="case-sec-built" data-case-section="built">
        ${sectionHead(2, c.built.title)}
        <div class="case-prose">
          ${c.built.body.map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div class="case-decisions">
          ${c.built.decisions
            .map(
              (d) => `
            <article>
              <h4>${esc(d.title)}</h4>
              <p>${esc(d.text)}</p>
            </article>`,
            )
            .join("")}
        </div>
        <div class="case-stack">
          <span class="mono-label">${esc(c.built.stackLabel)}</span>
          <ul>
            ${c.built.stack.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>
      </section>

      <section class="case-section" id="case-sec-hard" data-case-section="hard">
        <div class="case-callout">
          <p class="eyebrow">04 / ${esc(SECTIONS[3][1])}</p>
          <h3>${heading(c.hard.title)}</h3>
          <p>${esc(c.hard.text)}</p>
        </div>
      </section>

      <section class="case-section" id="case-sec-outcome" data-case-section="outcome">
        <p class="eyebrow">05 / ${esc(SECTIONS[4][1])}</p>
        <h3>Where it ended up<span> and what is next.</span></h3>
        <div class="case-prose"><p>${esc(c.outcome.body)}</p></div>
        <ul class="case-stats">
          ${c.outcome.stats
            .map(
              (s) =>
                `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`,
            )
            .join("")}
        </ul>
        <div class="case-next-list">
          <span class="mono-label">WHAT I WOULD DO NEXT</span>
          <ul>
            ${c.next.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>
      </section>

      <footer class="case-foot">
        <div class="case-links">
          ${c.links.map(renderLink).join("")}
        </div>
        <button class="case-next" type="button" data-case-next>
          <span>Next: ${esc(next.title)}</span>
          ${ICON_NEXT}
        </button>
      </footer>`;
  }

  function show(index) {
    const total = CASES.length;

    current = index;
    article.innerHTML = renderCase(index);

    countEl.textContent = `CASE STUDY · ${pad(index + 1)} / ${pad(total)}`;

    prevBtn.setAttribute(
      "aria-label",
      `Previous case study: ${CASES[(index - 1 + total) % total].title}`,
    );
    nextBtn.setAttribute(
      "aria-label",
      `Next case study: ${CASES[(index + 1) % total].title}`,
    );
  }

  /* =========================
     SCROLL FEEDBACK
     Reading progress line and the active section chip.
  ========================= */

  let ticking = false;

  function updateScroll() {
    ticking = false;

    const max = scroller.scrollHeight - scroller.clientHeight;
    const ratio = max > 0 ? Math.min(1, scroller.scrollTop / max) : 0;

    if (progressEl) progressEl.style.transform = `scaleX(${ratio})`;

    const top = scroller.getBoundingClientRect().top;
    let active = null;

    article.querySelectorAll("[data-case-section]").forEach((section) => {
      if (section.getBoundingClientRect().top - top <= 140) {
        active = section.dataset.caseSection;
      }
    });

    article.querySelectorAll("[data-jump]").forEach((chip) => {
      const on = chip.dataset.jump === active;

      chip.classList.toggle("is-active", on);

      if (on) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  }

  scroller.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateScroll);
    },
    { passive: true },
  );

  /* =========================
     OPEN / CLOSE / NAVIGATE
  ========================= */

  function setHash(id) {
    try {
      window.history.replaceState(null, "", `#case-${id}`);
    } catch {
      // History can be unavailable in sandboxed contexts. The overlay still works.
    }
  }

  function clearHash() {
    try {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } catch {
      // See setHash.
    }
  }

  function open(id, trigger) {
    const index = CASES.findIndex((item) => item.id === id);

    if (index < 0) return;

    if (trigger) lastTrigger = trigger;

    show(index);

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add("case-open");
    }

    scroller.scrollTop = 0;
    scroller.focus({ preventScroll: true });

    setHash(id);
    updateScroll();
  }

  function step(direction) {
    const total = CASES.length;
    const index = (current + direction + total) % total;

    show(index);

    scroller.scrollTop = 0;
    scroller.focus({ preventScroll: true });

    setHash(CASES[index].id);
    updateScroll();
  }

  triggers.forEach((button) => {
    button.addEventListener("click", () => open(button.dataset.case, button));
  });

  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  closeBtn.addEventListener("click", () => dialog.close());

  // One handler for everything rendered inside the case study.
  article.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const chip = target.closest("[data-jump]");

    if (chip) {
      const section = article.querySelector(
        `[data-case-section="${chip.dataset.jump}"]`,
      );

      if (section) {
        section.scrollIntoView({
          behavior: reducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      }

      return;
    }

    if (target.closest("[data-case-next]")) step(1);
  });

  // A click on the dark backdrop closes the overlay.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
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

  // Fires for the close button, Esc and backdrop clicks alike.
  dialog.addEventListener("close", () => {
    document.body.classList.remove("case-open");
    clearHash();

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  });

  /* =========================
     DEEP LINKS  (projects.html#case-fintrack)
  ========================= */

  function syncFromHash() {
    const match = window.location.hash.match(/^#case-(.+)$/);

    if (match) {
      open(decodeURIComponent(match[1]));
    } else if (dialog.open) {
      dialog.close();
    }
  }

  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();
})();
