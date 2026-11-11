import "server-only";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "@/lib/session";

/** Confere e-mail e senha contra ADMIN_EMAIL / ADMIN_PASSWORD_HASH. */
export function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) return false;

  // Roda sempre o scrypt para não vazar, por tempo de resposta, se o e-mail existe.
  const passwordOk = verifyPassword(password, adminHash);
  const emailOk = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  return emailOk && passwordOk;
}

export async function createSession(email: string): Promise<void> {
  const token = await signSession(email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

/** Use no começo de toda Server Action / route handler de escrita do admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Não autorizado.");
}
