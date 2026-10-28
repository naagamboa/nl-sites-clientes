(() => {
  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuBtn && mobileMenu) {
    const closeMenu = () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('is-locked', !isOpen);
      if (!isOpen) mobileMenu.querySelector('a')?.focus();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !mobileMenu.classList.contains('is-open')) return;
      closeMenu();
      menuBtn.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  const buttons = Array.from(document.querySelectorAll('[data-vehicle]'));
  const image = document.querySelector('[data-vehicle-image]');
  const label = document.querySelector('[data-vehicle-label]');

  if (buttons.length && image) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        const src = button.dataset.image;
        const title = button.dataset.label || 'Veículo';
        image.style.opacity = '0.2';
        const preload = new Image();
        preload.onload = () => {
          image.src = src;
          image.alt = `${title} finalizado na Du Lops Estética Automotiva`;
          if (label) label.textContent = `${title} · acabamento`;
          image.style.opacity = '1';
        };
        preload.src = src;
      });
    });
  }
})();
