/* ==========================================================================
   NL Sites — movimento, cursor e mapa
   Sem dependências. Respeita prefers-reduced-motion.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const body = document.body;
  const site = body.dataset.motion || 'site';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  /* O cursor próprio não é assinatura de todos os projetos.
     Fica só onde o gesto combina com a direção: barbearia editorial
     e os dois estúdios automotivos de acabamento. Nos sites mais calmos,
     o cursor nativo é a escolha certa. */
  const cursorSites = new Set(['artoflife', 'bravus', 'zm']);

  /* Mapa dinâmico — funcional também com movimento reduzido. */

  document.querySelectorAll('[data-map-toggle]').forEach((button) => {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    if (!target) return;

    button.addEventListener('click', () => {
      const iframe = target.querySelector('iframe[data-map-src]');
      if (iframe && !iframe.getAttribute('src')) {
        iframe.setAttribute('src', iframe.dataset.mapSrc);
      }

      const opening = target.hasAttribute('hidden');
      if (opening) {
        target.removeAttribute('hidden');
      } else {
        target.setAttribute('hidden', '');
      }

      button.setAttribute('aria-expanded', opening ? 'true' : 'false');
      const label = button.querySelector('[data-map-label]');
      if (label) {
        label.textContent = opening
          ? button.dataset.labelClose || 'Fechar mapa'
          : button.dataset.labelOpen || 'Ver mapa';
      }

      const panel = button.closest('.visit__panel-map');
      if (panel) panel.classList.toggle('is-live', opening);

      const host = button.closest('[data-map-host]');
      if (host) host.classList.toggle('is-map-open', opening);
    });
  });

  if (reduce.matches) return;

  root.classList.add('has-motion');

  /* Abertura ------------------------------------------------------------- */

  const brandEl = document.querySelector(
    '.brand__name, .brand__text .brand__name, .nav__brandtext, .footer__brand'
  );
  const brand = (brandEl ? brandEl.textContent : 'NL Sites').replace(/\s+/g, ' ').trim();
  const word = site === 'hub' ? 'NL Sites' : (brand || 'NL Sites');

  const intro = document.createElement('div');
  intro.className = 'm-intro';
  intro.setAttribute('aria-hidden', 'true');

  const introWord = document.createElement('span');
  introWord.className = 'm-intro__word';
  introWord.textContent = word;

  const introLine = document.createElement('span');
  introLine.className = 'm-intro__line';
  introLine.setAttribute('aria-hidden', 'true');

  intro.append(introWord, introLine);
  body.appendChild(intro);

  requestAnimationFrame(() => intro.classList.add('is-running'));

  let introClosed = false;
  const closeIntro = () => {
    if (introClosed) return;
    introClosed = true;
    intro.classList.add('is-done');
    window.setTimeout(() => intro.remove(), 1000);
  };

  window.setTimeout(closeIntro, 1150);

  /* Progresso de leitura ------------------------------------------------ */

  const progress = document.createElement('div');
  progress.className = 'm-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.appendChild(progress);

  let progressTick = false;
  const paintProgress = () => {
    const max = root.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    progressTick = false;
  };
  const onScroll = () => {
    if (progressTick) return;
    progressTick = true;
    window.requestAnimationFrame(paintProgress);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  paintProgress();

  /* Cursor -------------------------------------------------------------- */

  if (fine.matches && cursorSites.has(site)) {
    const cursor = document.createElement('div');
    cursor.className = 'm-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const dot = document.createElement('span');
    dot.className = 'm-cursor__dot';

    const ring = document.createElement('span');
    ring.className = 'm-cursor__ring';

    cursor.append(ring, dot);
    body.appendChild(cursor);

    let armed = false;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    const setDot = () => {
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    };

    const loop = () => {
      ringX += (targetX - ringX) * 0.24;
      ringY += (targetY - ringY) * 0.24;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      window.requestAnimationFrame(loop);
    };

    document.addEventListener('pointermove', (event) => {
      if (!armed) {
        armed = true;
        root.classList.add('has-cursor');
      }
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
      setDot();
    }, { passive: true });

    document.addEventListener('pointerover', (event) => {
      const interactive = event.target.closest(
        'a, button, summary, [role="button"], [data-cursor]'
      );
      cursor.classList.toggle('is-link', Boolean(interactive));
    }, { passive: true });

    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

    document.documentElement.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-visible');
    });

    document.documentElement.addEventListener('pointerenter', () => {
      if (Number.isFinite(targetX) && Number.isFinite(targetY)) {
        cursor.classList.add('is-visible');
      }
    });

    document.querySelectorAll('iframe').forEach((frame) => {
      frame.addEventListener('mouseenter', () => cursor.classList.remove('is-visible'));
    });

    loop();
  }

  /* Botões magnéticos --------------------------------------------------- */

  const magnetic = document.querySelectorAll(
    '.btn, .link-arrow, .nav__cta, .visit__panel-cta, .gallery__tile, [data-map-toggle]'
  );

  if (fine.matches) {
    magnetic.forEach((el) => {
      el.classList.add('m-magnetic');

      let rect = el.getBoundingClientRect();

      el.addEventListener('pointerenter', () => {
        rect = el.getBoundingClientRect();
      }, { passive: true });

      el.addEventListener('pointermove', (event) => {
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--m-mag-x', `${(x * 8).toFixed(2)}px`);
        el.style.setProperty('--m-mag-y', `${(y * 6).toFixed(2)}px`);
      }, { passive: true });

      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--m-mag-x', '0px');
        el.style.setProperty('--m-mag-y', '0px');
      });
    });
  }

  /* Tilt 3D + brilho ---------------------------------------------------- */

  const tiltSelectors = {
    eleve: '.gallery__item img, .visit__photo img, .audience__photo img',
    santos: '.manifesto__badge',
    trussardi: '.plate__frame, .doors__stage',
    artoflife: '.hero__frame, .gallery__item img, .services__figure img, .unit-panel__art',
    hub: '.card__media, .card__mobile',
    bravus: '.hero__frame, .service-preview__media, .studio__photo img, .presence__item',
    call: '.hero__frame, .house__photo img, .gallery__item img',
    map: '.hero__frame, .galpao__photo img, .baia__item img',
    dulops: '.hero__frame, .cuidado__photo img, .vehicles__item img',
    mov: '.hero__frame, .a-mov__photo img, .treino-card',
    jolie: '.hero__frame, .first__media, .space__photo img, .modality',
    topsul: '.hero__frame, .unit__photo img, .care__photo img, .service-row',
    zm: '.hero__frame, .gallery__item img, .studio__photo img, .service'
  };

  if (fine.matches) {
    document.querySelectorAll(tiltSelectors[site] || '').forEach((el) => {
      el.classList.add('m-tilt');

      let rect = el.getBoundingClientRect();

      const shineHost = el.tagName === 'IMG' ? el.parentElement : el;
      if (shineHost) {
        if (window.getComputedStyle(shineHost).position === 'static') {
          shineHost.style.position = 'relative';
        }
        const shine = document.createElement('span');
        shine.className = 'm-tilt-shine';
        shine.setAttribute('aria-hidden', 'true');
        shineHost.appendChild(shine);
      }

      el.addEventListener('pointermove', (event) => {
        if (el.closest('.is-live')) return;
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        el.style.setProperty('--m-tilt-x', `${((0.5 - y) * 4).toFixed(2)}deg`);
        el.style.setProperty('--m-tilt-y', `${((x - 0.5) * 5).toFixed(2)}deg`);
        el.style.setProperty('--m-tilt-mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--m-tilt-my', `${(y * 100).toFixed(1)}%`);
        el.classList.add('is-tilting');
      }, { passive: true });

      el.addEventListener('pointerenter', () => {
        rect = el.getBoundingClientRect();
      }, { passive: true });

      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--m-tilt-x', '0deg');
        el.style.setProperty('--m-tilt-y', '0deg');
        el.classList.remove('is-tilting');
      });
    });
  }

  /* Spotlight ----------------------------------------------------------- */

  const spotlightSelectors = {
    eleve: '.hero__photo-wrap, .manifesto__photo, .manifesto__quote, .audience__visual, .visit__photo, .visit__map, .gallery__item',
    santos: '.service, .manifesto__visual, .manifesto__quote, .visit__panel',
    trussardi: '.service, .symptoms__note, .plate, .doors, .oficina__plate',
    artoflife: '.gallery__item, .services__figure, .combo, .unit-panel',
    hub: '.card',
    bravus: '.service-row, .studio__note, .contact__panel, .presence__item',
    call: '.service-card, .house__quote, .prosthesis__item, .visit__panel',
    map: '.service-row, .galpao__note, .contact__panel',
    dulops: '.service, .cuidado__note, .contact__panel, .vehicles__copy',
    mov: '.treino-card, .contact__panel, .tab-panel',
    jolie: '.modality, .space__copy, .contact__panel, .first__media',
    topsul: '.service-row, .unit__card, .care__note, .contact__panel',
    zm: '.service, .studio__note, .contact__panel, .process__step'
  };

  if (fine.matches) {
    document.querySelectorAll(spotlightSelectors[site] || '').forEach((el) => {
      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.classList.add('m-spot-host');

      const spot = document.createElement('span');
      spot.className = 'm-spot';
      spot.setAttribute('aria-hidden', 'true');
      el.appendChild(spot);

      let rect = el.getBoundingClientRect();

      el.addEventListener('pointerenter', () => {
        rect = el.getBoundingClientRect();
      }, { passive: true });

      el.addEventListener('pointermove', (event) => {
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        el.style.setProperty('--m-spot-x', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--m-spot-y', `${(y * 100).toFixed(1)}%`);
      }, { passive: true });
    });
  }

})();
