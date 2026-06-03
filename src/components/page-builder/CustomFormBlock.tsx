import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Star } from "lucide-react";

export interface FormField {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "url"
    | "date"
    | "time"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "checkbox_group"
    | "rating"
    | "range";
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: string[]; // for select / radio
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  multiple?: boolean; // allow multi-select for "select"
}

interface Props {
  formId: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  fields: FormField[];
  maxWidth?: number;
}

const initialValueFor = (f: FormField): any => {
  if (f.type === "checkbox") return false;
  if (f.type === "checkbox_group") return [] as string[];
  if (f.type === "select" && f.multiple) return [] as string[];
  if (f.type === "rating") return 0;
  if (f.type === "range") return f.min ?? 0;
  return "";
};

const CustomFormBlock = ({
  formId,
  title,
  description,
  submitLabel = "Versturen",
  successMessage = "Bedankt! Je inzending is ontvangen.",
  fields,
  maxWidth = 640,
}: Props) => {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, any>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, initialValueFor(f)]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (id: string, v: any) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = values[f.id];
      if (f.required) {
        const empty =
          f.type === "checkbox"
            ? !v
            : f.type === "checkbox_group" || (f.type === "select" && f.multiple)
            ? !Array.isArray(v) || v.length === 0
            : f.type === "rating"
            ? !v || Number(v) < 1
            : !String(v ?? "").trim();
        if (empty) {
          next[f.id] = "Verplicht veld";
          return;
        }
      }
      if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
        next[f.id] = "Voer een geldig e-mailadres in";
      }
      if (v && f.type === "url" && !/^https?:\/\//.test(String(v))) {
        next[f.id] = "URL moet beginnen met http(s)://";
      }
      if (f.type === "number" && v !== "" && v != null) {
        const n = Number(v);
        if (Number.isNaN(n)) next[f.id] = "Voer een geldig getal in";
        else if (f.min != null && n < f.min) next[f.id] = `Minimaal ${f.min}`;
        else if (f.max != null && n > f.max) next[f.id] = `Maximaal ${f.max}`;
      }
      if ((f.type === "text" || f.type === "textarea") && v) {
        const len = String(v).length;
        if (f.minLength != null && len < f.minLength) next[f.id] = `Minimaal ${f.minLength} tekens`;
        else if (f.maxLength != null && len > f.maxLength) next[f.id] = `Maximaal ${f.maxLength} tekens`;
      }
      if (typeof v === "string" && v.length > 5000) {
        next[f.id] = "Maximaal 5000 tekens";
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      form_id: formId,
      form_title: title || null,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      data: fields.reduce<Record<string, any>>((acc, f) => {
        acc[f.label || f.id] = values[f.id];
        return acc;
      }, {}),
    };
    const { error } = await supabase.from("form_submissions").insert(payload);
    setSubmitting(false);
    if (error) {
      toast({ title: "Versturen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full flex justify-center">
        <div
          className="w-full bg-card border rounded-xl p-8 text-center shadow-sm"
          style={{ maxWidth }}
        >
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="text-base font-medium text-foreground">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full bg-card border rounded-xl p-6 md:p-8 shadow-sm space-y-5"
        style={{ maxWidth }}
      >
        {title && <h3 className="text-xl md:text-2xl font-bold text-foreground">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
        )}

        {fields.map((f) => {
          const err = errors[f.id];
          const common = {
            id: `${formId}-${f.id}`,
            "aria-invalid": !!err,
            "aria-describedby": err ? `${formId}-${f.id}-err` : undefined,
          };
          return (
            <div key={f.id} className="space-y-1.5">
              {f.type !== "checkbox" && (
                <Label htmlFor={common.id} className="text-sm">
                  {f.label}
                  {f.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
              )}

              {f.type === "textarea" ? (
                <Textarea
                  {...common}
                  value={values[f.id] || ""}
                  onChange={(e) => update(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.rows || 4}
                  maxLength={f.maxLength}
                />
              ) : f.type === "select" && !f.multiple ? (
                <Select value={values[f.id] || ""} onValueChange={(v) => update(f.id, v)}>
                  <SelectTrigger id={common.id}>
                    <SelectValue placeholder={f.placeholder || "Maak een keuze"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options || []).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : f.type === "select" && f.multiple ? (
                <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1 bg-background">
                  {(f.options || []).map((opt) => {
                    const arr: string[] = Array.isArray(values[f.id]) ? values[f.id] : [];
                    const checked = arr.includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer px-1 py-0.5 hover:bg-muted rounded">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            const next = c ? [...arr, opt] : arr.filter((x) => x !== opt);
                            update(f.id, next);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : f.type === "checkbox_group" ? (
                <div className="space-y-1.5">
                  {(f.options || []).map((opt) => {
                    const arr: string[] = Array.isArray(values[f.id]) ? values[f.id] : [];
                    const checked = arr.includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            const next = c ? [...arr, opt] : arr.filter((x) => x !== opt);
                            update(f.id, next);
                          }}
                        />
                        <span className="font-normal">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : f.type === "rating" ? (
                <div className="flex items-center gap-1" id={common.id}>
                  {Array.from({ length: f.max || 5 }).map((_, idx) => {
                    const n = idx + 1;
                    const active = (Number(values[f.id]) || 0) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => update(f.id, values[f.id] === n ? 0 : n)}
                        className="p-0.5"
                        aria-label={`${n} sterren`}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            active ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    );
                  })}
                  {values[f.id] ? (
                    <span className="text-xs text-muted-foreground ml-2">{values[f.id]} / {f.max || 5}</span>
                  ) : null}
                </div>
              ) : f.type === "range" ? (
                <div className="space-y-1">
                  <input
                    id={common.id}
                    type="range"
                    min={f.min ?? 0}
                    max={f.max ?? 100}
                    step={f.step ?? 1}
                    value={values[f.id] ?? f.min ?? 0}
                    onChange={(e) => update(f.id, Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{f.min ?? 0}</span>
                    <span className="font-medium text-foreground">{values[f.id] ?? f.min ?? 0}</span>
                    <span>{f.max ?? 100}</span>
                  </div>
                </div>
              ) : f.type === "radio" ? (
                <RadioGroup value={values[f.id] || ""} onValueChange={(v) => update(f.id, v)}>
                  {(f.options || []).map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`${common.id}-${opt}`} />
                      <Label htmlFor={`${common.id}-${opt}`} className="text-sm font-normal">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : f.type === "checkbox" ? (
                <div className="flex items-start gap-2">
                  <Checkbox
                    id={common.id}
                    checked={!!values[f.id]}
                    onCheckedChange={(c) => update(f.id, !!c)}
                  />
                  <Label htmlFor={common.id} className="text-sm font-normal leading-tight">
                    {f.label}
                    {f.required && <span className="text-destructive ml-0.5">*</span>}
                  </Label>
                </div>
              ) : (
                <Input
                  {...common}
                  type={f.type}
                  value={values[f.id] || ""}
                  onChange={(e) => update(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  min={f.type === "number" ? f.min : undefined}
                  max={f.type === "number" ? f.max : undefined}
                  step={f.type === "number" ? f.step : undefined}
                  minLength={f.type === "text" ? f.minLength : undefined}
                  maxLength={f.type === "text" ? f.maxLength : undefined}
                />
              )}

              {f.helpText && !err && (
                <p className="text-xs text-muted-foreground">{f.helpText}</p>
              )}
              {err && (
                <p id={`${formId}-${f.id}-err`} className="text-xs text-destructive">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </div>
  );
};

export default CustomFormBlock;