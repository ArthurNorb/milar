import { asc, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, testimonials } from "@/lib/db/schema";
import type { Project, Testimonial } from "@/lib/types";

export const PROJECTS_PER_PAGE = 5;

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.is_approved, true))
      .orderBy(desc(testimonials.created_at));
  } catch (error: unknown) {
    console.error("Erro ao buscar depoimentos:", error);
    return [];
  }
}

export async function getProjectsPage(
  page: number,
): Promise<{ projects: Project[]; totalPages: number }> {
  try {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(projects)
        .orderBy(
          sql`${projects.display_order} asc nulls last`,
          desc(projects.created_at),
          asc(projects.id),
        )
        .limit(PROJECTS_PER_PAGE)
        .offset((page - 1) * PROJECTS_PER_PAGE),
      db.select({ total: count() }).from(projects),
    ]);

    return {
      projects: rows,
      totalPages: total ? Math.ceil(total / PROJECTS_PER_PAGE) : 1,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar projetos:", error);
    return { projects: [], totalPages: 1 };
  }
}

export const HOME_PROJECTS_LIMIT = 12;

export async function getHomeProjects(): Promise<
  Pick<Project, "id" | "title" | "image_url" | "image_urls">[]
> {
  try {
    return await db
      .select({
        id: projects.id,
        title: projects.title,
        image_url: projects.image_url,
        image_urls: projects.image_urls,
      })
      .from(projects)
      .orderBy(
        sql`${projects.display_order} asc nulls last`,
        desc(projects.created_at),
        asc(projects.id),
      )
      .limit(HOME_PROJECTS_LIMIT);
  } catch (error: unknown) {
    console.error("Erro ao buscar projetos da home:", error);
    return [];
  }
}
