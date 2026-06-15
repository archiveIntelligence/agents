import type { MonographSection } from "@/lib/types";

// Renders a section body: blank-line-separated paragraphs, with lines that
// start with "- " collected into a bullet list. Mirrors the minimal renderer
// used elsewhere; no markdown deps.
function SectionBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="mt-2 space-y-1 text-sm text-muted-foreground">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span aria-hidden className="text-brand-500">
                    ·
                  </span>
                  <span>{l.replace(/^\s*-\s/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {block}
          </p>
        );
      })}
    </>
  );
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="acc-chevron flex-none text-muted-foreground transition-transform duration-200"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Two-tier monograph: a single "Full monograph" disclosure that reveals an
 * accordion of package-insert sections. Built on native <details>/<summary>
 * for keyboard accessibility with no client JS.
 */
export function ProductMonograph({ sections }: { sections: MonographSection[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <details className="group mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft [&[open]_.acc-chevron]:rotate-180">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col">
          <span className="eyebrow">Package insert</span>
          <span className="mt-0.5 font-display text-lg text-foreground">Full monograph</span>
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Expand</span>
          <Chevron />
        </span>
      </summary>

      <div className="border-t border-border px-5 pb-5">
        {sections.map((section, i) => (
          <details
            key={section.heading}
            open={i === 0}
            className="group/sec border-b border-border last:border-b-0 [&[open]_.acc-chevron]:rotate-180"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              {section.heading}
              <Chevron />
            </summary>
            <div className="pb-4">
              <SectionBody body={section.body} />
            </div>
          </details>
        ))}
      </div>
    </details>
  );
}
