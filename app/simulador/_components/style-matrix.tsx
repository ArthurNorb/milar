"use client";

import { cn } from "@/lib/utils";
import { AvaliacaoEstilo, EstilosAvaliacao } from "@/lib/orcamento-types";

const ESTILOS = [
  { key: "minimalista" as keyof EstilosAvaliacao, label: "Minimalista" },
  { key: "industrial" as keyof EstilosAvaliacao, label: "Industrial" },
  { key: "contemporaneo" as keyof EstilosAvaliacao, label: "Contemporâneo" },
  { key: "classicoLuxuoso" as keyof EstilosAvaliacao, label: "Clássico / Luxuoso" },
  { key: "rusticoNatural" as keyof EstilosAvaliacao, label: "Rústico / Natural" },
  { key: "escandinavo" as keyof EstilosAvaliacao, label: "Escandinavo / Nórdico" },
  { key: "vintageRetro" as keyof EstilosAvaliacao, label: "Vintage / Retrô" },
  { key: "abertoSugestoes" as keyof EstilosAvaliacao, label: "Aberto a sugestões" },
] as const;

const OPCOES: NonNullable<AvaliacaoEstilo>[] = [
  "Gosto Muito",
  "Gosto",
  "Neutro",
  "Não Gosto",
  "Inadmissível",
];

const OPCAO_COLORS: Record<NonNullable<AvaliacaoEstilo>, string> = {
  "Gosto Muito": "bg-[#2e3d30] text-[#e3d9ce] border-[#2e3d30]",
  "Gosto": "bg-[#2e3d30]/60 text-[#e3d9ce] border-[#2e3d30]/60",
  "Neutro": "bg-[#bfa086]/30 text-[#2e3d30] border-[#bfa086]/40",
  "Não Gosto": "bg-[#87381e]/20 text-[#87381e] border-[#87381e]/30",
  "Inadmissível": "bg-[#87381e] text-[#e3d9ce] border-[#87381e]",
};

interface StyleMatrixProps {
  value: EstilosAvaliacao;
  onChange: (value: EstilosAvaliacao) => void;
}

function StyleMatrix({ value, onChange }: StyleMatrixProps) {
  const set = (key: keyof EstilosAvaliacao, opcao: AvaliacaoEstilo) => {
    onChange({ ...value, [key]: value[key] === opcao ? null : opcao });
  };

  return (
    <div className="space-y-3">
      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-3 pr-4 text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47] font-normal w-40">
                Estilo
              </th>
              {OPCOES.map((op) => (
                <th
                  key={op}
                  className="pb-3 px-2 text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47] font-normal text-center whitespace-nowrap"
                >
                  {op}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bfa086]/20">
            {ESTILOS.map(({ key, label }) => (
              <tr key={key} className="group">
                <td className="py-3 pr-4 text-sm text-[#2e3d30] font-light">
                  {label}
                </td>
                {OPCOES.map((op) => {
                  const selected = value[key] === op;
                  return (
                    <td key={op} className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => set(key, op)}
                        className={cn(
                          "size-8 rounded-full border-2 transition-all duration-200 hover:scale-110 mx-auto flex items-center justify-center",
                          selected
                            ? OPCAO_COLORS[op]
                            : "border-[#bfa086]/30 hover:border-[#bfa086]",
                        )}
                        title={op}
                      >
                        {selected && (
                          <span className="text-[10px] font-bold">✓</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards verticais */}
      <div className="md:hidden space-y-4">
        {ESTILOS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-2xl border border-[#bfa086]/30 p-4 space-y-3"
          >
            <p className="text-sm text-[#2e3d30] font-light">{label}</p>
            <div className="flex flex-wrap gap-2">
              {OPCOES.map((op) => {
                const selected = value[key] === op;
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => set(key, op)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-['Spartan'] uppercase tracking-widest border transition-all duration-200",
                      selected
                        ? OPCAO_COLORS[op]
                        : "border-[#bfa086]/30 text-[#756d47] hover:border-[#bfa086]",
                    )}
                  >
                    {op}
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

export { StyleMatrix };
