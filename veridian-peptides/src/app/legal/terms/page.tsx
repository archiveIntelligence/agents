import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service"
      intro="The terms governing use of this store."
    >
      <p>
        This is a template terms-of-service document for a demonstration store
        and is not legal advice. Replace it with reviewed terms before going
        live.
      </p>
      <h2>Research use only</h2>
      <p>
        All products are sold strictly for laboratory and research use. They are
        not for human or animal consumption and are not medicines. By ordering
        you confirm you are using them in an appropriate professional context.
      </p>
      <h2>Eligibility</h2>
      <p>
        You must be of legal age in your jurisdiction and legally permitted to
        purchase research materials where you are located.
      </p>
      <h2>Orders & pricing</h2>
      <p>
        Prices are shown in EUR. We may correct pricing errors and cancel orders
        affected by them with a full refund.
      </p>
      <h2>Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for misuse of products
        supplied for research purposes.
      </p>
    </PageShell>
  );
}
