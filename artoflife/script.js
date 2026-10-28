(() => {
  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const waFloat = document.querySelector('.wa-float');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocus = null;

  /* Navegação: fundo após rolagem ------------------------------------------ */
  const onScroll = () => {
    const menuOpen = mobileMenu && mobileMenu.classList.contains('is-open');
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 36 || menuOpen);
    if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > 520);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile ------------------------------------------------------------ */
  const closeMenu = () => {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (nav) nav.classList.remove('is-menu');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
        return;
      }
      lastFocus = document.activeElement;
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      if (nav) nav.classList.add('is-menu');
      document.body.classList.add('is-locked');
      const firstLink = mobileMenu.querySelector('a, button');
      if (firstLink) window.setTimeout(() => firstLink.focus(), 80);
      onScroll();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }

      if (event.key !== 'Tab' || !mobileMenu.classList.contains('is-open')) return;
      const focusables = mobileMenu.querySelectorAll('a, button');
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
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* Revelação ao rolar ----------------------------------------------------- */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  /* Unidades: abas --------------------------------------------------------- */
  const tabs = Array.from(document.querySelectorAll('[data-unit-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-unit-panel]'));

  if (tabs.length && panels.length) {
    const activateTab = (tab, moveFocus = false) => {
      const panelId = tab.getAttribute('aria-controls');

      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        item.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden = panel.id !== panelId;
      });

      if (moveFocus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));

      tab.addEventListener('keydown', (event) => {
        let nextIndex;

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        if (typeof nextIndex !== 'undefined') {
          event.preventDefault();
          activateTab(tabs[nextIndex], true);
        }
      });
    });
  }

  /* Ano automático no rodapé ---------------------------------------------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
