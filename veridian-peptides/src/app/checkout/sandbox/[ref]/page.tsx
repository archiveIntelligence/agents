import type { Metadata } from "next";
import { SandboxPay } from "./sandbox-pay";

export const metadata: Metadata = {
  title: "Hosted payment (sandbox)",
  robots: { index: false },
};

export default async function SandboxCheckoutPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  return (
    <div className="container-px py-20">
      <div className="mx-auto max-w-lg">
        <SandboxPay providerRef={ref} />
      </div>
    </div>
  );
}
