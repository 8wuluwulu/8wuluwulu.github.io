/* ============================================
   EGOR SUKHANOV — PORTFOLIO SCRIPT
   Lightweight: scroll reveal, nav behavior,
   mobile menu, smooth anchors, project anims.
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

  // ---- Algo Visualizer: real bubble-sort demo ----
  if (!prefersReducedMotion) {
    var algoVisuals = document.querySelectorAll(".algo-visual");
    for (var k = 0; k < algoVisuals.length; k++) {
      startSortLoop(algoVisuals[k]);
    }

    function randomHeight() {
      // heights between 30% and 88%
      return Math.floor(30 + Math.random() * 59);
    }

    function shuffleBars(container) {
      var bars = container.querySelectorAll(".algo-bar");
      var heights = [];
      for (var i = 0; i < bars.length; i++) {
        heights.push(randomHeight());
      }
      // Fisher-Yates shuffle so heights differ from index order
      for (var j = heights.length - 1; j > 0; j--) {
        var idx = Math.floor(Math.random() * (j + 1));
        var tmp = heights[j];
        heights[j] = heights[idx];
        heights[idx] = tmp;
      }
      for (var m = 0; m < bars.length; m++) {
        bars[m].style.height = heights[m] + "%";
      }
      container.classList.remove("sorted");
      container.classList.remove("shuffle");
      container.classList.add("shuffle");
    }

    function sleep(ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    async function startSortLoop(container) {
      shuffleBars(container);
      await sleep(1500);

      var bars = container.querySelectorAll(".algo-bar");
      var heights = [];
      for (var i = 0; i < bars.length; i++) {
        heights.push(parseInt(bars[i].style.height, 10));
      }

      // Bubble sort with per-swap pause and highlight
      for (var pass = 0; pass < heights.length - 1; pass++) {
        for (var i = 0; i < heights.length - 1 - pass; i++) {
          var a = bars[i], b = bars[i + 1];
          // highlight comparing pair
          a.style.background = "linear-gradient(180deg, #ffd27a, #f59e0b)";
          a.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.6)";
          b.style.background = "linear-gradient(180deg, #ffd27a, #f59e0b)";
          b.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.6)";

          await sleep(400);

          if (heights[i] > heights[i + 1]) {
            var swap = heights[i];
            heights[i] = heights[i + 1];
            heights[i + 1] = swap;
            a.style.height = heights[i] + "%";
            b.style.height = heights[i + 1] + "%";
            await sleep(250);
          }

          // reset colors to sorted-done accent
          a.style.background = "linear-gradient(180deg, #a8b8ff, var(--accent))";
          b.style.background = "linear-gradient(180deg, #a8b8ff, var(--accent))";
          a.style.boxShadow = "0 0 10px var(--accent-glow-strong)";
          b.style.boxShadow = "0 0 10px var(--accent-glow-strong)";
        }
      }

      container.classList.add("sorted");
      // clear inline styles so CSS .sorted rule paints bars green
      for (var l = 0; l < bars.length; l++) {
        bars[l].style.background = "";
        bars[l].style.boxShadow = "";
      }

      await sleep(3000);
      startSortLoop(container);
    }
  }

  // ---- Skill tag ripple on hover (accent wave sweep) ----
  // No JS needed — handled via CSS .skill-tags span::before animation.

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