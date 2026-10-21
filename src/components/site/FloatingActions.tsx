import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

import { whatsappLink } from "@/config/site";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

// The assistant panel is only downloaded when first opened.
const loadPanel = () => import("@/components/chat/ChatPanel");
const ChatPanel = lazy(loadPanel);

const TEASER_KEY = "ssoussi-chat-teaser-seen";

export function FloatingActions() {
  const { t, l } = useI18n();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Product pages have a sticky "Devis / WhatsApp" bar on mobile: lift the buttons above it.
  const onProduct = /\/collections\/[^/]+\/[^/]+\/?$/.test(pathname);

  const close = useCallback(() => {
    setOpen(false);
    launcher.current?.focus();
  }, []);

  // Small "Une question ?" bubble, shown once per session after a few seconds.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    if (seen) return;
    const id = window.setTimeout(() => setTeaser(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  const hideTeaser = useCallback(() => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const lift = onProduct ? "max-md:bottom-24" : "";
  const btn =
    "grid size-14 place-items-center rounded-full text-cream shadow-soft transition-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0";

  return (
    <>
      {/* WhatsApp — bottom left */}
      <div className={cn("fixed bottom-5 left-4 z-40 sm:left-5", lift, open && "max-sm:hidden")}>
        <a
          href={whatsappLink(t.whatsapp.default)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.whatsappLong}
          className="group flex items-center gap-0 rounded-full bg-glaze text-cream shadow-soft transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0"
        >
          <span className="grid size-14 place-items-center">
            <WhatsAppIcon />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[12rem] group-hover:pr-5 group-focus-visible:max-w-[12rem] group-focus-visible:pr-5">
            {l({ fr: "Écrire sur WhatsApp", en: "Chat on WhatsApp" })}
          </span>
        </a>
      </div>

      {/* Assistant — bottom right */}
      <div
        className={cn(
          "fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:right-5",
          lift,
          open && "max-sm:hidden",
        )}
      >
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-[15rem] rounded-2xl rounded-br-md border border-border bg-cream py-3 pl-4 pr-9 text-sm text-ink shadow-soft"
            >
              <button
                type="button"
                onClick={() => {
                  hideTeaser();
                  setOpen(true);
                }}
                className="text-left"
              >
                <span className="block font-semibold text-safi">
                  {l({ fr: "Une question ?", en: "A question?" })}
                </span>
                <span className="text-muted-foreground">
                  {l({
                    fr: "Notre assistant vous répond tout de suite.",
                    en: "Our assistant answers right away.",
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={hideTeaser}
                aria-label={l({ fr: "Fermer", en: "Close" })}
                className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-sand hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={launcher}
          type="button"
          onClick={() => {
            hideTeaser();
            setOpen((o) => !o);
          }}
          onPointerEnter={() => void loadPanel()}
          onFocus={() => void loadPanel()}
          aria-label={open ? t.chat.close : t.chat.open}
          aria-expanded={open}
          className={cn(btn, "relative bg-clay-deep")}
        >
          {!open && (
            <span
              className="absolute inset-0 animate-ping rounded-full bg-clay/40 [animation-duration:2.5s] motion-reduce:hidden"
              aria-hidden
            />
          )}
          <span className="relative">
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <ChatPanel onClose={close} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}