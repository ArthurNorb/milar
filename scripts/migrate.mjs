// Aplica as migrations de ./drizzle em produção (container "migrate").
// Usa o migrator do drizzle-orm, o mesmo que o drizzle-kit usa por baixo
// (mesma tabela drizzle.__drizzle_migrations), sem precisar do drizzle-kit.
// Em dev continue usando `npm run db:migrate`.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("Migrations aplicadas.");
} catch (error) {
  console.error("Falha nas migrations:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
