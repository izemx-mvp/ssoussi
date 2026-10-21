import { z } from "zod";

import { submitContact } from "@/lib/contacts";
import { requestTypes } from "./knowledge";

export const leadSchema = z
  .object({
    name: z.string().trim().min(1, "required").max(120, "tooLong"),
    email: z.union([z.literal(""), z.string().trim().email("invalidEmail").max(255, "tooLong")]),
    phone: z
      .string()
      .trim()
      .max(40, "tooLong")
      .refine((v) => v === "" || /^[+()\d\s.-]{6,}$/.test(v), "invalidPhone"),
    country: z.string().trim().max(80, "tooLong"),
    requestType: z.enum(requestTypes),
    message: z.string().trim().max(2000, "tooLong"),
  })
  .refine((v) => v.email !== "" || v.phone !== "", { message: "emailOrPhone", path: ["email"] });

export type Lead = z.infer<typeof leadSchema>;

/**
 * Save a chat lead into `prospects` with the browser Supabase client.
 * `prospects` only accepts service-role writes until an anon INSERT policy is added
 * (see docs/AUDIT.md) — in that case the lead falls back to `contacts`, which accepts
 * public inserts but needs an email.
 */
export async function submitLead(lead: Lead, context: { page: string; locale: string }) {
  const notes = [
    lead.message || "—",
    `Pays : ${lead.country || "—"}`,
    `Source : assistant du site (${context.locale}) — ${context.page}`,
  ].join("\n");

  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.from("prospects").insert({
    name: lead.name,
    email: lead.email || null,
    phone: lead.phone || null,
    interest: lead.requestType,
    notes,
  });
  if (!error) return "prospects" as const;

  if (!lead.email) throw error;
  await submitContact({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    type: lead.requestType,
    message: `[Assistant] ${notes}`,
  });
  return "contacts" as const;
}
