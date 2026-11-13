
(() => {
  "use strict";

  /* =====================================
     GLOBAL SETTINGS & HELPERS
  ===================================== */

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const navToggle = document.getElementById("navToggle");
  const mobile = document.getElementById("mobileNav");

  const wellPipe = document.getElementById("wellPipe");
  const depthLabel = document.getElementById("depthLabel");
  const oilSplash = document.getElementById("oilSplash");

  const desktopLinks = Array.from(
    document.querySelectorAll(".desktop-nav a")
  );

  const mobileLinks = mobile
    ? Array.from(mobile.querySelectorAll("a"))
    : [];

  const allNavLinks = [...desktopLinks, ...mobileLinks];

  function normalizePath(path) {
    let clean = path.split("?")[0].split("#")[0];

    clean = clean.replace(/\/+$/, "");

    if (!clean || clean === "/") {
      return "index.html";
    }

    return clean.split("/").pop().toLowerCase();
  }

  function getLinkTarget(link) {
    try {
      const url = new URL(link.getAttribute("href"), window.location.href);
      return {
        path: normalizePath(url.pathname),
        hash: url.hash
      };
    } catch (error) {
      return null;
    }
  }


  /* =====================================
     HEADER SCROLL & PROGRESS
  ===================================== */

  function updateScroll() {
    const y = window.scrollY || window.pageYOffset || 0;

    if (header) {
      header.classList.toggle("scrolled", y > 35);
    }

    const max =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollProgress = max > 0
      ? Math.min(Math.max((y / max) * 100, 0), 100)
      : 0;

    if (progress) {
      progress.style.width = scrollProgress + "%";
    }

    /* Oil well scroll animation */

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

      if (oilSplash) {
        oilSplash.classList.toggle(
          "active",
          scrollAmount > 0.02
        );
      }
    }
  }

  updateScroll();

  window.addEventListener("scroll", updateScroll, {
    passive: true
  });

  window.addEventListener("resize", updateScroll);


  /* =====================================
     NAVIGATION - ACTIVE PAGE HIGHLIGHT
  ===================================== */

  function setActivePage() {
    const currentPage = normalizePath(window.location.pathname);

    allNavLinks.forEach((link) => {
      const target = getLinkTarget(link);

      if (!target) return;

      const isActive = target.path === currentPage;

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  setActivePage();


  /* =====================================
     NAVIGATION - ACTIVE SECTION HIGHLIGHT
     Works with #about, #projects, #contact etc.
  ===================================== */

  const sectionLinks = allNavLinks.filter((link) => {
    const target = getLinkTarget(link);

    return target &&
      target.path === normalizePath(window.location.pathname) &&
      target.hash &&
      target.hash.length > 1;
  });

  const trackedSections = sectionLinks
    .map((link) => {
      const target = getLinkTarget(link);

      if (!target) return null;

      return document.querySelector(target.hash);
    })
    .filter(Boolean);

  function setActiveSection(id) {
    sectionLinks.forEach((link) => {
      const target = getLinkTarget(link);

      if (!target) return;

      const isActive = target.hash === "#" + id;

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (
    trackedSections.length &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75]
      }
    );

    trackedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =====================================
     MOBILE NAVIGATION - SINGLE HANDLER
  ===================================== */

  if (navToggle && mobile) {

    function openMobileNav() {
      mobile.classList.add("open");

      navToggle.setAttribute("aria-expanded", "true");

      navToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
      );

      mobile.setAttribute("aria-hidden", "false");

      if ("inert" in mobile) {
        mobile.inert = false;
      }
    }

    function closeMobileNav() {
      mobile.classList.remove("open");

      navToggle.setAttribute("aria-expanded", "false");

      navToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      mobile.setAttribute("aria-hidden", "true");

      if ("inert" in mobile) {
        mobile.inert = true;
      }
    }

    function isMobileNavOpen() {
      return mobile.classList.contains("open");
    }

    /* Set initial state */

    if (isMobileNavOpen()) {
      openMobileNav();
    } else {
      closeMobileNav();
    }

    /* Hamburger click */

    navToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isMobileNavOpen()) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    /* Mobile navigation link click */

    mobile.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link) return;

      closeMobileNav();

      // Do not preventDefault.
      // Browser navigation must work normally.
    });

    /* Close when clicking outside */

    document.addEventListener("click", (event) => {
      if (!isMobileNavOpen()) return;

      const clickedInsideHeader =
        header && header.contains(event.target);

      if (!clickedInsideHeader) {
        closeMobileNav();
      }
    });

    /* Escape key */

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        isMobileNavOpen()
      ) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    /* Close when switching to desktop */

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1050) {
        closeMobileNav();
      }
    });
  }


  /* =====================================
     REVEAL ANIMATIONS
  ===================================== */

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 20px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("revealed");
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

      const step = steps[tab.dataset.step];

      if (!step) return;

      tabs.forEach((item) => {
        const isActive = item === tab;

        item.classList.toggle("selected", isActive);

        item.setAttribute(
          "aria-selected",
          String(isActive)
        );

        item.setAttribute(
          "tabindex",
          isActive ? "0" : "-1"
        );
      });

      const detail = document.getElementById("process-detail");

      if (detail && tab.id) {
        detail.setAttribute("aria-labelledby", tab.id);
      }

      const elements = [
        ["stepSymbol", "symbol"],
        ["stepOverline", "overline"],
        ["stepTitle", "title"],
        ["stepDescription", "description"],
        ["stepFooter", "footer"]
      ];

      elements.forEach(([id, key]) => {
        const element = document.getElementById(id);

        if (element) {
          element.textContent = step[key];
        }
      });

    });

  });


  /* =====================================
     ARTICLE SEARCH & FILTER
  ===================================== */

  const search = document.getElementById("articleSearch");

  const filters = Array.from(
    document.querySelectorAll(".filter-chip")
  );

  const articles = Array.from(
    document.querySelectorAll(".article-entry")
  );

  const empty = document.getElementById("articleEmpty");

  let category = "all";

  function filterArticles() {

    const query = (search?.value || "")
      .trim()
      .toLowerCase();

    let count = 0;

    articles.forEach((article) => {

      const articleCategory =
        article.dataset.category || "";

      const searchText = (
        (article.dataset.search || "") +
        " " +
        article.textContent
      ).toLowerCase();

      const matchesCategory =
        category === "all" ||
        articleCategory === category;

      const matchesSearch =
        !query ||
        searchText.includes(query);

      const visible =
        matchesCategory && matchesSearch;

      article.hidden = !visible;

      if (visible) {
        count++;
      }

    });

    if (empty) {
      empty.hidden = count > 0;
    }

  }

  filters.forEach((button) => {

    button.addEventListener("click", () => {

      category = button.dataset.filter || "all";

      filters.forEach((item) => {

        const isActive = item === button;

        item.classList.toggle("active", isActive);

        item.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

      filterArticles();

    });

  });

  search?.addEventListener("input", filterArticles);


  /* =====================================
     ARTICLE EXPAND / COLLAPSE
  ===================================== */

  articles
    .filter((article) => {
      return !article.classList.contains("article-tile");
    })
    .forEach((article) => {

      const heading = article.querySelector("h2");

      if (!heading) return;

      heading.setAttribute("role", "button");
      heading.setAttribute("tabindex", "0");

      heading.setAttribute(
        "aria-expanded",
        String(article.classList.contains("expanded"))
      );

      function toggleArticle() {

        const isOpen = article.classList.toggle("expanded");

        heading.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }

      heading.addEventListener("click", toggleArticle);

      heading.addEventListener("keydown", (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          toggleArticle();
        }

      });

    });


  /* =====================================
     EDUCATION PAGE ARTICLE HASH
  ===================================== */

  function openHashArticle() {

    if (
      !window.location.hash ||
      !normalizePath(window.location.pathname).endsWith("education.html")
    ) {
      return;
    }

    let target;

    try {
      target = document.querySelector(
        window.location.hash
      );
    } catch (error) {
      return;
    }

    if (target?.classList.contains("article-entry")) {

      target.classList.add("expanded");

      target
        .querySelector("h2")
        ?.setAttribute("aria-expanded", "true");

      if (!prefersReducedMotion) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }

    }

  }

  openHashArticle();

  window.addEventListener("hashchange", openHashArticle);


  /* =====================================
     NETLIFY DEMO FORM HANDLING
  ===================================== */

  if (window.location.protocol === "file:") {

    document
      .querySelectorAll('form[data-netlify]')
      .forEach((form) => {

        form.addEventListener("submit", (event) => {

          event.preventDefault();

          const alertElement =
            form.querySelector(".demo-alert");

          if (alertElement) {
            alertElement.hidden = false;

            alertElement.setAttribute(
              "role",
              "status"
            );
          }

        });

      });

  }


  /* =====================================
     FINAL INITIALIZATION
  ===================================== */

  // Make sure the active page is highlighted
  // after all navigation elements are initialized.

  setActivePage();

  // Refresh scroll calculations after page load
  // in case images or fonts change page height.

  window.addEventListener("load", () => {
    updateScroll();
    setActivePage();
  });

})();
