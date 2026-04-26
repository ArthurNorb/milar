"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { AmbienteItem } from "@/lib/orcamento-types";

interface AmbientesSelectorProps {
  options: string[];
  value: AmbienteItem[];
  onChange: (value: AmbienteItem[]) => void;
  className?: string;
}

function AmbientesSelector({ options, value, onChange, className }: AmbientesSelectorProps) {
  const selectedMap = new Map(value.map((a) => [a.nome, a.quantidade]));

  const toggle = (nome: string) => {
    if (selectedMap.has(nome)) {
      onChange(value.filter((a) => a.nome !== nome));
    } else {
      onChange([...value, { nome, quantidade: 1 }]);
    }
  };

  const adjust = (nome: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = selectedMap.get(nome) ?? 1;
    const next = current + delta;
    if (next <= 0) {
      onChange(value.filter((a) => a.nome !== nome));
    } else {
      onChange(value.map((a) => (a.nome === nome ? { ...a, quantidade: next } : a)));
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((nome) => {
        const qty = selectedMap.get(nome);
        const selected = qty !== undefined;
        return (
          <div
            key={nome}
            className={cn(
              "flex items-center rounded-full border transition-all duration-200 select-none",
              selected
                ? "bg-[#2e3d30] text-[#e3d9ce] border-[#2e3d30] shadow-sm"
                : "bg-transparent text-[#2e3d30] border-[#bfa086]/40 hover:border-[#bfa086] hover:bg-[#bfa086]/10 cursor-pointer",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(nome)}
              className="px-4 py-2 text-xs font-['Spartan'] uppercase tracking-widest"
            >
              {nome}
              {selected && qty! > 1 && (
                <span className="ml-1 opacity-80">×{qty}</span>
              )}
            </button>

            {selected && (
              <div className="flex items-center gap-0.5 pr-2">
                <button
                  type="button"
                  onClick={(e) => adjust(nome, -1, e)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={`Diminuir ${nome}`}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[10px] w-4 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={(e) => adjust(nome, 1, e)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={`Aumentar ${nome}`}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { AmbientesSelector };
