import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

const rules = [
  { id: "len", label: "Minimaal 10 tekens", test: (v: string) => v.length >= 10 },
  { id: "num", label: "Minimaal 1 cijfer", test: (v: string) => /\d/.test(v) },
  { id: "spec", label: "Minimaal 1 speciaal teken (!@#$%…)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const AdminActivate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery/invite token in the URL hash; getSession picks it up.
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) {
        toast({
          title: "Activatielink ongeldig of verlopen",
          description: "Vraag de beheerder om een nieuwe uitnodiging te sturen.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/admin/login"), 2500);
        return;
      }
      setEmail(user.email || "");
      setReady(true);
    });
  }, [navigate, toast]);

  const allValid = rules.every((r) => r.test(password)) && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast({ title: "Activeren mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account geactiveerd", description: "Je bent nu ingelogd." });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-card border rounded-xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Account activeren</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Stel een wachtwoord in voor je beheerdersaccount.
        </p>

        {!ready ? (
          <p className="text-sm text-muted-foreground">Activatielink controleren…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>E-mailadres</Label>
              <Input value={email} disabled />
            </div>
            <div>
              <Label htmlFor="pw">Wachtwoord</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
            </div>
            <div>
              <Label htmlFor="pw2">Bevestig wachtwoord</Label>
              <Input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            <ul className="space-y-1.5 text-sm bg-muted/40 rounded-md p-3">
              {rules.map((r) => {
                const ok = r.test(password);
                return (
                  <li key={r.id} className={`flex items-center gap-2 ${ok ? "text-primary" : "text-muted-foreground"}`}>
                    {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />} {r.label}
                  </li>
                );
              })}
              <li className={`flex items-center gap-2 ${password && password === confirm ? "text-primary" : "text-muted-foreground"}`}>
                {password && password === confirm ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />} Wachtwoorden komen overeen
              </li>
            </ul>

            <Button type="submit" className="w-full" disabled={!allValid || saving}>
              {saving ? "Activeren…" : "Account activeren"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminActivate;
