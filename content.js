// Körs i ALLA frames på Fortnox (verifikationslistan ligger i en iframe).
// Sätter klassen som gatear highlight.css och signalerar till bakgrunden när
// sidan ändrats så att badgen kan räknas om.
//
// På/av styrs via chrome.storage: popupen skriver storage, varje frame lyssnar
// på storage.onChanged och uppdaterar sig själv. Guard mot dubbel-init om
// scriptet både laddas deklarativt och injiceras on demand av popupen.

(function () {
  if (window.__fnxBildmarkorInit) return;
  window.__fnxBildmarkorInit = true;

  const ON_CLASS = "fnx-markera-pa";

  // Optimistiskt på (default) så vanligfallet inte flimrar.
  document.documentElement.classList.add(ON_CLASS);
  chrome.storage.local.get({ enabled: true }, ({ enabled }) => applyEnabled(enabled));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.enabled) {
      applyEnabled(changes.enabled.newValue);
      pingBadge(); // be bakgrunden räkna om/färga om badgen efter toggle
    }
  });

  function applyEnabled(on) {
    document.documentElement.classList.toggle(ON_CLASS, on);
  }

  // Signalera "sidan kan ha ändrats" till bakgrunden, som räknar ikonerna live.
  // Tyst om ingen lyssnar.
  function pingBadge() {
    chrome.runtime.sendMessage({ type: "changed" }, () => void chrome.runtime.lastError);
  }

  // Signalera vid DOM-ändringar (Fortnox ritar om löpande), debounce:at.
  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(pingBadge, 400);
  };

  (function start() {
    if (!document.body) {
      requestAnimationFrame(start); // body saknas vid document_start
      return;
    }
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
    });
    pingBadge();
  })();
})();
