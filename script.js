document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');

  if (!toggle || !links) return;

  const mobileNavigation = window.matchMedia('(max-width: 760px)');
  const closeMenu = () => {
    links.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  const syncNavigation = () => {
    if (mobileNavigation.matches) {
      if (toggle.getAttribute('aria-expanded') !== 'true') links.hidden = true;
    } else {
      links.hidden = false;
      closeMenu();
    }
  };

  syncNavigation();
  mobileNavigation.addEventListener('change', syncNavigation);

  toggle.addEventListener('click', () => {
    if (!mobileNavigation.matches) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    links.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!links.hidden && !links.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });
});
