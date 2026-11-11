"use server";

import { and, asc, desc, eq, like, ne, or, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts, projects, testimonials } from "@/lib/db/schema";
import { deleteUploadedImages } from "@/lib/images";
import { CACHE_TAGS } from "@/lib/queries";
import {
  extractPostImageUrls,
  postPlainText,
  sanitizePostHtml,
} from "@/lib/post-content";
import type { Post, Project, Testimonial } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { getErrorMessage } from "@/lib/utils";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function fail(error: unknown): { ok: false; error: string } {
  return { ok: false, error: getErrorMessage(error) };
}

function revalidatePublicPages() {
  // updateTag expira o cache de dados na hora (o admin vê a mudança já).
  updateTag(CACHE_TAGS.projects);
  revalidatePath("/");
  revalidatePath("/projetos");
}

function revalidateTestimonials() {
  updateTag(CACHE_TAGS.testimonials);
  revalidatePath("/");
}

// ---------- Projetos ----------

export async function listProjects(): Promise<ActionResult<Project[]>> {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(projects)
      .orderBy(
        sql`${projects.display_order} asc nulls last`,
        desc(projects.created_at),
        asc(projects.id),
      );
    return { ok: true, data: rows };
  } catch (error: unknown) {
    return fail(error);
  }
}

export interface SaveProjectInput {
  id?: number;
  title: string;
  description: string;
  tags: string[];
  image_urls: string[];
}

const IMAGE_URL_PATTERN = /^(\/uploads\/(projects|blog)\/[\w-]+\.webp|https:\/\/\S+)$/;

export async function saveProject(
  input: SaveProjectInput,
): Promise<ActionResult<{ id: number; created: boolean }>> {
  try {
    await requireAdmin();

    const title = input.title.trim();
    const description = input.description.trim();
    const tags = input.tags.map((t) => t.trim()).filter(Boolean);
    const imageUrls = input.image_urls;

    if (!title || !description) throw new Error("Título e descrição são obrigatórios.");
    if (!imageUrls.length) throw new Error("Adicione ao menos uma foto.");
    if (!imageUrls.every((url) => IMAGE_URL_PATTERN.test(url))) {
      throw new Error("URL de imagem inválida.");
    }

    const values = {
      title,
      description,
      tags,
      image_url: imageUrls[0],
      image_urls: imageUrls,
    };

    if (input.id !== undefined) {
      const [previous] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));
      if (!previous) throw new Error("Projeto não encontrado.");

      await db.update(projects).set(values).where(eq(projects.id, input.id));

      // Fotos removidas na edição deixam de ocupar disco.
      const before = previous.image_urls?.length ? previous.image_urls : [previous.image_url];
      await deleteUploadedImages(before.filter((url) => !imageUrls.includes(url)));

      revalidatePublicPages();
      return { ok: true, data: { id: input.id, created: false } };
    }

    const [created] = await db
      .insert(projects)
      .values(values)
      .returning({ id: projects.id });
    revalidatePublicPages();
    return { ok: true, data: { id: created.id, created: true } };
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) throw new Error("Projeto não encontrado.");

    await db.delete(projects).where(eq(projects.id, id));

    const urls = project.image_urls?.length ? project.image_urls : [project.image_url];
    try {
      await deleteUploadedImages(urls);
    } catch (error: unknown) {
      // O registro já foi removido; falha ao limpar disco não deve bloquear.
      console.warn("Falha ao limpar imagens do disco:", error);
    }

    revalidatePublicPages();
    return { ok: true, data: undefined };
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function reorderProjects(ids: number[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.update(projects).set({ display_order: index }).where(eq(projects.id, id));
      }
    });
    revalidatePublicPages();
    return { ok: true, data: undefined };
  } catch (error: unknown) {
    return fail(error);
  }
}

// ---------- Depoimentos ----------

export async function listAllTestimonials(): Promise<ActionResult<Testimonial[]>> {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.created_at));
    return { ok: true, data: rows };
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function approveTestimonial(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(testimonials)
      .set({ is_approved: true })
      .where(eq(testimonials.id, id));
    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function deleteTestimonial(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error: unknown) {
    return fail(error);
  }
}

// ---------- Blog ----------

function revalidateBlog(slugs: string[] = []) {
  updateTag(CACHE_TAGS.posts);
  revalidatePath("/blog");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

/** Garante slug único acrescentando -2, -3… quando já existe. */
async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(
      and(
        or(eq(posts.slug, base), like(posts.slug, `${base}-%`)),
        ignoreId !== undefined ? ne(posts.id, ignoreId) : undefined,
      ),
    );
  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

function postImageUrls(post: Pick<Post, "cover_image_url" | "content_html">): string[] {
  return [post.cover_image_url, ...extractPostImageUrls(post.content_html)];
}

export async function listPostsAdmin(): Promise<ActionResult<Post[]>> {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.updated_at), desc(posts.id));
    return { ok: true, data: rows };
  } catch (error: unknown) {
    return fail(error);
  }
}

export interface SavePostInput {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  content_html: string;
  is_published: boolean;
}

export async function savePost(
  input: SavePostInput,
): Promise<ActionResult<Post>> {
  try {
    await requireAdmin();

    const title = input.title.trim();
    const excerpt = input.excerpt.trim();
    const category = input.category.trim() || null;
    const coverImageUrl = input.cover_image_url;
    const contentHtml = sanitizePostHtml(input.content_html);
    const baseSlug = slugify(input.slug.trim() || title);

    if (!title || !excerpt) throw new Error("Título e resumo são obrigatórios.");
    if (!baseSlug) throw new Error("Endereço (slug) inválido.");
    if (!coverImageUrl) throw new Error("Adicione a foto principal.");
    if (!IMAGE_URL_PATTERN.test(coverImageUrl)) {
      throw new Error("URL de imagem inválida.");
    }
    if (input.is_published && !postPlainText(contentHtml)) {
      throw new Error("Escreva o texto do artigo antes de publicar.");
    }

    const now = new Date().toISOString();

    if (input.id !== undefined) {
      const [previous] = await db.select().from(posts).where(eq(posts.id, input.id));
      if (!previous) throw new Error("Artigo não encontrado.");

      const slug = await uniqueSlug(baseSlug, input.id);
      const [updated] = await db
        .update(posts)
        .set({
          title,
          slug,
          excerpt,
          category,
          cover_image_url: coverImageUrl,
          content_html: contentHtml,
          is_published: input.is_published,
          // A data de publicação é fixada na primeira vez que o artigo vai ao ar.
          published_at: input.is_published ? (previous.published_at ?? now) : previous.published_at,
          updated_at: now,
        })
        .where(eq(posts.id, input.id))
        .returning();

      // Capa trocada ou fotos retiradas do texto deixam de ocupar disco.
      const kept = new Set(postImageUrls(updated));
      try {
        await deleteUploadedImages(postImageUrls(previous).filter((url) => !kept.has(url)));
      } catch (error: unknown) {
        console.warn("Falha ao limpar imagens do disco:", error);
      }

      revalidateBlog([previous.slug, updated.slug]);
      return { ok: true, data: updated };
    }

    const slug = await uniqueSlug(baseSlug);
    const [created] = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt,
        category,
        cover_image_url: coverImageUrl,
        content_html: contentHtml,
        is_published: input.is_published,
        published_at: input.is_published ? now : null,
      })
      .returning();
    revalidateBlog([created.slug]);
    return { ok: true, data: created };
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function deletePost(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) throw new Error("Artigo não encontrado.");

    await db.delete(posts).where(eq(posts.id, id));

    try {
      await deleteUploadedImages(postImageUrls(post));
    } catch (error: unknown) {
      console.warn("Falha ao limpar imagens do disco:", error);
    }

    revalidateBlog([post.slug]);
    return { ok: true, data: undefined };
  } catch (error: unknown) {
    return fail(error);
  }
}
