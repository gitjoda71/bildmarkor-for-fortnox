// Körs i ALLA frames på Fortnox (verifikationslistan ligger i en iframe).
// Sätter klassen som gatear highlight.css och rapporterar antalet ikoner i
// just denna frame till bakgrunden (som summerar per flik för badgen).
//
// På/av styrs via chrome.storage: popupen skriver storage, varje frame lyssnar
// på storage.onChanged och uppdaterar sig själv. Guard mot dubbel-init om
// scriptet både laddas deklarativt och injiceras on demand av popupen.

(function () {
  if (window.__fnxBildmarkorInit) return;
  window.__fnxBildmarkorInit = true;

  const ON_CLASS = "fnx-markera-pa";
  const SELECTOR = '[data-tooltip*="Visa kopplade bilder"]';

  // Optimistiskt på (default) så vanligfallet inte flimrar.
  document.documentElement.classList.add(ON_CLASS);
  chrome.storage.local.get({ enabled: true }, ({ enabled }) => applyEnabled(enabled));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.enabled) applyEnabled(changes.enabled.newValue);
  });

  function applyEnabled(on) {
    document.documentElement.classList.toggle(ON_CLASS, on);
  }

  function countIcons() {
    return document.querySelectorAll(SELECTOR).length;
  }

  // Rapportera antal i denna frame till bakgrunden. Tyst om ingen lyssnar.
  function report() {
    chrome.runtime.sendMessage(
      { type: "count", count: countIcons() },
      () => void chrome.runtime.lastError
    );
  }

  // Räkna om vid DOM-ändringar (Fortnox ritar om löpande), debounce:at.
  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(report, 400);
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
    report();
  })();
})();
