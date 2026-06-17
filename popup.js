const toggle = document.getElementById("toggle");
const countBox = document.getElementById("count");
const countText = document.getElementById("countText");
const statusEl = document.getElementById("status");

const SELECTOR = '[data-tooltip*="Visa kopplade bilder"]';

function getActiveTab() {
  return chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => tabs[0]);
}

function isFortnox(tab) {
  return !!tab && /^https:\/\/[^/]*\.fortnox\.se\//.test(tab.url || "");
}

function renderCount(n) {
  statusEl.classList.add("hidden");
  countBox.classList.remove("hidden");
  countText.textContent =
    n === 1 ? "1 kopplad bild på sidan" : `${n} kopplade bilder på sidan`;
}

function showStatus(text) {
  statusEl.textContent = text;
  statusEl.classList.remove("hidden");
  countBox.classList.add("hidden");
  toggle.disabled = true;
}

// Se till att content-scriptet finns i alla frames (täcker flikar som öppnades
// innan tillägget laddades). Idempotent tack vare guard i content.js.
async function ensureInjected(tabId) {
  const present = await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: () => !!window.__fnxBildmarkorInit,
  });
  if (present.some((r) => r.result === false)) {
    await chrome.scripting.insertCSS({
      target: { tabId, allFrames: true },
      files: ["highlight.css"],
    });
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["content.js"],
    });
  }
}

// Räkna ikoner direkt i alla frames och summera (oberoende av iframe-gränser).
async function countAllFrames(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: (sel) => document.querySelectorAll(sel).length,
    args: [SELECTOR],
  });
  return results.reduce((sum, r) => sum + (r.result || 0), 0);
}

async function init() {
  const tab = await getActiveTab();
  if (!isFortnox(tab)) {
    showStatus("Öppna en Fortnox-flik och klicka på tillägget där.");
    return;
  }
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  toggle.checked = enabled;
  toggle.disabled = false;
  try {
    await ensureInjected(tab.id);
    renderCount(await countAllFrames(tab.id));
  } catch {
    showStatus("Kunde inte läsa sidan. Ladda om Fortnox-fliken (F5) och försök igen.");
  }
}

// Toggeln skriver bara storage; alla frames reagerar via storage.onChanged,
// och bakgrunden uppdaterar badge-färgen.
toggle.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: toggle.checked });
});

init();
