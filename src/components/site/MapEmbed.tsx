import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** Lazy OpenStreetMap embed centred on the atelier coordinates from site.ts. */
export function MapEmbed({ title, className }: { title: string; className?: string }) {
  const { lat, lon } = site.coordinates;
  const d = 0.012;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d * 1.6}%2C${lat - d}%2C${lon + d * 1.6}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lon}`;
  return (
    <div className={cn("mask-bowl overflow-hidden border border-border bg-cream", className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-72 w-full grayscale-[35%] sepia-[15%]"
      />
    </div>
  );
}
