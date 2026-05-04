import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Save, Loader2 } from "lucide-react";
import { Undo2, Redo2 } from "lucide-react";
import { Block, BlockType, createBlock } from "@/components/page-builder/blockSchema";
import BlockLibrary from "@/components/page-builder/BlockLibrary";
import BlockCanvas, { updateBlockPropsById, getById } from "@/components/page-builder/BlockCanvas";
import BlockInspector from "@/components/page-builder/BlockInspector";
import SeoFields, { SeoData } from "@/components/page-builder/SeoFields";
import PageSettingsForm, { PageSettingsData } from "@/components/page-builder/PageSettings";
import { useBlockHistory } from "@/hooks/useBlockHistory";

const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/[àáâäæ]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o").replace(/[ùúûü]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

const PageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nieuw";
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [seo, setSeo] = useState<SeoData>({
    meta_title: "", meta_description: "", meta_keywords: "",
    og_title: "", og_description: "", og_image_url: "", canonical_url: "",
  });
  const [settings, setSettings] = useState<PageSettingsData>({
    published: false, show_in_menu: false, menu_label: "", menu_order: 0,
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isNew) return;
    const fetch = async () => {
      const { data, error } = await supabase.from("custom_pages").select("*").eq("id", id!).maybeSingle();
      if (error || !data) {
        toast({ title: "Pagina niet gevonden", variant: "destructive" });
        navigate("/admin");
        return;
      }
      setTitle(data.title);
      setSlug(data.slug);
      setSlugTouched(true);
      setBlocks((data.blocks as unknown as Block[]) || []);
      setSeo({
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
        og_title: data.og_title || "",
        og_description: data.og_description || "",
        og_image_url: data.og_image_url || "",
        canonical_url: data.canonical_url || "",
      });
      setSettings({
        published: data.published,
        show_in_menu: data.show_in_menu,
        menu_label: data.menu_label || "",
        menu_order: data.menu_order || 0,
      });
      setLoading(false);
    };
    fetch();
  }, [id, isNew, navigate, toast]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const selectedBlock = selectedId ? getById(blocks, selectedId) : null;

  const addBlock = (type: BlockType) => {
    const block = createBlock(type);
    setBlocks([...blocks, block]);
    setSelectedId(block.id);
  };

  const updateSelected = (props: Record<string, any>) => {
    if (!selectedId) return;
    setBlocks(updateBlockPropsById(blocks, selectedId, props));
  };

  const deleteBlock = (bid: string) => {
    setBlocks(blocks.filter((b) => b.id !== bid));
    if (selectedId === bid) setSelectedId(null);
  };

  const duplicateBlock = (bid: string) => {
    const idx = blocks.findIndex((b) => b.id === bid);
    if (idx < 0) return;
    const orig = blocks[idx];
    const copy: Block = { ...orig, id: crypto.randomUUID(), props: JSON.parse(JSON.stringify(orig.props)) };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    setBlocks(next);
  };

  const save = async (publish?: boolean) => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Titel en slug zijn verplicht", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      blocks: blocks as any,
      ...seo,
      ...settings,
      ...(publish !== undefined ? { published: publish } : {}),
    };

    let result;
    if (isNew) {
      result = await supabase.from("custom_pages").insert(payload).select().single();
    } else {
      result = await supabase.from("custom_pages").update(payload).eq("id", id!).select().single();
    }
    setSaving(false);
    if (result.error) {
      toast({ title: "Fout bij opslaan", description: result.error.message, variant: "destructive" });
      return;
    }
    if (publish !== undefined) setSettings({ ...settings, published: publish });
    toast({ title: publish ? "Gepubliceerd" : "Opgeslagen" });
    if (isNew && result.data) navigate(`/admin/pages/${result.data.id}/edit`, { replace: true });
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="px-4 flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}><ArrowLeft className="h-4 w-4" /></Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pagina titel"
                className="font-semibold max-w-xs"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">/p/</span>
              <Input
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                placeholder="slug"
                className="text-xs max-w-[200px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} title="Ongedaan maken (Ctrl+Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} title="Opnieuw (Ctrl+Shift+Z)">
              <Redo2 className="h-4 w-4" />
            </Button>
            {settings.published && !isNew && (
              <Button variant="outline" size="sm" onClick={() => window.open(`/p/${slug}`, "_blank")}>
                <Eye className="h-4 w-4 mr-1" /> Bekijken
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Opslaan
            </Button>
            {settings.published ? (
              <Button size="sm" variant="secondary" onClick={() => save(false)} disabled={saving}>Concept maken</Button>
            ) : (
              <Button size="sm" onClick={() => save(true)} disabled={saving}>Publiceren</Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
          <div className="bg-card border-b px-4">
            <TabsList>
              <TabsTrigger value="blocks">Blokken</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Instellingen</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="blocks" className="flex-1 mt-0">
            <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-7.5rem)]">
              <aside className="col-span-12 lg:col-span-3 bg-card border rounded-lg p-4 overflow-y-auto">
                <BlockLibrary onAdd={addBlock} />
              </aside>
              <main className="col-span-12 lg:col-span-6 bg-card border rounded-lg p-4 overflow-y-auto" onClick={() => setSelectedId(null)}>
                <div onClick={(e) => e.stopPropagation()}>
                  <BlockCanvas
                    blocks={blocks}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onChange={setBlocks}
                  />
                </div>
              </main>
              <aside className="col-span-12 lg:col-span-3 bg-card border rounded-lg p-4 overflow-y-auto">
                <BlockInspector block={selectedBlock} onChange={updateSelected} />
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="p-6">
            <SeoFields data={seo} onChange={setSeo} />
          </TabsContent>

          <TabsContent value="settings" className="p-6">
            <PageSettingsForm data={settings} onChange={setSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageEditor;
