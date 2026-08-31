import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/repository";
import { createBlogPost } from "@/lib/admin/actions";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Blog" };

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>

      <form action={createBlogPost} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <Field label="Title">
          <input name="title" className={inputCls} required />
        </Field>
        <Field label="Excerpt">
          <input name="excerpt" className={inputCls} />
        </Field>
        <Field label="Body">
          <textarea name="body" rows={5} className={`${inputCls} h-auto py-2`} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <input name="category" defaultValue="Guides" className={inputCls} />
          </Field>
          <Field label="Reading minutes">
            <input name="readingMinutes" type="number" min="1" defaultValue={5} className={inputCls} />
          </Field>
        </div>
        <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
          Publish post
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{p.title}</span>
              <span className="text-xs text-muted-foreground">
                {p.category} · {formatDate(p.publishedOn)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
