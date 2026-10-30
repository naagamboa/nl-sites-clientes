(() => {
  const internal = location.protocol === "file:"
    || /^(localhost|127\.0\.0\.1|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
  if (!internal) return;

  const ranks = {
    trussardi: 1,
    topsul: 2,
    santos: 3,
    zm: 4,
    eleve: 5,
    bravus: 6,
    artoflife: 7,
    map: 8,
    call: 9,
    mov: 10,
    jolie: 11,
    dulops: 12
  };

  document.body.classList.add("is-internal");

  const nav = document.querySelector(".nav__links");
  if (nav) {
    const link = document.createElement("a");
    link.href = "vendas/";
    link.textContent = "Vendas";
    link.className = "nav__sales";
    nav.appendChild(link);
  }

  const container = document.querySelector(".projects .container");
  if (container) {
    const note = document.createElement("div");
    note.className = "sales-note";
    note.innerHTML = `
      <p><strong>Modo venda</strong> 12 roteiros na ordem de abordagem. Abertura sem link; o link só depois do “manda”.</p>
      <a class="btn btn--sales-note" href="vendas/">Abrir mesa de vendas →</a>
    `;
    container.prepend(note);
  }

  document.querySelectorAll(".card").forEach((card) => {
    const site = card.querySelector('.card__links a[href$="/"]');
    const links = card.querySelector(".card__links");
    if (!site || !links) return;

    const slug = site.getAttribute("href").replace(/\/$/, "");
    const rank = ranks[slug];
    if (!rank) return;

    const sales = document.createElement("a");
    sales.className = "btn btn--sales";
    sales.href = `vendas/roteiro.html?slug=${encodeURIComponent(slug)}`;
    sales.textContent = `Roteiro #${rank}`;
    sales.setAttribute("aria-label", `Abrir roteiro de venda ${rank} de 12`);
    links.appendChild(sales);
  });

  const pill = document.createElement("a");
  pill.className = "internal-pill";
  pill.href = "vendas/";
  pill.innerHTML = "Modo venda <span>12</span>";
  pill.setAttribute("aria-label", "Abrir a mesa de vendas interna");
  document.body.appendChild(pill);
})();
