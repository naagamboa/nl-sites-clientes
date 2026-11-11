(() => {
  const tools = document.querySelector('.lead-tools');
  const form = tools.querySelector('form');
  const status = tools.querySelector('[role="status"]');
  const query = form.elements.namedItem('query');
  const segment = form.elements.namedItem('segment');
  const preview = form.elements.namedItem('preview');
  const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR');
  const groups = ['firstContactRanking', 'ranking'].map(id => {
    const list = document.getElementById(id);
    const cards = Array.from(list.querySelectorAll('[data-segment]'), card => ({
      card,
      searchText: normalize([
        card.querySelector('.rank-card__name').textContent,
        card.querySelector('.rank-card__meta').textContent,
        card.dataset.slug.replaceAll('-', ' '),
      ].join(' ')),
    }));
    return { section: list.closest('.rank-section'), cards };
  });
  const cards = groups.flatMap(group => group.cards);
  if (!cards.length) return;

  const segments = [...new Set(cards.map(({card}) => card.dataset.segment))];
  segments.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  for (const name of segments) segment.add(new Option(name, name));

  function filterLeads() {
    const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
    let total = 0;
    for (const group of groups) {
      let matches = 0;
      for (const {card, searchText} of group.cards) {
        const visible = terms.every(term => searchText.includes(term))
          && (!segment.value || card.dataset.segment === segment.value)
          && (!preview.value || card.dataset.preview === preview.value);
        card.hidden = !visible;
        matches += Number(visible);
      }
      group.section.hidden = group.cards.length > 0 && matches === 0;
      total += matches;
    }
    if (total === 0) {
      status.textContent = 'Nenhum lead encontrado. Tente outro termo ou limpe os filtros.';
      return;
    }
    status.textContent = `${total} de ${cards.length} ${cards.length === 1 ? 'lead' : 'leads'}`;
  }

  form.addEventListener('submit', event => event.preventDefault());
  query.addEventListener('input', filterLeads);
  form.addEventListener('change', filterLeads);
  form.addEventListener('reset', () => requestAnimationFrame(() => {
    filterLeads();
    query.focus();
  }));
  filterLeads();
  tools.hidden = false;
})();
