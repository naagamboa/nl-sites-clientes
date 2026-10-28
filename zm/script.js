(() => {
  document.documentElement.classList.add('js');

  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 940px)');
  const desktopQuery = window.matchMedia('(min-width: 941px)');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuBtn && mobileMenu) {
    const closeMenu = (returnFocus) => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (returnFocus) menuBtn.focus();
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
      link.addEventListener('click', () => closeMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (mobileMenu.classList.contains('is-open')) closeMenu(true);
    });

    window.addEventListener('resize', () => {
      if (!mobileQuery.matches && mobileMenu.classList.contains('is-open')) closeMenu(false);
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

  /* Serviços: no desktop, a lista troca a imagem de destaque.
     No mobile, cada linha é um link direto para o WhatsApp. */

  const rows = Array.from(document.querySelectorAll('[data-service]'));
  const previewImage = document.querySelector('[data-service-img]');
  const previewCode = document.querySelector('[data-service-code]');
  const previewName = document.querySelector('[data-service-name]');
  const previewCta = document.querySelector('.service-preview .link-arrow');

  const setService = (row) => {
    if (!row) return;
    rows.forEach((item) => item.classList.toggle('is-active', item === row));
    const image = row.dataset.img;
    const alt = row.dataset.alt || '';
    const name = row.dataset.name || '';
    const code = row.dataset.code || '';

    if (previewImage && image) {
      previewImage.src = image;
      previewImage.alt = alt;
    }
    if (previewCode) previewCode.textContent = code;
    if (previewName) previewName.textContent = name;
    if (previewCta) previewCta.href = row.getAttribute('href') || previewCta.href;
  };

  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => {
      if (desktopQuery.matches) setService(row);
    });
    row.addEventListener('focus', () => {
      if (desktopQuery.matches) setService(row);
    });
    row.addEventListener('click', (event) => {
      if (desktopQuery.matches) {
        event.preventDefault();
        setService(row);
      }
    });
  });

  /* Galeria com lightbox nativo */

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('[data-lightbox-img]') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('[data-lightbox-caption]') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('[data-lightbox-close]') : null;

  if (lightbox && lightboxImg && typeof lightbox.showModal === 'function') {
    document.querySelectorAll('[data-lightbox]').forEach((button) => {
      button.addEventListener('click', () => {
        const source = button.dataset.src;
        const caption = button.dataset.caption || '';
        const innerImage = button.querySelector('img');
        if (!source) return;
        lightboxImg.src = source;
        lightboxImg.alt = innerImage ? innerImage.alt : caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.showModal();
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => lightbox.close());
    }

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }
})();
