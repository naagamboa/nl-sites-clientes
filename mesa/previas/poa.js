const options = document.querySelectorAll('.option-button');

for (const option of options) {
  option.addEventListener('click', () => {
    const shouldOpen = option.getAttribute('aria-expanded') !== 'true';

    for (const button of options) {
      const expanded = button === option && shouldOpen;
      button.setAttribute('aria-expanded', String(expanded));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
    }
  });
}

const photoDialog = document.querySelector('.photo-dialog');

if (photoDialog) {
  const expandedPhoto = photoDialog.querySelector('img');

  for (const button of document.querySelectorAll('[data-photo]')) {
    button.addEventListener('click', () => {
      const source = button.querySelector('img');
      expandedPhoto.src = source.currentSrc || source.src;
      expandedPhoto.alt = source.alt;
      photoDialog.showModal();
    });
  }

  photoDialog.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
}
