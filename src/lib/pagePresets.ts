import { Block, BlockType } from "@/components/page-builder/blockSchema";

const b = (type: BlockType, props: Record<string, any>, children?: Block[][]): Block => ({
  id: crypto.randomUUID(),
  type,
  props,
  ...(children ? { children } : {}),
});

/**
 * Returns a starting blocks-array that mirrors the current static design of a built-in page.
 * Used by the admin "Volledige pagina" tab so editors can see and edit existing content.
 */
export const getDefaultPageBlocks = (pageKey: string): Block[] => {
  switch (pageKey) {
    case "index":
      return [
        b("hero", {
          title: "Spaarsystemen op maat",
          subtitle:
            "Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte loyaliteitssystemen. In-house ontwikkeld, flexibel en schaalbaar.",
          bgColor: "muted",
          textColor: "dark",
          ctaLabel: "Bekijk ons spaarsysteem",
          ctaLink: "/spaarsysteem",
        }),
        b("heading", { text: "Waarom Loyaltygroup?", level: 2, align: "left", marginTop: 40 }),
        b("paragraph", {
          text: "Alles in eigen beheer ontwikkeld. Geen outsourcing, geen beperkingen.",
          align: "left",
        }),
        b("row", { columns: 2, gap: 20, padding: "small", bgColor: "background" }, [
          [
            b("icon_card", {
              icon: "Settings",
              title: "Maatwerk",
              description:
                "Elk spaarsysteem wordt volledig op maat ontwikkeld, passend bij uw organisatie en doelgroep.",
            }),
          ],
          [
            b("icon_card", {
              icon: "Smartphone",
              title: "Cross Platform",
              description:
                "Onze systemen werken naadloos op desktop, tablet en mobiel voor optimaal bereik.",
            }),
          ],
        ]),
        b("row", { columns: 2, gap: 20, padding: "small", bgColor: "background" }, [
          [
            b("icon_card", {
              icon: "Users",
              title: "Gebruiksvriendelijk",
              description:
                "Intuïtieve interfaces zorgen voor hoge adoptie bij zowel beheerders als eindgebruikers.",
            }),
          ],
          [
            b("icon_card", {
              icon: "Zap",
              title: "API Koppelingen",
              description:
                "Flexibele API's voor naadloze integratie met uw bestaande systemen en processen.",
            }),
          ],
        ]),
        b("cta_banner", {
          title: "Klaar om te starten?",
          subtitle:
            "Ontdek hoe een op maat gemaakt spaarsysteem uw organisatie kan versterken. Vraag vandaag nog een demo aan.",
          ctaLabel: "Demo aanvragen",
          ctaLink: "/demo",
        }),
      ];

    case "over-ons":
      return [
        b("heading", { text: "Over Ons", level: 1, align: "center", marginTop: 40 }),
        b("paragraph", {
          text: "Loyaltygroup B.V. — uw partner voor op maat gemaakte loyaliteitsoplossingen.",
          align: "center",
        }),
        b("heading", { text: "Wie zijn wij?", level: 2, align: "left", marginTop: 40 }),
        b("paragraph", {
          text:
            "Loyaltygroup B.V. is een Nederlands softwarebedrijf gespecialiseerd in het ontwikkelen van spaarsystemen en loyaliteitsprogramma's. Wij werken voor zowel gemeenten als commerciële organisaties.",
        }),
        b("paragraph", {
          text:
            "Wat ons onderscheidt is dat wij alles in eigen huis ontwikkelen. Ons team van ervaren ontwikkelaars bouwt elk systeem volledig op maat, zonder gebruik te maken van standaard templates of externe partijen.",
        }),
        b("paragraph", {
          text:
            "Dankzij onze flexibele aanpak en diepgaande technische kennis kunnen wij snel inspelen op veranderende wensen en nieuwe mogelijkheden bieden die standaardoplossingen niet kunnen leveren.",
        }),
        b("heading", { text: "Onze Waarden", level: 2, align: "center", marginTop: 32 }),
        b("row", { columns: 2, gap: 20, padding: "small" }, [
          [
            b("icon_card", {
              icon: "Code",
              title: "In-house Ontwikkeling",
              description:
                "Al onze systemen worden volledig in eigen huis ontwikkeld door ons ervaren team. Geen outsourcing, volledige controle over kwaliteit.",
            }),
          ],
          [
            b("icon_card", {
              icon: "Users",
              title: "Klantgericht",
              description:
                "Wij luisteren naar uw wensen en vertalen die naar een oplossing die perfect aansluit bij uw organisatie en doelgroep.",
            }),
          ],
        ]),
        b("row", { columns: 2, gap: 20, padding: "small" }, [
          [
            b("icon_card", {
              icon: "Heart",
              title: "Passie voor Technologie",
              description:
                "Ons team bestaat uit gepassioneerde ontwikkelaars die altijd op zoek zijn naar de beste en meest innovatieve oplossingen.",
            }),
          ],
          [
            b("icon_card", {
              icon: "Shield",
              title: "Betrouwbaar & Veilig",
              description:
                "Veiligheid en betrouwbaarheid staan centraal in alles wat wij doen. Onze systemen voldoen aan de hoogste standaarden.",
            }),
          ],
        ]),
      ];

    default:
      return [
        b("hero", {
          title: "Pagina titel",
          subtitle: "Begin met het bewerken of het toevoegen van blokken.",
          bgColor: "muted",
          textColor: "dark",
        }),
        b("paragraph", {
          text:
            "Dit is een leeg startpunt. Voeg blokken toe via de bibliotheek links, of importeer de standaardinhoud van deze pagina als die beschikbaar is.",
        }),
      ];
  }
};

export const hasPagePreset = (pageKey: string): boolean =>
  [
    "index",
    "over-ons",
    "spaarsysteem",
    "gemeenten",
    "commercieel",
    "klantcases",
    "support",
    "demo",
    "contact",
  ].includes(pageKey);