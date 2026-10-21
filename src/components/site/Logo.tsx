import logoLight from "@/assets/brand/ssoussi-logo-light.webp";
import logoStacked from "@/assets/brand/ssoussi-logo.webp";
import symbol from "@/assets/brand/ssoussi-symbol.webp";
import wordmark from "@/assets/brand/ssoussi-wordmark.webp";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const ALT = `${site.wordmark} — Artisanat marocain`;

/** Header logo: symbol + wordmark side by side, cut from the official logo file. */
export function LogoCompact({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src={symbol} alt="" width={165} height={160} className="h-11 w-auto md:h-12" />
      <img
        src={wordmark}
        alt={site.wordmark}
        width={388}
        height={72}
        className="h-[1.05rem] w-auto md:h-5"
      />
    </span>
  );
}

/** Stacked logo (symbol over wordmark + tagline). `light` = recoloured for safi-blue backgrounds. */
export function LogoStacked({ className, light }: { className?: string; light?: boolean }) {
  return (
    <img
      src={light ? logoLight : logoStacked}
      alt={ALT}
      width={360}
      height={362}
      loading="lazy"
      className={cn("h-auto w-40", className)}
    />
  );
}

export function LogoSymbol({ className }: { className?: string }) {
  return (
    <img src={symbol} alt="" width={165} height={160} className={cn("h-12 w-auto", className)} />
  );
}

export const logoUrl = logoStacked;
