"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  minLabel,
  maxLabel,
  className,
}: SliderProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <SliderPrimitive.Root
        value={value}
        onValueChange={(vals) => onChange(Array.isArray(vals) ? vals[0] : vals)}
        min={min}
        max={max}
        step={step}
        className="relative flex w-full touch-none items-center py-2"
      >
        <SliderPrimitive.Control className="relative flex w-full items-center">
          <SliderPrimitive.Track className="relative h-2 w-full grow rounded-full bg-[#bfa086]/30">
            <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-[#87381e]" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className="block size-5 rounded-full border-2 border-[#87381e] bg-[#e3d9ce] shadow-md transition-all duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87381e]/40 cursor-grab active:cursor-grabbing"
            aria-label="Slider"
          />
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between">
          {minLabel && (
            <span className="text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
              {minLabel}
            </span>
          )}
          {maxLabel && (
            <span className="text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
              {maxLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Slider };
