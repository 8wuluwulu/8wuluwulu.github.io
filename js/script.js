/* ============================================
   PORTFOLIO — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initActiveNavHighlight();
});

/* ============================================
   STICKY HEADER — add class on scroll
   ============================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   MOBILE NAVIGATION — Full-screen overlay
   Uses separate .mobile-overlay element.
   Toggles .nav-open on <body>.
   ============================================ */
function initMobileNav() {
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');

  if (!burger || !overlay) return;

  function openMenu() {
    document.body.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
    // Set active link in overlay based on current scroll position
    syncActiveOverlayLink();
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (document.body.classList.contains('nav-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Burger click toggles overlay
  burger.addEventListener('click', toggleMenu);

  // Close button (X) in the overlay
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close when a nav link inside overlay is clicked
  overlay.querySelectorAll('.mobile-overlay__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu();
    }
  });

  // Close if clicking the overlay background itself (not links/buttons)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });
}

/* ============================================
   Sync active link in mobile overlay
   based on which section is currently visible
   ============================================ */
function syncActiveOverlayLink() {
  const sections = document.querySelectorAll('section[id]');
  const overlayLinks = document.querySelectorAll('.mobile-overlay__link');

  if (!sections.length || !overlayLinks.length) return;

  let currentId = '';
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      currentId = section.getAttribute('id');
    }
  });

  overlayLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${currentId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ============================================
   SCROLL REVEAL — IntersectionObserver
   Sequential fade for cards, tags, headers
   ============================================ */
function initScrollReveal() {
  const cards = document.querySelectorAll('.project-card');
  const skillTags = document.querySelectorAll('.skill-tag');
  const sectionHeaders = document.querySelectorAll('.section__header');

  if (!cards.length && !skillTags.length) return;

  // --- Project Cards: sequential stagger ---
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = parseInt(card.dataset.index, 10) || 0;
          setTimeout(() => {
            card.classList.add('revealed');
          }, index * 120);
          cardObserver.unobserve(card);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  cards.forEach((card, i) => {
    card.dataset.index = i;
    cardObserver.observe(card);
  });

  // --- Skill Tags: staggered fade-in ---
  const tagObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tag = entry.target;
          const index = parseInt(tag.dataset.index, 10) || 0;
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, index * 80);
          tagObserver.unobserve(tag);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  skillTags.forEach((tag, i) => {
    tag.dataset.index = i;
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(14px)';
    tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    tagObserver.observe(tag);
  });

  // --- Section headers ---
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          headerObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  sectionHeaders.forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    headerObserver.observe(header);
  });
}

/* ============================================
   SMOOTH SCROLL — for anchor links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (!target) return;

      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================
   ACTIVE NAV HIGHLIGHT — scroll position
   Updates both desktop and mobile nav links
   ============================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop__link');
  const overlayLinks = document.querySelectorAll('.mobile-overlay__link');

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          // Update desktop nav
          desktopLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });

          // Update mobile overlay nav
          overlayLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-76px 0px -50% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}
