import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "milar_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET ausente ou com menos de 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(email: string): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

/** Retorna true se o token é válido, assinado por nós e não expirou. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
