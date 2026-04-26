"use client";

import { cn } from "@/lib/utils";
import { ImportanciaItem, NivelImportancia } from "@/lib/orcamento-types";

const ITENS: { key: keyof ImportanciaItem; label: string }[] = [
  { key: "funcionalidade", label: "Funcionalidade / Layout" },
  { key: "estetica", label: "Estética / Beleza" },
  { key: "conforto", label: "Conforto Térmico / Acústico" },
  { key: "materiaisNobres", label: "Materiais Nobres" },
  { key: "tecnologia", label: "Tecnologia / Automação" },
  { key: "qualidadeVida", label: "Qualidade de Vida" },
  { key: "auxilioCondicaoFisica", label: "Auxílio Condição Física / Psicológica" },
];

const NIVEIS: { value: NivelImportancia; label: string }[] = [
  { value: 1, label: "1 — Menos" },
  { value: 2, label: "2" },
  { value: 3, label: "3 — Mais" },
];

interface ImportanceRankProps {
  value: ImportanciaItem;
  onChange: (value: ImportanciaItem) => void;
}

function ImportanceRank({ value, onChange }: ImportanceRankProps) {
  const set = (key: keyof ImportanciaItem, nivel: NivelImportancia) => {
    onChange({ ...value, [key]: nivel });
  };

  return (
    <div className="space-y-4">
      {/* Header labels (desktop) */}
      <div className="hidden sm:grid grid-cols-[1fr_auto] items-center">
        <div />
        <div className="flex gap-6 pr-1">
          {NIVEIS.map((n) => (
            <span
              key={n.value}
              className="w-16 text-center text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47]"
            >
              {n.label}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#bfa086]/20">
        {ITENS.map(({ key, label }) => (
          <div
            key={key}
            className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <span className="text-sm text-[#2e3d30] font-light">{label}</span>
            <div className="flex gap-3 sm:gap-6">
              {NIVEIS.map((n) => {
                const selected = value[key] === n.value;
                return (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => set(key, n.value)}
                    className={cn(
                      "w-16 h-9 rounded-xl border text-xs font-['Spartan'] uppercase tracking-widest transition-all duration-200",
                      selected
                        ? "bg-[#2e3d30] text-[#e3d9ce] border-[#2e3d30] shadow-sm"
                        : "border-[#bfa086]/30 text-[#756d47] hover:border-[#bfa086] hover:bg-[#bfa086]/10",
                    )}
                  >
                    {n.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ImportanceRank };
