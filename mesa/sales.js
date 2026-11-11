(() => {
  const DATA = Array.isArray(window.NL_VENDAS) ? window.NL_VENDAS : [];
  const FIRST_CONTACT = [...(window.NL_LEADS_POA || []), ...(window.NL_PRIMEIRO_CONTATO || [])]
    .sort((a, b) => weightedPotential(b) - weightedPotential(a));
  const bySlug = new Map(DATA.map((item) => [item.slug, item]));
  const firstContactBySlug = new Map(FIRST_CONTACT.map((item) => [item.slug, item]));
  let proposalText = "";
  const contractTexts = new Map();
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
    const button = event.target.closest("[data-copy-key], [data-copy-open], [data-copy-proposal], [data-copy-contract]");
    if (!button) return;
    if (button.hasAttribute("data-copy-contract")) {
      const text = contractTexts.get(button.dataset.copyContract);
      if (text) copyText(text, button);
      return;
    }
    if (button.hasAttribute("data-copy-proposal")) {
      if (proposalText) copyText(proposalText, button);
      return;
    }
    const slug = button.dataset.slug;
    const firstContact = firstContactBySlug.get(slug);
    if (firstContact && button.dataset.copyOpen) {
      copyText(firstContact.open, button);
      return;
    }
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

  const scoreLabel = (value) => value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function weightedPotential(lead) {
    const [need, use, delivery] = lead.ratings;
    return need * 30 + use * 20 + delivery * 20;
  }

  function potential(lead) {
    const knownTotal = weightedPotential(lead);
    return {
      label: scoreLabel(knownTotal / 70),
      range: `${scoreLabel(knownTotal / 100)} a ${scoreLabel((knownTotal + 150) / 100)}`
    };
  }

  const contactLabel = (lead) => lead.kind || "WhatsApp comercial";

  function draftSections(lead) {
    const contracts = window.NL_CONTRATOS;
    if (!lead.amount || !contracts) return "";

    const pack = {
      id: "presenca",
      nome: "Presença Profissional",
      preco: `R$ ${lead.amount}`,
      dias: "3 a 5",
      escopo: `${lead.scope} Até cinco seções.`,
      ajustes: "Uma rodada consolidada de ajustes simples dentro do escopo."
    };
    proposalText = [
      `Proposta NL Sites para ${lead.name}`,
      lead.idea,
      `${pack.nome} · ${pack.preco}\n${pack.escopo} Inclui versão para celular, SEO básico e publicação após aprovação. ${pack.ajustes}`,
      `Condições\nPrazo estimado de ${pack.dias} dias úteis após ${contracts.inicio}. ${contracts.pagamento} Domínio e hospedagem à parte. ${contracts.suporte}`,
      `Alterações futuras\n${lead.extra} Serviços adicionais têm orçamento e aceite prévios. Referência de ${contracts.taxaAdicional}.`,
      `Próximo passo\n${lead.question} Após alinharmos esse ponto, confirmamos o escopo e o orçamento.`
    ].join("\n\n");
    contractTexts.set(pack.id, contracts.minuta(lead, pack));
    return `
      <section class="script-block" id="proposta">
        <div class="script-block__head">
          <h2>Proposta <span>Rascunho comercial</span></h2>
          <button class="btn btn--copy copy-btn" type="button" data-copy-proposal>Copiar proposta</button>
        </div>
        <p class="script-text">Confirme a necessidade, os materiais e o preço com o negócio antes de enviar.</p>
        <details class="contract-version" ${window.location.hash === "#proposta" ? "open" : ""}>
          <summary>${pack.nome} · referência de ${pack.preco}</summary>
          <p class="script-text">${esc(proposalText)}</p>
        </details>
      </section>
      <section class="script-block" id="contrato">
        <div class="script-block__head">
          <h2>Contrato <span>Minuta para revisão</span></h2>
          <button class="btn btn--copy copy-btn" type="button" data-copy-contract="${pack.id}">Copiar minuta</button>
        </div>
        <p class="script-text">Preencha os dados das partes e confirme as condições na cópia após o aceite da proposta.</p>
        <details class="contract-version" ${window.location.hash === "#contrato" ? "open" : ""}>
          <summary>Ver cláusulas da minuta</summary>
          <p class="script-text">${esc(contractTexts.get(pack.id))}</p>
        </details>
      </section>
    `;
  }

  /* Dashboard ------------------------------------------------------------- */

  const ranking = document.getElementById("ranking");
  if (ranking) {
    const leadCount = document.getElementById("leadCount");
    if (leadCount) leadCount.textContent = DATA.length + FIRST_CONTACT.length;
    const summary = document.getElementById("leadSummary");
    if (summary) summary.textContent = `${FIRST_CONTACT.length} para primeiro contato · ${DATA.length} com prévia`;

    const attack = document.getElementById("attackLine");
    if (attack && FIRST_CONTACT.length) {
      attack.innerHTML = `<span>Comece por</span>${FIRST_CONTACT.slice(0, 3).map((item, index) => `
        <a href="roteiro.html?slug=${encodeURIComponent(item.slug)}"><b>${pad(index + 1)}</b>${esc(item.name)}</a>
      `).join("")}`;
    }

    const firstRanking = document.getElementById("firstContactRanking");
    if (firstRanking) firstRanking.innerHTML = FIRST_CONTACT.map((lead, index) => `
      <article class="rank-card">
        <div class="rank-card__num" aria-hidden="true">${pad(index + 1)}</div>
        <div class="rank-card__body">
          <div class="rank-card__top">
            <h3 class="rank-card__name"><a href="roteiro.html?slug=${encodeURIComponent(lead.slug)}">${esc(lead.name)}</a></h3>
            <span class="priority${index > 2 ? " priority--soft" : ""}">${potential(lead).label}/5 provisório</span>
          </div>
          <p class="rank-card__meta">${esc(lead.segment)} · ${esc(lead.area)} · 70% de cobertura</p>
          <p class="rank-card__why">${esc(lead.idea)}</p>
          <div class="rank-card__actions">
            <a class="btn btn--accent" href="roteiro.html?slug=${encodeURIComponent(lead.slug)}">Abrir roteiro</a>
            ${lead.preview ? `<a class="btn btn--ghost" href="${esc(lead.preview)}">Ver prévia</a>` : ""}
            ${lead.amount ? `
              <a class="btn btn--ghost" href="roteiro.html?slug=${encodeURIComponent(lead.slug)}#proposta">Ver proposta</a>
              <a class="btn btn--ghost" href="roteiro.html?slug=${encodeURIComponent(lead.slug)}#contrato">Ver contrato</a>
            ` : ""}
            <button class="btn btn--copy" type="button" data-copy-open="${esc(lead.slug)}" data-slug="${esc(lead.slug)}">Copiar abertura</button>
          </div>
        </div>
        <aside class="rank-card__contact">
          <strong>Primeiro contato</strong>
          <a href="${esc(lead.contact)}"${external(lead.contact)}>${contactLabel(lead)}</a>
          <span>Interesse a validar</span>
        </aside>
      </article>
    `).join("");

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
            <a class="btn btn--ghost" href="roteiro.html?slug=${encodeURIComponent(data.slug)}#proposta">Ver proposta</a>
            <a class="btn btn--ghost" href="roteiro.html?slug=${encodeURIComponent(data.slug)}#contrato">Ver contrato</a>
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
    const lead = firstContactBySlug.get(slug);
    if (lead) {
      const score = potential(lead);
      const [need, use, delivery] = lead.ratings;
      const sources = [lead.source, ...(lead.supporting || [])];
      const lastIndex = FIRST_CONTACT.length - 1;
      const index = FIRST_CONTACT.indexOf(lead);
      const previous = FIRST_CONTACT[index - 1];
      const next = FIRST_CONTACT[index + 1];
      document.title = `${lead.name} — primeiro contato | NL Sites`;
      guide.innerHTML = `
        <a class="back" href="index.html#primeiro-contato">← Voltar para primeiro contato</a>
        <header class="guide-head">
          <p class="eyebrow"><span class="dot"></span> Primeiro contato · ${pad(index + 1)} / ${pad(lastIndex + 1)}</p>
          <h1>${esc(lead.name)}</h1>
          <p class="guide-head__meta"><span>${esc(lead.segment)}</span><span>${esc(lead.area)} · Porto Alegre</span></p>
          <p class="guide-head__why">${esc(lead.idea)}</p>
          ${lead.preview ? `<div class="guide-head__actions"><a class="btn btn--dark" href="${esc(lead.preview)}">Ver prévia do site</a></div>` : ""}
        </header>
        <div class="guide-grid">
          <div class="guide-main">
            <section class="script-block script-block--first">
              <div class="script-block__head">
                <h2>Abertura</h2>
                <button class="btn btn--copy copy-btn" type="button" data-copy-open="${esc(lead.slug)}" data-slug="${esc(lead.slug)}">Copiar abertura</button>
              </div>
              <p class="script-text">${esc(lead.open)}</p>
            </section>
            <section class="discovery">
              <h2>Se houver abertura</h2>
              <p>${esc(lead.question)}</p>
              <p>${lead.amount ? esc(lead.scope) : lead.slug === "king-razor" ? "Validar a demanda da mentoria antes de estimar preço." : "Faixa inicial de R$ 600 a R$ 700 para uma página de até cinco seções com conteúdo aprovado e links existentes. Confirmar escopo e custos de publicação antes de cotar."}</p>
            </section>
            ${draftSections(lead)}
            <section class="script-block">
              <h2>Evidências consultadas em 10/11/2026</h2>
              <p class="script-text">${esc(lead.fact)}</p>
              <ul>${sources.map((url, sourceIndex) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${sourceIndex === 0 ? "Fonte principal" : `Fonte complementar ${sourceIndex}`}</a></li>`).join("")}</ul>
            </section>
            <section class="script-block">
              <h2>Potencial provisório · ${score.label}/5</h2>
              <p class="script-text">Necessidade ${need}/5 · Caminho de uso ${use}/5 · Viabilidade da página ${delivery}/5. Cobertura de 70%. Faixa com os critérios ainda abertos de ${score.range}/5.</p>
              <p class="script-text">Valor para o negócio e capacidade de aproveitar a página seguem em aberto. A nota avalia adequação à oferta. Interesse, orçamento, responsável pela decisão e momento de compra ainda precisam ser confirmados.</p>
            </section>
          </div>
          <aside class="guide-aside">
            <div class="contact-card">
              <p class="contact-card__label">Canal comercial divulgado</p>
              <a class="contact-card__primary" href="${esc(lead.contact)}"${external(lead.contact)}>${contactLabel(lead)}</a>
              <div class="contact-card__block">
                <span>Localização</span>
                <p>${esc(lead.address)}</p>
              </div>
            </div>
          </aside>
        </div>
        <nav class="pager" aria-label="Navegação entre primeiros contatos">
          ${previous ? `<a href="roteiro.html?slug=${encodeURIComponent(previous.slug)}"><span>← Anterior</span>${esc(previous.name)}</a>` : "<span></span>"}
          ${next ? `<a class="pager__next" href="roteiro.html?slug=${encodeURIComponent(next.slug)}"><span>Próximo →</span>${esc(next.name)}</a>` : ""}
        </nav>
      `;
      if (["#proposta", "#contrato"].includes(window.location.hash)) {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      }
      return;
    }
    const data = bySlug.get(slug);

    if (!data) {
      guide.innerHTML = `
        <div class="empty">
          <p class="eyebrow"><span class="dot"></span> Roteiro não encontrado</p>
          <h1>Esse cliente não está na mesa.</h1>
          <p>Volte para a mesa de vendas e escolha um roteiro.</p>
          <p style="margin-top:22px"><a class="btn btn--dark" href="index.html">Voltar para a mesa</a></p>
        </div>
      `;
    } else {
      document.title = `${data.name} — roteiro de venda | NL Sites`;
      const previous = DATA.find((item) => item.rank === data.rank - 1);
      const next = DATA.find((item) => item.rank === data.rank + 1);
      const proposal = window.NL_PROPOSTAS?.[slug];
      const contracts = window.NL_CONTRATOS;
      let contractSection = "";
      if (proposal && contracts) {
        const packages = contracts.pacotes(data, proposal);
        const paragraphs = [
          `Proposta NL Sites para ${data.name}`,
          proposal.abertura
        ];
        packages.forEach((pack) => paragraphs.push(
          `${pack.nome} · ${pack.preco}\n${pack.escopo} Prazo estimado de ${pack.dias} dias úteis após ${contracts.inicio}. ${pack.ajustes}`
        ));
        paragraphs.push(
          `Condições\nTodos os pacotes incluem layout responsivo, SEO básico e publicação após aprovação. ${contracts.pagamento} ${contracts.suporte} Domínio e hospedagem são cobrados à parte. Para mudanças fora do escopo ou após a publicação, a referência é ${contracts.taxaAdicional}, com orçamento e aceite prévios. Manutenção recorrente é contratada à parte.`,
          `Próximo passo\n${proposal.confirmar} Com esses pontos definidos, podemos fechar o escopo e combinar a data de início.`
        );
        proposalText = paragraphs.join("\n\n");
        const versions = packages.map((pack) => {
          const text = contracts.minuta(data, pack);
          contractTexts.set(pack.id, text);
          return `
            <details class="contract-version" ${packages.length === 1 ? "open" : ""}>
              <summary>${esc(pack.nome)} · ${esc(pack.preco)}</summary>
              <p class="script-text">${esc(text)}</p>
              <button class="btn btn--copy" type="button" data-copy-contract="${pack.id}">Copiar minuta</button>
            </details>
          `;
        }).join("");
        contractSection = `
          <section class="script-block" id="contrato">
            <div class="script-block__head">
              <h2>Contrato <span>Minuta para revisão</span></h2>
            </div>
            <p class="script-text">Abra a minuta do pacote escolhido. Preencha os dados das partes na cópia antes de colher as assinaturas.</p>
            ${versions}
          </section>
        `;
      }

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
            ${proposalText ? `
              <section class="script-block script-block--link" id="proposta">
                <div class="script-block__head">
                  <h2>Proposta comercial <span>Rascunho para revisão</span></h2>
                  <button class="btn btn--copy copy-btn" type="button" data-copy-proposal>Copiar proposta</button>
                </div>
                <p class="script-text">${esc(proposalText)}</p>
              </section>
            ` : ""}
            ${contractSection}
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
      if (["#proposta", "#contrato"].includes(window.location.hash)) {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      }
    }
  }
})();
