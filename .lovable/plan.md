## Doel

Niets meer hardcoded in `src/lib/*` of in JSX van pagina's. Alle content komt uit Supabase en is bewerkbaar via het admin paneel.

## Aanpak in 5 fases

### Fase 1 — Database voorbereiden

Eén migratie met:

- **`page_presets`** tabel — voor de 462 regels uit `pagePresets.ts` (templates voor nieuwe pagina's). Velden: `key`, `name`, `description`, `blocks` (jsonb), `sort_order`.
- **`branches`** tabel — voor de 299 regels uit `brancheContent.ts`. Velden: `slug` (uniek), `name`, `icon`, `hero_title`, `hero_subtitle`, `intro`, `usps` (jsonb), `cases` (jsonb), `cta_title`, `cta_text`, `sort_order`, `published`.
- **`navigation_items`** tabel — voor het hoofdmenu. Velden: `label`, `path`, `parent_id`, `sort_order`, `published`.
- **Uitbreiding `custom_pages`** — `is_homepage` boolean + unieke index, zodat één pagina als homepage gemarkeerd kan worden en op `/` getoond wordt.

RLS: publiek leesbaar (alleen `published=true`), schrijven alleen voor admins via `has_role`. GRANTs voor `anon`, `authenticated`, `service_role`.

### Fase 2 — Content seeden

Alle huidige hardcoded waarden worden via een seed-migratie in de database gezet:

- 10 pagina's → `custom_pages` rijen met blokken die de huidige JSX één-op-één nabootsen (hero, USPs, reviews, CTA-blokken, etc.). Slugs: `home`, `commercieel`, `gemeenten`, `spaarsysteem`, `klantcases`, `support`, `over-ons`, `contact`, `demo`, `branches`.
- `home` krijgt `is_homepage=true`.
- Alle branches uit `brancheContent.ts` → `branches` rijen.
- Alle 8 presets uit `pagePresets.ts` → `page_presets` rijen.
- Menu uit `Header.tsx` → `navigation_items` rijen.

### Fase 3 — Builder uitbreiden met ontbrekende bloktypes

De huidige page-builder mist enkele bloktypes die de statische pagina's nodig hebben. Toe te voegen aan `blockSchema.ts` + `BlockRenderer.tsx`:

- `usp-grid` — bewerkbare USPs (icon + titel + tekst, n items)
- `reviews` — bewerkbare reviews-carousel
- `price-indication` — prijsblok met velden
- `demo-cta` — CTA met titel/tekst/knop
- `laagdrempelig` — bestaand blok (al aanwezig, verifiëren)
- `branche-grid` — toont alle branches uit `branches` tabel
- `branche-detail` — rendert één branche o.b.v. URL-slug

### Fase 4 — Routing herzien

`App.tsx` wordt drastisch ingekort:

```text
/                       → CustomPage (homepage, is_homepage=true)
/branches/:slug         → CustomPage met branche-detail blok
/klantcases/:id         → KlantcaseDetail (blijft, data al in DB)
/klantcases/nieuw       → KlantcaseCreator (blijft)
/admin/*                → bestaande admin-routes
/:slug                  → CustomPage (catch-all op slug)
*                       → NotFound
```

`Header.tsx` haalt menu uit `navigation_items` ipv hardcoded array.

### Fase 5 — Opruimen + admin

- Verwijderen: `src/pages/Index.tsx`, `Commercieel.tsx`, `Gemeenten.tsx`, `Spaarsysteem.tsx`, `Klantcases.tsx`, `Support.tsx`, `OverOns.tsx`, `Contact.tsx`, `Demo.tsx`, `Branches.tsx`, `Branche.tsx`.
- Verwijderen: `src/lib/brancheContent.ts`, `src/lib/pagePresets.ts`, `src/lib/builtinPages.ts`.
- `src/components/sections/*` — verwijderen óf omzetten naar pure render-componenten die het blok rendert (zonder eigen content).
- `BuiltinPageEditor` verwijderen (niet meer nodig).
- Nieuwe admin-panels:
  - **Branches** — CRUD lijst voor `branches` tabel
  - **Navigatie** — drag-en-drop menu editor voor `navigation_items`
  - **Presets** — beheer van page templates
- `PagesAdmin` — toon ook `is_homepage` toggle en alle nieuwe pagina's; presets-dropdown haalt uit DB ipv code.

## Risico's & mitigatie

- **Visuele drift**: blokken moeten exact dezelfde look geven als huidige JSX. Per pagina screenshot-vergelijking na migratie.
- **SEO**: bestaande URL's blijven werken (alle huidige paden in seed). Meta-tags via bestaande `page_seo` tabel per slug.
- **Downtime tijdens deploy**: seed-migratie draait vóór code-deploy, zodat data klaarstaat als nieuwe code live gaat.
- **Klantcases-detailpagina** blijft hardcoded component (data komt al uit DB) — buiten scope.

## Wat blijft hardcoded

- Admin-paneel UI (Admin.tsx, editors, dashboards) — dit is gereedschap, geen content
- Layout-shell (Header logo-link, Footer copyright-fallback)
- Auth-pagina's (AdminLogin, AdminActivate)
- 404-pagina
- Error states & loading skeletons
- Component-styling (Tailwind classes)

## Technische details

- Bestaande `custom_pages.published` kolom wordt hergebruikt voor publieke zichtbaarheid.
- Branches & navigatie krijgen aparte `useBranches()` / `useNavigation()` hooks die met React Query cachen.
- Catch-all route `/:slug` mag pas ná alle specifieke routes staan, anders schaduwt het `/admin` etc.
- Bij ontbrekende slug → 404 (huidige NotFound).
- Seed gebruikt `ON CONFLICT DO NOTHING` op slug zodat re-runs veilig zijn.

## Omvang

~15-25 nieuwe/aangepaste bestanden, 1 grote migratie, 1 seed-migratie. Bouw in deze volgorde uit en test na elke fase voordat de volgende start.
