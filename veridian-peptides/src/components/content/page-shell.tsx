import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

// Shared shell for static content/legal pages. Keeps headers consistent and
// applies prose styling without pulling in a typography plugin.
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          {eyebrow ? <Badge tone="brand">{eyebrow}</Badge> : null}
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
          {intro ? <p className="mt-3 text-lg text-muted-foreground">{intro}</p> : null}
        </header>
        <div className="space-y-4 [&_a]:font-medium [&_a]:text-brand-700 hover:[&_a]:text-brand-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:text-muted-foreground [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
