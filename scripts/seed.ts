// Uso: npm run seed  (lê DATABASE_URL de .env.development.local)
// Idempotente: só insere em tabelas vazias.
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, testimonials } from "../lib/db/schema";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("Defina DATABASE_URL (ex.: via .env.development.local).");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

async function seedProjects() {
  const [{ total }] = await db.select({ total: count() }).from(projects);
  if (total > 0) {
    console.log("Projetos já existem, pulando.");
    return;
  }

  const rows = [
    {
      title: 'Casa Manga Beiras',
      description: 'Gerar conexão, equilíbrio e tranquilidade para uma família grande com rotina intensa. Cores e linhas moldando o comportamento.',
      image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Residencial', 'Neuroarquitetura', 'Família'],
    },
    {
      title: 'Apto GG',
      description: 'Sala e cozinha conjugadas para interação. Elementos que geram conforto emocional e mantêm memórias afetivas. Escritório flexível com foco em neuroarquitetura para alta produtividade.',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Apartamento', 'Interiores', 'Home Office'],
    },
  ];

  await db
    .insert(projects)
    .values(rows.map((row, index) => ({ ...row, image_urls: [row.image_url], display_order: index })));
  console.log(`Projetos inseridos: ${rows.length}`);
}

async function seedTestimonials() {
  const [{ total }] = await db.select({ total: count() }).from(testimonials);
  if (total > 0) {
    console.log("Depoimentos já existem, pulando.");
    return;
  }

  const rows = [
    {
      client_name: 'Fernando',
      text: 'A casa tem um abraço. Não é só decoração, tem toda uma ciência por trás.',
      is_approved: true,
    },
    {
      client_name: 'Mariana',
      text: 'O clima mudou muito, o ambiente é muito mais relaxante. Valeu cada centavo.',
      is_approved: true,
    },
  ];

  await db.insert(testimonials).values(rows);
  console.log(`Depoimentos inseridos: ${rows.length}`);
}

async function main() {
  console.log("Iniciando seed...");
  await seedProjects();
  await seedTestimonials();
  console.log("Seed concluído!");
}

main()
  .catch((error: unknown) => {
    console.error("Seed falhou:", error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
