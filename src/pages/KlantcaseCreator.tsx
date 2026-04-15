import { useState } from "react";
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
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { useEffect } from "react";

const KlantcaseCreator = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gemeenten");
  const [imageUrl, setImageUrl] = useState("");
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
      image_url: imageUrl.trim() || null,
      published,
    });

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
              <Label htmlFor="image" className="text-base font-semibold">Afbeelding URL</Label>
              <div className="mt-1 space-y-2">
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://voorbeeld.nl/afbeelding.jpg"
                />
                {imageUrl && (
                  <div className="relative inline-block">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg border object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {!imageUrl && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <ImagePlus className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Voer een afbeelding URL in hierboven</p>
                  </div>
                )}
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
