(() => {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  /* ---------- Menu category tabs ---------- */
  const tabs = Array.from(document.querySelectorAll('.menu-tab'));
  const panels = Array.from(document.querySelectorAll('.menu-panel'));

  function activateTab(tab) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.id === tab.dataset.target;
      panel.classList.toggle('is-active', active);
      panel.toggleAttribute('hidden', !active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;
      if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
      if (targetIndex !== null) {
        event.preventDefault();
        tabs[targetIndex].focus();
        activateTab(tabs[targetIndex]);
      }
    });
  });

  /* ---------- Scroll-spy on main nav ---------- */
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Reveal-on-scroll (staggered) ---------- */
  const revealGroups = document.querySelectorAll(
    '.menu-grid, .offres-grid, .galerie-grid, .sauces-grid, .concept-stats'
  );
  const MAX_STAGGER_STEPS = 6;
  const STAGGER_STEP_MS = 60;

  if ('IntersectionObserver' in window && revealGroups.length) {
    revealGroups.forEach((group) => {
      Array.from(group.children).forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP_MS}ms`;
      });
    });
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealGroups.forEach((group) => {
      Array.from(group.children).forEach((el) => reveal.observe(el));
    });
  }

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && statNumbers.length) {
    const animateCount = (el) => {
      const text = el.textContent.trim();
      const target = parseInt(text, 10);
      const suffix = text.replace(/[0-9]/g, '');
      if (Number.isNaN(target) || prefersReducedMotion) return;

      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    const counter = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNumbers.forEach((el) => counter.observe(el));
  }

  /* ---------- Floating CTA visibility ---------- */
  const floatingCta = document.querySelector('.floating-cta');
  const hero = document.getElementById('accueil');

  if (floatingCta && hero && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          floatingCta.classList.toggle('is-visible', !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(hero);
  }
})();
