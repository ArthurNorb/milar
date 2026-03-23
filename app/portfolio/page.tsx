import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowUpRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] selection:bg-[#87381e] selection:text-[#e3d9ce] pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">
      {/* Elementos Decorativos Globais (Estampas) */}
      <div className="absolute top-0 right-0 w-125 h-125 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
        <Image
          src="/estampas/Preenchida Macro 02.png"
          alt=""
          fill
          className="animate-[spin_60s_linear_infinite]"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-150 h-150 opacity-[0.04] pointer-events-none -translate-x-1/4 translate-y-1/4">
        <Image src="/estampas/Contorno Macro 06.png" alt="" fill />
      </div>

      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
        {/* Cabeçalho Editorial */}
        <div className="max-w-4xl mb-20 md:mb-32 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#bfa086]/30 bg-[#bfa086]/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#87381e]" />
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

        {/* Grade de Portfólio Dinâmica */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
          {projectList.map((project, index) => (
            <div
              key={project.id}
              className={`group flex flex-col space-y-6 transition-all duration-700 ${
                index % 3 === 0
                  ? "lg:col-span-2 lg:flex-row lg:space-y-0 lg:space-x-12"
                  : ""
              }`}
            >
              {/* Moldura de Arco (Portal) */}
              <div
                className={`relative overflow-hidden rounded-t-full border-4 border-[#2e3d30]/5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#bfa086]/30 ${
                  index % 3 === 0
                    ? "lg:w-3/5 aspect-4/5"
                    : "w-full aspect-3/4"
                }`}
              >
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay de Estampa no Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-multiply bg-[#87381e]">
                  <Image
                    src="/estampas/Contorno Micro 04.png"
                    alt=""
                    fill
                    className="object-cover scale-150 rotate-12"
                  />
                </div>

                {/* Botão Flutuante de Link */}
                <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-12 h-12 bg-[#e3d9ce] rounded-full flex items-center justify-center text-[#87381e] shadow-lg">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Informações do Projeto */}
              <div
                className={`flex flex-col justify-center ${index % 3 === 0 ? "lg:w-2/5" : "w-full"}`}
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

          {/* Placeholder Criativo para "Em Breve" */}
          <Card className="aspect-3/4 flex flex-col items-center justify-center p-12 text-center bg-[#2e3d30] text-[#e3d9ce] rounded-t-full border-none shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Image
                src="/estampas/Preenchida Micro 06.png"
                alt=""
                fill
                className="object-cover rotate-45"
              />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-full border border-[#bfa086]/30 flex items-center justify-center mx-auto mb-4 group-hover:rotate-90 transition-transform duration-700">
                <span className="text-3xl font-light text-[#bfa086]">+</span>
              </div>
              <h3 className="text-2xl font-serif">
                Seu refúgio pode ser o próximo.
              </h3>
              <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#bfa086]">
                Novas histórias em breve
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
