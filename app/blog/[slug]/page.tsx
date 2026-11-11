import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedPostBySlug } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
import { formatPostDate } from "../_components/format-date";

interface PostProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado | Milar Arquitetura" };

  return {
    title: `${post.title} | Milar Arquitetura`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover_image_url }],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const date = formatPostDate(post.published_at);

  return (
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] selection:bg-[#87381e] selection:text-[#e3d9ce] pt-16 pb-24 overflow-hidden relative">
      <article className="container max-w-3xl px-6 md:px-12 mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Você está em"
          className="flex flex-wrap items-center gap-2 text-[10px] font-['Spartan'] tracking-[0.2em] uppercase text-[#756d47] mb-10"
        >
          <Link href="/" className="hover:text-[#87381e] transition-colors">
            Início
          </Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="hover:text-[#87381e] transition-colors">
            Blog
          </Link>
          {post.category && (
            <>
              <span aria-hidden>/</span>
              <span className="text-[#87381e]">{post.category}</span>
            </>
          )}
        </nav>

        <header className="space-y-6 mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase">
            {post.category && <span className="text-[#87381e]">{post.category}</span>}
            {post.category && date && <span className="w-4 h-px bg-[#bfa086]" aria-hidden />}
            {date && (
              <time dateTime={post.published_at ?? undefined} className="text-[#756d47]">
                {date}
              </time>
            )}
          </div>
          <h1 className="text-[2.5rem] leading-tight md:text-6xl font-serif tracking-tight text-[#2e3d30]">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-[#756d47] leading-relaxed">
            {post.excerpt}
          </p>
        </header>
      </article>

      <div className="container max-w-5xl px-6 md:px-12 mx-auto relative z-10 mb-12 md:mb-16">
        <div className="relative aspect-[16/10] overflow-hidden border border-[#2e3d30]/10 shadow-sm">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container max-w-3xl px-6 md:px-12 mx-auto relative z-10">
        {/* HTML sanitizado no servidor ao salvar (lib/post-content.ts) */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        {/* CTA final */}
        <section className="mt-20 md:mt-28 bg-[#2e3d30] text-[#e3d9ce] rounded-[2.5rem] p-8 md:p-12 space-y-6">
          <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#bfa086]">
            Vamos conversar?
          </span>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight">
            Vamos conversar sobre o seu <span className="italic text-[#bfa086]">projeto</span>?
          </h2>
          <Button
            render={<a href={siteConfig.projectFormUrl} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="lg"
            className="w-full sm:w-auto px-8 h-14 bg-[#c3532e] hover:bg-[#c3532e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-wider uppercase rounded-full transition-transform hover:scale-105 duration-300 flex items-center justify-center shadow-lg"
          >
            Solicitar Projeto <ArrowRight className="w-4 h-4" />
          </Button>
        </section>

        <div className="mt-16 border-t border-[#bfa086]/30 pt-10">
          <Link
            href="/blog"
            className="text-sm font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2 w-fit"
          >
            &larr; Voltar para o blog
          </Link>
        </div>
      </div>
    </div>
  );
}
