"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "./session";

export interface AuthResult {
  ok: boolean;
  error?: string;
}

function dbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  if (!dbEnabled()) return { ok: false, error: "Accounts require a configured database." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!emailRe.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  if (!firstName || !lastName) return { ok: false, error: "First and last name are required." };

  const { prisma } = await import("@/lib/db/prisma");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName },
  });

  // Attach any prior guest orders placed with the same email.
  await prisma.order.updateMany({
    where: { email, userId: null },
    data: { userId: user.id },
  });

  await createSession(user.id);
  redirect("/account");
}

export async function login(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  if (!dbEnabled()) return { ok: false, error: "Accounts require a configured database." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const { prisma } = await import("@/lib/db/prisma");
  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-ish response: always run a hash compare to limit user enumeration.
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinv";
  const valid = await bcrypt.compare(password, hash);

  if (!user || !valid) return { ok: false, error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/account");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
