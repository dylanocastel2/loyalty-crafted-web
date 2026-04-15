import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KlantcaseData {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  header_image_url: string | null;
  branche: string | null;
  created_at: string;
}

const KlantcaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [kcase, setKcase] = useState<KlantcaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("klantcases")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      setKcase(data as KlantcaseData | null);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center text-muted-foreground">Laden...</div>
      </Layout>
    );
  }

  if (!kcase) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Klantcase niet gevonden</h1>
          <Link to="/klantcases">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Terug naar klantcases
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const headerImg = kcase.header_image_url || kcase.image_url;

  return (
    <Layout>
      {/* Header image */}
      {headerImg ? (
        <div className="w-full h-64 md:h-96 overflow-hidden relative">
          <img
            src={headerImg}
            alt={kcase.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container pb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">{kcase.category}</span>
            {kcase.branche && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded">{kcase.branche}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">{kcase.title}</h1>
          </div>
        </div>
      ) : (
        <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
          <div className="container text-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">{kcase.category}</span>
            {kcase.branche && (
              <span className="text-xs bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded">{kcase.branche}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mt-2">{kcase.title}</h1>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <Link to="/klantcases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Terug naar klantcases
          </Link>

          {kcase.image_url && kcase.header_image_url && (
            <img
              src={kcase.image_url}
              alt={kcase.title}
              className="w-full rounded-lg mb-8 max-h-96 object-cover"
            />
          )}

          <div className="prose prose-lg max-w-none">
            {kcase.description.split("\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default KlantcaseDetail;
