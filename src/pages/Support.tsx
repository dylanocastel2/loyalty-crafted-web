import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Download, Shield, FileIcon } from "lucide-react";
import EditableText from "@/components/EditableText";
import PageContent from "@/components/page-builder/PageContent";

const remoteSupport = [
  {
    name: "AnyDesk",
    description: "Beveiligde verbinding op afstand",
    url: "https://anydesk.com/nl",
    image: "https://www.loyaltygroup.nl/images/anydesk.jpg",
  },
  {
    name: "TeamViewer",
    description: "Beveiligde verbinding op afstand",
    url: "https://www.teamviewer.com/nl/",
    image: "https://www.loyaltygroup.nl/images/teamviewer.png",
  },
];

const drivers = [
  {
    name: "Omnikey Cardman 3121 Paslezer",
    url: "https://www.hidglobal.com/drivers?field_driver_brand_tid_selective=24&field_driver_product_reference_nid_selective=3950&field_driver_operating_systems_tid_selective=3096",
  },
  { name: "Loyalty Export Data Programma (LED)", url: "http://www.loyaltymanager.nl/downloads/LEDInst.exe" },
  { name: "ATEN UC232A Converter (Windows)", url: "http://www.loyaltymanager.nl/downloads/UC232A_Windows_Setup.exe" },
  { name: "Prolific Driver", url: "http://www.loyaltymanager.nl/downloads/profilic.zip" },
  { name: "Xiring Driver", url: "http://www.loyaltymanager.nl/downloads/xiringDriver.zip" },
];

const Support = () => (
  <Layout>
    <PageContent pageKey="support">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center">
          <EditableText page="support" contentKey="hero_title" defaultValue="Support" as="h1" className="text-4xl md:text-5xl font-bold mb-4" />
          <EditableText
            page="support"
            contentKey="hero_subtitle"
            defaultValue="Onze helpdesk staat voor u klaar. Vind hieronder hulp op afstand en downloads voor onze spaarsystemen."
            as="p"
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            multiline
          />
        </div>
      </section>

      {/* Helpdesk */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <EditableText page="support" contentKey="helpdesk_title" defaultValue="Helpdesk" as="h2" className="text-2xl md:text-3xl font-bold mb-4" />
          <EditableText
            page="support"
            contentKey="helpdesk_text"
            defaultValue="Loyaltygroup beschikt over een professioneel helpdesk team. Onze vakkundige helpdeskmedewerkers bieden servicegerichte ondersteuning en advies. Ons team beantwoordt graag al uw vragen over technische kwesties. U kunt ons van maandag tot vrijdag bellen van 09:00 tot 17:00.

Heeft u een minder dringende vraag of even geen tijd om te bellen? Stuur dan een mailtje naar helpdesk@loyaltygroup.nl of laat een berichtje achter via het contactformulier. Wij proberen altijd binnen 24 uur uw mail te beantwoorden."
            as="p"
            className="text-muted-foreground leading-relaxed whitespace-pre-line mb-8"
            multiline
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="tel:0320411356" className="flex items-center gap-3 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bel ons</p>
                <p className="font-semibold">0320 411 356</p>
              </div>
            </a>
            <a href="mailto:helpdesk@loyaltygroup.nl" className="flex items-center gap-3 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Mail ons</p>
                <p className="font-semibold text-sm">helpdesk@loyaltygroup.nl</p>
              </div>
            </a>
            <Link to="/contact" className="flex items-center gap-3 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Of via</p>
                <p className="font-semibold">Contactformulier →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Ondersteuning op afstand */}
      <section className="py-16 bg-muted/40">
        <div className="container max-w-4xl">
          <EditableText page="support" contentKey="remote_title" defaultValue="Ondersteuning op afstand" as="h2" className="text-2xl md:text-3xl font-bold mb-4" />
          <EditableText
            page="support"
            contentKey="remote_text"
            defaultValue="Als u er zelf even niet uitkomt tijdens het contact met onze helpdesk, dan kunnen onze medewerkers (alleen met uw toestemming) uw computer op afstand besturen met een beveiligde verbinding.

Download AnyDesk of TeamViewer op verzoek van de helpdesk medewerker om dit mogelijk te maken. Zodra uw probleem is opgelost, kunt u de sessie beëindigen en de verbinding verbreken."
            as="p"
            className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6"
            multiline
          />
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-card p-4 rounded-lg border mb-8">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              Wij snappen dat u bezorgd bent om uw privacy, wij ook! Daarom gebruiken wij alleen gecertificeerde software, altijd met
              een licentie. U bent er dus van verzekerd dat we alleen de meest veilige verbinding tot stand brengen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {remoteSupport.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:border-primary hover:shadow-md transition-all"
              >
                <img src={tool.image} alt={tool.name} className="h-20 object-contain mb-4" loading="lazy" />
                <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline">
                  <Download className="h-4 w-4" /> Download
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Drivers */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <EditableText page="support" contentKey="drivers_title" defaultValue="Drivers" as="h2" className="text-2xl md:text-3xl font-bold mb-3" />
          <EditableText
            page="support"
            contentKey="drivers_text"
            defaultValue="Hieronder vindt u de downloadlinks voor drivers van het offline en het online Loyalty Spaarsysteem."
            as="p"
            className="text-muted-foreground mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((d) => (
              <a
                key={d.name}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group flex items-center gap-4 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-accent grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <FileIcon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{d.name}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-primary mt-1 group-hover:underline">
                    <Download className="h-3 w-3" /> Download
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="container text-center max-w-2xl">
          <EditableText page="support" contentKey="cta_title" defaultValue="Nog vragen?" as="h2" className="text-2xl md:text-3xl font-bold mb-3" />
          <EditableText page="support" contentKey="cta_text" defaultValue="Neem direct contact op met ons team — we helpen u graag verder." as="p" className="text-muted-foreground mb-6" />
          <Link to="/contact"><Button size="lg">Naar contactformulier</Button></Link>
        </div>
      </section>
    </PageContent>
  </Layout>
);

export default Support;
