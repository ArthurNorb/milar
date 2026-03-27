import { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase-server";

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
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] selection:bg-[#87381e] selection:text-[#e3d9ce] pt-10 pb-10 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-[0.01] pointer-events-none">
        <Image
          src="/estampas/Contorno Macro 06.png"
          alt="Textura de fundo"
          fill
          className="object-cover" 
          priority
        />
      </div>

      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
        <div className="max-w-4xl mb-20 md:mb-32 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#bfa086]/30 bg-[#bfa086]/10 backdrop-blur-sm">
            <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#87381e] font-semibold">
              Projetos em Destaque
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
          {projectList.map((project, index) => (
            <div
              key={project.id}
              className={`group flex flex-col space-y-6 transition-all duration-700 ${
                index % 3 === 0
                  ? "lg:col-span-2 lg:flex-row lg:space-y-0 lg:space-x-12"
                  : ""
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-t-full border-4 border-[#2e3d30]/5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#bfa086]/30 ${
                  index % 3 === 0 ? "lg:w-3/5 aspect-4/5" : "w-full aspect-3/4"
                }`}
              >
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-multiply bg-[#87381e]">
                  <Image
                    src="/estampas/Contorno Micro 04.png"
                    alt=""
                    fill
                    className="object-cover scale-150 rotate-12"
                  />
                </div>
              </div>

              <div
                className={`flex flex-col justify-center ${
                  index % 3 === 0 ? "lg:w-2/5" : "w-full"
                }`}
              >
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

                <div className="h-px w-0 bg-[#bfa086] group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
