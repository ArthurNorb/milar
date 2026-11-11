import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { Project, Testimonial } from "@/lib/types";

export const PROJECTS_PER_PAGE = 5;

const PROJECT_COLUMNS =
  "id, title, description, image_url, image_urls, tags, display_order, created_at";
const TESTIMONIAL_COLUMNS = "id, client_name, text, is_approved, created_at";

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .returns<Testimonial[]>();

  if (error) {
    console.error("Erro ao buscar depoimentos:", error);
    return [];
  }
  return data ?? [];
}

export async function getProjectsPage(
  page: number,
): Promise<{ projects: Project[]; totalPages: number }> {
  const supabase = await getSupabaseServerClient();
  const from = (page - 1) * PROJECTS_PER_PAGE;
  const to = from + PROJECTS_PER_PAGE - 1;

  const { data, count, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS, { count: "exact" })
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<Project[]>();

  if (error) {
    console.error("Erro ao buscar projetos:", error);
  }

  return {
    projects: data ?? [],
    totalPages: count ? Math.ceil(count / PROJECTS_PER_PAGE) : 1,
  };
}
