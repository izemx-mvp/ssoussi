import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText, Hand, MessageSquareText, PackageCheck, Tag, Truck } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Rosette } from "@/components/brand/Motif";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { whatsappLink } from "@/config/site";
import { useI18n } from "@/i18n";
import { ContactForm } from "./ContactForm";
import { WhatsAppIcon } from "./icons";

type Ctx = { open: (productRef?: string) => void };
const QuoteCtx = createContext<Ctx>({ open: () => {} });

/** Opens the global "Demander un devis" dialog, optionally pre-filled with a product reference. */
export const useQuote = () => useContext(QuoteCtx);

function SidePanel({ productRef, onNavigate }: { productRef?: string | undefined; onNavigate: () => void }) {
  const { l, lp } = useI18n();
  const steps = [
    {
      icon: MessageSquareText,
      title: { fr: "Votre demande", en: "Your request" },
      text: { fr: "Quelques infos suffisent pour commencer.", en: "A few details are enough to start." },
    },
    {
      icon: FileText,
      title: { fr: "Devis personnalisé", en: "Tailored quote" },
      text: { fr: "Prix, délais et livraison adaptés.", en: "Price, lead time and delivery to suit you." },
    },
    {
      icon: Truck,
      title: { fr: "Fabrication & envoi", en: "Making & shipping" },
      text: { fr: "Fait main, emballé avec soin.", en: "Handmade, carefully packed." },
    },
  ];
  const waText = productRef
    ? l({
        fr: `Bonjour, je souhaite un devis pour : ${productRef}`,
        en: `Hello, I'd like a quote for: ${productRef}`,
      })
    : l({ fr: "Bonjour, je souhaite un devis.", en: "Hello, I'd like a quote." });

  return (
    <div className="grain relative hidden min-w-0 flex-col justify-between overflow-y-auto overflow-x-hidden bg-safi p-8 text-cream md:flex">
      <Rosette
        className="pointer-events-none absolute -bottom-16 -right-16 size-64 text-cream opacity-10"
        strokeWidth={0.6}
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
          {l({ fr: "Comment ça marche", en: "How it works" })}
        </p>
        <ol className="mt-6 space-y-6">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title.fr} className="relative flex gap-4">
              {i < steps.length - 1 && (
                <span className="absolute left-5 top-11 h-[calc(100%-1rem)] w-px bg-cream/20" aria-hidden />
              )}
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-ochre/60 text-ochre">
                <Icon className="size-4" strokeWidth={1.6} aria-hidden />
              </span>
              <span>
                <span className="block font-display text-xl leading-tight">{l(title)}</span>
                <span className="mt-0.5 block text-sm text-cream/70">{l(text)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative mt-10 space-y-4">
        <ul className="space-y-2 text-sm text-cream/85">
          <li className="flex items-center gap-2">
            <Hand className="size-4 text-ochre" aria-hidden />
            {l({ fr: "Pièces 100 % faites main", en: "100% handmade pieces" })}
          </li>
          <li className="flex items-center gap-2">
            <PackageCheck className="size-4 text-ochre" aria-hidden />
            {l({ fr: "Livraison Maroc & international", en: "Morocco & worldwide delivery" })}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 text-ochre" aria-hidden />
            {l({ fr: "Sans engagement", en: "No commitment" })}
          </li>
        </ul>
        <a
          href={whatsappLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-2xl bg-cream/10 p-4 transition-colors hover:bg-cream/15"
        >
          <span className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-glaze">
              <WhatsAppIcon className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {l({ fr: "Plus rapide sur WhatsApp", en: "Faster on WhatsApp" })}
              </span>
              <span className="block text-xs text-cream/70">
                {l({ fr: "Message pré-rempli", en: "Pre-filled message" })}
              </span>
            </span>
          </span>
          <ArrowRight className="size-4 text-cream/70" aria-hidden />
        </a>
        <Link
          to="/{-$locale}/professionnels"
          params={lp}
          hash="brief"
          onClick={onNavigate}
          className="block text-center text-xs text-cream/70 underline-offset-4 hover:text-cream hover:underline"
        >
          {l({
            fr: "Projet professionnel ou grande quantité ? Brief dédié →",
            en: "Trade project or large quantity? Dedicated brief →",
          })}
        </Link>
      </div>
    </div>
  );
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const { t, l } = useI18n();
  const [isOpen, setOpen] = useState(false);
  const [ref, setRef] = useState<string | undefined>();
  // Remount the form each time the dialog opens so a previous success state is cleared.
  const [session, setSession] = useState(0);

  const open = useCallback((r?: string) => {
    setRef(r);
    setSession((s) => s + 1);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <QuoteCtx.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[94svh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden rounded-[1.75rem] border-none bg-cream p-0 sm:max-w-4xl sm:rounded-[2rem]">
          <div className="grid max-h-[94svh] w-full min-w-0 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SidePanel productRef={ref} onNavigate={() => setOpen(false)} />

            <div className="relative flex min-w-0 max-h-[94svh] flex-col overflow-y-auto overflow-x-hidden">
              {/* Decorative motif clipped inside the column (it used to cause the horizontal scroll) */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <Rosette className="absolute -right-12 -top-12 size-44 text-ochre opacity-[0.12]" />
              </div>

              {/* Header */}
              <DialogHeader className="relative space-y-2 border-b border-border px-6 pb-6 pt-7 pr-14 text-left sm:px-8 md:px-10 md:pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                  {l({ fr: "Devis gratuit", en: "Free quote" })}
                </p>
                <DialogTitle className="font-display text-4xl font-medium leading-tight text-safi md:text-5xl">
                  {t.quote.title}
                </DialogTitle>
                <DialogDescription className="text-[0.95rem] leading-relaxed">
                  {t.quote.intro}
                </DialogDescription>
              </DialogHeader>

              {/* Body */}
              <div className="relative min-w-0 px-6 py-6 sm:px-8 md:px-10 md:pb-10">
                {ref && (
                  <div className="relative mb-6 flex min-w-0 items-start gap-3 rounded-2xl border border-ochre/40 bg-sand p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-clay text-cream">
                      <Tag className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {l({ fr: "Votre demande concerne", en: "Your request is about" })}
                      </span>
                      <span className="block truncate font-display text-xl text-safi">{ref}</span>
                    </span>
                  </div>
                )}

                {/* Mobile: compact WhatsApp shortcut (side panel is hidden) */}
                <a
                  href={whatsappLink(
                    ref
                      ? l({
                          fr: `Bonjour, je souhaite un devis pour : ${ref}`,
                          en: `Hello, I'd like a quote for: ${ref}`,
                        })
                      : l({ fr: "Bonjour, je souhaite un devis.", en: "Hello, I'd like a quote." }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mb-6 flex items-center justify-center gap-2 rounded-full border border-glaze/40 py-2.5 text-sm font-semibold text-glaze md:hidden"
                >
                  <WhatsAppIcon className="size-4" />
                  {l({ fr: "Ou directement sur WhatsApp", en: "Or directly on WhatsApp" })}
                </a>

                <div className="relative min-w-0 [&_form]:min-w-0 [&_input]:min-w-0 [&_input]:max-w-full [&_select]:min-w-0 [&_select]:max-w-full [&_textarea]:max-w-full [&_.grid>*]:min-w-0">
                  <ContactForm key={session} mode="quote" defaultType="particulier" productRef={ref} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </QuoteCtx.Provider>
  );
}