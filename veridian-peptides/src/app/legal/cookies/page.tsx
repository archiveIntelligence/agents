import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = { title: "Cookie Settings" };

export default function CookiesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Cookie settings"
      intro="How this site uses cookies."
    >
      <p>
        This demonstration store uses only the cookies it needs to function.
        Replace this page with a full cookie policy and a consent manager before
        going live.
      </p>
      <h2>Essential cookies</h2>
      <ul>
        <li>Session cookie — keeps you signed in (httpOnly).</li>
        <li>Cart — stored locally in your browser, not a tracking cookie.</li>
      </ul>
      <h2>Analytics & marketing</h2>
      <p>
        None are set in this demo. If you add analytics or marketing cookies,
        gate them behind explicit consent here.
      </p>
    </PageShell>
  );
}
