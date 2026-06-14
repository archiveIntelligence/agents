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
  const source =
    post.body && post.body.trim().length > 0 ? post.body : post.excerpt;

  return (
    <article className="container-px py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Research blog
        </Link>
        <header className="mt-4 mb-10">
          <Badge tone="brand">{post.category}</Badge>
          <h1 className="mt-4 text-4xl tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {formatDate(post.publishedOn)} · {post.readingMinutes} min read
          </p>
        </header>
        <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
          {renderBlocks(source)}
        </div>
        <p className="mt-12 rounded-xl border border-border bg-surface-muted p-4 text-xs leading-relaxed text-muted-foreground">
          This article is general research information and not medical advice.
          The compounds discussed are supplied strictly for laboratory and
          research use only and are not for human consumption.
        </p>
      </div>
    </article>
  );
}

// Minimal markdown-ish renderer: ## / ### headings, "- " bullet lists and
// paragraphs. Keeps article bodies authorable as plain text in the dataset.
function renderBlocks(source: string) {
  const chunks = source.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk, i) => {
    if (chunk.startsWith("### ")) {
      return (
        <h3 key={i} className="pt-2 text-xl tracking-tight text-foreground">
          {chunk.slice(4)}
        </h3>
      );
    }
    if (chunk.startsWith("## ")) {
      return (
        <h2 key={i} className="pt-4 text-2xl tracking-tight text-foreground">
          {chunk.slice(3)}
        </h2>
      );
    }
    if (/^- /m.test(chunk)) {
      const items = chunk.split(/\n/).filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc space-y-1.5 pl-5">
          {items.map((it, j) => (
            <li key={j}>{it.slice(2)}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{chunk}</p>;
  });
}
