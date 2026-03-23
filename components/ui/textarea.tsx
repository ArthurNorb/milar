import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-30 w-full rounded-2xl border border-[#bfa086]/60 bg-transparent px-5 py-4 text-base text-[#2e3d30] font-light transition-all duration-300 outline-none placeholder:text-[#756d47]/60 hover:border-[#756d47] hover:bg-[#bfa086]/5 focus-visible:border-[#87381e] focus-visible:bg-transparent focus-visible:ring-3 focus-visible:ring-[#87381e]/20 disabled:cursor-not-allowed disabled:bg-[#bfa086]/10 disabled:opacity-50 aria-invalid:border-[#87381e] aria-invalid:ring-3 aria-invalid:ring-[#87381e]/20 md:text-sm resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
