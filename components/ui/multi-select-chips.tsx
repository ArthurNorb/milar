"use client";

import { cn } from "@/lib/utils";

interface MultiSelectChipsProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

function MultiSelectChips({
  options,
  value,
  onChange,
  className,
}: MultiSelectChipsProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-['Spartan'] uppercase tracking-widest transition-all duration-200 border select-none cursor-pointer",
              selected
                ? "bg-[#2e3d30] text-[#e3d9ce] border-[#2e3d30] shadow-sm"
                : "bg-transparent text-[#2e3d30] border-[#bfa086]/40 hover:border-[#bfa086] hover:bg-[#bfa086]/10",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export { MultiSelectChips };
