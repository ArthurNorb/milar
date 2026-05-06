import { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import ProjectImageCarousel from "./_components/project-image-carousel";

export const metadata: Metadata = {
  title: "Portfólio | Milar Arquitetura",
  description:
    "Exploração de projetos onde a neurociência encontra a estética para criar refúgios de bem-estar.",
};

export default async function PortfolioPage() {
  const supabase = await getSupabaseServerClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  const projectList = projects || [];

  return (
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] selection:bg-[#87381e] selection:text-[#e3d9ce] pt-10 pb-20 overflow-hidden relative">
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

      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
        {/* Cabeçalho */}
        <div className="max-w-4xl mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#bfa086]/30 bg-[#bfa086]/10 backdrop-blur-sm">
            <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#87381e] font-semibold">
              Nossos Projetos
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight">
            Curadoria de <br />
            <span className="italic text-[#756d47]">Refúgios.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#2e3d30]/70 max-w-2xl font-light leading-relaxed">
            Cada espaço aqui não é apenas estética; é o resultado de estudos
            sobre o comportamento humano e bem-estar, desenhados para acolher a
            sua rotina.
          </p>
        </div>

        {/* Grid de Projetos Alinhado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 items-start">
          {projectList.map((project) => (
            <div key={project.id} className="group flex flex-col space-y-6">
              {/* Container da Imagem com o formato de Arco */}
              <div className="relative overflow-hidden rounded-t-full border-4 border-[#2e3d30]/5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#bfa086]/30 w-full aspect-[3/4]">
                <ProjectImageCarousel
                  images={
                    project.image_urls?.length
                      ? project.image_urls
                      : [project.image_url]
                  }
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Efeito Hover na Imagem */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-multiply bg-[#87381e]">
                  <Image
                    src="/estampas/Contorno Micro 04.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover scale-150 rotate-12"
                  />
                </div>
              </div>

              {/* Conteúdo de Texto */}
              <div className="flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-3xl md:text-4xl font-serif text-[#2e3d30] mb-4 group-hover:text-[#87381e] transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-[#756d47] font-light leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="h-px w-0 bg-[#bfa086] group-hover:w-full transition-all duration-700 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
