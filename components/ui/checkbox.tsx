"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-[#bfa086]/50 bg-transparent transition-all duration-300 outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-[#87381e] hover:shadow-sm focus-visible:border-[#87381e] focus-visible:ring-3 focus-visible:ring-[#87381e]/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#87381e] aria-invalid:ring-3 aria-invalid:ring-[#87381e]/20 data-checked:border-[#2e3d30] data-checked:bg-[#2e3d30] data-checked:text-[#e3d9ce] data-checked:shadow-md",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current animate-in zoom-in-50 duration-200 [&>svg]:size-3.5 [&>svg]:stroke-3"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
