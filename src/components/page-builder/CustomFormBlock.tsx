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
import { CheckCircle2, Loader2 } from "lucide-react";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "url" | "date" | "textarea" | "select" | "radio" | "checkbox";
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: string[]; // for select / radio
  helpText?: string;
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

const initialValueFor = (f: FormField) => (f.type === "checkbox" ? false : "");

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
        if (f.type === "checkbox" ? !v : !String(v ?? "").trim()) {
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
      if (v && String(v).length > 5000) {
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
                />
              ) : f.type === "select" ? (
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