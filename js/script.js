/* ============================================
   EGOR SUKHANOV — PORTFOLIO SCRIPT
   Lightweight: scroll reveal, nav behavior,
   mobile menu, smooth anchors.
   ============================================ */

(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll Reveal ----
  var revealObserver = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  var revealEls = document.querySelectorAll(".reveal");
  for (var i = 0; i < revealEls.length; i++) {
    revealObserver.observe(revealEls[i]);
  }

  // ---- Navbar hide/show on scroll ----
  var navbar = document.getElementById("navbar");
  var lastScroll = 0;
  var ticking = false;

  function handleScroll() {
    var currentScroll = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (navbar) {
          if (currentScroll > 100) {
            navbar.classList.add("is-scrolled");
          } else {
            navbar.classList.remove("is-scrolled");
          }

          if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.classList.add("is-hidden");
          } else {
            navbar.classList.remove("is-hidden");
          }
        }

        lastScroll = currentScroll;
        ticking = false;
      });

      ticking = true;
    }
  }

  if (!prefersReducedMotion) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // ---- Mobile Menu ----
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function toggleMobileMenu() {
    var isOpen = mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-active");
    document.body.style.overflow = isOpen ? "" : "hidden";
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", toggleMobileMenu);
  }

  var mobileLinks = document.querySelectorAll(".mobile-link");
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener("click", function () {
      toggleMobileMenu();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("is-open")) {
      toggleMobileMenu();
    }
  });

  // ---- Smooth anchor scrolling ----
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      }
    });
  }

  // ---- Subtle orb parallax (GPU-only, passive) ----
  if (!prefersReducedMotion) {
    var orbs = document.querySelectorAll(".bg-gradient-orb");
    var orbData = [];

    for (var i = 0; i < orbs.length; i++) {
      orbData.push({ el: orbs[i], speed: (i + 1) * 6 });
    }

    window.addEventListener(
      "mousemove",
      function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        for (var i = 0; i < orbData.length; i++) {
          var d = orbData[i];
          d.el.style.transform = "translate(" + (x * d.speed) + "px, " + (y * d.speed) + "px)";
        }
      },
      { passive: true }
    );
  }
})();