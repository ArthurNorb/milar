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

  const rows: {
    title: string;
    description: string;
    image_url: string;
    image_urls?: string[];
    tags: string[];
  }[] = [
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
    {
      title: 'Casa Jardim Sereno',
      description: 'Integração com a área verde e materiais naturais para reduzir o estresse e favorecer o descanso.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      image_urls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'],
      tags: ['Residencial', 'Biofilia'],
    },
    {
      title: 'Studio Raiz',
      description: 'Estúdio compacto com iluminação em camadas e paleta terrosa para foco e acolhimento.',
      image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      tags: ['Studio', 'Iluminação'],
    },
    {
      title: 'Cobertura Aurora',
      description: 'Ambientes amplos com luz natural abundante e áreas de convivência pensadas para a rotina da família.',
      image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      tags: ['Cobertura', 'Convivência'],
    },
  ];

  await db.insert(projects).values(
    rows.map((row, index) => ({
      ...row,
      image_urls: row.image_urls ?? [row.image_url],
      display_order: index,
    })),
  );
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
    {
      client_name: 'Camila',
      text: 'Cada cantinho da casa parece ter sido pensado para a nossa rotina. Chegar em casa virou o melhor momento do dia.',
      is_approved: true,
    },
    {
      client_name: 'Rafael',
      text: 'Profissionalismo e sensibilidade. A Giovanna entendeu exatamente o que a gente precisava, mesmo quando nem sabíamos explicar.',
      is_approved: true,
    },
    {
      client_name: 'Juliana',
      text: 'Meu escritório em casa ficou leve e funcional. Minha produtividade mudou desde a reforma.',
      is_approved: true,
    },
    {
      client_name: 'Marcos',
      text: 'O processo foi tranquilo do início ao fim, com acompanhamento em cada etapa da obra.',
      is_approved: true,
    },
    {
      client_name: 'Patrícia',
      text: 'As cores e a iluminação transformaram a sala. Hoje a família inteira quer ficar ali.',
      is_approved: true,
    },
    {
      client_name: 'Eduardo',
      text: 'Não imaginava que a arquitetura pudesse influenciar tanto o meu humor. Recomendo de olhos fechados.',
      is_approved: true,
    },
    {
      client_name: 'Larissa',
      text: 'Atenção aos detalhes e muito carinho com o projeto. O resultado superou as expectativas.',
      is_approved: true,
    },
    {
      client_name: 'Thiago',
      text: 'Nosso apartamento é pequeno e agora parece o dobro. Soluções inteligentes e lindas.',
      is_approved: true,
    },
    {
      client_name: 'Visitante',
      text: 'Depoimento aguardando aprovação (teste de moderação).',
      is_approved: false,
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
