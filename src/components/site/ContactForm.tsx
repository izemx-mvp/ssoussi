import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(40).optional(),
  country: z.string().trim().max(80).optional(),
  type: z.string().max(40),
  message: z.string().trim().min(1, "Message requis").max(3000),
  product_ref: z.string().max(200).optional(),
});

const types = [
  { v: "devis", l: "Demande de devis" },
  { v: "particulier", l: "Particulier" },
  { v: "professionnel", l: "Professionnel / B2B" },
  { v: "export", l: "Export / distribution" },
  { v: "autre", l: "Autre" },
];

function F({ name, label, errors, children }: { name: string; label: string; errors: Record<string, string>; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );
}

export function ContactForm({ defaultType = "particulier", productRef, onDone }: { defaultType?: string; productRef?: string | undefined; onDone?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse({ ...raw, product_ref: productRef || (raw['product_ref'] as string) || undefined });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const d = parsed.data;
    const { error } = await supabase.from("contacts").insert({
      name: d.name, email: d.email, phone: d.phone || null, country: d.country || null,
      type: d.type, message: d.message, product_ref: d.product_ref || null,
    });
    setLoading(false);
    if (error) {
      toast.error("L'envoi a échoué. Merci de réessayer.");
      return;
    }
    toast.success("Merci ! Votre message a bien été envoyé.");
    (e.target as HTMLFormElement).reset();
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <F errors={errors} name="name" label="Nom"><Input id="name" name="name" className="bg-background" /></F>
      <F errors={errors} name="email" label="Email"><Input id="email" name="email" type="email" className="bg-background" /></F>
      <F errors={errors} name="phone" label="Téléphone"><Input id="phone" name="phone" className="bg-background" /></F>
      <F errors={errors} name="country" label="Pays"><Input id="country" name="country" className="bg-background" /></F>
      <div className="sm:col-span-2">
        <F errors={errors} name="type" label="Vous êtes">
          <select id="type" name="type" defaultValue={defaultType} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            {types.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </F>
      </div>
      <div className="sm:col-span-2">
        <F errors={errors} name="message" label="Votre projet">
          <Textarea id="message" name="message" rows={5} className="bg-background" placeholder="Quantités, dimensions, usage, échéance…" />
        </F>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="clay" size="xl" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Envoi…" : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  );
}
