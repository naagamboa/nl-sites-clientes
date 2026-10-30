(() => {
  const DATA = Array.isArray(window.NL_VENDAS) ? window.NL_VENDAS : [];
  const bySlug = new Map(DATA.map((item) => [item.slug, item]));
  const pad = (value) => String(value).padStart(2, "0");
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const external = (url) => /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";

  const legacyCopy = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
    area.remove();
    return ok;
  };

  const copyText = async (text, button) => {
    const original = button.textContent;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (error) {
      copied = false;
    }
    if (!copied) copied = legacyCopy(text);
    button.textContent = copied ? "Copiado" : "Selecione o texto";
    window.setTimeout(() => { button.textContent = original; }, 1400);
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy-key], [data-copy-open]");
    if (!button) return;
    const slug = button.dataset.slug;
    const data = bySlug.get(slug);
    if (!data) return;
    const text = button.dataset.copyOpen
      ? data.script.open
      : data.script[button.dataset.copyKey];
    if (!text) return;
    copyText(text, button);
  });

  const contactChannels = (data) => {
    const channels = data.channels || [];
    return channels.map((channel) => `
      <a href="${esc(channel.url)}"${external(channel.url)}>${esc(channel.label)}</a>
    `).join("");
  };

  const addressLines = (data) => data.address.map((line) => `<span>${esc(line)}</span>`).join("");

  /* Dashboard ------------------------------------------------------------- */

  const ranking = document.getElementById("ranking");
  if (ranking) {
    const attack = document.getElementById("attackLine");
    if (attack) {
      attack.innerHTML = `<span>Prioridade agora</span>${DATA.slice(0, 4).map((item) => `
        <a href="roteiro.html?slug=${encodeURIComponent(item.slug)}"><b>${pad(item.rank)}</b>${esc(item.name.replace(" Lavagem e Higienização", "").replace(" Estética Automotiva", "").replace(" Barbershop", "").replace(" NeoPilates", ""))}</a>
      `).join("")}`;
    }

    ranking.innerHTML = DATA.map((data) => `
      <article class="rank-card">
        <div class="rank-card__num" aria-hidden="true">${pad(data.rank)}</div>
        <div class="rank-card__body">
          <div class="rank-card__top">
            <h2 class="rank-card__name"><a href="roteiro.html?slug=${encodeURIComponent(data.slug)}">${esc(data.name)}</a></h2>
            <span class="priority${data.rank > 4 ? " priority--soft" : ""}">${esc(data.priority)}</span>
          </div>
          <p class="rank-card__meta">${esc(data.segment)} · ${esc(data.area)}</p>
          <p class="rank-card__why">${esc(data.why)}</p>
          <div class="rank-card__actions">
            <a class="btn btn--accent" href="roteiro.html?slug=${encodeURIComponent(data.slug)}">Abrir roteiro</a>
            <a class="btn btn--ghost" href="${esc(data.site)}" target="_blank" rel="noopener">Ver site</a>
            <button class="btn btn--copy" type="button" data-copy-open="${esc(data.slug)}" data-slug="${esc(data.slug)}">Copiar abertura</button>
          </div>
        </div>
        <aside class="rank-card__contact">
          <strong>Contato</strong>
          <a href="${esc(data.primary.url)}"${external(data.primary.url)}>${esc(data.primary.label)}</a>
          <span>${esc(data.area)}</span>
          <span>${esc(data.hours)}</span>
        </aside>
      </article>
    `).join("");
  }

  /* Guide ----------------------------------------------------------------- */

  const guide = document.getElementById("guide");
  if (guide) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || "";
    const data = bySlug.get(slug);

    if (!data) {
      guide.innerHTML = `
        <div class="empty">
          <p class="eyebrow"><span class="dot"></span> Roteiro não encontrado</p>
          <h1>Esse cliente não está na mesa.</h1>
          <p>Volte para a mesa de vendas e escolha um dos 12 roteiros.</p>
          <p style="margin-top:22px"><a class="btn btn--dark" href="index.html">Voltar para a mesa</a></p>
        </div>
      `;
    } else {
      document.title = `${data.name} — roteiro de venda | NL Sites`;
      const previous = DATA.find((item) => item.rank === data.rank - 1);
      const next = DATA.find((item) => item.rank === data.rank + 1);

      const scriptBlocks = [
        { key: "open", title: "1. Abertura", note: "sem link", cls: "script-block--first" },
        { key: "link", title: "2. Se responder “manda”", note: "link + valor", cls: "script-block--link" },
        { key: "followup", title: "3. Follow-up", note: "2 dias", cls: "" },
        { key: "close", title: "4. Fechamento", note: "10 minutos", cls: "" },
        { key: "price", title: "5. Se perguntar o preço", note: "escopo + garantia", cls: "" }
      ].map((block) => `
        <section class="script-block ${block.cls}">
          <div class="script-block__head">
            <h2>${block.title}<span>${block.note}</span></h2>
            <button class="btn btn--copy copy-btn" type="button" data-copy-key="${block.key}" data-slug="${esc(data.slug)}">Copiar</button>
          </div>
          <p class="script-text">${esc(data.script[block.key])}</p>
        </section>
      `).join("");

      guide.innerHTML = `
        <a class="back" href="index.html">← Voltar para a mesa de vendas</a>
        <header class="guide-head">
          <p class="eyebrow"><span class="dot"></span> Roteiro ${pad(data.rank)} / ${pad(DATA.length)} · ${esc(data.priority)}</p>
          <h1>${esc(data.name)}</h1>
          <p class="guide-head__meta"><span>${esc(data.segment)}</span><span>${esc(data.area)}</span><span>${esc(data.primary.kind)}</span></p>
          <p class="guide-head__why">${esc(data.why)}</p>
          <div class="guide-head__actions">
            <a class="btn btn--dark" href="${esc(data.site)}" target="_blank" rel="noopener">Abrir site</a>
            <button class="btn btn--ghost" type="button" data-copy-open="${esc(data.slug)}" data-slug="${esc(data.slug)}">Copiar abertura</button>
            <a class="btn btn--ghost" href="../" target="_blank" rel="noopener">Abrir hub</a>
          </div>
        </header>

        <div class="guide-grid">
          <div class="guide-main">
            ${scriptBlocks}
            <div class="price-box">
              <div>
                <p class="price-box__label">Projeto de referência</p>
                <strong>${esc(data.price)}</strong>
                <p>${esc(data.priceDetail)}</p>
                ${data.monthly ? `<p class="price-box__monthly">${esc(data.monthly)}</p>` : ""}
              </div>
              <button class="btn btn--accent" type="button" data-copy-key="price" data-slug="${esc(data.slug)}">Copiar resposta</button>
            </div>
            <section class="objection">
              <h2>Objeção mais provável</h2>
              <q>${esc(data.script.objection.q)}</q>
              <p>${esc(data.script.objection.a)}</p>
            </section>
            <section class="discovery">
              <h2>Perguntas de diagnóstico</h2>
              <p>${esc(data.script.discovery)}</p>
            </section>
          </div>

          <aside class="guide-aside">
            <div class="contact-card">
              <p class="contact-card__label">Contato principal · ${esc(data.primary.kind)}</p>
              <a class="contact-card__primary" href="${esc(data.primary.url)}"${external(data.primary.url)}>${esc(data.primary.label)}</a>
              <div class="contact-card__channels">${contactChannels(data)}</div>
              <div class="contact-card__block">
                <span>Endereço</span>
                <p>${addressLines(data)}</p>
              </div>
              <div class="contact-card__block">
                <span>Horário</span>
                <p>${esc(data.hours)}</p>
              </div>
              <a class="btn btn--accent" href="${esc(data.site)}" target="_blank" rel="noopener">Ver a prévia</a>
            </div>
            <p class="tip">A primeira mensagem não tem link. O link só depois do “manda”. Se não responder, um follow-up em 2 dias; depois, 30 dias.</p>
            <p class="tip">Antes de enviar, confira o horário e o endereço. Se algo mudou, corrija aqui e no site.</p>
          </aside>
        </div>

        <nav class="pager" aria-label="Navegação entre roteiros">
          ${previous ? `<a href="roteiro.html?slug=${encodeURIComponent(previous.slug)}"><span>← Anterior · ${pad(previous.rank)}</span>${esc(previous.name)}</a>` : `<span></span>`}
          ${next ? `<a class="pager__next" href="roteiro.html?slug=${encodeURIComponent(next.slug)}"><span>Próximo · ${pad(next.rank)} →</span>${esc(next.name)}</a>` : `<span></span>`}
        </nav>
      `;
    }
  }
})();
