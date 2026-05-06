import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import ProjectImageCarousel from "./_components/project-image-carousel";

interface PortfolioProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Portfólio | Milar Arquitetura",
  description:
    "Exploração de projetos onde a neurociência encontra a estética para criar refúgios de bem-estar.",
};

export default async function PortfolioPage({ searchParams }: PortfolioProps) {
  const supabase = await getSupabaseServerClient();
  const { page } = await searchParams;

  const itemsPerPage = 5;
  const parsedPage = Number(page);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Busca os projetos com paginação e o total (count) para calcular as páginas
  const {
    data: projects,
    count,
    error,
  } = await supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching projects:", error);
  }

  const projectList = projects || [];
  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

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
          priority
        />
      </div>

      <div className="container max-w-screen-xl px-6 md:px-12 mx-auto relative z-10">
        {/* Lista de Projetos (Um abaixo do outro, intercalando lados no desktop) */}
        <div className="flex flex-col gap-24 md:gap-32">
          {projectList.map((project, index) => {
            // Alterna o lado da imagem e do texto no desktop (par / ímpar)
            const isEven = index % 2 === 0;

            return (
              <article
                key={project.id}
                className={`group flex flex-col gap-8 lg:gap-16 items-center ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Bloco da Imagem (Quadrada/Retangular) */}
                <div className="w-full lg:w-1/2 relative overflow-hidden rounded-md border border-[#2e3d30]/10 shadow-sm transition-all duration-700 group-hover:shadow-xl aspect-square md:aspect-[4/3]">
                  <ProjectImageCarousel
                    images={
                      project.image_urls?.length
                        ? project.image_urls
                        : [project.image_url]
                    }
                    alt={project.title}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Efeito Hover na Imagem */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-multiply bg-[#87381e]">
                    <Image
                      src="/estampas/Contorno Micro 04.png"
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover scale-150 rotate-12"
                    />
                  </div>
                </div>

                {/* Bloco de Texto (Ao lado no Desktop, Embaixo no Mobile) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-4">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.tags || []).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 bg-[#bfa086]/20 text-[#87381e] hover:bg-[#bfa086]/30 border-none transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-5xl font-serif text-[#2e3d30] mb-6 group-hover:text-[#87381e] transition-colors duration-300">
                    {project.title}
                  </h2>

                  {/* Descrição Completa (espaçamento dinâmico, sem limite de linhas) */}
                  <div className="text-[#2e3d30]/80 font-light leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {project.description}
                  </div>

                  {/* Linha decorativa que cresce no hover */}
                  <div className="h-px w-12 bg-[#bfa086] group-hover:w-full transition-all duration-1000 mt-10" />
                </div>
              </article>
            );
          })}
        </div>

        {/* Navegação da Paginação */}
        {totalPages > 1 && (
          <nav className="mt-32 flex justify-center items-center gap-6 md:gap-12 border-t border-[#bfa086]/30 pt-10">
            {currentPage > 1 ? (
              <Link
                href={`/portfolio?page=${currentPage - 1}`}
                className="text-sm font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2"
              >
                &larr; Anteriores
              </Link>
            ) : (
              <span className="text-sm font-['Spartan'] uppercase tracking-widest text-[#2e3d30]/30 cursor-not-allowed flex items-center gap-2">
                &larr; Anteriores
              </span>
            )}

            <span className="font-serif italic text-lg text-[#756d47]">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/portfolio?page=${currentPage + 1}`}
                className="text-sm font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:text-[#2e3d30] transition-colors flex items-center gap-2"
              >
                Próximos &rarr;
              </Link>
            ) : (
              <span className="text-sm font-['Spartan'] uppercase tracking-widest text-[#2e3d30]/30 cursor-not-allowed flex items-center gap-2">
                Próximos &rarr;
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
