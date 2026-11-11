import { asc, count, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { projects, testimonials } from "@/lib/db/schema";
import type { Project, Testimonial } from "@/lib/types";

export const PROJECTS_PER_PAGE = 5;
export const HOME_PROJECTS_LIMIT = 12;

/** Tags de cache: as Server Actions do admin as invalidam após cada escrita. */
export const CACHE_TAGS = {
  projects: "projects",
  testimonials: "testimonials",
} as const;

export type PublicTestimonial = Pick<Testimonial, "id" | "client_name" | "text">;

export type ProjectListItem = Pick<
  Project,
  "id" | "title" | "description" | "image_url" | "image_urls" | "tags"
>;

const projectOrder = [
  sql`${projects.display_order} asc nulls last`,
  desc(projects.created_at),
  asc(projects.id),
] as const;

// O cache fica por dentro e o try/catch por fora: se o banco falhar, o erro
// propaga para o catch e NÃO é gravado no cache como lista vazia.
// Sem `revalidate`: o dado só muda quando o admin escreve (tags invalidadas).

const cachedApprovedTestimonials = unstable_cache(
  async (): Promise<PublicTestimonial[]> =>
    db
      .select({
        id: testimonials.id,
        client_name: testimonials.client_name,
        text: testimonials.text,
      })
      .from(testimonials)
      .where(eq(testimonials.is_approved, true))
      .orderBy(desc(testimonials.created_at)),
  ["approved-testimonials"],
  { tags: [CACHE_TAGS.testimonials] },
);

export async function getApprovedTestimonials(): Promise<PublicTestimonial[]> {
  try {
    return await cachedApprovedTestimonials();
  } catch (error: unknown) {
    console.error("Erro ao buscar depoimentos:", error);
    return [];
  }
}

const cachedProjectsPage = unstable_cache(
  async (page: number) => {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          image_url: projects.image_url,
          image_urls: projects.image_urls,
          tags: projects.tags,
        })
        .from(projects)
        .orderBy(...projectOrder)
        .limit(PROJECTS_PER_PAGE)
        .offset((page - 1) * PROJECTS_PER_PAGE),
      db.select({ total: count() }).from(projects),
    ]);

    return {
      projects: rows as ProjectListItem[],
      totalPages: total ? Math.ceil(total / PROJECTS_PER_PAGE) : 1,
    };
  },
  ["projects-page"],
  { tags: [CACHE_TAGS.projects] },
);

export async function getProjectsPage(
  page: number,
): Promise<{ projects: ProjectListItem[]; totalPages: number }> {
  try {
    return await cachedProjectsPage(page);
  } catch (error: unknown) {
    console.error("Erro ao buscar projetos:", error);
    return { projects: [], totalPages: 1 };
  }
}

type HomeProject = Pick<Project, "id" | "title" | "image_url" | "image_urls">;

const cachedHomeProjects = unstable_cache(
  async (): Promise<HomeProject[]> =>
    db
      .select({
        id: projects.id,
        title: projects.title,
        image_url: projects.image_url,
        image_urls: projects.image_urls,
      })
      .from(projects)
      .orderBy(...projectOrder)
      .limit(HOME_PROJECTS_LIMIT),
  ["home-projects"],
  { tags: [CACHE_TAGS.projects] },
);

export async function getHomeProjects(): Promise<HomeProject[]> {
  try {
    return await cachedHomeProjects();
  } catch (error: unknown) {
    console.error("Erro ao buscar projetos da home:", error);
    return [];
  }
}
