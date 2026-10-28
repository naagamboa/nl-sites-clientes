(() => {
  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
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
      if (!isOpen) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
        menuBtn.focus();
      }
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

  const rows = Array.from(document.querySelectorAll('[data-service]'));
  const previewImage = document.querySelector('[data-service-img]');
  const previewCode = document.querySelector('[data-service-code]');
  const previewName = document.querySelector('[data-service-name]');
  const previewCta = document.querySelector('.service-preview .link-arrow');

  const setService = (row) => {
    if (!row) return;
    rows.forEach((item) => item.classList.toggle('is-active', item === row));
    const image = row.dataset.img;
    const name = row.querySelector('.service-row__name')?.textContent.trim() || '';
    const code = row.dataset.code || '';

    if (previewImage && image) previewImage.src = image;
    if (previewCode) previewCode.textContent = code;
    if (previewName) previewName.textContent = name;
    if (previewCta) {
      previewCta.href = `https://wa.me/5551985397992?text=${encodeURIComponent(`Olá! Quero um orçamento de ${name} na Bravus.`)}`;
    }
  };

  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => setService(row));
    row.addEventListener('focus', () => setService(row));
    row.addEventListener('click', () => {
      setService(row);
      if (window.matchMedia('(max-width: 820px)').matches) {
        const name = row.querySelector('.service-row__name')?.textContent.trim() || '';
        window.open(`https://wa.me/5551985397992?text=${encodeURIComponent(`Olá! Quero um orçamento de ${name} na Bravus.`)}`, '_blank', 'noopener');
      }
    });
  });
})();
