/**
 * PORTFOLIO — MAIN.JS
 *
 * All JavaScript for the site lives here.
 * Zero inline scripts or inline event handlers exist in the HTML.
 *
 * Contents:
 * 1. Theme toggle (dark / light), persisted to localStorage
 * 2. Navbar: scroll shadow + sticky state
 * 3. Mobile nav: hamburger open/close
 * 4. Scroll-reveal: Intersection Observer for .reveal elements
 * 5. Skill bar fill: animated on first scroll into view
 * 6. Hero stat counter: animated number count-up
 * 7. Project filter: show/hide cards by category
 * 8. Contact form: validation + Formspree AJAX submission
 * 9. Footer year: auto-updated
 * 10. Active nav link: highlights current section while scrolling
 */

'use strict';

/* ============================================================
   HELPER — safely query the DOM
============================================================ */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


/* ============================================================
   1. THEME TOGGLE
   Saves preference to localStorage so it persists across visits.
============================================================ */
(function initTheme() {
  const root        = document.documentElement;
  const toggleBtn   = $('#theme-toggle');
  const icon        = toggleBtn ? $('.theme-icon', toggleBtn) : null;

  // On first visit the HTML defaults to dark, so we store that.
  const saved = localStorage.getItem('portfolio-theme');
  const currentTheme = saved || 'dark';

  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀' : '☾';
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }
})();


/* ============================================================
   2. NAVBAR — scroll shadow
============================================================ */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const handler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // Run once immediately in case user refreshes mid-page
})();


/* ============================================================
   3. MOBILE NAV — hamburger toggle
============================================================ */
(function initMobileNav() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Close menu when any nav link is clicked
  $$('a', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
})();


/* ============================================================
   4. SCROLL-REVEAL
   Uses IntersectionObserver to add .visible to .reveal elements
   when they enter the viewport. No library required.
============================================================ */
(function initReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  // If the browser doesn't support IntersectionObserver (very old),
  // just show everything immediately.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.12,     // 12% of the element must be visible
    rootMargin: '0px 0px -40px 0px' // Trigger a little before fully in view
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   5. SKILL BAR FILL
   Reads the data-width attribute and sets the bar width once
   the skill category card becomes visible.
============================================================ */
(function initSkillBars() {
  const bars = $$('.skill-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(bar => {
      bar.style.width = `${bar.dataset.width || 0}%`;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.dataset.width || 0;
        entry.target.style.width = `${targetWidth}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   6. HERO STAT COUNTER
   Counts up from 0 to the data-target value when it enters view.
============================================================ */
(function initStatCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(el => { el.textContent = el.dataset.target || 0; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1200; // ms
      const start  = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ============================================================
   7. PROJECT FILTER
   Filters project cards by the data-category attribute.
   Adding "hidden" hides the card via CSS display:none.
============================================================ */
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Show/hide cards
      cards.forEach(card => {
        const category = card.dataset.category || '';
        const show     = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ============================================================
   8. CONTACT FORM
   Client-side validation first, then AJAX POST to Formspree.
   No page reload, clear user feedback.
============================================================ */
(function initContactForm() {
  const form      = $('#contact-form');
  if (!form) return;

  const statusEl  = $('#form-status');
  const submitBtn = $('#submit-btn');
  const btnText   = submitBtn ? $('.btn-text', submitBtn) : null;
  const btnLoad   = submitBtn ? $('.btn-loading', submitBtn) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Validation ---
    const name    = form.querySelector('#contact-name');
    const email   = form.querySelector('#contact-email');
    const message = form.querySelector('#contact-message');
    let valid     = true;

    clearErrors();

    if (!name.value.trim()) {
      showError('name-error', 'Please enter your name.');
      valid = false;
    }

    if (!email.value.trim()) {
      showError('email-error', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError('email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim()) {
      showError('message-error', 'Please enter a message.');
      valid = false;
    }

    if (!valid) return;

    // --- Submit to Formspree ---
    setLoading(true);

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        setStatus('Message sent — thanks! I\'ll get back to you soon.', 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = (data.errors || []).map(err => err.message).join(', ')
                     || 'Something went wrong. Please try again.';
        setStatus(msg, 'error');
      }
    } catch (_err) {
      setStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    $$('.form-error').forEach(el => { el.textContent = ''; });
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; }
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent  = message;
    statusEl.className    = `form-status ${type}`;
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (btnText) btnText.hidden  = isLoading;
    if (btnLoad) btnLoad.hidden  = !isLoading;
  }

  function isValidEmail(value) {
    // Simple format check — Formspree does the real validation server-side
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
})();


/* ============================================================
   9. FOOTER YEAR
   Auto-updates the copyright year so you never have to.
============================================================ */
(function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================================
   10. ACTIVE NAV LINK
   Highlights the nav link corresponding to the current section
   as the user scrolls down the page.
============================================================ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id   = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
        // The CSS [aria-current="page"] rule handles the visual highlight
      });
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(section => observer.observe(section));
})();
