import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SceneImage } from "@/components/media/scene-image";
import { getBlogPosts } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Research Blog",
  description: "Guides on testing, reconstitution, supplier selection and more.",
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container-px py-14">
      <header className="mb-10 max-w-2xl">
        <Badge tone="brand">Research Blog</Badge>
        <h1 className="mt-4 text-4xl tracking-tight sm:text-5xl">Research blog</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Practical, lab-focused guides — written for researchers.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
          >
            <SceneImage
              src={`/blog/${post.slug}.png`}
              alt={post.title}
              className="aspect-[16/9]"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-1 flex-col p-6">
              <Badge tone="neutral">{post.category}</Badge>
              <h2 className="mt-4 text-lg leading-snug transition-colors group-hover:text-brand-700">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <span className="mt-4 text-xs text-muted-foreground">
                {formatDate(post.publishedOn)} · {post.readingMinutes} min read
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
