// Summerar antal "Visa kopplade bilder"-ikoner per flik (över alla frames,
// eftersom listan ligger i en iframe) och sätter en badge på ikonen.
// Orange = markering på, grå = av. Tom badge när inga ikoner finns.

const counts = {}; // "<tabId>:<frameId>" -> antal

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "count" && sender.tab) {
    const tabId = sender.tab.id;
    const frameId = sender.frameId || 0;
    counts[tabId + ":" + frameId] = msg.count;
    updateBadge(tabId);
  }
});

function sumForTab(tabId) {
  const prefix = tabId + ":";
  let sum = 0;
  for (const k in counts) if (k.startsWith(prefix)) sum += counts[k];
  return sum;
}

function clearTab(tabId) {
  const prefix = tabId + ":";
  for (const k in counts) if (k.startsWith(prefix)) delete counts[k];
}

async function updateBadge(tabId) {
  const total = sumForTab(tabId);
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  chrome.action.setBadgeText({ tabId, text: total > 0 ? String(total) : "" });
  chrome.action.setBadgeBackgroundColor({
    tabId,
    color: enabled ? "#f9a825" : "#9e9e9e",
  });
  if (chrome.action.setBadgeTextColor) {
    chrome.action.setBadgeTextColor({ tabId, color: "#ffffff" });
  }
}

// Rensa när fliken laddar om / navigerar bort (frames rapporterar på nytt sen).
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    clearTab(tabId);
    chrome.action.setBadgeText({ tabId, text: "" });
  }
});
chrome.tabs.onRemoved.addListener(clearTab);

// Badge-färgen följer på/av-toggeln direkt.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    const tabs = new Set();
    for (const k in counts) tabs.add(Number(k.split(":")[0]));
    tabs.forEach(updateBadge);
  }
});
