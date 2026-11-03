(() => {
  const CARDS = [
    {
      slug: "eleve",
      index: 1,
      name: "Eleve",
      sub: "NeoPilates",
      meta: "Pilates e bem-estar · Cidade Baixa · POA",
      line: "“O corpo em movimento, agora com um site à altura.”",
      theme: "light",
      bg: "#f6f1e4",
      fg: "#171512",
      muted: "rgba(23, 21, 18, 0.62)",
      lineColor: "rgba(23, 21, 18, 0.14)",
      frame: "#fffaf0",
      accent: "#e8452f",
      accentText: "#c43724",
      colors: ["#f6f1e4", "#ffe84a", "#e8452f", "#2fa8d8", "#171512"],
      desktop: "../_hub/assets/shots/eleve-desktop.png",
      mobile: "../_hub/assets/shots/eleve-mobile.png"
    },
    {
      slug: "santos",
      index: 2,
      name: "Santos",
      sub: "Estética Automotiva",
      meta: "Estética automotiva · Santo Antônio · POA",
      line: "“O detalhe muda tudo. O site também.”",
      theme: "dark",
      bg: "#0a0b0d",
      fg: "#f2f0ea",
      muted: "rgba(242, 240, 234, 0.64)",
      lineColor: "rgba(242, 240, 234, 0.16)",
      frame: "#12151a",
      accent: "#e23a2e",
      accentText: "#e23a2e",
      colors: ["#0a0b0d", "#e23a2e", "#8ce7f2", "#c8ccd2", "#f2f0ea"],
      desktop: "../_hub/assets/shots/santos-desktop.png",
      mobile: "../_hub/assets/shots/santos-mobile.png"
    },
    {
      slug: "trussardi",
      index: 3,
      name: "Trussardi",
      sub: "Auto Portas",
      meta: "Auto portas · Floresta · POA",
      line: "“Porta desalinhada tem conserto. Agora tem endereço digital.”",
      theme: "light",
      bg: "#f0ece3",
      fg: "#17181b",
      muted: "rgba(23, 24, 27, 0.62)",
      lineColor: "rgba(23, 24, 27, 0.15)",
      frame: "#ffffff",
      accent: "#1e3fe0",
      accentText: "#1e3fe0",
      colors: ["#f0ece3", "#17181b", "#1e3fe0", "#e23a2e", "#67645d"],
      desktop: "../_hub/assets/shots/trussardi-desktop.png",
      mobile: "../_hub/assets/shots/trussardi-mobile.png"
    },
    {
      slug: "artoflife",
      index: 4,
      name: "Art of Life",
      sub: "Barbershop",
      meta: "Barbearia · 4 unidades · POA",
      line: "“Corte, barba e pausa. Agora também no digital.”",
      theme: "dark",
      bg: "#0c0b09",
      fg: "#f2ead9",
      muted: "rgba(242, 234, 217, 0.64)",
      lineColor: "rgba(242, 234, 217, 0.16)",
      frame: "#14120e",
      accent: "#b98b4e",
      accentText: "#d4a86a",
      colors: ["#0c0b09", "#f2ead9", "#b98b4e", "#8d6230", "#e7dcc5"],
      desktop: "../_hub/assets/shots/artoflife-desktop.png",
      mobile: "../_hub/assets/shots/artoflife-mobile.png"
    },
    {
      slug: "bravus",
      index: 5,
      name: "Bravus",
      sub: "Studio Automotivo",
      meta: "Proteção automotiva · Santa Maria Goretti · POA",
      line: "“Proteção que se vê. Presença que fica.”",
      theme: "dark",
      bg: "#070908",
      fg: "#eef2e9",
      muted: "rgba(238, 242, 233, 0.64)",
      lineColor: "rgba(238, 242, 233, 0.16)",
      frame: "#101510",
      accent: "#c8ff36",
      accentText: "#c8ff36",
      colors: ["#070908", "#c8ff36", "#8c9892", "#eef2e9", "#121711"],
      desktop: "../_hub/assets/shots/bravus-desktop.png",
      mobile: "../_hub/assets/shots/bravus-mobile.png"
    },
    {
      slug: "call",
      index: 6,
      name: "Call",
      sub: "Barber Shop",
      meta: "Barbearia e prótese capilar · Azenha · POA",
      line: "“Autoestima é o melhor corte. O site acompanha.”",
      theme: "dark",
      bg: "#0e3b2e",
      fg: "#f5eedf",
      muted: "rgba(245, 238, 223, 0.66)",
      lineColor: "rgba(245, 238, 223, 0.18)",
      frame: "#0b2e24",
      accent: "#d8764f",
      accentText: "#e59a77",
      colors: ["#0e3b2e", "#f5eedf", "#642820", "#d8764f", "#14110d"],
      desktop: "../_hub/assets/shots/call-desktop.png",
      mobile: "../_hub/assets/shots/call-mobile.png"
    },
    {
      slug: "map",
      index: 7,
      name: "MAP",
      sub: "Personal Car",
      meta: "Estética automotiva · São Sebastião · POA",
      line: "“Acabamento de showroom. Presença de site.”",
      theme: "light",
      bg: "#f1eadc",
      fg: "#151515",
      muted: "rgba(21, 21, 21, 0.62)",
      lineColor: "rgba(21, 21, 21, 0.15)",
      frame: "#fffaf1",
      accent: "#e12522",
      accentText: "#b81c1a",
      colors: ["#f1eadc", "#e12522", "#151515", "#fffaf1", "#655f55"],
      desktop: "../_hub/assets/shots/map-desktop.png",
      mobile: "../_hub/assets/shots/map-mobile.png"
    },
    {
      slug: "dulops",
      index: 8,
      name: "Du Lops",
      sub: "Estética Automotiva",
      meta: "Carros e motos · Zona Sul · POA",
      line: "“O brilho que fica. Agora com vitrine.”",
      theme: "dark",
      bg: "#061018",
      fg: "#e8f4f5",
      muted: "rgba(232, 244, 245, 0.64)",
      lineColor: "rgba(232, 244, 245, 0.16)",
      frame: "#0a1a24",
      accent: "#2e9bc4",
      accentText: "#8fe8ff",
      colors: ["#061018", "#b9efff", "#2e9bc4", "#e8f4f5", "#166680"],
      desktop: "../_hub/assets/shots/dulops-desktop.png",
      mobile: "../_hub/assets/shots/dulops-mobile.png"
    },
    {
      slug: "mov",
      index: 9,
      name: "MOV",
      sub: "Treinamento Funcional",
      meta: "Treinamento funcional · Bom Fim · POA",
      line: "“Treino forte, clima leve. Site à altura.”",
      theme: "dark",
      bg: "#080b07",
      fg: "#f2f1e8",
      muted: "rgba(242, 241, 232, 0.64)",
      lineColor: "rgba(242, 241, 232, 0.16)",
      frame: "#11170e",
      accent: "#b8ff2e",
      accentText: "#b8ff2e",
      colors: ["#080b07", "#b8ff2e", "#f2f1e8", "#7aad00", "#12160f"],
      desktop: "../_hub/assets/shots/mov-desktop.png",
      mobile: "../_hub/assets/shots/mov-mobile.png"
    },
    {
      slug: "jolie",
      index: 10,
      name: "Jolie",
      sub: "Espaço de Vida",
      meta: "Pilates, yoga e terapias · Jardim Planalto · POA",
      line: "“Um lugar para respirar. E para encontrar.”",
      theme: "light",
      bg: "#f8f2e7",
      fg: "#2a2228",
      muted: "rgba(42, 34, 40, 0.64)",
      lineColor: "rgba(42, 34, 40, 0.14)",
      frame: "#fffaf2",
      accent: "#cbb9d8",
      accentText: "#7c5f8b",
      colors: ["#f8f2e7", "#cbb9d8", "#e7c778", "#7c5f8b", "#43303f"],
      desktop: "../_hub/assets/shots/jolie-desktop.png",
      mobile: "../_hub/assets/shots/jolie-mobile.png"
    },
    {
      slug: "topsul",
      index: 11,
      name: "Top Sul",
      sub: "Lavagem e Higienização",
      meta: "Lavagem e higienização · Cristal e Glória · POA",
      line: "“Seu carro merece o melhor. Seu site também.”",
      theme: "dark",
      bg: "#06131c",
      fg: "#eef7f9",
      muted: "rgba(238, 247, 249, 0.64)",
      lineColor: "rgba(238, 247, 249, 0.15)",
      frame: "#0a1e2a",
      accent: "#35c7ef",
      accentText: "#35c7ef",
      colors: ["#06131c", "#35c7ef", "#8fe8ff", "#eef7f9", "#0a2230"],
      desktop: "../_hub/assets/shots/topsul-desktop.png",
      mobile: "../_hub/assets/shots/topsul-mobile.png"
    },
    {
      slug: "zm",
      index: 12,
      name: "ZM",
      sub: "Estética Automotiva",
      meta: "Estética automotiva · Lomba do Pinheiro · POA",
      line: "“Brilho com método. Presença com assinatura.”",
      theme: "dark",
      bg: "#080706",
      fg: "#f4efe6",
      muted: "rgba(244, 239, 230, 0.64)",
      lineColor: "rgba(244, 239, 230, 0.15)",
      frame: "#12100d",
      accent: "#d8b46a",
      accentText: "#d8b46a",
      colors: ["#080706", "#d8b46a", "#ead8b0", "#f4efe6", "#16130f"],
      desktop: "../_hub/assets/shots/zm-desktop.png",
      mobile: "../_hub/assets/shots/zm-mobile.png"
    }
  ];

  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("site") || CARDS[0].slug;
  const data = CARDS.find((item) => item.slug === slug) || CARDS[0];

  document.title = `${data.name} ${data.sub} — apresentação | NL Sites`;
  document.body.innerHTML = `
    <article class="post" data-theme="${esc(data.theme)}" style="
      --bg:${esc(data.bg)};
      --fg:${esc(data.fg)};
      --muted:${esc(data.muted)};
      --line:${esc(data.lineColor)};
      --frame:${esc(data.frame)};
      --accent:${esc(data.accent)};
      --accentText:${esc(data.accentText)};
    ">
      <div class="post__wash" aria-hidden="true"></div>
      <div class="post__grid" aria-hidden="true"></div>
      <div class="post__index-bg" aria-hidden="true">${String(data.index).padStart(2, "0")}</div>

      <header class="post__head">
        <div class="post__agency"><i aria-hidden="true"></i> NL Sites <span>/ apresenta</span></div>
        <span class="post__count">${String(data.index).padStart(2, "0")} / ${String(CARDS.length).padStart(2, "0")}</span>
      </header>

      <section class="post__title">
        <p class="post__eyebrow">Uma prévia feita para</p>
        <span class="post__name">${esc(data.name)}</span>
        <span class="post__sub">${esc(data.sub)}</span>
        <p class="post__meta">${esc(data.meta)}</p>
      </section>

      <div class="post__visual">
        <div class="browser">
          <div class="browser__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(data.slug)}</span></div>
          <img src="${esc(data.desktop)}" alt="Prévia desktop do site ${esc(data.name)} ${esc(data.sub)}" width="1440" height="940">
        </div>
        <div class="phone">
          <img src="${esc(data.mobile)}" alt="Prévia mobile do site ${esc(data.name)} ${esc(data.sub)}" width="390" height="844">
        </div>
      </div>

      <footer class="post__foot">
        <p class="post__line">${esc(data.line)}</p>
        <div class="post__bottom">
          <div class="post__palette" aria-label="Paleta do site">
            ${data.colors.map((color) => `<span style="--dot:${esc(color)}"></span>`).join("")}
          </div>
          <span class="post__cta">Veja no link
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </footer>
    </article>
  `;
})();
