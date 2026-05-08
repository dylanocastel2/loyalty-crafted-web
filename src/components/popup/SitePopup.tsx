import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

type Option = { label: string; next?: string | null };
type Question = {
  id: string;
  type: "choice" | "text";
  label: string;
  placeholder?: string;
  options?: Option[];
};

type Config = {
  id: string;
  enabled: boolean;
  title: string;
  delay_seconds: number;
  frequency: "once" | "session" | "always";
  show_on_pages: string[];
  questions: Question[];
};

type Answer = { question_id: string; question: string; answer: string };

function shouldShowOnPath(pages: string[], path: string) {
  if (!pages || pages.length === 0) return true;
  if (pages.includes("*")) return true;
  return pages.some((p) => p === path || (p.endsWith("/*") && path.startsWith(p.slice(0, -2))));
}

function storageKeyFor(id: string) {
  return `lg_popup_${id}_seen`;
}

export default function SitePopup() {
  const location = useLocation();
  const [config, setConfig] = useState<Config | null>(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [textValue, setTextValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    let active = true;
    supabase
      .from("popup_configs")
      .select("*")
      .eq("enabled", true)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        const cfg = data as unknown as Config;
        if (!cfg.questions || cfg.questions.length === 0) return;
        if (!shouldShowOnPath(cfg.show_on_pages, location.pathname)) return;

        // Frequency check
        const key = storageKeyFor(cfg.id);
        if (cfg.frequency === "once" && localStorage.getItem(key)) return;
        if (cfg.frequency === "session" && sessionStorage.getItem(key)) return;

        const t = setTimeout(() => {
          if (!active) return;
          setConfig(cfg);
          setCurrentId(cfg.questions[0].id);
          setAnswers([]);
          setTextValue("");
          setSubmitted(false);
          setOpen(true);
        }, Math.max(0, cfg.delay_seconds) * 1000);

        return () => clearTimeout(t);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const currentQuestion = useMemo(
    () => config?.questions.find((q) => q.id === currentId) || null,
    [config, currentId],
  );

  const submit = async (finalAnswers: Answer[]) => {
    if (!config) return;
    await supabase.from("popup_responses").insert([
      {
        popup_id: config.id,
        page_path: location.pathname,
        answers: finalAnswers as unknown as any,
      },
    ]);
    const key = storageKeyFor(config.id);
    if (config.frequency === "once") localStorage.setItem(key, "1");
    else if (config.frequency === "session") sessionStorage.setItem(key, "1");
    setSubmitted(true);
  };

  const onChoice = async (opt: Option) => {
    if (!currentQuestion) return;
    const next: Answer[] = [
      ...answers,
      { question_id: currentQuestion.id, question: currentQuestion.label, answer: opt.label },
    ];
    setAnswers(next);
    if (opt.next) {
      setCurrentId(opt.next);
      setTextValue("");
    } else {
      await submit(next);
    }
  };

  const onTextSubmit = async () => {
    if (!currentQuestion) return;
    const value = textValue.trim();
    if (!value) return;
    const next: Answer[] = [
      ...answers,
      { question_id: currentQuestion.id, question: currentQuestion.label, answer: value },
    ];
    setAnswers(next);
    await submit(next);
  };

  if (!config) return null;

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    if (config.frequency === "once") localStorage.setItem(storageKeyFor(config.id), "1");
    else if (config.frequency === "session") sessionStorage.setItem(storageKeyFor(config.id), "1");
  };

  return (
    <div
      role="dialog"
      aria-label={config.title || "Feedback"}
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border bg-background shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <button
        onClick={dismiss}
        aria-label="Sluiten"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="p-4 pr-8">
        <h3 className="text-sm font-semibold mb-3">{config.title || "Hallo"}</h3>
        {submitted ? (
          <p className="text-sm text-muted-foreground">Bedankt voor uw feedback!</p>
        ) : currentQuestion ? (
          <div className="space-y-3">
            <p className="text-sm">{currentQuestion.label}</p>
            {currentQuestion.type === "choice" ? (
              <div className="flex flex-wrap gap-2">
                {(currentQuestion.options || []).map((opt, i) => (
                  <Button
                    key={i}
                    size="sm"
                    onClick={() => onChoice(opt)}
                    variant={i === 0 ? "default" : "outline"}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  rows={2}
                  placeholder={currentQuestion.placeholder || "Uw antwoord..."}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={dismiss}>
                    Overslaan
                  </Button>
                  <Button size="sm" onClick={onTextSubmit} disabled={!textValue.trim()}>
                    Versturen
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}