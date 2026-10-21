export type ContactRow = {
  name: string;
  email: string;
  phone?: string | undefined;
  country?: string | undefined;
  type: string;
  message: string;
  product_ref?: string | undefined;
};

// Mirrors the RLS check on public.contacts (name 1–120, email 3–255, message 1–3000).
export const CONTACT_LIMITS = { name: 120, email: 255, message: 3000 } as const;

/** Insert an enquiry into the Lovable Cloud `contacts` table. Throws on failure. */
export async function submitContact(row: ContactRow) {
  // Loaded on submit so supabase-js stays out of the initial bundle.
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.from("contacts").insert({
    name: row.name.slice(0, CONTACT_LIMITS.name),
    email: row.email.slice(0, CONTACT_LIMITS.email),
    phone: row.phone || null,
    country: row.country || null,
    type: row.type,
    message: row.message.slice(0, CONTACT_LIMITS.message),
    product_ref: row.product_ref || null,
  });
  if (error) throw error;
}
