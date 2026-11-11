import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { posts, projects, testimonials } from "@/lib/db/schema";
import type { Post, Project, Testimonial } from "@/lib/types";

export const PROJECTS_PER_PAGE = 5;
export const HOME_PROJECTS_LIMIT = 12;

/** Tags de cache: as Server Actions do admin as invalidam após cada escrita. */
export const CACHE_TAGS = {
  projects: "projects",
  testimonials: "testimonials",
  posts: "posts",
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

// ---------- Blog ----------

export const POSTS_PER_PAGE = 9;

export type PostListItem = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "category" | "cover_image_url" | "published_at"
>;

const cachedPostsPage = unstable_cache(
  async (page: number) => {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: posts.id,
          slug: posts.slug,
          title: posts.title,
          excerpt: posts.excerpt,
          category: posts.category,
          cover_image_url: posts.cover_image_url,
          published_at: posts.published_at,
        })
        .from(posts)
        .where(eq(posts.is_published, true))
        .orderBy(desc(posts.published_at), desc(posts.id))
        .limit(POSTS_PER_PAGE)
        .offset((page - 1) * POSTS_PER_PAGE),
      db.select({ total: count() }).from(posts).where(eq(posts.is_published, true)),
    ]);

    return {
      posts: rows as PostListItem[],
      total,
      totalPages: total ? Math.ceil(total / POSTS_PER_PAGE) : 1,
    };
  },
  ["posts-page"],
  { tags: [CACHE_TAGS.posts] },
);

export async function getPublishedPostsPage(
  page: number,
): Promise<{ posts: PostListItem[]; total: number; totalPages: number }> {
  try {
    return await cachedPostsPage(page);
  } catch (error: unknown) {
    console.error("Erro ao buscar artigos:", error);
    return { posts: [], total: 0, totalPages: 1 };
  }
}

const cachedPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const [row] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.is_published, true)))
      .limit(1);
    return row ?? null;
  },
  ["post-by-slug"],
  { tags: [CACHE_TAGS.posts] },
);

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await cachedPostBySlug(slug);
  } catch (error: unknown) {
    console.error("Erro ao buscar artigo:", error);
    return null;
  }
}

const cachedPublishedSlugs = unstable_cache(
  async () =>
    db
      .select({ slug: posts.slug, updated_at: posts.updated_at })
      .from(posts)
      .where(eq(posts.is_published, true)),
  ["published-post-slugs"],
  { tags: [CACHE_TAGS.posts] },
);

export async function getPublishedPostSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  try {
    return await cachedPublishedSlugs();
  } catch (error: unknown) {
    console.error("Erro ao buscar slugs dos artigos:", error);
    return [];
  }
}
