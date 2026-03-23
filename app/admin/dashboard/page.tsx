"use client";

import { useState } from "react";
import PortfolioManager from "./portfolio-manager";
import TestimonialsManager from "./testimonials-manager";
import CurriculumManager from "./curriculum-manager";
import {
  FolderKanban,
  MessageSquare,
  FileText,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

type Tab = "portfolio" | "testimonials" | "curriculum";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#87381e]">
            <Sparkles className="w-4 h-4" />
            <span className="font-['Spartan'] text-[10px] uppercase tracking-[0.2em] font-bold">
              Bem-vinda de volta
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2e3d30]">
            Olá, <span className="italic text-[#756d47]">Giovanna.</span>
          </h2>
          <p className="text-[#756d47] font-light max-w-md">
            O que vamos transformar no seu ateliê digital hoje?
          </p>
        </div>

        {/* Seletor de Abas Estilo Segmented Control */}
        <div className="bg-[#2e3d30]/5 p-1.5 rounded-2xl flex items-center w-full md:w-auto overflow-x-auto scrollbar-hide">
          <TabButton
            active={activeTab === "portfolio"}
            onClick={() => setActiveTab("portfolio")}
            icon={<FolderKanban className="w-4 h-4" />}
            label="Portfólio"
          />
          <TabButton
            active={activeTab === "testimonials"}
            onClick={() => setActiveTab("testimonials")}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Depoimentos"
          />
          <TabButton
            active={activeTab === "curriculum"}
            onClick={() => setActiveTab("curriculum")}
            icon={<FileText className="w-4 h-4" />}
            label="Currículo"
          />
        </div>
      </div>

      {/* Área de Conteúdo com Card de Suporte */}
      <div className="relative min-h-150 w-full rounded-[2.5rem] bg-[#e3d9ce] border border-[#bfa086]/20 shadow-sm overflow-hidden transition-all duration-500">
        {/* Marca d'água de fundo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <LayoutGrid className="w-125 h-125" />
        </div>

        <div className="relative z-10 p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500">
          {activeTab === "portfolio" && <PortfolioManager />}
          {activeTab === "testimonials" && <TestimonialsManager />}
          {activeTab === "curriculum" && <CurriculumManager />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap
        font-['Spartan'] text-[10px] uppercase tracking-widest font-bold
        ${
          active
            ? "bg-[#2e3d30] text-[#e3d9ce] shadow-lg scale-105"
            : "text-[#2e3d30]/50 hover:text-[#2e3d30] hover:bg-[#2e3d30]/5"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
