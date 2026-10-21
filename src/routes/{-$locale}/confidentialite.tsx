import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";
import { privacyPolicy } from "@/data/legal";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/confidentialite")({
  head: ({ match }) => {
    const t = messages[localeFromPath(match.pathname)];
    return seo({
      pathname: match.pathname,
      title: t.legal.privacyTitle,
      description: t.legal.privacyTitle,
    });
  },
  component: Privacy,
});

function Privacy() {
  const { t } = useI18n();
  return <LegalPage title={t.legal.privacyTitle} sections={privacyPolicy} />;
}
