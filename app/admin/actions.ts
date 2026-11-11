"use server";

import { checkCredentials, createSession, destroySession } from "@/lib/auth";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

export type LoginResult = { ok: true } | { ok: false; error: string };

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const FAIL_DELAY_MS = 800;
const MAX_FIELD = 256;

export async function login(email: unknown, password: unknown): Promise<LoginResult> {
  const key = `login:${await getClientIp()}`;
  const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterSec / 60));
    return {
      ok: false,
      error: `Muitas tentativas. Tente novamente em ${minutes} min.`,
    };
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > MAX_FIELD ||
    password.length > MAX_FIELD ||
    !checkCredentials(email, password)
  ) {
    // Atraso fixo: encarece força bruta mesmo dentro do limite.
    await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
    return { ok: false, error: "Credenciais inválidas. Verifique seus dados." };
  }

  resetRateLimit(key);
  await createSession(email.trim().toLowerCase());
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroySession();
}
