import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border border-[#bfa086]/60 bg-transparent px-5 py-2 text-base text-[#2e3d30] font-light transition-all duration-300 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-['Spartan'] file:font-medium file:uppercase file:tracking-widest file:text-[#87381e] placeholder:text-[#756d47]/60 hover:border-[#756d47] hover:bg-[#bfa086]/5 focus-visible:border-[#87381e] focus-visible:bg-transparent focus-visible:ring-3 focus-visible:ring-[#87381e]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#bfa086]/10 disabled:opacity-50 aria-invalid:border-[#87381e] aria-invalid:ring-3 aria-invalid:ring-[#87381e]/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
