const form = document.getElementById('avaliacao');
const damage = form.elements.namedItem('damage');
const tip = document.getElementById('photo-tip');
const damageOptions = {
  amassado: ['Amassado', 'Fotografe a peça inteira e o amassado de lado, com boa luz.'],
  pintura: ['Risco ou dano na pintura', 'Fotografe a peça inteira e faça uma foto de perto em luz natural.'],
  duvida: ['Marca que ainda não sei identificar', 'Faça uma foto mais aberta para localizar a marca e outra de perto.'],
};
damage.addEventListener('change', () => {
  tip.textContent = damageOptions[damage.value][1];
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const vehicle = form.elements.namedItem('vehicle').value.trim();
  const panel = form.elements.namedItem('panel').value.trim();
  const message = [
    'Oi, Giocar! Gostaria de orientação sobre um reparo.',
    'Dano: ' + damageOptions[damage.value][0] + '.',
    vehicle && 'Carro: ' + vehicle + '.',
    panel && 'Peça afetada: ' + panel + '.',
    'Vou anexar as fotos nesta conversa.',
  ].filter(Boolean).join('\n');
  window.location.assign('https://wa.me/5551984421217?text=' + encodeURIComponent(message));
});
