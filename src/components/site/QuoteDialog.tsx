import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

type Ctx = { open: (productRef?: string) => void };
const QuoteCtx = createContext<Ctx>({ open: () => {} });
export const useQuote = () => useContext(QuoteCtx);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [ref, setRef] = useState<string | undefined>();
  return (
    <QuoteCtx.Provider value={{ open: (r) => { setRef(r); setOpen(true); } }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-cream sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-safi">Demander un devis</DialogTitle>
            <DialogDescription>
              {ref ? <>Pièce : <strong className="text-ink">{ref}</strong>. </> : null}
              Nous revenons vers vous sous 48 h ouvrées.
            </DialogDescription>
          </DialogHeader>
          <ContactForm defaultType="devis" productRef={ref} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </QuoteCtx.Provider>
  );
}
