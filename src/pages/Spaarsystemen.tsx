import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, QrCode, Gift, Globe, Layers } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";

const systems = [
  { icon: Globe, tKey: "ss_online_title", dKey: "ss_online_desc", title: "Online Spaarsysteem", desc: "Webgebaseerd spaarsysteem toegankelijk via elk apparaat met internetverbinding." },
  { icon: CreditCard, tKey: "ss_digitaal_title", dKey: "ss_digitaal_desc", title: "Digitale Spaarpas", desc: "Vervang fysieke pasjes door een moderne digitale spaarpas in de app of wallet." },
  { icon: QrCode, tKey: "ss_klantenkaart_title", dKey: "ss_klantenkaart_desc", title: "Klantenkaart", desc: "Fysieke of digitale klantenkaart met QR-code voor snelle identificatie." },
  { icon: Smartphone, tKey: "ss_apps_title", dKey: "ss_apps_desc", title: "Mobiele Apps", desc: "Native apps voor iOS en Android met push-notificaties en locatiediensten." },
  { icon: Gift, tKey: "ss_cadeau_title", dKey: "ss_cadeau_desc", title: "Cadeaukaarten", desc: "Digitale en fysieke cadeaukaarten als onderdeel van uw loyaliteitsprogramma." },
  { icon: Layers, tKey: "ss_api_title", dKey: "ss_api_desc", title: "API Platform", desc: "Krachtige API's voor integratie met POS-systemen, webshops en CRM-software." },
];

const Spaarsystemen = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <EditableText page="spaarsystemen" contentKey="hero_title" defaultValue="Spaarsystemen" as="h1" className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
        <EditableText page="spaarsystemen" contentKey="hero_subtitle" defaultValue="Een compleet overzicht van onze loyaliteitssystemen — van digitale spaarpassen tot volledige app-oplossingen." as="p" className="text-lg text-primary-foreground/90 max-w-2xl mx-auto" multiline />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((s) => (
            <div key={s.tKey} className="border rounded-lg p-8 bg-card hover:shadow-lg transition-shadow">
              <s.icon className="h-10 w-10 text-primary mb-4" />
              <EditableText page="spaarsystemen" contentKey={s.tKey} defaultValue={s.title} as="h3" className="text-lg font-semibold mb-2" />
              <EditableText page="spaarsystemen" contentKey={s.dKey} defaultValue={s.desc} as="p" className="text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container text-center">
        <EditableText page="spaarsystemen" contentKey="cta_title" defaultValue="Welk systeem past bij u?" as="h2" className="text-2xl font-bold mb-4" />
        <EditableText page="spaarsystemen" contentKey="cta_text" defaultValue="Wij adviseren u graag over de beste oplossing voor uw situatie." as="p" className="text-muted-foreground mb-8 max-w-xl mx-auto" multiline />
        <EditableButton page="spaarsystemen" contentKey="cta_btn" defaultValue="Demo aanvragen" to="/demo" />
      </div>
    </section>
  </Layout>
);

export default Spaarsystemen;
