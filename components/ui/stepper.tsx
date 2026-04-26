"use client";

import { cn } from "@/lib/utils";

interface StepperStep {
  label: string;
  key: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: string;
  className?: string;
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className={cn("w-full", className)}>
      {/* Barra de progresso */}
      <div className="relative h-1 w-full bg-[#bfa086]/30 rounded-full mb-4">
        <div
          className="absolute h-full bg-[#87381e] rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentIndex) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Labels dos steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[9px] font-['Spartan'] font-semibold transition-all duration-300",
                  isCompleted && "bg-[#87381e] text-[#e3d9ce]",
                  isCurrent && "bg-[#2e3d30] text-[#e3d9ce] shadow-md scale-110",
                  !isCompleted && !isCurrent && "bg-[#bfa086]/30 text-[#756d47]",
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-[8px] font-['Spartan'] uppercase tracking-widest transition-colors duration-300",
                  isCurrent ? "text-[#2e3d30] font-semibold" : "text-[#756d47]",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Stepper };
export type { StepperStep };
