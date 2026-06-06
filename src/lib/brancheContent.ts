import { Building2, ShoppingBag, Utensils, HeartPulse, Store } from "lucide-react";

export interface BrancheData {
  slug: string;
  label: string;
  icon: typeof Building2;
  shortDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  problems: string[];
  opportunities: string[];
  loyaltyValue: string;
  scenarios: { title: string; text: string }[];
  features: { title: string; desc: string }[];
  whyUs: { title: string; desc: string }[];
  klantcaseFilter: string; // matches branche field in klantcases
  tone: string;
  metaTitle: string;
  metaDescription: string;
}

export const BRANCHES: BrancheData[] = [
  {
    slug: "gemeenten",
    label: "Gemeenten",
    icon: Building2,
    shortDesc: "Stadspas, minimaregelingen en lokale economie in één platform.",
    heroTitle: "Loyaliteitsoplossingen voor gemeenten",
    heroSubtitle: "Van stadspas tot minimaregeling: één betrouwbaar platform waarmee u inwoners ondersteunt én de lokale economie versterkt — volledig op maat van uw gemeente.",
    problems: [
      "Versnipperde regelingen die voor inwoners onoverzichtelijk zijn",
      "Hoge administratieve lasten en handmatige controles",
      "Beperkt inzicht in besteding van budgetten en doelbereik",
      "Lokale ondernemers die moeilijk bereikt of betrokken worden",
    ],
    opportunities: [
      "Eén digitale pas voor alle gemeentelijke regelingen",
      "Realtime rapportages op wijk-, doelgroep- of regelingniveau",
      "Direct geld terug naar lokale winkeliers in plaats van landelijke ketens",
      "Meer rechthebbenden bereikt door een laagdrempelige gebruikerservaring",
    ],
    loyaltyValue:
      "Een gemeentelijke loyaliteits- of stadspasoplossing combineert het beheer van regelingen met een prettige ervaring voor de inwoner. Tegoeden worden direct besteed bij aangesloten lokale ondernemers, wat zowel de bestaanszekerheid van inwoners als de omzet van het MKB versterkt. De gemeente houdt grip op budgetten en kan beleid bijsturen op basis van actuele cijfers — zonder dat dit ten koste gaat van de privacy van de inwoner.",
    scenarios: [
      {
        title: "Stadspas met digitale en fysieke variant",
        text: "Inwoners ontvangen één pas waarmee zij korting krijgen bij aangesloten ondernemers, deel kunnen nemen aan activiteiten en gebruik kunnen maken van minimaregelingen. De pas werkt zowel fysiek aan de kassa als digitaal in de app.",
      },
      {
        title: "Minimabudget direct besteedbaar",
        text: "Een gezin met recht op een kindpakket krijgt het budget automatisch op de pas gestort en kan dit alleen besteden binnen de afgesproken categorieën bij aangesloten lokale winkels — zonder bonnen, zonder voorschieten.",
      },
      {
        title: "Beleidsmatige rapportages",
        text: "Beleidsmedewerkers zien per maand welk percentage van het beschikbare budget daadwerkelijk wordt besteed, in welke wijken en bij welke categorieën ondernemers — input om beleid scherp bij te sturen.",
      },
    ],
    features: [
      { title: "Digitale stadspas + app", desc: "Inwoners gebruiken de pas in winkels, app of webportal — keuze aan de gebruiker." },
      { title: "Minimaregelingen", desc: "Beheer kindpakket, sport- en cultuurregelingen of energietoeslag binnen één platform." },
      { title: "Aansluiting lokale ondernemers", desc: "Eenvoudig portaal waar winkeliers zich aanmelden, transacties zien en uitbetaling ontvangen." },
      { title: "Privacy & AVG", desc: "Volledig AVG-compliant, met dataminimalisatie en strikte rolgebaseerde toegang." },
      { title: "Koppelingen", desc: "Via API te koppelen aan bestaande burgerzaken-, financiële of subsidiesystemen." },
      { title: "Rapportages en dashboards", desc: "Realtime inzicht in deelname, besteding en effect per regeling of doelgroep." },
    ],
    whyUs: [
      { title: "Eigen Nederlandse ontwikkeling", desc: "Alle software wordt in eigen huis ontwikkeld en beheerd — geen afhankelijkheid van externe partijen." },
      { title: "Maatwerk op een bewezen standaard", desc: "U start op een uitontwikkeld platform en wij voegen exact die functionaliteit toe die uw gemeente nodig heeft." },
      { title: "Korte lijnen met de helpdesk", desc: "Geen ticketdoolhof: u spreekt direct met de mensen die het systeem kennen." },
      { title: "Sterke prijs-kwaliteitsverhouding", desc: "U betaalt voor een professionele oplossing zonder de prijskaartjes van internationale leveranciers." },
    ],
    klantcaseFilter: "Gemeenten",
    tone: "gemeentelijk",
    metaTitle: "Stadspas & loyaliteitsplatform voor gemeenten | Loyaltygroup",
    metaDescription:
      "Eén digitaal platform voor stadspas, minimaregelingen en lokale economie. Volledig op maat ontwikkeld door Loyaltygroup. Plan een vrijblijvende demo.",
  },
  {
    slug: "horeca",
    label: "Horeca",
    icon: Utensils,
    shortDesc: "Vaste gasten, hogere besteding en herkenning aan tafel.",
    heroTitle: "Loyaliteitssystemen voor horeca",
    heroSubtitle: "Bouw aan een vaste gastenkring met digitale spaarpas, app en kassakoppeling — zodat elke bezoeker een herkende gast wordt en geen anonieme order.",
    problems: [
      "Veel passanten, weinig terugkerende gasten",
      "Kortingsacties die alleen op prijs concurreren in plaats van op beleving",
      "Geen zicht op wie uw beste gasten écht zijn",
      "Personeelswisselingen waardoor persoonlijke herkenning verdwijnt",
    ],
    opportunities: [
      "Herhaalbezoek belonen met punten, vouchers of upgrades",
      "Persoonlijke aanbiedingen op basis van bestelgedrag",
      "Push-berichten voor stille dagdelen of nieuwe menukaarten",
      "Inzicht in gemiddelde besteding, bezoekfrequentie en seizoenspatronen",
    ],
    loyaltyValue:
      "In de horeca beslist een gast in seconden waar hij naartoe gaat. Een goed loyaliteitsprogramma maakt van die keuze een gewoonte: gasten openen uw app, zien een vertrouwde voucher of voelen dat ze gekend worden. Dat verhoogt de bezoekfrequentie, de gemiddelde besteding én de marge, doordat u niet meer hoeft te concurreren met platte kortingsacties.",
    scenarios: [
      {
        title: "Digitale spaarpas in eigen app",
        text: "Gasten sparen automatisch punten bij elke bestelling — afgerekend via de kassa of via een QR-code op tafel. Bij een drempelwaarde ontvangen ze een vrije keuze uit een door u samengesteld beloningsmenu.",
      },
      {
        title: "Push op rustige momenten",
        text: "Op een rustige dinsdagavond stuurt u een gerichte push naar gasten die normaal op woensdag komen: 'vandaag dubbele punten op uw favoriete gerecht'.",
      },
      {
        title: "Cadeaukaarten als extra omzet",
        text: "Verkoop digitale en fysieke cadeaukaarten die direct in uw kassa- en spaarsysteem werken — een doorlopende extra omzetstroom met hoge marge.",
      },
    ],
    features: [
      { title: "Digitale spaarpas en app", desc: "Gasten sparen via app, fysieke pas of telefoonnummer — wat het beste past." },
      { title: "Kassakoppeling", desc: "Punten worden automatisch toegekend en beloningen direct verzilverd aan de kassa." },
      { title: "Vouchers en acties", desc: "Stuur tijdelijke acties, verjaardagsvouchers of welkomstgeschenken met enkele klikken." },
      { title: "Push-berichten", desc: "Direct contact met uw vaste gasten zonder dure mailcampagnes." },
      { title: "Cadeaukaarten", desc: "Fysiek én digitaal, naadloos verwerkt in uw kassa en boekhouding." },
      { title: "Inzichten per gast", desc: "Bezoekfrequentie, gemiddelde besteding en favoriete gerechten — bruikbaar voor uw team." },
    ],
    whyUs: [
      { title: "Werkt naast uw kassa", desc: "Wij koppelen aan de meest gebruikte kassasystemen of leveren een eenvoudig alternatief." },
      { title: "Volledig in uw huisstijl", desc: "De app, pas en beloningen ogen alsof u ze zelf hebt laten ontwerpen — geen sjabloon." },
      { title: "Persoonlijke begeleiding", desc: "Een vaste contactpersoon helpt u het programma uit te rollen en te optimaliseren." },
      { title: "Eerlijke prijsstelling", desc: "Geen percentage over uw omzet, maar een transparant maandtarief dat past bij uw zaak." },
    ],
    klantcaseFilter: "Horeca",
    tone: "horeca",
    metaTitle: "Loyaliteitsprogramma voor horeca | Loyaltygroup",
    metaDescription:
      "Digitale spaarpas, kassakoppeling en cadeaukaarten voor restaurants, cafés en horecaketens. Op maat ontwikkeld door Loyaltygroup. Plan een demo.",
  },
  {
    slug: "retail",
    label: "Retail",
    icon: ShoppingBag,
    shortDesc: "Omnichannel klantenbinding, ook tussen filialen en webshop.",
    heroTitle: "Loyaliteitsplatform voor retail",
    heroSubtitle: "Verbind kassa, webshop en app tot één klantbeleving — waarbij elke aankoop telt en elke klant herkend wordt, ongeacht het kanaal.",
    problems: [
      "Klanten die online en offline als losse personen worden behandeld",
      "Generieke kortingsbonnen die marge kosten zonder loyaliteit op te bouwen",
      "Versnipperde data tussen kassa, webshop en CRM",
      "Concurrentie van grote ketens met eigen apps en miles-programma's",
    ],
    opportunities: [
      "Eén klantprofiel over filiaal, webshop en app heen",
      "Persoonlijke aanbiedingen op basis van werkelijke aankoophistorie",
      "Sparen en verzilveren in elk verkoopkanaal",
      "Sterke band tussen winkelier en klant, ook zonder duur reclamebudget",
    ],
    loyaltyValue:
      "Retail draait op marges, frequentie en herkenning. Een loyaliteitsplatform bindt klanten aan uw winkel of keten zonder dat u permanent hoeft te stunten met prijzen. Klanten sparen met elke aankoop, ontvangen relevante aanbiedingen en voelen zich onderdeel van uw merk — een sterke buffer tegen prijsvechters en marketplaces.",
    scenarios: [
      {
        title: "Spaarpas in webshop én winkel",
        text: "Een klant scant zijn pas of app in de winkel, koopt later online verder en ziet hetzelfde puntensaldo terug bij het afrekenen op de webshop.",
      },
      {
        title: "Gepersonaliseerde campagnes",
        text: "Op basis van eerdere aankopen krijgt een klant alleen relevante aanbiedingen toegestuurd — wat zorgt voor hogere conversie en minder uitschrijvingen.",
      },
      {
        title: "Winkeliersvereniging-spaarsysteem",
        text: "Meerdere winkels in een winkelgebied sparen samen met één pas — klanten worden gestimuleerd om in het centrum te blijven in plaats van uit te wijken naar een meubelboulevard.",
      },
    ],
    features: [
      { title: "Omnichannel pas en app", desc: "Eén klantbeleving over filialen, webshop en app heen." },
      { title: "Kassakoppelingen", desc: "Werkt met de meest gangbare Nederlandse kassasystemen." },
      { title: "Webshop-integratie", desc: "Koppelingen met de bekendste e-commerceplatformen en custom webshops via API." },
      { title: "Cadeaukaarten", desc: "Eigen cadeaukaarten, fysiek en digitaal, inwisselbaar in alle kanalen." },
      { title: "Campagne-tools", desc: "Stuur acties, vouchers of push-berichten op basis van aankoopsegmenten." },
      { title: "CRM en rapportages", desc: "Inzicht in topklanten, herhaalaankopen en marketing-effectiviteit." },
    ],
    whyUs: [
      { title: "Eigen ontwikkeling, geen afhankelijkheid", desc: "Wij bouwen, hosten en onderhouden alles zelf — u krijgt rechtstreeks antwoord van de makers." },
      { title: "Maatwerk binnen een standaard", desc: "Snel live op een bewezen platform en de ruimte om unieke wensen toe te voegen." },
      { title: "Schaalt mee", desc: "Van één winkel tot een landelijke keten of franchise — dezelfde betrouwbare basis." },
      { title: "Sterke prijs-kwaliteit", desc: "Een professionele oplossing zonder de tarieven van internationale loyalty-suites." },
    ],
    klantcaseFilter: "Retail",
    tone: "retail",
    metaTitle: "Loyaliteitsprogramma voor retail | Loyaltygroup",
    metaDescription:
      "Omnichannel spaarpas, app en cadeaukaarten voor winkels, ketens en franchises. Op maat ontwikkeld in Nederland. Plan vandaag een demo.",
  },
  {
    slug: "zorg",
    label: "Zorg",
    icon: HeartPulse,
    shortDesc: "Waardering, deelname en welzijn — zonder commerciële schreeuwerigheid.",
    heroTitle: "Loyaliteits- en waarderingsoplossingen voor de zorg",
    heroSubtitle: "Versterk de band met cliënten, mantelzorgers, vrijwilligers en medewerkers met een rustig, betrouwbaar platform — volledig afgestemd op de toon van uw organisatie.",
    problems: [
      "Vrijwilligers en mantelzorgers waarderen die meer dan een attentie verdienen",
      "Verschillende deelregelingen voor cliënten die slecht zichtbaar zijn",
      "Veel handmatig werk rond vergoedingen, bonnen en kleine budgetten",
      "Behoefte aan rust en privacy in plaats van commerciële marketing",
    ],
    opportunities: [
      "Eén rustige plek waar deelnemers tegoeden, regelingen en activiteiten zien",
      "Gerichte waardering voor vrijwilligers, mantelzorgers en medewerkers",
      "Eenvoudige verantwoording naar bestuurders en financiers",
      "Lagere administratielast door digitale afhandeling",
    ],
    loyaltyValue:
      "In de zorg gaat loyaliteit niet over korting, maar over erkenning en deelname. Een goed ingericht platform geeft mantelzorgers, vrijwilligers, cliënten en medewerkers een tastbare blijk van waardering en maakt regelingen overzichtelijk. De organisatie houdt grip op besteding en kan eenvoudig laten zien wat met de middelen wordt gedaan — zonder dat het systeem aanvoelt als een commerciële webshop.",
    scenarios: [
      {
        title: "Mantelzorgwaardering",
        text: "Geregistreerde mantelzorgers ontvangen jaarlijks een tegoed dat zij digitaal kunnen besteden bij geselecteerde partners — zonder bonnetjes, zonder voorschieten.",
      },
      {
        title: "Vrijwilligers belonen",
        text: "Vrijwilligers verzamelen 'punten' per uur inzet en kunnen die inwisselen voor cursussen, activiteiten of kleine attenties — een eenvoudige manier om grote waardering te tonen.",
      },
      {
        title: "Activiteitenpas voor cliënten",
        text: "Cliënten gebruiken één pas voor toegang tot activiteiten, een kop koffie of deelname aan uitjes — beheerders zien direct welke activiteiten leven.",
      },
    ],
    features: [
      { title: "Digitale pas met rust in beeld", desc: "Eenvoudige interface, grote knoppen, geen commerciële prikkels." },
      { title: "Tegoeden en regelingen", desc: "Beheer mantelzorgtegoeden, vrijwilligersbeloningen en activiteitenbudgetten in één platform." },
      { title: "Privacy by design", desc: "Strikte rollen en minimale data — passend bij de zorgcontext." },
      { title: "Aangesloten partners", desc: "Lokale ondernemers, dagbestedingslocaties of activiteitenaanbieders sluiten eenvoudig aan." },
      { title: "Rapportages voor bestuur", desc: "Inzicht in deelname en besteding voor verantwoording naar bestuur en financiers." },
      { title: "AVG-compliant en veilig gehost", desc: "Hosting binnen de EU, met passende beveiligingsmaatregelen." },
    ],
    whyUs: [
      { title: "Geen luidruchtig marketingplatform", desc: "Onze interfaces passen bij de waardige toon van een zorgorganisatie." },
      { title: "Maatwerk in tone of voice", desc: "Naamgeving, kleuren en beloningen sluiten aan bij uw organisatie en doelgroep." },
      { title: "Korte lijnen", desc: "Eén vast aanspreekpunt voor zowel beleid, beheer als techniek." },
      { title: "Voordelige prijsstelling", desc: "Een betaalbare oplossing zonder dure licentiestructuren — relevant in een sector met krappe budgetten." },
    ],
    klantcaseFilter: "Zorg",
    tone: "zorg",
    metaTitle: "Loyaliteits- en waarderingsplatform voor de zorg | Loyaltygroup",
    metaDescription:
      "Digitale waardering voor mantelzorgers, vrijwilligers en cliënten. Rustig, veilig en op maat ontwikkeld door Loyaltygroup. Plan een demo.",
  },
  {
    slug: "winkeliersverenigingen",
    label: "Winkeliersverenigingen",
    icon: Store,
    shortDesc: "Eén pas, één app, één centrum dat samen sterker staat.",
    heroTitle: "Spaarsystemen voor winkeliersverenigingen en centrummanagement",
    heroSubtitle: "Bind bezoekers aan uw winkelgebied met één gezamenlijke spaarpas of app — een sterke buffer tegen webshops en perifere ketens.",
    problems: [
      "Bezoekers die kiezen voor meubelboulevards of grote webshops",
      "Winkeliers die individueel te klein zijn om een eigen programma op te zetten",
      "Versnipperde acties zonder gezamenlijke kracht",
      "Geen inzicht in bezoekstromen en gezamenlijke besteding",
    ],
    opportunities: [
      "Eén gezamenlijke spaarpas die in elke aangesloten winkel werkt",
      "Gemeenschappelijke acties en evenementen ondersteunen vanuit één platform",
      "Lokaal geld blijft lokaal: punten verzilveren bij de buurman",
      "Bestuur ziet objectieve cijfers over deelname en gezamenlijke omzet",
    ],
    loyaltyValue:
      "Een winkeliersvereniging of centrummanagement staat sterker door samen te opereren. Een gezamenlijk loyaliteitsprogramma maakt de meerwaarde van het centrum tastbaar voor de bezoeker — die spaart in elke aangesloten winkel en wisselt vervolgens in waar hij maar wil. Dat houdt bestedingen binnen het gebied, vergroot de bezoekfrequentie en geeft het bestuur harde cijfers om beleid en activiteiten op te bouwen.",
    scenarios: [
      {
        title: "Gezamenlijke spaarpas",
        text: "Bezoekers ontvangen één pas of digitale variant. Of zij nu bij de bakker of de modezaak afrekenen — punten zijn overal inwisselbaar binnen het centrum.",
      },
      {
        title: "Centrumcampagnes",
        text: "Bij een seizoenscampagne ontvangen alle leden dezelfde tijdelijke voucher die zij naar eigen smaak inzetten — gezamenlijke kracht, eigen invulling per winkelier.",
      },
      {
        title: "Inzicht voor centrummanager",
        text: "Het bestuur ziet geanonimiseerd hoeveel bezoekers actief sparen, in welke branches besteed wordt en welke acties écht aanslaan.",
      },
    ],
    features: [
      { title: "Gezamenlijke pas en app", desc: "Eén systeem voor alle aangesloten winkels — direct toegankelijk voor leden." },
      { title: "Per-winkelier beheer", desc: "Iedere ondernemer ziet zijn eigen transacties en kan eigen acties opzetten." },
      { title: "Centraal bestuur", desc: "Bestuur of centrummanager beheert leden, rapportages en gezamenlijke campagnes." },
      { title: "Eerlijke verrekening", desc: "Heldere verrekening van uitgegeven en ingewisselde punten tussen leden." },
      { title: "Cadeaukaarten", desc: "Een eigen cadeaukaart voor het hele winkelgebied — verkocht én geaccepteerd door alle leden." },
      { title: "Marketing-tools", desc: "Push, nieuwsbrief en campagne-acties vanuit één plek voor het hele centrum." },
    ],
    whyUs: [
      { title: "Ervaring met collectieven", desc: "Wij draaien spaarsystemen voor winkeliersverenigingen en weten waar de gevoeligheden zitten." },
      { title: "In eigen huisstijl", desc: "De pas en app krijgen de naam en uitstraling van uw centrum — niet die van een softwareleverancier." },
      { title: "Korte lijnen voor bestuur en leden", desc: "Eén aanspreekpunt voor bestuur en hulp dichtbij voor individuele ondernemers." },
      { title: "Betaalbaar voor collectieven", desc: "Een prijsstelling die past bij collectieve budgetten en mee kan groeien met het aantal leden." },
    ],
    klantcaseFilter: "Winkeliersverenigingen",
    tone: "centrum",
    metaTitle: "Gezamenlijke spaarpas voor winkeliersverenigingen | Loyaltygroup",
    metaDescription:
      "Een gezamenlijke spaarpas en app voor winkeliersverenigingen en centrummanagement. Houd bestedingen lokaal. Plan een demo bij Loyaltygroup.",
  },
];

export const getBranche = (slug: string) => BRANCHES.find((b) => b.slug === slug);