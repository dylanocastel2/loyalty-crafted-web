# Plan: Loyaltygroup content- en conversie-uitbreiding

Doel: van een functionele site naar een vertrouwenwekkende, inhoudelijk rijke B2B-site die prospects ervan overtuigt om een demo te plannen — zonder bestaande teksten weg te gooien.

## 1. Nieuwe & uitgebreide pagina's

**Branche-overzicht** — `/branches`
- Hero met branche-keuze (kaarten: Gemeenten, Horeca, Retail, Zorg, Winkeliersverenigingen/Centrummanagement) — zelfde patroon als homepage-audience-selector
- Korte uitleg waarom Loyaltygroup per branche relevant is
- CTA: plan een demo + vraag prijsindicatie

**Branchepagina's** — `/branches/:slug` (5 pagina's, elk volledig uitgeschreven)
- `gemeenten` (vervangt huidige /gemeenten waar zinvol, behoudt bestaande tekst)
- `horeca`
- `retail`
- `zorg`
- `winkeliersverenigingen`

Elke branchepagina bevat:
1. Branchegerichte hero: herkenbare problemen + kansen, in tone-of-voice van die sector
2. Sectie "Hoe loyaliteit waarde toevoegt in [branche]" — concreet, met scenario's
3. Relevante functionaliteiten (3–6 met icoon + uitleg)
4. Sectie "Waarom Loyaltygroup voor [branche]" — USP's vertaald naar die markt
5. Klantcases-blok gefilterd op die branche (gebruikt bestaand KlantcasesBlock)
6. Maatwerk-bewijssectie: "standaardproduct + maatwerk in jouw huisstijl"
7. Reviewblok (placeholder-quotes voor admin)
8. Prijs-kwaliteit blok ("vanaf-indicatie op aanvraag")
9. Demo-CTA + contactformulier met "Plan een demo"

## 2. Homepage-uitbreidingen (bestaande content blijft)

- USP-band onder hero (8 USP's compact): eigen softwareontwikkeling, maatwerk, betrouwbaarheid, korte lijnen, veel mogelijkheden, prijs-kwaliteit, integraties, flexibiliteit
- Social proof: reviewquotes-carrousel (placeholders) + bestaand klantcases-blok prominenter
- Sectie "Veel mogelijkheden, laagdrempelig in gebruik" met 2-koloms layout
- Sectie "Waarom organisaties voor Loyaltygroup kiezen" met de 8 USP's uitgewerkt
- Prijs-kwaliteit teaser (geen bedragen) met CTA "Vraag prijsindicatie"
- Onderaan: demo-contactformulier (naam, organisatie, e-mail, telefoon, branche, gewenste demodatum, bericht) — gebruikt bestaande `contact_submissions` tabel + e-mailflow

## 3. Productpagina (Spaarsysteem) verdieping

- Diepere uitleg per onderdeel: Online Spaarsysteem, Digitale Spaarpas, Klantenkaart, Apps, Cadeaukaarten, API-koppelingen, Beheeromgeving
- Per onderdeel: wat is het, voor wie, kernfuncties, voorbeeldscenario
- Sectie "Standaardproduct + maatwerk" met visueel onderscheid
- Sectie "Integraties & koppelingen"
- Demo-CTA blok onderaan

## 4. Overige bestaande pagina's verrijken

- `/over-ons`: EEAT-versterking — eigen ontwikkeling, team, ervaring, betrouwbaarheid, korte lijnen. Behoudt bestaande tekst.
- `/support`: helpdesk-USP uitwerken, responsetijden, contactkanalen
- `/contact` & `/demo`: nadrukkelijke "Plan een demo" CTA en uitleg wat de prospect kan verwachten

## 5. Globale componenten

- **`DemoCTA` component** — herbruikbaar blok dat op elke pagina onderaan komt ("Plan vrijblijvend een demo")
- **`USPGrid` component** — herbruikbare USP-tegels (8 USP's, korte uitleg per USP)
- **`ReviewsBlock` component** — quotes-carrousel; werkt met `page_content` keys zodat admin via CMS kan vullen (jij levert quotes later)
- **`PriceIndicationBlock`** — prijs-kwaliteit zonder bedragen + CTA prijsindicatie
- **`HomepageDemoForm`** — uitgebreid formulier (naam, organisatie, e-mail, telefoon, branche, gewenste datum, bericht) → schrijft naar `contact_submissions`, triggert bestaande mail edge function

## 6. SEO & EEAT

- Per (branche)pagina: unieke `<title>`, meta description, canonical, og-tags via bestaande SeoFields/`page_seo`
- JSON-LD: `Organization` op homepage, `Service`/`Product` op spaarsysteem, `FAQPage` waar relevant, `BreadcrumbList` op branchepagina's
- Semantische H1/H2/H3-structuur, alt-teksten, interne linking tussen branches ↔ klantcases ↔ spaarsysteem
- E-E-A-T: auteurschap ("door het team van Loyaltygroup"), ervaring (jaren, aantal klanten geanonimiseerd), expertise (eigen ontwikkeling NL), betrouwbaarheid (helpdesk, korte lijnen)

## 7. Content-aanpak

- Volledig uitgeschreven Nederlandse content per sectie (geen lege placeholders behalve de reviewquotes die jij aanlevert — die krijgen duidelijk neutrale platform-quotes als CMS-default)
- Tone: zakelijk, modern, overtuigend, niet wervend-overdreven
- Bestaande teksten blijven; nieuwe content wordt eromheen en eronder toegevoegd

## Technische opzet

- Nieuwe route `/branches` en `/branches/:slug` in `App.tsx`
- Branchecontent in `src/lib/brancheContent.ts` (typed object met hero/USP's/functionaliteiten/scenario per branche) → één React-component rendert op basis van slug
- Header-nav krijgt "Branches" item (vervangt of plaatst naast Spaarsystemen)
- Migration: nieuwe kolom `branche_slug` op `klantcases` (optioneel) **OF** filtering blijft via bestaande `branche` tekstkolom — kies de bestaande aanpak om migrationsdruk te beperken
- Form-edge-function `send-contact-notification` wordt hergebruikt; nieuw onderwerp "Demo-aanvraag via homepage" / "Demo-aanvraag [branche]"
- Geen wijziging aan auth/RLS

## Volgorde van uitvoeren

1. Globale componenten (DemoCTA, USPGrid, ReviewsBlock, PriceIndicationBlock, HomepageDemoForm) + brancheContent-data
2. Routes + nav-update + `/branches` overzicht + branche-template
3. Homepage uitbreidingen
4. Spaarsysteem-pagina verdieping
5. Bestaande pagina's (Over Ons, Support, Contact, Demo) verrijken + DemoCTA toevoegen
6. SEO meta + JSON-LD per pagina
7. Visuele check via preview op desktop + mobiel

Akkoord? Dan begin ik bij stap 1. Dit wordt een aantal grote edits achter elkaar.
