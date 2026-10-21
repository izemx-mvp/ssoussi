import { Link } from "@tanstack/react-router";

import { Img } from "@/components/brand/Img";
import { DrawLine } from "@/components/brand/DrawLine";
import { postCategories, readingTime, type Post } from "@/data/posts";
import { useI18n } from "@/i18n";

export const formatDate = (iso: string, locale: "fr" | "en") =>
  new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function PostCard({ post }: { post: Post }) {
  const { l, lp, locale, t } = useI18n();
  return (
    <article className="group">
      <Link to="/{-$locale}/journal/$slug" params={{ ...lp, slug: post.slug }} className="block">
        <div className="mask-bowl overflow-hidden">
          <Img
            media={post.image}
            alt=""
            sizes="(min-width: 768px) 33vw, 100vw"
            className="zoom-media aspect-[4/3] w-full"
          />
        </div>
        <p className="eyebrow mt-5">
          {l(postCategories[post.category])} ·{" "}
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </p>
        <h3 className="mt-3 text-3xl leading-tight">
          <span className="draw-underline">
            {l(post.title)}
            <DrawLine />
          </span>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l(post.excerpt)}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t.common.minRead(readingTime(post, locale))}
        </p>
      </Link>
    </article>
  );
}
