import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPostsPage } from "@/lib/queries";
import { formatPostDate } from "./_components/format-date";

interface BlogProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Blog | Milar Arquitetura",
  description:
    "Conversas sobre neuroarquitetura, projetos, obras e interiores para planejar uma casa que cuida de quem vive nela.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: BlogProps) {
  const { page } = await searchParams;

  const parsedPage = Number(page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { posts, total, totalPages } = await getPublishedPostsPage(currentPage);

  return (
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] selection:bg-[#87381e] selection:text-[#e3d9ce] pt-16 pb-24 overflow-hidden relative">
      {/* Textura de Fundo */}
      <div className="absolute inset-0 z-0 opacity-[0.01] pointer-events-none">
        <Image
          src="/estampas/Contorno Macro 06.png"
          alt="Textura de fundo"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container max-w-screen-xl px-6 md:px-12 mx-auto relative z-10">
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-[#bfa086]/30 pb-8 md:pb-12 mb-16 md:mb-24">
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#87381e]">
              Blog
            </span>
            <h1 className="text-[2.5rem] leading-tight md:text-6xl font-serif tracking-tight text-[#2e3d30]">
              Entre projetos e <span className="italic text-[#756d47]">conversas</span>
            </h1>
            <p className="text-[#2e3d30]/80 font-light leading-relaxed text-base md:text-lg">
              Neuroarquitetura, obras e interiores explicados de um jeito
              simples, para você planejar uma casa que acolhe a sua rotina.
            </p>
          </div>
          {total > 0 && (
            <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#756d47] shrink-0">
              {String(total).padStart(2, "0")} {total === 1 ? "artigo" : "artigos"}
            </span>
          )}
        </header>

        {posts.length === 0 ? (
          <p className="text-center font-serif italic text-xl md:text-2xl text-[#756d47] py-24">
            Os primeiros artigos estão sendo escritos. Volte em breve!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-10 md:gap-y-16">
            {posts.map((post) => {
              const date = formatPostDate(post.published_at);
              return (
                <article key={post.id} className="group flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block overflow-hidden border border-[#2e3d30]/10 shadow-sm transition-all duration-700 group-hover:shadow-xl aspect-[4/3] mb-6"
                  >
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-[10px] font-['Spartan'] tracking-[0.2em] uppercase">
                    {post.category && (
                      <span className="text-[#87381e]">{post.category}</span>
                    )}
                    {post.category && date && (
                      <span className="w-4 h-px bg-[#bfa086]" aria-hidden />
                    )}
                    {date && (
                      <time dateTime={post.published_at ?? undefined} className="text-[#756d47]">
                        {date}
                      </time>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif text-[#2e3d30] mb-4 group-hover:text-[#87381e] transition-colors duration-300">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-[#2e3d30]/80 font-light leading-relaxed text-base line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto text-xs font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2 w-fit"
                  >
                    Ler artigo &rarr;
                  </Link>

                  <div className="h-px w-12 bg-[#bfa086] group-hover:w-full transition-all duration-1000 mt-6" />
                </article>
              );
            })}
          </div>
        )}

        {/* Navegação da Paginação */}
        {totalPages > 1 && (
          <nav className="mt-20 md:mt-32 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 md:gap-12 border-t border-[#bfa086]/30 pt-10">
            {currentPage > 1 ? (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="text-sm font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2 py-3"
              >
                &larr; Anteriores
              </Link>
            ) : (
              <span className="text-sm font-['Spartan'] uppercase tracking-widest text-[#2e3d30]/30 cursor-not-allowed flex items-center gap-2 py-3">
                &larr; Anteriores
              </span>
            )}

            <span className="font-serif italic text-lg text-[#756d47]">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="text-sm font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2 py-3"
              >
                Próximos &rarr;
              </Link>
            ) : (
              <span className="text-sm font-['Spartan'] uppercase tracking-widest text-[#2e3d30]/30 cursor-not-allowed flex items-center gap-2 py-3">
                Próximos &rarr;
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
