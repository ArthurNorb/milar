/**
 * Roda uma vez quando o servidor Next sobe. Em produção, recusa iniciar com
 * configuração insegura em vez de descobrir o problema no primeiro login.
 */
export function register(): void {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const problems: string[] = [];
  const env = process.env;

  if (!env.DATABASE_URL) problems.push("DATABASE_URL ausente");
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    problems.push("SESSION_SECRET ausente ou com menos de 32 caracteres");
  }
  if (!env.ADMIN_EMAIL) problems.push("ADMIN_EMAIL ausente");
  if (!/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/.test(env.ADMIN_PASSWORD_HASH ?? "")) {
    problems.push("ADMIN_PASSWORD_HASH inválido (gere com npm run hash-password)");
  }
  if (env.ADMIN_EMAIL?.trim().toLowerCase() === "admin@milar.local") {
    problems.push("ADMIN_EMAIL ainda é o de desenvolvimento");
  }
  if (!env.UPLOADS_DIR) problems.push("UPLOADS_DIR ausente");
  if (!env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")) {
    problems.push("NEXT_PUBLIC_SITE_URL deve começar com https://");
  }

  if (problems.length > 0) {
    throw new Error(`Configuração de produção inválida:\n- ${problems.join("\n- ")}`);
  }
}
