import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "vp.session";
const SESSION_TTL_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
}

function dbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

/** Create a DB-backed session and set the httpOnly cookie. */
export async function createSession(userId: string): Promise<void> {
  if (!dbEnabled()) return;
  const { prisma } = await import("@/lib/db/prisma");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { token, userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Resolve the current user from the session cookie, or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!dbEnabled()) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { prisma } = await import("@/lib/db/prisma");
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    role: session.user.role as SessionUser["role"],
  };
}

/** Revoke the current session and clear the cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && dbEnabled()) {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.session.deleteMany({ where: { token } });
  }
  store.delete(SESSION_COOKIE);
}

/** Throws unless the current user is an admin (for backoffice routes). */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}
