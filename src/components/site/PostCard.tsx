import { Link } from "@tanstack/react-router";
import type { Post } from "@/data/posts";
export function PostCard({ post }: { post: Post }) {
  return <Link to="/journal/$slug" params={{ slug: post.slug }} className="group block"><img src={post.image} alt={post.title} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" /><p className="eyebrow mt-5">{post.category} · {new Date(post.date).toLocaleDateString("fr-FR")}</p><h3 className="mt-3 text-3xl group-hover:text-clay">{post.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p></Link>;
}