import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const KlantcaseCreator = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gemeenten");
  const [branche, setBranche] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("klantcases").insert({
      title: title.trim(),
      description: description.trim(),
      category,
      branche: branche.trim() || null,
      image_url: imageUrl.trim() || null,
      header_image_url: headerImageUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      cta_label: ctaLabel.trim() || null,
      cta_url: ctaUrl.trim() || null,
      published,
    } as any);

    setLoading(false);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Klantcase aangemaakt!" });
      navigate("/klantcases");
    }
  };

  if (authLoading) return <Layout><div className="container py-16 text-center">Laden...</div></Layout>;
  if (!isAdmin) return null;

  return (
    <Layout>
      <section className="py-8 bg-muted/50">
        <div className="container">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Terug
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Nieuwe Klantcase</h1>
          <p className="text-muted-foreground mt-1">Maak een nieuwe klantcase aan met foto's en beschrijving.</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-base font-semibold">Titel *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bijv. Gemeente Amsterdam"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-base font-semibold">Categorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gemeenten">Gemeenten</SelectItem>
                  <SelectItem value="Commercieel">Commercieel</SelectItem>
                  <SelectItem value="Overig">Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="branche" className="text-base font-semibold">Branche</Label>
              <Input
                id="branche"
                value={branche}
                onChange={(e) => setBranche(e.target.value)}
                placeholder="Bijv. Horeca, Retail, Overheid, Sport"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Headerfoto (getoond op overzichtspagina)</Label>
              <div className="mt-1">
                <FileUpload
                  onUpload={(url) => setHeaderImageUrl(url)}
                  currentUrl={headerImageUrl || undefined}
                  folder="klantcases/headers"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Afbeelding (getoond op detailpagina)</Label>
              <div className="mt-1">
                <FileUpload
                  onUpload={(url) => setImageUrl(url)}
                  currentUrl={imageUrl || undefined}
                  folder="klantcases"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold">Beschrijving *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschrijf de klantcase in detail..."
                rows={8}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="video_url" className="text-base font-semibold">Video (YouTube of Vimeo URL)</Label>
              <Input
                id="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Plak een YouTube- of Vimeo-link. De video wordt ingesloten op de detailpagina.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta_label" className="text-base font-semibold">Knoptekst</Label>
                <Input
                  id="cta_label"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="Bijv. Bezoek website"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cta_url" className="text-base font-semibold">Knop-URL</Label>
                <Input
                  id="cta_url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Switch checked={published} onCheckedChange={setPublished} />
              <div>
                <Label className="text-base font-semibold">Direct publiceren</Label>
                <p className="text-sm text-muted-foreground">Maak deze klantcase zichtbaar op de website</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? "Opslaan..." : "Klantcase aanmaken"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                Annuleren
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default KlantcaseCreator;
