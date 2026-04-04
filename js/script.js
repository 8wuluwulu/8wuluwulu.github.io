/* ============================================
   EGOR PORTFOLIO — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initActiveNavHighlight();
});

/* ============================================
   STICKY HEADER — shrink on scroll
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
   MOBILE NAVIGATION
   ============================================ */
function initMobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   SCROLL REVEAL — IntersectionObserver
   Sequential fade-in for project cards
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
          // Stagger delay: each card appears 120ms after the previous
          setTimeout(() => {
            card.classList.add('revealed');
          }, index * 120);
          cardObserver.unobserve(card);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
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
      threshold: 0.2,
    }
  );

  skillTags.forEach((tag, i) => {
    tag.dataset.index = i;
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(16px)';
    tag.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
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
      threshold: 0.3,
    }
  );

  sectionHeaders.forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(24px)';
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

      const headerOffset = 80;
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
   ACTIVE NAV HIGHLIGHT — based on scroll pos
   ============================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}
