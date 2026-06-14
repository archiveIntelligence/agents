"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, register, type AuthResult } from "@/lib/auth/actions";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? login : register;
  const [state, formAction, pending] = useActionState<AuthResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First name" autoComplete="given-name" required />
          <Input name="lastName" label="Last name" autoComplete="family-name" required />
        </div>
      ) : null}

      <Input name="email" type="email" label="Email" autoComplete="email" required />
      <Input
        name="password"
        type="password"
        label="Password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        required
      />

      {state?.error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-error">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-brand-700 px-6 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lift disabled:opacity-50"
      >
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/account/register" className="font-medium text-brand-700 hover:text-brand-800">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/account/login" className="font-medium text-brand-700 hover:text-brand-800">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Input({
  name,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-sm shadow-soft transition-colors focus-visible:border-brand-400 focus-visible:outline-2 focus-visible:outline-ring"
      />
    </label>
  );
}
