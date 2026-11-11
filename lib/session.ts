import { SignJWT, jwtVerify } from "jose";

// Em produção o prefixo __Host- obriga o navegador a só aceitar o cookie com
// Secure, path=/ e sem Domain (não vaza para subdomínios).
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-milar_session" : "milar_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 horas

const ISSUER = "milar";
const AUDIENCE = "milar-admin";

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET ausente ou com menos de 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

/** Trocar SESSION_VERSION no .env derruba todas as sessões abertas. */
function sessionVersion(): string {
  return process.env.SESSION_VERSION?.trim() || "1";
}

export async function signSession(email: string): Promise<string> {
  return new SignJWT({ role: "admin", ver: sessionVersion() })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

/** Retorna true se o token é válido, assinado por nós, não expirou e é da versão atual. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    return (
      payload.role === "admin" &&
      payload.ver === sessionVersion() &&
      !!adminEmail &&
      payload.sub === adminEmail
    );
  } catch {
    return false;
  }
}
