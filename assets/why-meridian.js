/* =========================================
   WHY MERIDIAN PAGE — SCRIPT
   ========================================= */

(() => {
  "use strict";

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

  /* =====================================
     HEADER SCROLL & PROGRESS BAR
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
      const pipeHeight = Math.round(scrollAmount * maxPipeHeight);
      const depthFt = Math.round(scrollAmount * 5000);

      wellPipe.style.height = pipeHeight + "px";
      depthLabel.textContent = depthFt.toLocaleString() + " FT";

      if (oilSplash) {
        oilSplash.classList.toggle("active", scrollAmount > 0.02);
      }
    }
  }

  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);

  /* =====================================
     MOBILE NAVIGATION
  ===================================== */

  if (navToggle && mobile) {
    function openMobileNav() {
      mobile.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation menu");
      mobile.setAttribute("aria-hidden", "false");
      if ("inert" in mobile) {
        mobile.inert = false;
      }
    }

    function closeMobileNav() {
      mobile.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
      mobile.setAttribute("aria-hidden", "true");
      if ("inert" in mobile) {
        mobile.inert = true;
      }
    }

    function isMobileNavOpen() {
      return mobile.classList.contains("open");
    }

    if (isMobileNavOpen()) {
      openMobileNav();
    } else {
      closeMobileNav();
    }

    navToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isMobileNavOpen()) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobile.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      closeMobileNav();
    });

    document.addEventListener("click", (event) => {
      if (!isMobileNavOpen()) return;
      const clickedInsideHeader = header && header.contains(event.target);
      if (!clickedInsideHeader) {
        closeMobileNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMobileNavOpen()) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1050) {
        closeMobileNav();
      }
    });
  }

  /* =====================================
     REVEAL ANIMATIONS (optional)
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
      { threshold: 0.08, rootMargin: "0px 0px 20px 0px" }
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
     FINAL REFRESH
  ===================================== */

  window.addEventListener("load", () => {
    updateScroll();
  });
})();