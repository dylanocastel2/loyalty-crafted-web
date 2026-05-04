import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, Save, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Block, BlockType, createBlock } from "@/components/page-builder/blockSchema";
import BlockLibrary from "@/components/page-builder/BlockLibrary";
import BlockCanvas, { updateBlockPropsById, getById } from "@/components/page-builder/BlockCanvas";
import BlockInspector from "@/components/page-builder/BlockInspector";
import { getBuiltinPage } from "@/lib/builtinPages";
import { getDefaultPageBlocks, hasPagePreset } from "@/lib/pagePresets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download } from "lucide-react";

type Position = "before" | "after" | "full";

const BuiltinPageEditor = () => {
  const { pageKey } = useParams<{ pageKey: string }>();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const builtin = pageKey ? getBuiltinPage(pageKey) : undefined;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState<Position>("full");
  const [beforeBlocks, setBeforeBlocks] = useState<Block[]>([]);
  const [afterBlocks, setAfterBlocks] = useState<Block[]>([]);
  const [fullBlocks, setFullBlocks] = useState<Block[]>([]);
  const [fullIsSaved, setFullIsSaved] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!builtin) return;
    const load = async () => {
      const { data } = await supabase
        .from("page_blocks")
        .select("position, blocks")
        .eq("page_key", builtin.key);
      if (data) {
        const before = data.find((r) => r.position === "before");
        const after = data.find((r) => r.position === "after");
        const full = data.find((r) => r.position === "full");
        if (before?.blocks) setBeforeBlocks(before.blocks as unknown as Block[]);
        if (after?.blocks) setAfterBlocks(after.blocks as unknown as Block[]);
        const savedFull = (full?.blocks as unknown as Block[]) || [];
        if (savedFull.length > 0) {
          setFullBlocks(savedFull);
          setFullIsSaved(true);
        } else if (hasPagePreset(builtin.key)) {
          // Auto-load preset so editor immediately shows current page contents
          setFullBlocks(getDefaultPageBlocks(builtin.key));
          setFullIsSaved(false);
        }
      }
      setLoading(false);
    };
    load();
  }, [builtin]);

  if (!builtin && !authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Onbekende pagina</p>
        <Button onClick={() => navigate("/admin/pages")}>Terug</Button>
      </div>
    );
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin || !builtin) return null;

  const blocks = active === "before" ? beforeBlocks : active === "after" ? afterBlocks : fullBlocks;
  const setBlocks = active === "before" ? setBeforeBlocks : active === "after" ? setAfterBlocks : setFullBlocks;
  const selectedBlock = selectedId ? getById(blocks, selectedId) : null;

  const importDefault = () => {
    if (!builtin) return;
    const preset = getDefaultPageBlocks(builtin.key);
    setFullBlocks(preset);
    setActive("full");
    setSelectedId(null);
    setFullIsSaved(false);
    toast({
      title: "Standaardinhoud geladen",
      description: "Pas de blokken aan en klik op Opslaan om de pagina te overschrijven.",
    });
  };

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

  const saveSlot = async (position: Position, blocksToSave: Block[]) => {
    return supabase
      .from("page_blocks")
      .upsert(
        { page_key: builtin.key, position, blocks: blocksToSave as any },
        { onConflict: "page_key,position" }
      );
  };

  const save = async () => {
    setSaving(true);
    const [r1, r2, r3] = await Promise.all([
      saveSlot("before", beforeBlocks),
      saveSlot("after", afterBlocks),
      saveSlot("full", fullBlocks),
    ]);
    setSaving(false);
    if (r1.error || r2.error || r3.error) {
      toast({ title: "Fout bij opslaan", description: (r1.error || r2.error || r3.error)?.message, variant: "destructive" });
      return;
    }
    setFullIsSaved(fullBlocks.length > 0);
    toast({ title: "Opgeslagen" });
    setPreviewKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="px-4 flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/pages")}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="font-semibold leading-tight">{builtin.label}</h1>
              <p className="text-xs text-muted-foreground">Extra blokken voor bestaande pagina</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showPreview ? "Verberg preview" : "Toon preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(builtin.path, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-1" /> Bekijken
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Opslaan
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <Tabs value={active} onValueChange={(v) => { setActive(v as Position); setSelectedId(null); }} className="flex-1 flex flex-col">
          <div className="bg-card border-b px-4">
            <TabsList>
              <TabsTrigger value="full">Volledige pagina {fullBlocks.length > 0 && `(${fullBlocks.length})`}</TabsTrigger>
              <TabsTrigger value="before">Extra boven ({beforeBlocks.length})</TabsTrigger>
              <TabsTrigger value="after">Extra onder ({afterBlocks.length})</TabsTrigger>
            </TabsList>
            {active === "full" && (
              <div className="flex items-center justify-between gap-3 py-1.5 flex-wrap">
                <p className="text-[11px] text-muted-foreground max-w-2xl">
                  {fullIsSaved
                    ? "✓ Deze pagina wordt nu aangestuurd door deze blokken. Pas direct aan en klik op Opslaan."
                    : hasPagePreset(builtin.key)
                    ? "Dit is de standaardinhoud van de pagina, geladen als blokken. Pas aan en klik Opslaan om de live pagina te vervangen."
                    : "Voeg blokken toe om de pagina te bouwen."}
                </p>
                {hasPagePreset(builtin.key) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Reset naar standaard
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset naar standaardinhoud?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hiermee worden de huidige blokken in "Volledige pagina" vervangen
                          door de originele inhoud van deze pagina. Dit is pas definitief
                          nadat je op Opslaan klikt.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={importDefault}>Reset</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>

          <TabsContent value={active} className="flex-1 mt-0">
            <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-7.5rem)]">
              <aside className="col-span-12 lg:col-span-2 bg-card border rounded-lg p-4 overflow-y-auto">
                <BlockLibrary onAdd={addBlock} />
              </aside>
              <main className={`col-span-12 ${showPreview ? "lg:col-span-4" : "lg:col-span-7"} bg-card border rounded-lg p-4 overflow-y-auto`} onClick={() => setSelectedId(null)}>
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
              {showPreview && (
                <aside className="col-span-12 lg:col-span-3 bg-card border rounded-lg overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
                    <span className="text-xs font-semibold">Live preview</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPreviewKey((k) => k + 1)} title="Vernieuwen">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1 bg-background overflow-hidden">
                    <iframe
                      key={previewKey}
                      src={builtin.path}
                      title="Live preview"
                      className="w-full h-full border-0"
                      style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "166.67%", height: "166.67%" }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground px-3 py-1.5 border-t">Klik op opslaan om de preview te updaten.</p>
                </aside>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuiltinPageEditor;