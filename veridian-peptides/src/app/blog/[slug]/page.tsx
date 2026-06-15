import type { Metadata } from "next";
import type { ReactNode } from "react";
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

// Minimal markdown-ish renderer: ## / ### headings, "- " bullet lists,
// "1. " ordered lists (used for the References section), inline [text](url)
// links and paragraphs. Keeps article bodies authorable as plain text in the
// dataset with no extra dependencies.
function renderBlocks(source: string) {
  const chunks = source.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk, i) => {
    if (chunk.startsWith("### ")) {
      return (
        <h3 key={i} className="pt-2 text-xl tracking-tight text-foreground">
          {renderInline(chunk.slice(4))}
        </h3>
      );
    }
    if (chunk.startsWith("## ")) {
      return (
        <h2 key={i} className="pt-4 text-2xl tracking-tight text-foreground">
          {renderInline(chunk.slice(3))}
        </h2>
      );
    }
    if (/^\d+\.\s/m.test(chunk)) {
      const items = chunk.split(/\n/).filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol
          key={i}
          className="list-decimal space-y-1.5 break-words pl-5 text-sm"
        >
          {items.map((it, j) => (
            <li key={j}>{renderInline(it.replace(/^\d+\.\s/, ""))}</li>
          ))}
        </ol>
      );
    }
    if (/^- /m.test(chunk)) {
      const items = chunk.split(/\n/).filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc space-y-1.5 pl-5">
          {items.map((it, j) => (
            <li key={j}>{renderInline(it.slice(2))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{renderInline(chunk)}</p>;
  });
}

// Parse inline [text](url) markdown links into React nodes. Anything that is
// not a well-formed link is emitted as plain text. The URL pattern tolerates a
// single level of balanced parentheses so DOI links such as
// .../S0140-6736(21)00845-X are captured intact.
const INLINE_LINK =
  /\[([^\]]+)\]\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/g;

function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_LINK.lastIndex = 0;
  while ((match = INLINE_LINK.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}
