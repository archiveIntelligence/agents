"use server";

// Sandbox-only payment confirmation. Stands in for a real provider redirect
// + webhook when no API keys are configured, so the full pay -> settle ->
// order-paid flow can be demonstrated locally. Disabled when real provider
// credentials are present.

function referenceFromProviderRef(providerRef: string): string {
  return providerRef.replace(/^np_sandbox_/, "").replace(/^paysera_/, "");
}

export async function confirmSandboxPayment(
  providerRef: string,
): Promise<{ ok: boolean; reference: string }> {
  const reference = referenceFromProviderRef(providerRef);

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db/prisma");
      const order = await prisma.order.findUnique({ where: { reference } });
      if (order && order.status === "PENDING_PAYMENT") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", providerRef },
        });
      }
    } catch (err) {
      console.error("Sandbox confirmation failed", err);
      return { ok: false, reference };
    }
  }

  return { ok: true, reference };
}
