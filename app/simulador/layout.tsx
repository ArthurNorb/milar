import { Metadata } from "next";
import { ReactNode } from "react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Simulação de Projeto | Milar Arquitetura",
  description:
    "Dê o primeiro passo. Descubra o investimento para transformar seu ambiente com a aplicação da neuroarquitetura.",
};

export default function SimulatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center py-12 md:py-20 px-5 md:px-6 z-0 overflow-hidden">
      {/* Fundo imersivo exclusivo para o simulador */}
      <div className="absolute inset-0 z-[-1] pointer-events-none flex items-center justify-center">
        <Image
          src="/estampas/Contorno Macro 02.png"
          alt="Textura Orgânica"
          width={1200}
          height={1200}
          className="opacity-[0.03] object-contain animate-[spin_120s_linear_infinite]"
          priority
        />
        {/* Gradiente para garantir que o formulário fique sempre 100% legível */}
        <div className="absolute inset-0 bg-linear-to-b from-[#e3d9ce]/40 via-[#e3d9ce]/80 to-[#e3d9ce] backdrop-blur-[1px]" />
      </div>

      {/* Container que vai abraçar o page.tsx do simulador */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col relative z-10">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16 space-y-4">
          <span className="font-['Spartan'] text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#87381e] font-semibold">
            Orçamento Inteligente
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2e3d30] leading-tight">
            Vamos desenhar <br className="hidden md:block" />o seu novo refúgio?
          </h1>
          <p className="text-[#756d47] font-light text-sm md:text-base max-w-md mx-auto pt-2">
            Responda algumas perguntas rápidas para entendermos a sua
            necessidade e calcularmos uma estimativa para o seu projeto.
          </p>
        </div>

        {/* Aqui é onde o formulário do simulador vai ser injetado */}
        {children}
      </div>
    </div>
  );
}
