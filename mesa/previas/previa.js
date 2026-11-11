const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Keyboard behavior follows the tabs used on the MOV site.
const chooser = document.querySelector("[data-chooser]");
const tabList = chooser.querySelector("[data-choices]");
const tabs = [...tabList.querySelectorAll("button")];
const panels = [...chooser.querySelectorAll("[data-panel]")];
tabList.setAttribute("role", "tablist");

function selectTab(index, focus = false) {
  tabs.forEach((tab, position) => {
    const selected = position === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[position].hidden = !selected;
  });
  if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.setAttribute("role", "tab");
  panels[index].setAttribute("role", "tabpanel");
  panels[index].setAttribute("aria-labelledby", tab.id);
  tab.addEventListener("click", () => selectTab(index));
  tab.addEventListener("keydown", (event) => {
    const keys = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!Object.hasOwn(keys, event.key)) return;
    event.preventDefault();
    selectTab(keys[event.key], true);
  });
});
selectTab(0);

// Use a native dialog like ZM, with next and previous controls.
const dialog = document.querySelector(".gallery-dialog");
const tiles = [...document.querySelectorAll("[data-gallery]")];
const dialogImage = dialog.querySelector("img");
const caption = dialog.querySelector("figcaption");
let currentPhoto = 0;

function showPhoto(index) {
  currentPhoto = (index + tiles.length) % tiles.length;
  const tile = tiles[currentPhoto];
  dialogImage.src = tile.href;
  dialogImage.alt = tile.querySelector("img").alt;
  caption.textContent = dialogImage.alt;
}

if (typeof dialog.showModal === "function") {
  tiles.forEach((tile, index) => tile.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPhoto(index);
    dialog.showModal();
  }));
  dialog.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => showPhoto(currentPhoto + Number(button.dataset.direction)));
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const map = document.querySelector("[data-map]");
const frame = map.querySelector("iframe");
map.addEventListener("toggle", () => {
  if (map.open && !frame.hasAttribute("src")) frame.src = frame.dataset.src;
});

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("awaiting-reveal");
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach((section) => {
    if (section.getBoundingClientRect().top < innerHeight) return;
    section.classList.add("awaiting-reveal");
    reveal.observe(section);
  });
}

const progress = document.querySelector(".preview-bar");
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  const percent = distance > 0 ? Math.min(100, scrollY / distance * 100) : 0;
  progress.style.setProperty("--progress", `${percent}%`);
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

document.querySelectorAll("[data-message-builder]").forEach((builder) => {
  const link = builder.querySelector("[data-message-link]");
  const fields = [...builder.querySelectorAll("[data-label]")];
  function updateMessage() {
    const lines = [builder.dataset.intro];
    fields.forEach((field) => {
      const value = field.value.trim();
      if (value) lines.push(`${field.dataset.label}: ${value}`);
    });
    link.href = `https://wa.me/${builder.dataset.phone}?text=${encodeURIComponent(lines.join("\n"))}`;
  }
  builder.addEventListener("input", updateMessage);
  builder.addEventListener("change", updateMessage);
  updateMessage();
});

const training = document.getElementById("modalidade");
document.querySelectorAll("[data-select-training]").forEach((action) => {
  action.addEventListener("click", () => {
    training.value = action.dataset.selectTraining;
    training.dispatchEvent(new Event("change", { bubbles: true }));
  });
});
