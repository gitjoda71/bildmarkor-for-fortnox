# Chrome Web Store – listing

Färdig text att klistra in i Web Store-formuläret. Två språk; börja med svenska
(primär målgrupp) och lägg engelska som extra lokalisering om du vill.

---

## Namn

Bildmarkör för Fortnox

## Kort beskrivning (max 132 tecken)

Gulmarkerar "Visa kopplade bilder"-ikoner i Fortnox så de blir lätta att hitta. På/av-toggle + räknare. Inofficiellt tillägg.

## Kategori

Productivity / Workflow & Planning

## Single purpose (krävs av Web Store)

The extension has a single purpose: to visually highlight the "Visa kopplade
bilder" (view attached images) icons on Fortnox pages and show how many exist,
so the user can find them faster.

## Behörighetsmotiveringar (för granskningen)

- **host_permissions (https://*.fortnox.se/\*):** Required to run on Fortnox
  pages and read the DOM to locate and highlight the relevant icons. The
  bookkeeping list is rendered inside an iframe, so the extension must run in
  all frames of fortnox.se.
- **scripting:** Used to inject the highlight stylesheet/logic and to count the
  icons across frames when the popup opens.
- **storage:** Stores a single on/off preference locally.

No remote code, no data collection, no network requests.

---

## Detaljerad beskrivning (svenska)

Bildmarkör för Fortnox gör en enda sak, men gör den bra: den gulmarkerar alla
"Visa kopplade bilder"-ikoner i Fortnox så att du direkt ser vilka rader som
har en kopplad bild/underlag – utan att behöva svepa med musen över varje rad.

Funktioner:
• Tydlig gul markering med ram och glow på varje "Visa kopplade bilder"-ikon.
• Räknare i popupen: ser direkt hur många kopplade bilder som finns på sidan.
• Antal-badge på verktygsfältsikonen – syns utan att du öppnar popupen.
• På/av med ett klick. Inställningen kommer ihåg.
• Fungerar även i Fortnox bokföringslista (som ligger i en iframe).

Integritet: tillägget samlar inte in något, skickar inget externt och har ingen
spårning. Allt sker lokalt i din webbläsare.

Inofficiellt tillägg – inte anslutet till eller godkänt av Fortnox AB.

---

## Detaljerad beskrivning (English)

Image Marker for Fortnox does one thing well: it highlights every "Visa
kopplade bilder" (view attached images) icon in Fortnox in yellow, so you can
instantly see which rows have an attached image/receipt – no need to hover over
each row.

Features:
• Clear yellow highlight with border and glow on each icon.
• Counter in the popup: see how many attached-image icons are on the page.
• Count badge on the toolbar icon – visible without opening the popup.
• One-click on/off. Your choice is remembered.
• Works inside the Fortnox bookkeeping list (which runs in an iframe).

Privacy: collects nothing, sends nothing externally, no tracking. Everything
runs locally in your browser.

Unofficial extension – not affiliated with or endorsed by Fortnox AB.

---

## Skärmdumpar (du fixar dessa)

Web Store kräver minst 1 (helst 3–5), storlek **1280×800** eller 640×400.
Förslag på motiv:
1. Verifikationslistan med flera gulmarkerade bild-ikoner (huvudbilden).
2. Popupen öppen med på/av-toggeln och räknaren synlig.
3. Närbild på verktygsfältsikonen med antal-badgen.

Tips: zooma sidan till ~110–125 % innan du tar skärmdumpen så ikonerna syns
tydligt. Maska/sudda ev. känsliga belopp och kundnamn.
