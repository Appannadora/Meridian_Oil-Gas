
(() => {
  "use strict";

  /* =====================================
     HEADER, SCROLL PROGRESS & MOBILE NAV
  ===================================== */

  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const navToggle = document.getElementById("navToggle");
  const mobile = document.getElementById("mobileNav");

  const wellPipe = document.getElementById("wellPipe");
  const depthLabel = document.getElementById("depthLabel");
  const oilSplash = document.getElementById("oilSplash");

  // Update header, progress bar and oil animation
  function updateScroll() {
    const y = window.scrollY || window.pageYOffset || 0;

    // Header scroll effect
    header?.classList.toggle("scrolled", y > 35);

    // Scroll progress
    const max =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollProgress = max > 0
      ? Math.min(Math.max((y / max) * 100, 0), 100)
      : 0;

    if (progress) {
      progress.style.width = scrollProgress + "%";
    }

    // Oil well scroll animation
    if (wellPipe && depthLabel) {
      const scrollAmount = max > 0
        ? Math.min(Math.max(y / max, 0), 1)
        : 0;

      const maxPipeHeight = 280;
      const pipeHeight = Math.round(
        scrollAmount * maxPipeHeight
      );

      const depthFt = Math.round(
        scrollAmount * 5000
      );

      wellPipe.style.height = pipeHeight + "px";

      depthLabel.textContent =
        depthFt.toLocaleString() + " FT";

      // Oil splash effect
      if (oilSplash) {
        if (scrollAmount > 0.02) {
          oilSplash.classList.add("active");
        } else {
          oilSplash.classList.remove("active");
        }
      }
    }
  }

  updateScroll();

  window.addEventListener("scroll", updateScroll, {
    passive: true
  });

  window.addEventListener("resize", updateScroll);


  /* =====================================
     MOBILE NAVIGATION
  ===================================== */

  if (navToggle && mobile) {

    function closeMobileNav() {
      mobile.classList.remove("open");

      navToggle.setAttribute("aria-expanded", "false");

      navToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    }

    function openMobileNav() {
      mobile.classList.add("open");

      navToggle.setAttribute("aria-expanded", "true");

      navToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
      );
    }

    // Hamburger button
    navToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded =
        navToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Mobile navigation links
    mobile.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        // Close menu and allow browser navigation
        closeMobileNav();

        // Do not use preventDefault here.
      });

    });

    // Close menu when clicking outside header
    document.addEventListener("click", function (event) {

      if (
        header &&
        !header.contains(event.target) &&
        mobile.classList.contains("open")
      ) {
        closeMobileNav();
      }

    });

    // Close menu with Escape key
    document.addEventListener("keydown", function (e) {

      if (
        e.key === "Escape" &&
        mobile.classList.contains("open")
      ) {
        closeMobileNav();
      }

    });

    // Close menu when switching to desktop
    window.addEventListener("resize", function () {

      if (window.innerWidth > 1050) {
        closeMobileNav();
      }

    });

  }


  /* =====================================
     REVEAL ANIMATIONS
  ===================================== */

  if ("IntersectionObserver" in window) {

    const ob = new IntersectionObserver(
      (entries) => {

        entries.forEach((e) => {

          if (e.isIntersecting) {

            e.target.classList.add("revealed");

            ob.unobserve(e.target);

          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 20px 0px"
      }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      ob.observe(el);
    });

  } else {

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("revealed");
    });

  }


  /* =====================================
     PROCESS TABS
  ===================================== */

  const steps = {

    eval: {
      symbol: "◎",
      overline: "SUBSURFACE FOUNDATION",
      title: "Evaluate & plan.",
      description:
        "Review geological data, offset-well history, proposed well locations, drilling objectives and commercial considerations before committing to field work.",
      footer: "GEOLOGY · ENGINEERING · SCOPE"
    },

    prepare: {
      symbol: "⌁",
      overline: "SITE & REGULATORY READINESS",
      title: "Prepare & permit.",
      description:
        "Secure the required access and approvals, prepare the drilling location, coordinate utilities, review field conditions and confirm contractor readiness.",
      footer: "LAND · ACCESS · PERMITS · EQUIPMENT"
    },

    drill: {
      symbol: "⌑",
      overline: "WELL CONSTRUCTION",
      title: "Drill & complete.",
      description:
        "Drill, log and evaluate the subsurface objectives. When supported by test results and engineering, prepare the well for potential production.",
      footer: "DRILLING · EVALUATION · COMPLETION"
    },

    operate: {
      symbol: "↗",
      overline: "COMMERCIAL READINESS",
      title: "Test & operate.",
      description:
        "Commission equipment and facilities, test fluid handling and production systems, complete required authorizations and monitor actual operating results.",
      footer: "TESTING · COMMISSIONING · MONITORING"
    }

  };

  const tabs = Array.from(
    document.querySelectorAll(".process-tab")
  );

  tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const st = steps[tab.dataset.step];

      if (!st) return;

      tabs.forEach((t) => {

        const is = t === tab;

        t.classList.toggle("selected", is);

        t.setAttribute("aria-selected", String(is));

        t.setAttribute("tabindex", is ? "0" : "-1");

      });

      const detail = document.getElementById("process-detail");

      detail?.setAttribute("aria-labelledby", tab.id);

      const elements = [
        ["stepSymbol", "symbol"],
        ["stepOverline", "overline"],
        ["stepTitle", "title"],
        ["stepDescription", "description"],
        ["stepFooter", "footer"]
      ];

      elements.forEach(([id, key]) => {

        const el = document.getElementById(id);

        if (el) {
          el.textContent = st[key];
        }

      });

    });

  });


  /* =====================================
     ARTICLE SEARCH & FILTER
  ===================================== */

  const search = document.getElementById("articleSearch");

  const filters = [
    ...document.querySelectorAll(".filter-chip")
  ];

  const articles = [
    ...document.querySelectorAll(".article-entry")
  ];

  const empty = document.getElementById("articleEmpty");

  let category = "all";

  function filterArticles() {

    const q = (search?.value || "")
      .trim()
      .toLowerCase();

    let count = 0;

    articles.forEach((a) => {

      const visible =
        (category === "all" ||
          a.dataset.category === category) &&
        (
          !q ||
          (a.dataset.search || "").toLowerCase().includes(q) ||
          a.textContent.toLowerCase().includes(q)
        );

      a.hidden = !visible;

      if (visible) {
        count++;
      }

    });

    if (empty) {
      empty.hidden = count > 0;
    }

  }

  filters.forEach((b) => {

    b.addEventListener("click", () => {

      category = b.dataset.filter;

      filters.forEach((x) => {

        const active = x === b;

        x.classList.toggle("active", active);

        x.setAttribute("aria-pressed", String(active));

      });

      filterArticles();

    });

  });

  search?.addEventListener("input", filterArticles);


  /* =====================================
     ARTICLE EXPAND / COLLAPSE
  ===================================== */

  articles
    .filter((a) => !a.classList.contains("article-tile"))
    .forEach((a) => {

      const h = a.querySelector("h2");

      h?.setAttribute("role", "button");

      h?.setAttribute("tabindex", "0");

      h?.setAttribute(
        "aria-expanded",
        String(a.classList.contains("expanded"))
      );

      function toggle() {

        const open = a.classList.toggle("expanded");

        h?.setAttribute("aria-expanded", String(open));

      }

      h?.addEventListener("click", toggle);

      h?.addEventListener("keydown", (e) => {

        if (e.key === "Enter" || e.key === " ") {

          e.preventDefault();

          toggle();

        }

      });

    });


  /* =====================================
     EDUCATION PAGE ARTICLE HASH
  ===================================== */

  if (
    location.hash &&
    location.pathname.endsWith("education.html")
  ) {

    const target = document.querySelector(location.hash);

    if (target?.classList.contains("article-entry")) {

      target.classList.add("expanded");

      target
        .querySelector("h2")
        ?.setAttribute("aria-expanded", "true");

    }

  }


  /* =====================================
     NETLIFY DEMO FORM HANDLING
  ===================================== */

  // Prevent users from believing local HTML form
  // submissions are stored without a deployed backend.

  if (location.protocol === "file:") {

    document
      .querySelectorAll('form[data-netlify]')
      .forEach((form) => {

        form.addEventListener("submit", (e) => {

          e.preventDefault();

          const alert = form.querySelector(".demo-alert");

          if (alert) {

            alert.hidden = false;

            alert.setAttribute("role", "status");

          }

        });

      });

  }

})();
/* =========================================
   MOBILE NAV TOGGLE — reliable click handling
   ========================================= */
(function () {
    var header = document.getElementById('siteHeader');
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.getElementById('mobileNav');

    if (!header || !toggle || !mobileNav) return;

    function openNav() {
        mobileNav.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation menu');
    }

    function closeNav() {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    }

    /* Toggle open / close */
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (mobileNav.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    /* Let link clicks navigate normally — just close the menu */
    mobileNav.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (link) {
            /* DO NOT preventDefault — let browser navigate */
            closeNav();
            /* no stopPropagation either, so navigation is not blocked */
        }
    });

    /* Close only when clicking truly outside the header/nav */
    document.addEventListener('click', function (e) {
        if (!mobileNav.classList.contains('open')) return;

        var insideNav = mobileNav.contains(e.target);
        var insideToggle = toggle.contains(e.target);
        var insideHeader = header.contains(e.target);

        if (insideNav || insideToggle || insideHeader) {
            /* click originated inside the menu, toggle, or header → do nothing */
            return;
        }
        closeNav();
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            closeNav();
        }
    });

    /* Close when resizing to desktop */
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1050 && mobileNav.classList.contains('open')) {
            closeNav();
        }
    });
})();

document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
    link.addEventListener('click', function() {
        // 1. Remove active state from ALL links
        document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(l => {
            l.removeAttribute('aria-current');
        });
        
        // 2. Add active state to the clicked link
        this.setAttribute('aria-current', 'page');
    });
});