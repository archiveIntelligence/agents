import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBlogPost } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  // Seed posts may have no long-form body; fall back to the excerpt.
  const paragraphs = (post.body && post.body.trim().length > 0 ? post.body : post.excerpt)
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <article className="container-px py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Research blog
        </Link>
        <header className="mt-4 mb-8">
          <Badge tone="brand">{post.category}</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(post.publishedOn)} · {post.readingMinutes} min read
          </p>
        </header>
        <div className="space-y-4 text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          This article is general research information and not medical advice.
          Products are for laboratory research use only.
        </p>
      </div>
    </article>
  );
}
