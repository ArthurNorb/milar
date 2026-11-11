import "server-only";
import { headers } from "next/headers";

/**
 * Rate limit em memória (janela deslizante). Suficiente para uma instância só
 * do Next na VPS; se um dia houver várias, mover para o Postgres/Redis.
 */
type Bucket = number[];

const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    store.set(key, recent);
    return { ok: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
  }

  recent.push(now);
  store.set(key, recent);

  // Evita crescimento sem limite (ataque com muitos IPs): descarta os mais antigos.
  if (store.size > MAX_KEYS) {
    const excess = store.size - MAX_KEYS;
    let removed = 0;
    for (const k of store.keys()) {
      if (removed++ >= excess) break;
      store.delete(k);
    }
  }

  return { ok: true };
}

/** Zera o contador (ex.: login bem-sucedido). */
export function resetRateLimit(key: string): void {
  store.delete(key);
}

/**
 * IP do visitante. Em produção o Caddy sobrescreve X-Real-IP com o IP real
 * (vindo do CF-Connecting-IP, aceito só das faixas do Cloudflare), então o
 * cliente não consegue forjá-lo. Sem proxy (dev) cai em "local".
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-real-ip")?.trim();
  return ip && ip.length <= 64 ? ip : "local";
}
