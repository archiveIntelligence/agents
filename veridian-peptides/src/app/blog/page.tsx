import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Research blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Practical, lab-focused guides — written for researchers.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
          >
            <Badge tone="neutral">{post.category}</Badge>
            <h2 className="mt-3 font-semibold group-hover:text-brand-600">{post.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            <span className="mt-4 text-xs text-muted-foreground">
              {formatDate(post.publishedOn)} · {post.readingMinutes} min read
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
