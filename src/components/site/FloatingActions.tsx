import { useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };
const suggestions = ["Comment est fabriquée la poterie de Safi ?", "Je cherche des pièces pour un hôtel", "Livrez-vous à l'international ?"];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Le service est momentanément indisponible.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
        endRef.current?.scrollIntoView({ block: "end" });
      }
    } catch (e) {
      setMsgs([...next, { role: "assistant", content: (e as Error).message }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <a href={whatsappLink("Bonjour SSOUSSI, je souhaite des informations.")} target="_blank" rel="noreferrer" aria-label="WhatsApp"
          className="grid size-14 place-items-center rounded-full bg-safi text-cream shadow-soft transition-transform hover:-translate-y-1">
          <WhatsAppIcon />
        </a>
        <button onClick={() => setOpen((o) => !o)} aria-label="Assistant SSOUSSI"
          className="grid size-14 place-items-center rounded-full bg-clay text-cream shadow-soft transition-transform hover:-translate-y-1">
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[32rem] max-h-[75vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-cream shadow-soft">
          <div className="bg-safi px-5 py-4 text-cream">
            <p className="font-display text-2xl leading-none">ⴰⴼⵓⵙ · Assistant</p>
            <p className="mt-1 text-xs text-cream/70">Questions sur nos métiers, pièces et devis</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-muted-foreground">Bonjour, comment puis-je vous aider ?</p>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="block w-full rounded-full border border-safi/25 px-4 py-2 text-left text-safi hover:bg-safi hover:text-cream">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cn("whitespace-pre-wrap leading-relaxed", m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-safi px-4 py-2 text-cream" : "max-w-[95%] text-ink")}>
                {m.content || (busy && i === msgs.length - 1 ? <span className="text-muted-foreground">…</span> : null)}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Votre message…" maxLength={1000}
              className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus:ring-1 focus:ring-ring" />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Envoyer" className="grid size-10 place-items-center rounded-full bg-clay text-cream disabled:opacity-50">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
