// Cria .env.development.local com valores de dev, se ainda não existir.
// Chamado pelo ./run. O Next carrega esse arquivo no `next dev`.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { hashPassword } from "../lib/password";

const FILE = ".env.development.local";
const DEV_EMAIL = "admin@milar.local";
const DEV_PASSWORD = "milar-dev";

if (existsSync(FILE)) {
  console.log(`${FILE} já existe, mantendo.`);
  process.exit(0);
}

const content = `# Gerado pelo ./run — só para desenvolvimento. Não é versionado.
DATABASE_URL=postgres://milar:milar@127.0.0.1:54329/milar
SESSION_SECRET=${randomBytes(48).toString("base64")}
ADMIN_EMAIL=${DEV_EMAIL}
ADMIN_PASSWORD_HASH=${hashPassword(DEV_PASSWORD)}
UPLOADS_DIR=./.data/uploads
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

writeFileSync(FILE, content);
mkdirSync(".data/uploads", { recursive: true });
console.log(`${FILE} criado. Login do admin: ${DEV_EMAIL} / ${DEV_PASSWORD}`);
