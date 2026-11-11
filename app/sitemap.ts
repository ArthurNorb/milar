import type { MetadataRoute } from "next";
import { getPublishedPostSlugs } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// As actions do blog já revalidam /sitemap.xml; isto cobre um build feito sem
// acesso ao banco (o sitemap não fica congelado sem os artigos).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPostSlugs();

  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/projetos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
