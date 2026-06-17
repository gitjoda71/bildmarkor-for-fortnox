// Sätter en badge med antal "Visa kopplade bilder"-ikoner per flik.
//
// Pull-modell: i stället för att ackumulera per-frame-rapporter i minnet
// (vilket blir fel när iframes rivs/återskapas eller när service workern
// sover) räknar workern om LIVE i alla frames via chrome.scripting när
// content-scriptet signalerar att sidan ändrats. Det ger en enda
// sanningskälla – samma metod som popupen använder – så badge och popup
// alltid stämmer, och döda frames kan aldrig dubbelräknas.

const SELECTOR = '[data-tooltip*="Visa kopplade bilder"]';
const timers = {}; // tabId -> debounce-timer

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "changed" && sender.tab && sender.tab.id != null) {
    schedule(sender.tab.id);
  }
});

// Samla ihop signaler från flera frames till en omräkning per flik.
function schedule(tabId) {
  clearTimeout(timers[tabId]);
  timers[tabId] = setTimeout(() => {
    delete timers[tabId];
    updateBadge(tabId);
  }, 250);
}

async function updateBadge(tabId) {
  let total = 0;
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      func: (sel) => document.querySelectorAll(sel).length,
      args: [SELECTOR],
    });
    total = results.reduce((sum, r) => sum + (r.result || 0), 0);
  } catch {
    return; // fliken stängd eller går inte att injicera i
  }

  let enabled = true;
  try {
    ({ enabled } = await chrome.storage.local.get({ enabled: true }));
  } catch {
    /* storage otillgänglig – behåll default */
  }

  // Fliken kan ha stängts under await ovan; svälj då felet tyst.
  try {
    await chrome.action.setBadgeText({ tabId, text: total > 0 ? String(total) : "" });
    await chrome.action.setBadgeBackgroundColor({
      tabId,
      color: enabled ? "#f9a825" : "#9e9e9e",
    });
    if (chrome.action.setBadgeTextColor) {
      await chrome.action.setBadgeTextColor({ tabId, color: "#ffffff" });
    }
  } catch {
    /* tabId borta – ofarligt */
  }
}

// Rensa badgen direkt när fliken laddar om / navigerar bort; content-scriptet
// signalerar ett nytt antal så fort den nya sidan är redo.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {});
  }
});
