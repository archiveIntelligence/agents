import { StarRating } from "@/components/product/star-rating";
import { relativeDate } from "@/lib/format";
import type { Review } from "@/lib/types";

export function ProductReviews({
  average,
  count,
  reviews,
}: {
  average: number;
  count: number;
  reviews: Review[];
}) {
  // rating distribution (5★ … 1★)
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <section id="reviews" className="mt-24 scroll-mt-24">
      <h2 className="mb-6 text-3xl tracking-tight">Researcher reviews</h2>

      {count === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted-foreground">
          No reviews yet for this compound.
        </p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
          {/* Summary */}
          <div className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl text-foreground">{average.toFixed(1)}</span>
              <span className="pb-2 text-sm text-muted-foreground">/ 5</span>
            </div>
            <StarRating value={average} size={18} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {count} verified-research review{count === 1 ? "" : "s"}
            </p>
            <dl className="mt-5 space-y-1.5">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <dt className="w-8 flex-none">{d.star}★</dt>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-gold-500"
                      style={{ width: `${count ? (d.n / count) * 100 : 0}%` }}
                    />
                  </div>
                  <dd className="w-5 flex-none text-right">{d.n}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* List */}
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <li key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size={15} />
                    <span className="font-medium text-foreground">{r.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{relativeDate(r.date)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.author}</span>
                  {r.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
                      <Check /> Verified order
                    </span>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="var(--color-brand-600)" />
      <path d="M4.5 8.2l2.2 2.2 4.8-4.9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
