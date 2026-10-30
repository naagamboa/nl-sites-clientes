(() => {
  const gate = document.getElementById("secureGate");
  const form = document.getElementById("secureForm");
  const input = document.getElementById("securePassword");
  const error = document.getElementById("secureError");
  const storageKey = "nl-mesa-v1";
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (!gate || !form || !input || !error) return;

  const bytesFromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

  const loadSales = () => {
    if (window.__nlSalesLoaded) return;
    window.__nlSalesLoaded = true;
    const script = document.createElement("script");
    script.src = "sales.js?v=1";
    script.onerror = () => { error.textContent = "Não foi possível carregar a mesa. Recarregue a página."; };
    document.body.appendChild(script);
  };

  const addLock = () => {
    const nav = document.querySelector(".topbar__nav");
    if (!nav || nav.querySelector(".secure-lock")) return;
    const lock = document.createElement("a");
    lock.className = "secure-lock";
    lock.href = "#";
    lock.textContent = "Bloquear";
    lock.addEventListener("click", (event) => {
      event.preventDefault();
      try { sessionStorage.removeItem(storageKey); } catch (storeError) {}
      window.location.reload();
    });
    nav.insertBefore(lock, nav.querySelector(".badge"));
  };

  const unlock = (data) => {
    window.NL_VENDAS = data;
    gate.hidden = true;
    document.body.classList.remove("is-locked");
    document.querySelectorAll("[inert]").forEach((element) => { element.inert = false; });
    loadSales();
    addLock();
  };

  try {
    const cached = sessionStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.exp > Date.now() && Array.isArray(parsed.data) && parsed.data.length === 12) {
        unlock(parsed.data);
        return;
      }
    }
  } catch (storeError) {}

  document.body.classList.add("is-locked");

  const decrypt = async (password) => {
    const payload = window.NL_VENDAS_SECURE;
    if (!payload || !payload.data) throw new Error("Payload ausente");
    const salt = bytesFromBase64(payload.salt);
    const iv = bytesFromBase64(payload.iv);
    const ciphertext = bytesFromBase64(payload.data);
    const material = await crypto.subtle.importKey(
      "raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: payload.iterations, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    const data = JSON.parse(decoder.decode(plain));
    if (!Array.isArray(data) || data.length !== 12) throw new Error("Dados inválidos");
    return data;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    const button = form.querySelector("button");
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Abrindo...";
    try {
      const data = await decrypt(input.value.trim());
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({ exp: Date.now() + 2 * 60 * 60 * 1000, data }));
      } catch (storeError) {}
      unlock(data);
    } catch (decryptError) {
      error.textContent = "Senha incorreta. Tente novamente.";
      input.select();
      button.disabled = false;
      button.textContent = original;
    }
  });
})();
