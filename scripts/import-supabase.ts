// Importa projetos e depoimentos do Supabase antigo para o Postgres novo.
//
// Uso (na sua máquina, com o ./run de pé em outro terminal):
//   SUPABASE_DB_URL='postgresql://postgres.<ref>:<senha>@aws-0-<região>.pooler.supabase.com:5432/postgres' \
//     npm run import:supabase -- --replace
//
// - Lê o Supabase só com SELECT (nada é alterado lá).
// - Baixa cada foto do Storage, passa pelo mesmo pipeline do upload
//   (rotação EXIF, sem metadados, 1920px, WebP) e grava em UPLOADS_DIR/projects.
// - Reescreve image_url/image_urls para /uploads/projects/<uuid>.webp.
// - Mantém ids, ordem, tags, datas e o status de aprovação dos depoimentos.
// - --replace apaga antes os projetos/depoimentos do banco de destino (ex.: os
//   de exemplo do seed). Sem a flag, aborta se o destino não estiver vazio.
// - Posts do blog não são tocados (não existiam no Supabase).
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import sharp from "sharp";

const SOURCE_URL = process.env.SUPABASE_DB_URL;
const TARGET_URL = process.env.DATABASE_URL;
const UPLOADS_DIR = path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "./.data/uploads");
const REPLACE = process.argv.includes("--replace");

const MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024;

if (!SOURCE_URL || !TARGET_URL) {
  console.error("Defina SUPABASE_DB_URL (origem) e DATABASE_URL (destino; o .env.development.local já traz).");
  process.exit(1);
}

type SourceProject = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_urls: string[] | null;
  tags: string[] | null;
  display_order: number | null;
  created_at: string | null;
};

type SourceTestimonial = {
  id: number;
  client_name: string;
  text: string;
  is_approved: boolean | null;
  created_at: string | null;
};

const source = postgres(SOURCE_URL, { max: 1, ssl: "require", prepare: false });
const target = postgres(TARGET_URL, { max: 1 });

const written: string[] = [];
const converted = new Map<string, string>();

function isSupabaseStorageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.pathname.includes("/storage/v1/object/");
  } catch {
    return false;
  }
}

/** Baixa e converte uma foto do Storage; devolve a URL local nova. */
async function importImage(url: string): Promise<string> {
  const cached = converted.get(url);
  if (cached) return cached;

  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${url}`);
  const declared = Number(res.headers.get("content-length") ?? "0");
  if (declared > MAX_DOWNLOAD_BYTES) throw new Error(`Arquivo grande demais: ${url}`);
  const input = Buffer.from(await res.arrayBuffer());
  if (input.length > MAX_DOWNLOAD_BYTES) throw new Error(`Arquivo grande demais: ${url}`);

  const output = await sharp(input, { limitInputPixels: 50_000_000, failOn: "error" })
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();

  const relative = path.posix.join("projects", `${randomUUID()}.webp`);
  const full = path.join(UPLOADS_DIR, relative);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, output);
  written.push(full);

  const local = `/uploads/${relative}`;
  converted.set(url, local);
  console.log(`  foto ${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB  ${local}`);
  return local;
}

async function mapUrl(url: string): Promise<string> {
  // URLs externas que não são do Supabase (ex.: Unsplash) ficam como estão.
  return isSupabaseStorageUrl(url) ? importImage(url) : url;
}

async function main() {
  const projects = await source<SourceProject[]>`
    select id, title, description, image_url, image_urls, tags, display_order, created_at
    from public.projects order by id`;
  const testimonials = await source<SourceTestimonial[]>`
    select id, client_name, text, is_approved, created_at
    from public.testimonials order by id`;
  console.log(`Supabase: ${projects.length} projetos, ${testimonials.length} depoimentos.`);

  const [{ p, t }] = await target<{ p: number; t: number }[]>`
    select (select count(*)::int from projects) as p, (select count(*)::int from testimonials) as t`;
  if ((p > 0 || t > 0) && !REPLACE) {
    throw new Error(
      `O destino já tem ${p} projetos e ${t} depoimentos. Rode com --replace para substituí-los.`,
    );
  }

  console.log("Baixando e convertendo fotos...");
  const rows: (Omit<SourceProject, "image_urls" | "tags" | "created_at"> & {
    image_urls: string[];
    tags: string[];
    created_at: string;
  })[] = [];
  for (const project of projects) {
    console.log(`- ${project.title}`);
    const imageUrl = await mapUrl(project.image_url);
    const gallery: string[] = [];
    for (const url of project.image_urls ?? []) gallery.push(await mapUrl(url));
    rows.push({
      id: project.id,
      title: project.title,
      description: project.description,
      image_url: imageUrl,
      image_urls: gallery,
      tags: project.tags ?? [],
      display_order: project.display_order,
      created_at: project.created_at ?? new Date().toISOString(),
    });
  }

  await target.begin(async (tx) => {
    if (REPLACE) {
      await tx`delete from projects`;
      await tx`delete from testimonials`;
    }
    for (const row of rows) {
      await tx`
        insert into projects (id, title, description, image_url, image_urls, tags, display_order, created_at)
        values (${row.id}, ${row.title}, ${row.description}, ${row.image_url},
                ${row.image_urls}::text[], ${row.tags}::text[], ${row.display_order}, ${row.created_at})`;
    }
    for (const item of testimonials) {
      await tx`
        insert into testimonials (id, client_name, text, is_approved, created_at)
        values (${item.id}, ${item.client_name}, ${item.text}, ${item.is_approved ?? false},
                ${item.created_at ?? new Date().toISOString()})`;
    }
    // Próximos ids continuam depois dos importados.
    await tx`select setval(pg_get_serial_sequence('projects', 'id'), coalesce((select max(id) from projects), 0) + 1, false)`;
    await tx`select setval(pg_get_serial_sequence('testimonials', 'id'), coalesce((select max(id) from testimonials), 0) + 1, false)`;
  });

  const pending = testimonials.filter((t) => !t.is_approved).length;
  console.log(
    `\nPronto: ${rows.length} projetos, ${testimonials.length} depoimentos (${pending} pendentes), ${written.length} fotos em ${UPLOADS_DIR}/projects.`,
  );
}

main()
  .catch(async (error: unknown) => {
    console.error("\nFalhou:", error instanceof Error ? error.message : error);
    // Nada foi gravado no banco (transação); limpa as fotos já convertidas.
    await Promise.all(written.map((f) => unlink(f).catch(() => undefined)));
    process.exitCode = 1;
  })
  .finally(async () => {
    await source.end();
    await target.end();
  });
