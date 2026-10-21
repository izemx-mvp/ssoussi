import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";
import { legalNotice } from "@/data/legal";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/mentions-legales")({
  head: ({ match }) => {
    const t = messages[localeFromPath(match.pathname)];
    return seo({
      pathname: match.pathname,
      title: t.legal.legalTitle,
      description: t.legal.legalTitle,
    });
  },
  component: LegalNotice,
});

function LegalNotice() {
  const { t } = useI18n();
  return <LegalPage title={t.legal.legalTitle} sections={legalNotice} />;
}
