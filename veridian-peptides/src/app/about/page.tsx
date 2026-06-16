import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SceneImage } from "@/components/media/scene-image";
import { getAveragePurity, getCoas, getProducts } from "@/lib/repository";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "VERUM Biolabs supplies independently HPLC-tested research peptides. Our story, our standards, and why verifiable transparency sits at the centre of everything we ship.",
};

export default async function AboutPage() {
  const [avgPurity, coas, products] = await Promise.all([
    getAveragePurity(),
    getCoas(),
    getProducts(),
  ]);
  const compoundCount = new Set(products.map((p) => p.name)).size;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="container-px grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge tone="accent">Our story</Badge>
            <h1 className="mt-5 text-balance text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              We built the supplier we{" "}
              <span className="italic text-brand-700">couldn’t find</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              VERUM Biolabs began with a frustration every researcher knows: in
              this field, it is genuinely hard to know what is inside the vial.
              Labels promise purity; few suppliers prove it. We decided to prove
              it — for every batch, before it ever goes on sale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/coa" size="lg">
                See the evidence
              </ButtonLink>
              <ButtonLink href="/products" size="lg" variant="secondary">
                Browse the catalogue
              </ButtonLink>
            </div>
          </div>
          <SceneImage
            src="/blog/choosing-a-supplier.png"
            alt="Research vials prepared for independent analysis"
            className="aspect-[4/3] rounded-3xl border border-border shadow-lift"
          />
        </div>
      </section>

      {/* Credibility stats */}
      <section className="border-b border-border">
        <div className="container-px grid gap-px overflow-hidden py-0 sm:grid-cols-4">
          <Stat value={`${avgPurity}%`} label="Average tested purity (HPLC)" />
          <Stat value="100%" label="Batches with a public COA" />
          <Stat value={`${compoundCount}+`} label="Curated research compounds" />
          <Stat value={`${coas.length}`} label="Certificates in the public vault" />
        </div>
      </section>

      {/* The belief */}
      <section className="container-px py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="brand">What we believe</Badge>
          <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl text-balance">
            Trust isn’t a claim. It’s a document you can open.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Anyone can print “99% pure” on a label. So we don’t ask you to take
            our word for it. Every compound we sell is sent to an independent
            laboratory, analysed by HPLC, and the full report is published in our{" "}
            <Link href="/coa" className="font-medium text-brand-700">
              public COA vault
            </Link>{" "}
            — tied to the exact batch number on your vial. No selective reporting.
            No in-house figures. Just third-party data you can read and verify
            before you spend a euro.
          </p>
        </div>
      </section>

      {/* Standards / how we work */}
      <section className="border-y border-border bg-surface">
        <div className="container-px py-16 lg:py-20">
          <div className="max-w-2xl">
            <Badge tone="brand">Our standards</Badge>
            <h2 className="mt-4 text-3xl tracking-tight">
              Built like a laboratory, not a marketplace
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four commitments shape every order we ship.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Principle
              title="Independent testing"
              body="Third-party HPLC for every batch — not a representative sample, every batch — published before sale."
            />
            <Principle
              title="Full traceability"
              body="The batch number on your vial maps to one certificate. Confirm it yourself in seconds."
            />
            <Principle
              title="Cold-chain logistics"
              body="Lyophilised material handled with temperature-aware packaging and tracked EU dispatch."
            />
            <Principle
              title="Honest by design"
              body="Real prices, no fake countdowns or invented scarcity. Research-use framing, stated plainly."
            />
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="container-px py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="brand">From source to vial</Badge>
          <h2 className="mt-4 text-3xl tracking-tight">Every batch takes the same path</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Step n="01" title="Source" body="Material is sourced from vetted manufacturing partners against a defined specification." />
          <Step n="02" title="Test" body="An independent lab runs HPLC identity and purity analysis on the production batch." />
          <Step n="03" title="Publish" body="The certificate of analysis goes into the public vault, linked to the batch number." />
          <Step n="04" title="Ship" body="Only then does the batch go on sale — packed for the cold chain and dispatched with tracking." />
        </div>
      </section>

      {/* Seriousness / RUO */}
      <section className="border-t border-border bg-surface">
        <div className="container-px grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <SceneImage
            src="/blog/reading-a-coa.png"
            alt="An HPLC chromatogram under inspection"
            className="order-2 aspect-[16/9] rounded-3xl border border-border shadow-soft lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <Badge tone="brand">Professional use</Badge>
            <h2 className="mt-4 text-3xl tracking-tight">For the bench, and only the bench</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Everything we supply is intended strictly for laboratory and
              research use, and is not for human consumption. We expect our
              customers to be professionals handling these materials in an
              appropriate setting — and we write, price and package accordingly.
              Seriousness about safety is part of seriousness about science.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/quality">Our quality process</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-px py-16 lg:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-brand-50 via-surface to-accent-50 p-10 text-center shadow-soft">
          <h2 className="text-3xl tracking-tight text-balance">
            Verify first. Then decide.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Open a certificate, check the purity, confirm the batch — and order
            with the kind of confidence this field rarely offers.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/coa" size="lg">
              Open the COA vault
            </ButtonLink>
            <ButtonLink href="/products" size="lg" variant="secondary">
              Shop research peptides
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface px-6 py-8 text-center">
      <div className="font-display text-4xl text-brand-700">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
      <h3 className="text-lg tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <span className="font-mono text-sm text-brand-700">{n}</span>
      <h3 className="mt-2 text-lg tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
