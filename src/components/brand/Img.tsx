import type { CSSProperties } from "react";

import type { Media } from "@/config/media";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  media: Media;
  /** Overrides the default localized alt text. Pass "" for decorative images. */
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  focus?: string | undefined;
  style?: CSSProperties;
};

/** Responsive WebP image with explicit dimensions, lazy loading and a blur placeholder. */
export function Img({ media, alt, sizes = "100vw", priority, className, focus, style }: Props) {
  const { l } = useI18n();
  return (
    <img
      src={media.src}
      srcSet={media.srcSet}
      sizes={sizes}
      width={media.width}
      height={media.height}
      alt={alt ?? l(media.alt)}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn("bg-muted object-cover", className)}
      style={{
        backgroundImage: `url(${media.placeholder})`,
        backgroundSize: "cover",
        backgroundPosition: focus ?? "center",
        objectPosition: focus,
        ...style,
      }}
    />
  );
}
