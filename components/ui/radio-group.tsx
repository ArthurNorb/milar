"use client";

import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupHorizontal({
  className,
  ...props
}: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-row flex-wrap gap-3", className)}
      {...props}
    />
  );
}

interface RadioItemProps extends RadioPrimitive.Root.Props {
  label: string;
}

function RadioItem({ label, className, value, ...props }: RadioItemProps) {
  return (
    <RadioPrimitive.Root
      value={value}
      data-slot="radio-item"
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#bfa086]/30 cursor-pointer transition-all duration-200 hover:border-[#bfa086] hover:bg-[#bfa086]/5 data-[checked]:border-[#2e3d30] data-[checked]:bg-[#2e3d30]/5 data-[checked]:shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="relative flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-[#bfa086]/50 transition-all duration-200 group-data-[checked]:border-[#2e3d30]">
        <RadioPrimitive.Indicator className="size-2 rounded-full bg-[#2e3d30] animate-in zoom-in-50 duration-200" />
      </div>
      <span className="text-sm text-[#2e3d30] font-light select-none">
        {label}
      </span>
    </RadioPrimitive.Root>
  );
}

function RadioItemCompact({ label, className, value, ...props }: RadioItemProps) {
  return (
    <RadioPrimitive.Root
      value={value}
      data-slot="radio-item"
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-xl border border-[#bfa086]/30 cursor-pointer transition-all duration-200 hover:border-[#bfa086] data-[checked]:border-[#87381e] data-[checked]:bg-[#87381e]/5",
        className,
      )}
      {...props}
    >
      <div className="relative flex size-3.5 shrink-0 items-center justify-center rounded-full border-2 border-[#bfa086]/50 transition-all duration-200 group-data-[checked]:border-[#87381e]">
        <RadioPrimitive.Indicator className="size-1.5 rounded-full bg-[#87381e] animate-in zoom-in-50 duration-200" />
      </div>
      <span className="text-xs font-['Spartan'] uppercase tracking-widest text-[#2e3d30] select-none">
        {label}
      </span>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupHorizontal, RadioItem, RadioItemCompact };
