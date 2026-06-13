import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/account");
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Access your orders and tracking.
        </p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
