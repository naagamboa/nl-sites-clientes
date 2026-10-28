(() => {
  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const waFloat = document.querySelector('.wa-float');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocus = null;

  /* Navegação: fundo após rolagem ------------------------------------------ */
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 36);
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
      document.body.classList.add('is-locked');
      const firstLink = mobileMenu.querySelector('a, button');
      if (firstLink) window.setTimeout(() => firstLink.focus(), 60);
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

  /* Comparador antes / depois --------------------------------------------- */
  const carStage = document.querySelector('[data-car] .car__stage');
  const carRange = document.querySelector('[data-car-range]');
  const clipRect = document.getElementById('afterClipRect');
  const splitLine = document.getElementById('splitLine');

  if (carStage && carRange && clipRect && splitLine) {
    const updateCar = (value) => {
      const x = Math.max(0, Math.min(1000, Number(value) * 10));
      clipRect.setAttribute('x', x);
      clipRect.setAttribute('width', 1000 - x);
      splitLine.setAttribute('x1', x);
      splitLine.setAttribute('x2', x);
      carStage.style.setProperty('--split', x / 10 + '%');
    };

    carRange.addEventListener('input', (event) => updateCar(event.target.value));
    updateCar(carRange.value);
  }
})();
