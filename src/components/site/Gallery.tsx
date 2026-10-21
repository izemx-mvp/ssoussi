import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useState, type MouseEvent } from "react";

import { Img } from "@/components/brand/Img";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Media } from "@/config/media";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/** Product gallery: main image with hover zoom, thumbnails, and a keyboard-friendly lightbox. */
export function Gallery({ images, name }: { images: Media[]; name: string }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  const current = images[index] ?? images[0]!;
  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(
      `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseMove={onMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        className="group mask-bowl relative block w-full cursor-zoom-in overflow-hidden bg-cream"
        aria-label={`${t.product.zoom} — ${name}`}
      >
        <Img
          media={current}
          alt={`${name} — ${t.product.image(index + 1)}`}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/5] w-full transition-transform duration-300 motion-reduce:transition-none"
          style={{ transformOrigin: origin, transform: zoom ? "scale(1.7)" : "scale(1)" }}
        />
        <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-cream/90 text-safi opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="size-4" aria-hidden />
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-4 flex gap-3">
          {images.map((m, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t.product.image(i + 1)}
                aria-current={i === index}
                className={cn(
                  "block overflow-hidden rounded-2xl border-2 transition-colors",
                  i === index ? "border-clay" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Img media={m} alt="" sizes="96px" className="size-20 md:size-24" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[min(92vw,1100px)] border-none bg-ink/95 p-3 sm:p-6 [&>button]:text-cream"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <div className="relative">
            <Img
              media={current}
              alt={`${name} — ${t.product.image(index + 1)}`}
              sizes="92vw"
              className="max-h-[80svh] w-full rounded-xl bg-transparent object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.a11y.previous}
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-safi"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.a11y.next}
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-safi"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
          <p className="text-center text-sm text-cream/70">
            {index + 1} / {images.length}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
