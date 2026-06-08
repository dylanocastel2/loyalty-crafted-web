import { Block, BlockType } from "@/components/page-builder/blockSchema";
import { getBranche } from "./brancheContent";

const b = (type: BlockType, props: Record<string, any>, children?: Block[][]): Block => ({
  id: crypto.randomUUID(),
  type,
  props,
  ...(children ? { children } : {}),
});

const buildBrancheBlocks = (slug: string): Block[] | null => {
  const data = getBranche(slug);
  if (!data) return null;
  const label = data.label;
  const labelLower = label.toLowerCase();

  return [
    b("hero", {
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      bgColor: "muted",
      textColor: "dark",
      ctaLabel: "Plan een demo",
      ctaLink: "/demo",
    }),
    b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "start", bgColor: "background" }, [
      [
        b("heading", { text: "Herkenbare uitdagingen", level: 2, align: "left" }),
        b("feature_list", { items: data.problems.map((p) => ({ title: p, description: "" })) }),
      ],
      [
        b("heading", { text: "Kansen met een loyaliteitsplatform", level: 2, align: "left" }),
        b("feature_list", { items: data.opportunities.map((p) => ({ title: p, description: "" })) }),
      ],
    ]),
    b("container", { content: "", bgColor: "muted", padding: "small" }),
    b("heading", { text: `Hoe loyaliteit waarde toevoegt in ${labelLower}`, level: 2, align: "left", marginTop: 32 }),
    b("paragraph", { text: data.loyaltyValue, align: "left" }),
    b("row", { columns: 3, gap: 20, padding: "medium" },
      data.scenarios.map((s) => [
        b("heading", { text: s.title, level: 3, align: "left" }),
        b("paragraph", { text: s.text, align: "left" }),
      ]),
    ),
    b("heading", { text: "Functionaliteiten die ertoe doen", level: 2, align: "left", marginTop: 32 }),
    b("paragraph", {
      text: `Een greep uit de modules die we voor ${labelLower} doorgaans inzetten — we voegen alleen toe wat u écht gebruikt.`,
      align: "left",
    }),
    b("row", { columns: 3, gap: 20, padding: "medium" },
      data.features.map((f) => [
        b("icon_card", { icon: "Sparkles", title: f.title, description: f.desc, iconColor: "primary" }),
      ]),
    ),
    b("heading", { text: "Maatwerk in uw huisstijl, gebouwd op een bewezen standaard", level: 2, align: "left", marginTop: 32 }),
    b("paragraph", {
      text: "U start niet bij nul. Loyaltygroup levert een uitontwikkeld standaardplatform en voegt daar exact die functionaliteit, vormgeving en koppelingen aan toe die uw organisatie nodig heeft. Het resultaat: snel live, en tóch een oplossing die zich volledig naar uw merk en processen voegt.",
      align: "left",
    }),
    b("row", { columns: 2, gap: 20, padding: "medium" },
      [
        data.whyUs.slice(0, Math.ceil(data.whyUs.length / 2)).flatMap((w) => [
          b("icon_card", { icon: "Check", title: w.title, description: w.desc, iconColor: "primary" }),
        ]),
        data.whyUs.slice(Math.ceil(data.whyUs.length / 2)).flatMap((w) => [
          b("icon_card", { icon: "Check", title: w.title, description: w.desc, iconColor: "primary" }),
        ]),
      ],
    ),
    b("klantcases", {
      view: "short",
      mode: "latest",
      selectedIds: [],
      limit: 6,
      columns: 3,
      showBranche: true,
      showCategory: true,
      title: `Klantcases uit ${labelLower}`,
      bgColor: "background",
      padding: "medium",
      showFilter: false,
    }),
    b("cta_banner", {
      title: `Klaar voor loyaliteit in ${labelLower}?`,
      subtitle: "Plan een vrijblijvende demo of vraag een prijsindicatie aan.",
      ctaLabel: "Plan een demo",
      ctaLink: "/demo",
    }),
  ];
};

/**
 * Returns a starting blocks-array that mirrors the current static design of a built-in page.
 * Used by the admin "Volledige pagina" tab so editors can see and edit existing content.
 */
export const getDefaultPageBlocks = (pageKey: string): Block[] => {
  if (pageKey.startsWith("branche-")) {
    const blocks = buildBrancheBlocks(pageKey.slice("branche-".length));
    if (blocks) return blocks;
  }
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
        b("search_bar", {
          placeholder: "Waar bent u naar op zoek?",
          buttonLabel: "Zoek",
          maxWidth: 560,
          align: "center",
          variant: "rounded",
          showButton: true,
          bgColor: "background",
          padding: "small",
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

    case "spaarsysteem":
      return [
        b("heading", { text: "Spaarsysteem", level: 1, align: "left", marginTop: 32 }),
        b("paragraph", {
          text:
            "Met het Loyalty Spaarsysteem kunnen klanten met hun aankopen sparen voor beloningen die u zelf kunt samenstellen. Met de gratis meegeleverde CRM Tools houdt u klanten altijd op de hoogte van de laatste nieuwtjes, acties en aanbiedingen.",
        }),
        b("row", { columns: 3, gap: 24, padding: "medium" }, [
          [b("icon_card", { icon: "Database", title: "Complete Pakketten", description: "Al onze spaaroplossingen werken in combinatie met het Loyalty Spaarsysteem." })],
          [b("icon_card", { icon: "Share2", title: "Gezamenlijke Systemen", description: "Voor MKB, ketens, franchises, winkeliersverenigingen en gemeentes." })],
          [b("icon_card", { icon: "Settings", title: "Oplossingen op Maat", description: "Wij ontwikkelen al onze software in eigen huis. Als u het kunt bedenken, dan kunnen wij het maken!" })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("heading", { text: "Online Spaarsysteem", level: 2, align: "left" }), b("paragraph", { text: "De pasklare spaaroplossing om de klantenbinding te versterken. Met een fysieke spaarpas, smartphone app, cadeaukaarten en uitgebreide CRM Tools." })],
          [b("image", { url: "https://www.loyaltygroup.nl/images/online-spaarsysteem-spaarsystemen.jpg", alt: "Online Spaarsysteem", width: "100%", align: "center" })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("image", { url: "https://www.loyaltygroup.nl/images/digitale-spaarpas-spaarsystemen.jpg", alt: "Digitale Spaarpas", width: "100%", align: "center" })],
          [b("heading", { text: "Digitale Spaarpas", level: 2, align: "left" }), b("paragraph", { text: "Liever geen fysieke kaarten? Uw klanten kunnen hun spaarpas en cadeaukaarten in de Loyalty App gebruiken. Nu ook met vouchers, push-berichten, webshopkoppeling en nog veel meer." })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("heading", { text: "Klantenkaart", level: 2, align: "left" }), b("paragraph", { text: "Stimuleer uw klanten om vaker terug te komen met de Loyalty Spaarpas. Met een uniek design en saldochecker op uw eigen website." })],
          [b("image", { url: "https://www.loyaltygroup.nl/images/klantenkaart.jpg", alt: "Klantenkaart", width: "100%", align: "center" })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("image", { url: "https://www.loyaltygroup.nl/images/loyalty-apps-spaarsystemen.png", alt: "Loyalty Apps", width: "100%", align: "center" })],
          [b("heading", { text: "Loyalty Apps", level: 2, align: "left" }), b("paragraph", { text: "Met de Loyalty App kunnen klanten meer dan alleen sparen. Nu met o.a. vouchers, push-berichten en webshopkoppeling." })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("heading", { text: "Cadeaukaarten", level: 2, align: "left" }), b("paragraph", { text: "Het meest feestelijke geschenk van Nederland. Werkt ook in combinatie met de Spaarpas en Loyalty App." })],
          [b("image", { url: "https://www.loyaltygroup.nl/images/cadeaukaarten.jpg", alt: "Cadeaukaarten", width: "100%", align: "center" })],
        ]),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "center" }, [
          [b("image", { url: "https://www.loyaltygroup.nl/images/kassakoppelingen-spaarsystemen.jpg", alt: "Kassakoppelingen", width: "100%", align: "center" })],
          [b("heading", { text: "Kassakoppelingen", level: 2, align: "left" }), b("paragraph", { text: "Het Loyalty Spaarsysteem kan gekoppeld worden aan de kassa. Sparen is nog nooit zo makkelijk geweest." })],
        ]),
        b("container", { content: "Hoe werkt het?", bgColor: "muted", padding: "small" }),
        b("row", { columns: 4, gap: 20, padding: "medium", bgColor: "muted" }, [
          [b("icon_card", { icon: "Search", title: "1. Analyse & Advies", description: "Wij analyseren uw situatie en adviseren over de beste aanpak voor uw loyaliteitsprogramma." })],
          [b("icon_card", { icon: "PenTool", title: "2. Ontwerp & Ontwikkeling", description: "Ons team ontwerpt en bouwt uw spaarprogramma volledig op maat, in eigen huis." })],
          [b("icon_card", { icon: "Plug", title: "3. Implementatie", description: "Naadloze implementatie met koppelingen aan uw bestaande systemen via onze API's." })],
          [b("icon_card", { icon: "Rocket", title: "4. Lancering & Support", description: "Wij begeleiden de lancering en bieden doorlopende ondersteuning en optimalisatie." })],
        ]),
        b("feature_list", {
          items: [
            { title: "Volledig op maat gemaakt", description: "" },
            { title: "In-house ontwikkeld team", description: "" },
            { title: "Geen outsourcing", description: "" },
            { title: "Flexibele aanpassingen", description: "" },
            { title: "Doorlopende ondersteuning", description: "" },
            { title: "Schaalbare architectuur", description: "" },
            { title: "AVG-compliant", description: "" },
            { title: "Uitgebreide rapportages", description: "" },
          ],
        }),
        b("image_cards", {
          title: "Service",
          subtitle: "Loyaltygroup probeert iedereen zo persoonlijk mogelijk te helpen en onze klanten zijn doorgaans uitermate content met de diensten die wij verlenen.",
          columns: 3,
          bgColor: "background",
          padding: "medium",
          items: [
            { image: "https://www.loyaltygroup.nl/images/overstappen.jpg", title: "Overstappen", description: "Heeft u al een klantenbestand? Wij kunnen deze overzetten naar het Loyalty Spaarsysteem." },
            { image: "https://www.loyaltygroup.nl/images/onderhoud_installatie.jpg", title: "Installatie & Onderhoud", description: "Wij zorgen dat u in de winkel aan de slag kunt en op de achtergrond houden we het systeem up-to-date." },
            { image: "https://www.loyaltygroup.nl/images/sales.jpg", title: "Sales & Marketing", description: "Met onze jarenlange ervaring in CRM en loyalty kunnen wij u helpen uw doelstellingen te realiseren." },
          ],
        }),
        b("cta_banner", {
          title: "Wilt u weten wat Loyaltygroup voor u kan betekenen?",
          subtitle: "Wij komen graag geheel vrijblijvend bij u langs om de vele mogelijkheden van het Loyalty Spaarsysteem te demonstreren.",
          ctaLabel: "Demo aanvragen",
          ctaLink: "/demo",
        }),
      ];

    case "gemeenten":
      return [
        b("hero", {
          title: "Oplossingen voor Gemeenten",
          subtitle: "Versterk uw gemeente met een op maat gemaakt spaarsysteem. Van stadspassen tot minimaregelingen — alles in één platform.",
          bgColor: "muted",
          textColor: "dark",
          ctaLabel: "Demo aanvragen",
          ctaLink: "/demo",
        }),
        b("heading", { text: "Wat bieden wij gemeenten?", level: 2, align: "center", marginTop: 32 }),
        b("row", { columns: 3, gap: 20, padding: "medium" }, [
          [b("icon_card", { icon: "CreditCard", title: "Stadspas", description: "Digitale stadspas voor inwoners met kortingen bij lokale ondernemers." })],
          [b("icon_card", { icon: "Users", title: "Regelingen", description: "Beheer minimaregelingen en subsidies via één centraal platform." })],
          [b("icon_card", { icon: "BarChart3", title: "Lokale Economie", description: "Stimuleer de lokale economie door inwoners naar winkelgebieden te leiden." })],
        ]),
        b("row", { columns: 3, gap: 20, padding: "medium" }, [
          [b("icon_card", { icon: "Shield", title: "Privacy & Veiligheid", description: "AVG-compliant systeem met hoge beveiligingsstandaarden." })],
          [b("icon_card", { icon: "Landmark", title: "Gemeentelijk Beheer", description: "Volledig beheerpaneel voor ambtenaren met rapportages en analyses." })],
          [b("icon_card", { icon: "Building2", title: "Integraties", description: "Naadloze koppeling met bestaande gemeentelijke systemen via API's." })],
        ]),
        b("cta_banner", {
          title: "Interesse in een samenwerking?",
          subtitle: "Neem contact met ons op voor een vrijblijvend gesprek over de mogelijkheden voor uw gemeente.",
          ctaLabel: "Contact opnemen",
          ctaLink: "/contact",
        }),
      ];

    case "commercieel":
      return [
        b("hero", {
          title: "Commerciële Loyaliteitsoplossingen",
          subtitle: "Bouw duurzame klantrelaties op met een op maat gemaakt loyaliteitsprogramma dat past bij uw merk.",
          bgColor: "muted",
          textColor: "dark",
          ctaLabel: "Demo aanvragen",
          ctaLink: "/demo",
        }),
        b("heading", { text: "Voordelen voor uw bedrijf", level: 2, align: "center", marginTop: 32 }),
        b("row", { columns: 3, gap: 20, padding: "medium" }, [
          [b("icon_card", { icon: "TrendingUp", title: "Klantenbinding", description: "Verhoog klantloyaliteit met een persoonlijk spaarprogramma." })],
          [b("icon_card", { icon: "QrCode", title: "Digitale Spaarpas", description: "Moderne digitale spaarpas via app of webportal." })],
          [b("icon_card", { icon: "Gift", title: "Beloningen", description: "Flexibel beloningssysteem met punten, kortingen en cadeaus." })],
        ]),
        b("row", { columns: 3, gap: 20, padding: "medium" }, [
          [b("icon_card", { icon: "BarChart3", title: "CRM & Analytics", description: "Uitgebreide klantinzichten en rapportages voor betere besluitvorming." })],
          [b("icon_card", { icon: "Repeat", title: "Herhaalaankopen", description: "Stimuleer herhaalaankopen en verhoog de gemiddelde orderwaarde." })],
          [b("icon_card", { icon: "ShoppingBag", title: "Omnichannel", description: "Werkt in-store, online en via mobiele apps voor maximaal bereik." })],
        ]),
        b("cta_banner", {
          title: "Start vandaag nog",
          subtitle: "Ontdek hoe een loyaliteitsprogramma op maat uw bedrijf kan laten groeien.",
          ctaLabel: "Neem contact op",
          ctaLink: "/contact",
        }),
      ];

    case "klantcases":
      return [
        b("heading", { text: "Klantcases", level: 1, align: "center", marginTop: 32 }),
        b("paragraph", { text: "Ontdek hoe wij organisaties helpen met op maat gemaakte loyaliteitsoplossingen.", align: "center" }),
        b("paragraph", { text: "ℹ️  De daadwerkelijke klantcases worden automatisch geladen op de live pagina vanuit het beheer. Pas hier de tekst en CTA's aan.", align: "center" }),
        b("cta_banner", {
          title: "Wilt u de volgende succescase zijn?",
          subtitle: "",
          ctaLabel: "Neem contact op",
          ctaLink: "/contact",
        }),
      ];

    case "support":
      return [
        b("heading", { text: "Support", level: 1, align: "center", marginTop: 32 }),
        b("paragraph", { text: "Wij staan voor u klaar. Vind antwoorden op veelgestelde vragen of neem direct contact op.", align: "center" }),
        b("faq", {
          items: [
            { question: "Hoe lang duurt de ontwikkeling van een spaarsysteem?", answer: "De doorlooptijd varieert per project, maar gemiddeld duurt een implementatie 6-12 weken, afhankelijk van de complexiteit en gewenste integraties." },
            { question: "Kunnen jullie koppelen met ons bestaande systeem?", answer: "Ja, wij ontwikkelen API's op maat voor naadloze integratie met POS-systemen, CRM-software, webshops en andere bestaande systemen." },
            { question: "Is het systeem AVG-compliant?", answer: "Absoluut. Privacy en veiligheid staan centraal in onze ontwikkeling. Alle systemen voldoen aan de AVG-wetgeving." },
            { question: "Bieden jullie ook ondersteuning na de lancering?", answer: "Ja, wij bieden doorlopende ondersteuning, onderhoud en optimalisatie na de lancering van uw spaarsysteem." },
            { question: "Wat kost een spaarsysteem?", answer: "De kosten zijn afhankelijk van uw wensen en de complexiteit van het project. Neem contact met ons op voor een vrijblijvende offerte." },
          ],
        }),
        b("heading", { text: "Nog vragen?", level: 2, align: "center", marginTop: 32 }),
        b("row", { columns: 3, gap: 20, padding: "medium", bgColor: "muted" }, [
          [b("icon_card", { icon: "Mail", title: "E-mail", description: "info@loyaltygroup.nl" })],
          [b("icon_card", { icon: "Phone", title: "Telefoon", description: "Ma-Vr 9:00 - 17:00" })],
          [b("icon_card", { icon: "MessageSquare", title: "Contact", description: "Gebruik ons contactformulier voor al uw vragen." })],
        ]),
      ];

    case "demo":
      return [
        b("heading", { text: "Demo Aanvragen", level: 1, align: "center", marginTop: 32 }),
        b("paragraph", { text: "Ervaar onze spaarsystemen in actie. Vraag een vrijblijvende demo aan.", align: "center" }),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "start" }, [
          [b("contact_form", { title: "Vul het formulier in" })],
          [
            b("heading", { text: "Wat kunt u verwachten?", level: 3, align: "left" }),
            b("feature_list", {
              items: [
                { title: "Persoonlijke demonstratie op maat", description: "" },
                { title: "Overzicht van alle mogelijkheden", description: "" },
                { title: "Antwoord op al uw vragen", description: "" },
                { title: "Vrijblijvend en kosteloos", description: "" },
                { title: "Reactie binnen 24 uur", description: "" },
              ],
            }),
          ],
        ]),
      ];

    case "contact":
      return [
        b("heading", { text: "Contact", level: 1, align: "center", marginTop: 32 }),
        b("paragraph", { text: "Neem contact met ons op. Wij helpen u graag verder.", align: "center" }),
        b("row", { columns: 2, gap: 32, padding: "medium", verticalAlign: "start" }, [
          [b("contact_form", { title: "Stuur ons een bericht" })],
          [
            b("heading", { text: "Contactgegevens", level: 3, align: "left" }),
            b("icon_card", { icon: "Mail", title: "E-mail", description: "info@loyaltygroup.nl" }),
            b("icon_card", { icon: "Phone", title: "Telefoon", description: "Ma-Vr 9:00 - 17:00" }),
            b("icon_card", { icon: "MapPin", title: "Adres", description: "Nederland" }),
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