"use server";

import { checkCredentials, createSession, destroySession } from "@/lib/auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  if (!checkCredentials(email, password)) {
    return { ok: false, error: "Credenciais inválidas. Verifique seus dados." };
  }
  await createSession(email.trim().toLowerCase());
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroySession();
}
