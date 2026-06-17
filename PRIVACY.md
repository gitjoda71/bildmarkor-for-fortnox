# Integritetspolicy – Bildmarkör för Fortnox

_Senast uppdaterad: 2026-06-17_

## Kort version

Tillägget samlar **inte** in någon data, skickar **inget** till någon server
och innehåller **ingen** spårning eller analys. Allt arbete sker lokalt i din
webbläsare.

## Vad tillägget gör

Bildmarkör för Fortnox letar upp "Visa kopplade bilder"-ikoner på sidor under
`*.fortnox.se` och ritar en gul markering på dem. Det räknar även hur många
sådana ikoner som finns och visar antalet i popupen och som en siffra på
tilläggets verktygsfältsikon.

## Data som lagras

- En enda inställning – om markeringen är **på eller av** – sparas i
  `chrome.storage.local`. Den ligger kvar i din webbläsarprofil och lämnar
  aldrig din dator.

Ingen annan data lagras. Inga personuppgifter, inget bokföringsinnehåll, inga
sidadresser och inga identifierare samlas in eller överförs.

## Behörigheter och varför de behövs

- **`host_permissions: https://*.fortnox.se/*`** och **`scripting`** – för att
  läsa sidans innehåll och rita markeringen direkt i Fortnox-flikar (inklusive
  den iframe där bokföringslistan ligger). Används enbart för markering och
  räkning, ingenting skickas vidare.
- **`storage`** – för att komma ihåg på/av-läget.

## Externa anrop

Inga. Tillägget gör inga nätverksanrop över huvud taget.

## Kontakt

Frågor om integritet: skapa ett ärende (issue) i GitHub-repot.
