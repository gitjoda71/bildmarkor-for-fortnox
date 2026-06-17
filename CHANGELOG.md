# Changelog

## v0.4.1 – robusthet inför publikt släpp

- Badgen räknas nu **live i alla frames** från service workern (pull-modell via
  `chrome.scripting`) i stället för en in-memory-karta. Löser flera fynd från
  pre-publish-granskningen på en gång: stale badge vid SW-sömn, dubbelräkning av
  rivna iframes, och divergens mellan badge och popup-räknare (en sanningskälla).
- `updateBadge` har felhantering (try/catch) → inga obehandlade rejections om en
  flik stängs mitt i en uppdatering.
- Docs: README `=`→`*=` (matchar koden), PRIVACY.md fick trademark-disclaimer +
  not om att popupen läser flikens URL lokalt + riktig kontakt-URL, Pillow-not i
  README, privacy policy-URL i STORE_LISTING.md.

## v0.4.0 – första publika släppet

- Gulmarkerar "Visa kopplade bilder"-ikoner på `*.fortnox.se`, i **alla frames**
  (verifikationslistan ligger i en iframe).
- På/av-toggle via `chrome.storage` (slår igenom i skal + iframe), räknare i
  popupen, antal-badge på verktygsfältsikonen.
- Ikoner, integritetspolicy, store-listing-text och byggscript för Web Store.
