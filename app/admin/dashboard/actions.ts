"use server";

import { asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, testimonials } from "@/lib/db/schema";
import { deleteUploadedImages } from "@/lib/images";
import { CACHE_TAGS } from "@/lib/queries";
import type { Project, Testimonial } from "@/lib/types";
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

const IMAGE_URL_PATTERN = /^(\/uploads\/projects\/[\w-]+\.webp|https:\/\/\S+)$/;

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
