import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useI18n } from "@/i18n";
import { withLocale } from "@/i18n/locale";

/**
 * Tiny markdown for pre-written answers: **bold**, [label](href), "- " and "1. " lists,
 * blank line = paragraph. Renders React nodes only (no HTML injection).
 */
export function ChatMarkdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const { locale } = useI18n();
  const router = useRouter();

  const inline = (s: string, key: string): ReactNode[] =>
    s.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
      const k = `${key}-${i}`;
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={k}>{part.slice(2, -2)}</strong>;
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (!m) return part;
      const [, label, href] = m as unknown as [string, string, string];
      if (href.startsWith("/")) {
        const to = withLocale(href, locale);
        return (
          <a
            key={k}
            href={to}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              router.navigate({ href: to });
              onNavigate?.();
            }}
          >
            {label}
          </a>
        );
      }
      return (
        <a key={k} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    });

  const blocks: ReactNode[] = [];
  text.split(/\n{2,}/).forEach((block, b) => {
    const lines = block.split("\n");
    let para: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;
    const flush = () => {
      if (para.length) {
        const key = `p${b}-${blocks.length}`;
        blocks.push(
          <p key={key}>
            {para.flatMap((line, i) => [
              ...(i ? [<br key={`${key}-br${i}`} />] : []),
              ...inline(line, `${key}-${i}`),
            ])}
          </p>,
        );
        para = [];
      }
      if (list) {
        const key = `l${b}-${blocks.length}`;
        const items = list.items.map((it, i) => <li key={i}>{inline(it, `${key}-${i}`)}</li>);
        blocks.push(list.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>);
        list = null;
      }
    };
    for (const line of lines) {
      const ul = /^- (.*)$/.exec(line);
      const ol = /^\d+\. (.*)$/.exec(line);
      const item = ul ?? ol;
      if (item) {
        if (para.length || (list && list.ordered !== !!ol)) flush();
        list ??= { ordered: !!ol, items: [] };
        list.items.push(item[1]!);
      } else {
        if (list) flush();
        para.push(line);
      }
    }
    flush();
  });

  return <div className="chat-md">{blocks}</div>;
}
