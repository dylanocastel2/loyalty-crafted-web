## Doel

Alle publieke pagina's worden volledig database-gestuurd via `custom_pages` + de bestaande paginabouwer. De huidige look (lay-out, font, kleuren, blok-spacings) blijft 1-op-1 hetzelfde. Na deze migratie kun je iedere pagina aanpassen door alleen Supabase + de paginabouwer te gebruiken — geen code-wijzigingen meer nodig.

## Aanpak per pagina

1. Ik bouw elke statische pagina opnieuw op als rij blocks in de paginabouwer.
2. Bestaande hardcoded secties (USPGrid, ReviewsBlock, PriceIndication, DemoCTA, Laagdrempelig, DemoForm, BrancheGrid) worden **nieuwe blok-types** in de paginabouwer met dezelfde JSX/styling — zodat het visueel identiek blijft maar via de bouwer is in te stellen.
3. `custom_pages` krijgt een `is_homepage` flag (al aanwezig) zodat één page als `/` kan dienen.
4. Routing in `App.tsx` wordt drastisch ingekort: alleen admin-routes, klantcase-detail/creator en alle overige paden gaan via `CustomPage` op basis van slug.
5. De oude `src/pages/*.tsx` bestanden en `src/components/sections/*` blijven nog even staan tot de visuele check klaar is, en worden daarna verwijderd.

## Nieuwe blok-types (presentational, niet bewerkbaar via tekst-velden — alleen instellingen)

| Blok | Bron-bestand | Instellingen in bouwer |
|---|---|---|
| `usp_grid` | `USPGrid.tsx` | titel, USP-lijst (icon/title/desc), kolommen, achtergrond |
| `reviews` | `ReviewsBlock.tsx` | titel, review-lijst, score |
| `price_indication` | `PriceIndication.tsx` | titel, items, cta |
| `demo_cta` | `DemoCTA.tsx` | variant (`gradient`/`muted`), titel, knoplabel, link |
| `demo_form` | `DemoForm.tsx` | titel, intro |
| `laagdrempelig` | `LaagdrempeligBlock.tsx` | titel, bullets |
| `branche_grid` | uit `useBranches` | titel, filter, kolommen |
| `branche_detail` | dynamic via `:slug` param | (rendert de geselecteerde branche-pagina) |

Voor `branche_detail` werkt het zo: één `custom_pages`-rij met slug `branche-template` bevat het block; de route `/branches/:slug` mount `CustomPage` met die template en het block leest de juiste branche uit `useBranche(slug)`.

## Database-werk

- **Seed `custom_pages`**: 1 rij per pagina met de juiste blocks-JSON. (Homepage, gemeenten, commercieel, spaarsysteem, klantcases-overzicht, support, over-ons, contact, demo, branches-overzicht, branche-template.)
- **`navigation_items`** is al aanwezig — `Header.tsx` blijft die lezen.
- Geen schema-wijziging nodig; alleen data-inserts.

## Routing-wijziging (App.tsx)

Voor / na:

```text
voor:                                 na:
/                  → Index            /                       → CustomPage (is_homepage=true)
/gemeenten         → Gemeenten        /branches/:slug         → CustomPage (branche-template)
/commercieel       → Commercieel      /klantcases/nieuw       → KlantcaseCreator (blijft)
/spaarsysteem      → Spaarsysteem     /klantcases/:id         → KlantcaseDetail (blijft)
/klantcases        → Klantcases       /admin/*                → admin pagina's (blijven)
/over-ons          → OverOns          /:slug                  → CustomPage (catch-all)
/contact           → Contact          *                       → NotFound
...
```

## Wat *niet* bewerkbaar wordt

- `Header.tsx` zelf (logo, mobile-menu logica) — menu-items zijn al data.
- `Footer.tsx` is al via `useFooterConfig`.
- Admin-pagina's, login, 404.
- Klantcase-detailpagina (`KlantcaseDetail.tsx`) — die leest al uit DB, layout is vast.

## Risico's & mitigatie

- **Visuele drift**: ik vergelijk per pagina (screenshot oud vs. nieuw) voordat ik de oude `.tsx` verwijder.
- **SEO**: bestaande meta-tags per slug staan in `page_seo`; `CustomPage` leest meta uit `custom_pages` velden — ik kopieer beide bij seed.
- **Downtime**: data eerst seeden, daarna routing omschakelen in dezelfde release.

## Volgorde van uitvoering

1. Nieuwe blok-types toevoegen aan `blockSchema.ts`, `BlockRenderer.tsx` + inspector-velden (`BlockInspector.tsx`).
2. Seed `custom_pages` met de 11 pagina's via één data-migratie (insert-tool).
3. Visuele check per pagina via `/p/<slug>` (deze route bestaat al).
4. Routing in `App.tsx` omschakelen — homepage + catch-all + branche-template.
5. Oude `src/pages/*.tsx` en `src/components/sections/*` verwijderen, plus `BuiltinPageEditor` en `pagePresets.ts`.
6. `PagesAdmin` krijgt knop "Stel in als homepage" (toggle `is_homepage`).

## Geschat werk

Groot. ~15-20 bestanden aanmaken/wijzigen, 1 grote data-seed-migratie. Ik werk in deze volgorde, lever na stap 3 een eerste visuele check zodat je goedkeuring kunt geven vóór routing-omschakeling (stap 4).

## Bevestiging

Akkoord = ik start met stap 1 (nieuwe blok-types). Of wil je een variant — bijvoorbeeld de bestaande secties als "smart blocks" laten zodat de teksten daarvan via `page_content` blijven, of juist alle teksten via blok-instellingen?