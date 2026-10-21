import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CrackedPot, Rosette } from "@/components/brand/Motif";
import { Button } from "@/components/ui/button";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { LocaleRestore } from "@/components/site/LanguageSwitch";
import { PageTransition } from "@/components/site/PageTransition";
import { QuoteProvider } from "@/components/site/QuoteDialog";
import { site } from "@/config/site";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { organizationLd, seo } from "@/lib/seo";

// Arabic is decorative only: load just the glyphs used (صنع يدوي, فخار, آسفي).
const ARABIC_GLYPHS = encodeURIComponent("صنعيدوفخارآسفي ");
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap";
const FONTS_AR = `https://fonts.googleapis.com/css2?family=Amiri&display=swap&text=${ARABIC_GLYPHS}`;

// Runs before first paint: hides the brush-stroke loader for returning visitors.
const VISITED_SCRIPT =
  "try{if(localStorage.getItem('ssoussi.visited')){document.documentElement.setAttribute('data-visited','')}else{localStorage.setItem('ssoussi.visited','1')}}catch(e){document.documentElement.setAttribute('data-visited','')}";

function NotFoundComponent() {
  const { t, lp } = useI18n();
  return (
    <section className="grain relative flex min-h-[85svh] items-center overflow-hidden pt-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2">
        <CrackedPot className="draw-in mx-auto w-56 md:w-80" />
        <div>
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-5xl md:text-7xl">{t.notFound.title}</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {t.notFound.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="clay" size="xl">
              <Link to="/{-$locale}" params={lp}>
                {t.cta.backHome}
              </Link>
            </Button>
            <Button asChild variant="line" size="xl">
              <Link to="/{-$locale}/collections" params={lp}>
                {t.nav.collections}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useI18n();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center justify-center px-4 pt-24">
      <div className="max-w-md text-center">
        <Rosette className="mx-auto size-16 text-ochre" />
        <h1 className="mt-6 text-4xl">{t.error.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.error.text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            variant="clay"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {t.error.retry}
          </Button>
          <Button asChild variant="line">
            <a href="/">{t.cta.backHome}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const base = seo({
      pathname: match.pathname,
      title: `${site.wordmark} — ${site.tagline[locale]}`,
      description: messages[locale].meta.siteDescription,
      jsonLd: [organizationLd()],
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#F4ECE1" },
        ...base.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: FONTS },
        { rel: "stylesheet", href: FONTS_AR },
      ],
      scripts: base.scripts,
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <html lang={localeFromPath(pathname)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VISITED_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <div className="site-loader" aria-hidden>
          <Rosette className="size-24 text-clay" strokeWidth={1.4} />
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <QuoteProvider>
        <LocaleRestore />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <FloatingActions />
        <Toaster
          position="top-center"
          toastOptions={{ className: "!bg-cream !text-ink !border-border" }}
        />
      </QuoteProvider>
    </QueryClientProvider>
  );
}
