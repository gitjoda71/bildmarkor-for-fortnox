# Bildmarkör för Fortnox

Liten Chrome-extension som **gulmarkerar alla "Visa kopplade bilder"-ikoner**
på Fortnox-sidor, så att de blir lätta att hitta i tabeller och listor.

> **Inofficiellt tillägg.** Inte anslutet till, sponsrat av eller godkänt av
> Fortnox AB. "Fortnox" är ett varumärke som tillhör Fortnox AB och används här
> enbart för att beskriva vad tillägget är kompatibelt med.

Markerar element vars `data-tooltip` innehåller "Visa kopplade bilder", t.ex.:

```html
<i data-model-key="" class="cursor icon-picture custom-tooltip " data-tooltip="Visa kopplade bilder"></i>
```

## Hur det funkar

En content-script-stylesheet injiceras på `*.fortnox.se` och lägger gul bakgrund
+ ram + glow på matchande ikoner. Eftersom det är en CSS-selektor träffar den
även ikoner som Fortnox ritar ut dynamiskt när du klickar dig runt (SPA), utan
att något behöver köras om.

**Viktigt — iframes:** Fortnox kör den äldre bokföringsmodulen (där ikonerna
finns, t.ex. verifikationslistan) i en `iframe` inuti det nya React-skalet.
Därför körs content-scriptet i **alla frames** (`all_frames: true`), annars
nås aldrig ikonerna. Räknaren och badgen summerar över alla frames.

- **På/av-toggle:** klicka på tilläggets ikon i verktygsfältet → en popup med en
  switch. CSS:en gateas bakom klassen `fnx-markera-pa` på `<html>`. Valet sparas
  i `chrome.storage`; varje frame lyssnar på `storage.onChanged` och uppdaterar
  sig själv, så toggeln slår igenom i både skal och iframe direkt.
- **Räknare:** popupen räknar ikoner i alla frames (via `chrome.scripting`) och
  summerar — visar hur många "Visa kopplade bilder"-ikoner som finns på sidan nu.
- **Badge på ikonen:** när content-scriptet signalerar att sidan ändrats räknar
  en service worker om ikonerna **live i alla frames** (via `chrome.scripting`)
  och sätter siffran direkt på verktygsfältsikonen, utan att popupen behöver
  öppnas. Samma räknemetod som popupen använder → badge och popup visar alltid
  samma tal, och rivna iframes kan aldrig dubbelräknas. Orange badge = markering
  på, grå = av. En debounce:ad `MutationObserver` håller siffran live när Fortnox
  ritar om sidan.

## Installation (Developer Mode)

1. Öppna `chrome://extensions/` i Chrome.
2. Slå på **Developer mode** (toggle uppe till höger).
3. Klicka **Load unpacked**.
4. Peka på den här mappen (`fortnox-bildmarkor`, där `manifest.json` ligger).
5. Öppna en Fortnox-sida — alla "Visa kopplade bilder"-ikoner är nu gulmarkerade.

Ändrar du i `highlight.css` räcker det att ladda om extensionen (cirkel-pilen
på kortet i `chrome://extensions/`) och reladda Fortnox-fliken.

## Felsökning

Markeras inget direkt efter att du laddat om tillägget: ladda om Fortnox-fliken
(F5) **en gång**. Content-scripts injiceras bara vid sidladdning, så flikar som
redan var öppna när tillägget laddades om saknar scriptet tills de laddas om.
(Popupen kan injicera i skalet on demand, men iframen kräver en sidladdning.)

Markeras fortfarande inget efter F5: ikonernas `data-tooltip` kanske har en
annan text än `Visa kopplade bilder`. Högerklicka på en ikon → Inspektera →
kontrollera attributet, och justera `SELECTOR` i `content.js`/`popup.js` samt
selektorn i `highlight.css`.

## Antaganden

- Matchar domänen `*.fortnox.se` (täcker `apps.fortnox.se`, `apps5.fortnox.se` m.fl.).
  Kör du Fortnox på en annan domän: lägg till den i `matches` + `host_permissions`
  i `manifest.json`.
- Ikonerna identifieras på `data-tooltip*="Visa kopplade bilder"` (innehåller, så
  extra blanksteg tolereras). Färgerna ändras högst upp i `highlight.css`.

## Publicering

- **Chrome Web Store:** ladda upp en zip med körfilerna (manifest, `*.js`,
  `*.css`, `popup.html`, `icons/`). Bygg den med `python build_zip.py` →
  skapar `dist/bildmarkor-for-fortnox-<version>.zip`. Listing-text finns i
  [`STORE_LISTING.md`](STORE_LISTING.md), integritetspolicyn i
  [`PRIVACY.md`](PRIVACY.md).
- **Integritet:** tillägget samlar inte in något och skickar inget externt.
  Enda lagrade datan är en på/av-flagga i `chrome.storage.local`.
- **Ikoner:** genereras av `make_icons.py` (kräver Pillow: `pip install Pillow`).
  Behövs bara köras om designen ändras; `icons/*.png` är committade.

## Licens

Proprietär (All rights reserved) — se [`LICENSE`](LICENSE). Tillägget är gratis
att installera men källkoden får inte återanvändas utan tillstånd.
