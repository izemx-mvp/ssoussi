import { useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUp, CheckCircle2, PhoneCall, RotateCcw, X } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { respond, replyForIntentId, type BotReply } from "@/chatbot/engine";
import { getIntent, requestTypes, welcomeChips, type RequestType } from "@/chatbot/knowledge";
import { leadSchema, submitLead } from "@/chatbot/leads";
import { ChatMarkdown } from "@/chatbot/Markdown";
import {
  newId,
  resetChat,
  setChat,
  updateMessage,
  useChatState,
  type BotMessage,
} from "@/chatbot/store";
import { WhatsAppIcon } from "@/components/site/icons";
import { LogoSymbol } from "@/components/site/Logo";
import { useQuote } from "@/components/site/QuoteDialog";
import { site, whatsappLink } from "@/config/site";
import { getPost } from "@/data/posts";
import { getProduct } from "@/data/products";
import { useI18n } from "@/i18n";
import { withLocale, type Locale } from "@/i18n/locale";
import { toPostCard, toProductCard } from "@/lib/catalogue-search";
import { cn } from "@/lib/utils";

// Pending "typing" reply, shared across panel mounts so closing the panel doesn't lose it.
let pending: ReturnType<typeof setTimeout> | undefined;

function deliver(reply: BotReply) {
  clearTimeout(pending);
  setChat({ typing: true });
  // Fake typing indicator: 400–700 ms.
  pending = setTimeout(
    () => {
      pending = undefined;
      setChat((s) => ({
        typing: false,
        misses: reply.kind === "answer" ? 0 : s.misses + 1,
        messages: [...s.messages, { ...reply, id: newId(), role: "bot" }],
      }));
    },
    400 + Math.random() * 300,
  );
}

const chip =
  "rounded-full border border-safi/25 bg-sand px-3.5 py-2 text-left text-[0.8rem] font-medium text-safi transition-colors hover:bg-safi hover:text-cream";

function useNavigateAndMaybeClose(onClose: () => void) {
  const router = useRouter();
  return (href: string) => {
    router.navigate({ href });
    if (window.innerWidth < 640) onClose();
  };
}

function ProductCards({ slugs, onClose }: { slugs: string[]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const go = useNavigateAndMaybeClose(onClose);
  const { open } = useQuote();
  const items = slugs.flatMap((s) => {
    const p = getProduct(s);
    return p ? [toProductCard(p, locale)] : [];
  });
  if (!items.length) return null;
  return (
    <ul className="no-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
      {items.map((p) => (
        <li
          key={p.slug}
          className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-cream"
        >
          <img
            src={p.image}
            alt=""
            width={176}
            height={132}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="p-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-clay-deep">
              {p.subtitle}
            </p>
            <p className="mt-1 font-display text-lg leading-tight text-safi">{p.name}</p>
            <div className="mt-3 flex gap-1.5">
              <a
                href={p.url}
                onClick={(e) => {
                  e.preventDefault();
                  go(p.url);
                }}
                className="flex-1 rounded-full border border-safi/30 px-2 py-1.5 text-center text-xs font-semibold text-safi hover:bg-safi hover:text-cream"
              >
                {t.cta.view}
              </a>
              <button
                type="button"
                onClick={() => open(`${p.name} (${p.slug})`)}
                className="flex-1 rounded-full bg-clay-deep px-2 py-1.5 text-xs font-semibold text-cream hover:brightness-95"
              >
                {t.chat.quoteShort}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PostCards({ slugs, onClose }: { slugs: string[]; onClose: () => void }) {
  const { locale } = useI18n();
  const go = useNavigateAndMaybeClose(onClose);
  const items = slugs.flatMap((s) => {
    const p = getPost(s);
    return p ? [toPostCard(p, locale)] : [];
  });
  if (!items.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((p) => (
        <li key={p.slug}>
          <a
            href={p.url}
            onClick={(e) => {
              e.preventDefault();
              go(p.url);
            }}
            className="flex gap-3 rounded-2xl border border-border bg-cream p-2 pr-3 hover:border-ochre"
          >
            <img
              src={p.image}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              className="size-16 shrink-0 rounded-xl object-cover"
            />
            <span>
              <span className="block font-display text-base leading-tight text-safi">
                {p.title}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                {p.excerpt}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function TypingDots() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-ochre"
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3] }}
            transition={
              reduce ? { duration: 0 } : { duration: 1.1, repeat: Infinity, delay: i * 0.18 }
            }
          />
        ))}
      </span>
      {t.chat.typing}
    </div>
  );
}

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "country" | "message", string>>;

function LeadForm({ msg }: { msg: BotMessage }) {
  const { t, locale } = useI18n();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const errorText = (code?: string) =>
    code
      ? ({
          required: t.form.required,
          invalidEmail: t.form.invalidEmail,
          invalidPhone: t.chat.invalidPhone,
          emailOrPhone: t.chat.emailOrPhone,
          tooLong: t.form.tooLong,
        }[code] ?? code)
      : undefined;

  if (msg.lead === "sent")
    return (
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 self-start rounded-full bg-glaze/10 px-3 py-1.5 text-xs font-semibold text-glaze">
          <CheckCircle2 className="size-4" aria-hidden /> {t.chat.leadSaved}
        </p>
        <p className="text-[0.9rem] leading-relaxed">{t.chat.leadThanks}</p>
      </div>
    );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = leadSchema.safeParse({
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      country: String(f.get("country") ?? ""),
      requestType: String(f.get("requestType") ?? "particulier"),
      message: String(f.get("message") ?? "") || (msg.question ?? ""),
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        next[k] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await submitLead(parsed.data, { page: window.location.pathname, locale });
      updateMessage(msg.id, { lead: "sent" });
    } catch {
      setStatus("error");
    }
  };

  const input =
    "h-10 w-full rounded-xl border border-input bg-sand px-3 text-sm text-ink outline-none focus:border-clay-deep aria-[invalid=true]:border-destructive";
  const field = (name: keyof FieldErrors, label: string, type = "text", auto?: string) => (
    <div>
      <label htmlFor={`lead-${msg.id}-${name}`} className="text-xs font-medium text-ink/80">
        {label}
      </label>
      <input
        id={`lead-${msg.id}-${name}`}
        name={name}
        type={type}
        autoComplete={auto}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `lead-${msg.id}-${name}-err` : undefined}
        className={cn(input, "mt-1")}
      />
      {errors[name] && (
        <p id={`lead-${msg.id}-${name}-err`} className="mt-1 text-xs text-destructive">
          {errorText(errors[name])}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-3 rounded-2xl border border-border bg-cream p-4"
      aria-label={t.chat.leadTitle}
    >
      <div>
        <p className="font-display text-lg leading-tight text-safi">{t.chat.leadTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t.chat.leadText}</p>
      </div>
      {field("name", t.form.name, "text", "name")}
      <div className="grid gap-3 sm:grid-cols-2">
        {field("email", t.form.email, "email", "email")}
        {field("phone", t.form.phone, "tel", "tel")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {field("country", t.form.country, "text", "country-name")}
        <div>
          <label htmlFor={`lead-${msg.id}-type`} className="text-xs font-medium text-ink/80">
            {t.form.requestType}
          </label>
          <select
            id={`lead-${msg.id}-type`}
            name="requestType"
            defaultValue={msg.leadType ?? "particulier"}
            className={cn(input, "mt-1")}
          >
            {requestTypes.map((r) => (
              <option key={r} value={r}>
                {t.form.types[r]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`lead-${msg.id}-message`} className="text-xs font-medium text-ink/80">
          {t.chat.leadMessage}
        </label>
        <textarea
          id={`lead-${msg.id}-message`}
          name="message"
          rows={2}
          maxLength={2000}
          defaultValue={msg.question ?? ""}
          className={cn(input, "mt-1 h-auto py-2")}
        />
      </div>
      <p className="text-[0.68rem] text-muted-foreground">
        {t.chat.leadConsent}{" "}
        <a
          href={withLocale("/confidentialite", locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          {t.chat.privacy}
        </a>
        .
      </p>
      {status === "error" && (
        <div role="alert" className="space-y-2 text-xs text-ink">
          <p>{t.chat.leadError}</p>
          <WhatsAppButton question={msg.question} />
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-clay-deep px-4 py-2 text-xs font-semibold text-cream hover:brightness-95 disabled:opacity-50"
        >
          {status === "sending" ? t.form.sending : t.chat.leadSend}
        </button>
        <button
          type="button"
          onClick={() => updateMessage(msg.id, { lead: undefined })}
          className="rounded-full px-3 py-2 text-xs font-semibold text-ink/70 hover:bg-sand"
        >
          {t.chat.cancel}
        </button>
      </div>
    </form>
  );
}

function WhatsAppButton({ question, big }: { question?: string | undefined; big?: boolean }) {
  const { t } = useI18n();
  return (
    <a
      href={whatsappLink(question || t.whatsapp.default)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-glaze font-semibold text-cream hover:brightness-95",
        big ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-xs",
      )}
    >
      <WhatsAppIcon className={big ? "size-4" : "size-3.5"} />{" "}
      {question ? t.chat.whatsappAsk : t.cta.whatsapp}
    </a>
  );
}

function Actions({ msg, onClose }: { msg: BotMessage; onClose: () => void }) {
  const { t, l, locale } = useI18n();
  const { open } = useQuote();
  const go = useNavigateAndMaybeClose(onClose);
  const strong = msg.kind === "fallback-strong";
  if (!msg.actions.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {msg.actions.map((a, i) => {
        switch (a.type) {
          case "whatsapp":
            return <WhatsAppButton key={i} question={msg.question} big={strong} />;
          case "quote":
            return (
              <button
                key={i}
                type="button"
                onClick={() => open()}
                className="inline-flex items-center gap-1.5 rounded-full bg-clay-deep px-3 py-1.5 text-xs font-semibold text-cream hover:brightness-95"
              >
                {t.chat.quoteForm} <ArrowRight className="size-3.5" aria-hidden />
              </button>
            );
          case "lead":
            return msg.lead ? null : (
              <button
                key={i}
                type="button"
                onClick={() => updateMessage(msg.id, { lead: "open", leadType: a.requestType })}
                className="inline-flex items-center gap-1.5 rounded-full border border-safi/30 px-3 py-1.5 text-xs font-semibold text-safi hover:bg-safi hover:text-cream"
              >
                <PhoneCall className="size-3.5" aria-hidden /> {t.chat.callback}
              </button>
            );
          case "link": {
            const href = withLocale(a.href, locale);
            return (
              <a
                key={i}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  go(href);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-safi/30 px-3 py-1.5 text-xs font-semibold text-safi hover:bg-safi hover:text-cream"
              >
                {l(a.label)} <ArrowRight className="size-3.5" aria-hidden />
              </a>
            );
          }
        }
      })}
    </div>
  );
}

function QuickReplies({
  ids,
  lang,
  onPick,
}: {
  ids: string[];
  lang: Locale;
  onPick: (id: string, label: string) => void;
}) {
  const items = ids.flatMap((id) => {
    const intent = getIntent(id);
    return intent ? [{ id, label: intent.label[lang] }] : [];
  });
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((q) => (
        <button key={q.id} type="button" onClick={() => onPick(q.id, q.label)} className={chip}>
          {q.label}
        </button>
      ))}
    </div>
  );
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const { messages, misses, typing } = useChatState();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep the latest message in view.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages.length, typing, reduce]);

  const pushUser = (text: string) =>
    setChat((s) => ({ messages: [...s.messages, { id: newId(), role: "user", text }] }));

  const send = (text: string) => {
    const v = text.trim().slice(0, 1000);
    if (!v || typing) return;
    pushUser(v);
    setInput("");
    deliver(respond(v, locale, misses));
  };

  const pick = (id: string, label: string, lang: Locale = locale) => {
    if (typing) return;
    const reply = replyForIntentId(id, lang);
    if (!reply) return;
    pushUser(label);
    deliver(reply);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const restart = () => {
    clearTimeout(pending);
    pending = undefined;
    resetChat();
    setInput("");
    inputRef.current?.focus();
  };

  const lastBot = [...messages].reverse().find((m) => m.role === "bot");

  return (
    <motion.section
      role="dialog"
      aria-modal="false"
      aria-label={t.chat.title}
      initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduce ? 0 : 24 }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-sand sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(640px,calc(100svh-8rem))] sm:w-[400px] sm:rounded-[1.75rem] sm:border sm:border-border sm:shadow-soft"
    >
      {/* Glass header (one of the two places glassmorphism is allowed) */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 border-b border-border/70 bg-sand/70 px-4 py-3 backdrop-blur-xl backdrop-saturate-150">
        <LogoSymbol className="h-9" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none tracking-wide text-safi">
            {site.wordmark}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-glaze" aria-hidden /> {t.chat.online}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink/70 hover:bg-cream hover:text-ink"
          >
            <RotateCcw className="size-3.5" aria-hidden /> {t.chat.reset}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full text-ink/70 hover:bg-cream hover:text-ink"
          aria-label={t.chat.close}
        >
          <X className="size-5" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-5 px-4 pb-4 pt-20" aria-live="polite">
          <div className="max-w-[95%] self-start rounded-2xl rounded-tl-sm bg-cream px-4 py-3 text-[0.9rem] leading-relaxed text-ink">
            {t.chat.welcome}
          </div>
          {messages.length === 0 && (
            <QuickReplies
              ids={welcomeChips}
              lang={locale}
              onPick={(id, label) => pick(id, label)}
            />
          )}

          {messages.map((m) =>
            m.role === "user" ? (
              <p
                key={m.id}
                className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-safi px-4 py-2.5 text-[0.9rem] text-cream"
              >
                {m.text}
              </p>
            ) : (
              <div key={m.id} lang={m.lang} className="flex w-full flex-col gap-3 text-ink">
                <ChatMarkdown
                  text={m.text}
                  onNavigate={() => window.innerWidth < 640 && onClose()}
                />
                {m.products.length > 0 && <ProductCards slugs={m.products} onClose={onClose} />}
                {m.posts.length > 0 && <PostCards slugs={m.posts} onClose={onClose} />}
                <Actions msg={m} onClose={onClose} />
                {m.lead && <LeadForm msg={m} />}
                {m.id === lastBot?.id && !typing && (
                  <QuickReplies
                    ids={m.quickReplies}
                    lang={m.lang}
                    onPick={(id, label) => pick(id, label, m.lang)}
                  />
                )}
              </div>
            ),
          )}

          {typing && <TypingDots />}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-border bg-cream/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2 rounded-[1.4rem] border border-input bg-sand px-3 py-2 focus-within:border-clay-deep">
          <label htmlFor="chat-input" className="sr-only">
            {t.chat.placeholder}
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={1000}
            placeholder={t.chat.placeholder}
            lang={locale}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            aria-label={t.chat.send}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-clay-deep text-cream transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="mt-2 px-2 text-[0.68rem] text-muted-foreground">{t.chat.disclaimer}</p>
      </form>
    </motion.section>
  );
}
