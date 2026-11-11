import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __milarSql?: ReturnType<typeof postgres>;
};

function getSql() {
  if (!globalForDb.__milarSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL não definida.");
    globalForDb.__milarSql = postgres(url, {
      max: 5,
      idle_timeout: 20, // fecha conexões ociosas (poupa RAM no Postgres)
      max_lifetime: 60 * 30,
    });
  }
  return globalForDb.__milarSql;
}

// Cliente guardado em globalThis para sobreviver ao HMR do `next dev`.
export const db = drizzle(getSql(), { schema });
