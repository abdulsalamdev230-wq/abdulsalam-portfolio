/* ================================================================
   ABDUL SALAM — PORTFOLIO SCRIPT
   Dependency-free: navigation, theme, reveal-on-scroll, contact form.
================================================================ */

/* ==========================================================
   SITE CONFIG — yahan apne real links daalein.
   Sirf ye block edit karein, baqi code ko chherne ki zaroorat nahi.
========================================================== */
const SITE_CONFIG = {
  // Social profiles: HTML me href pehle se set hain.
  // Yahan value dene se wo override ho jati hai (khali chhorein to HTML wala link chalta rahega).
  socials: {
    github: '',
    whatsapp: '',
    email: '',
  },

  // Project cards: data-project="p1" ... "p5" ke links override karne ke liye.
  // Khali ya '#' chhorein to HTML ka link use hoga.
  projects: {
    p1: { live: '', github: '' },
    p2: { live: '', github: '' },
    p3: { live: '', github: '' },
    p4: { live: '', github: '' },
    p5: { live: '', github: '' },
  },

  // Formspree form id: https://formspree.io par free form banayein,
  // id yahan paste karein (e.g. 'xyzabcd'). Khali chhorein to mailto: fallback chalega.
  formspreeId: '',

  // Contact email (mailto fallback isi par jayega)
  contactEmail: 'abdulshooter4303m@email.com',
};

(function () {
  'use strict';

  const isUsable = (value) => typeof value === 'string' && value.trim() !== '' && value.trim() !== '#';

  /* ---------------- Config overrides ---------------- */
  function applyConfig() {
    document.querySelectorAll('[data-project]').forEach((card) => {
      const key = card.getAttribute('data-project');
      const cfg = SITE_CONFIG.projects[key];
      if (!cfg) return;

      card.querySelectorAll('.project-links .btn').forEach((btn) => {
        const isGithub = Boolean(btn.querySelector('.fa-github'));
        const target = isGithub ? cfg.github : cfg.live;

        if (isUsable(target)) {
          btn.href = target.trim();
          btn.target = '_blank';
          btn.rel = 'noopener noreferrer';
        }
      });
    });

    document.querySelectorAll('[data-social]').forEach((link) => {
      const key = link.getAttribute('data-social');
      const target = SITE_CONFIG.socials[key];
      if (isUsable(target)) {
        link.href = target.trim();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }

  /* ---------------- Mobile drawer ---------------- */
  function initNav() {
    const menuBtn = document.getElementById('menu-btn');
    const drawer = document.getElementById('nav-drawer');
    const backdrop = document.getElementById('nav-backdrop');
    const closeBtn = document.getElementById('drawer-close');
    const navbar = document.querySelector('.navbar');

    if (!menuBtn || !drawer || !backdrop) return;

    let open = false;
    let lastFocused = null;

    function openDrawer() {
      if (open) return;
      open = true;
      lastFocused = document.activeElement;

      backdrop.hidden = false;
      // Force a paint so the opening transition runs.
      void backdrop.offsetWidth;

      backdrop.classList.add('is-open');
      drawer.classList.add('is-open');
      drawer.removeAttribute('inert');
      drawer.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');

      // Wait a frame so the drawer is visible (and therefore focusable).
      window.setTimeout(() => {
        const firstLink = drawer.querySelector('.drawer-link');
        if (open && firstLink) firstLink.focus({ preventScroll: true });
      }, 60);
    }

    function closeDrawer(restoreFocus) {
      if (!open) return;
      open = false;

      backdrop.classList.remove('is-open');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');

      window.setTimeout(() => {
        if (!open) backdrop.hidden = true;
      }, 300);

      if (restoreFocus !== false) {
        (lastFocused || menuBtn).focus({ preventScroll: true });
      }
    }

    menuBtn.addEventListener('click', () => (open ? closeDrawer() : openDrawer()));
    if (closeBtn) closeBtn.addEventListener('click', () => closeDrawer());
    backdrop.addEventListener('click', () => closeDrawer());

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeDrawer(false));
    });

    document.addEventListener('keydown', (event) => {
      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }

      // Simple focus containment inside the drawer.
      if (event.key === 'Tab') {
        const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900 && open) closeDrawer(false);
    });

    // Header shadow once the page is scrolled.
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------------- Theme ---------------- */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const meta = document.querySelector('meta[name="theme-color"]');
    const stored = (() => {
      try {
        return localStorage.getItem('theme');
      } catch (error) {
        return null;
      }
    })();

    function apply(theme) {
      const isDark = theme !== 'light';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

      if (toggle) {
        toggle.setAttribute('aria-pressed', String(!isDark));
        toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        const icon = toggle.querySelector('i');
        if (icon) icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }

      if (meta) meta.setAttribute('content', isDark ? '#0a0a0c' : '#f6f6f8');

      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (error) {
        /* storage disabled — theme just won't persist */
      }
    }

    apply(stored === 'light' ? 'light' : 'dark');

    if (toggle) {
      toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        apply(isDark ? 'light' : 'dark');
      });
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );

    items.forEach((item) => observer.observe(item));
  }

  /* ---------------- Active nav link ---------------- */
  function initActiveLink() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const links = Array.from(document.querySelectorAll('.nav-link, .drawer-link'));
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const matches = link.getAttribute('href') === '#' + id;
        if (matches) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------- Contact form ---------------- */
  function initForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast-message');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');

    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitHTML = submitBtn ? submitBtn.innerHTML : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let toastTimer;

    function showToast(message, success) {
      if (!toast || !toastText) return;
      toastText.textContent = message;

      if (toastIcon) {
        toastIcon.className = success ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
      }

      toast.classList.toggle('is-success', Boolean(success));
      toast.classList.toggle('is-error', !success);
      toast.classList.add('show');

      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('show'), 5000);
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.innerHTML = loading
        ? '<span>Sending… <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></span>'
        : submitHTML;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in every field before sending.', false);
        return;
      }

      if (!emailPattern.test(email)) {
        showToast('That email address does not look right.', false);
        return;
      }

      setLoading(true);

      if (isUsable(SITE_CONFIG.formspreeId)) {
        fetch('https://formspree.io/f/' + SITE_CONFIG.formspreeId.trim(), {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        })
          .then((response) => {
            if (!response.ok) throw new Error('Request failed');
            showToast('Message sent — I will get back to you soon.', true);
            form.reset();
          })
          .catch(() => {
            showToast('Could not send. Please email ' + SITE_CONFIG.contactEmail + ' directly.', false);
          })
          .then(() => setLoading(false));
        return;
      }

      // Fallback: open the visitor's mail app with everything pre-filled.
      const mailto =
        'mailto:' +
        SITE_CONFIG.contactEmail +
        '?subject=' +
        encodeURIComponent('[' + name + '] ' + subject) +
        '&body=' +
        encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');

      window.location.href = mailto;

      window.setTimeout(() => {
        setLoading(false);
        form.reset();
        showToast('Your email app should be open. If not, email ' + SITE_CONFIG.contactEmail + '.', true);
      }, 1200);
    });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    applyConfig();
    initNav();
    initTheme();
    initReveal();
    initActiveLink();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
