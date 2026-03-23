import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-1 text-[9px] sm:text-[10px] font-['Spartan'] uppercase tracking-[0.2em] transition-all focus-visible:border-[#87381e] focus-visible:ring-[3px] focus-visible:ring-[#87381e]/30 aria-invalid:border-[#87381e] aria-invalid:ring-[#87381e]/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-[#2e3d30] text-[#e3d9ce] hover:bg-[#2e3d30]/90",
        secondary: "bg-[#bfa086] text-[#2e3d30] hover:bg-[#bfa086]/90",
        destructive: "bg-[#87381e] text-[#e3d9ce] hover:bg-[#87381e]/90",
        outline: "border-[#bfa086]/60 text-[#2e3d30] hover:bg-[#bfa086]/20",
        ghost: "hover:bg-[#a39f86]/20 text-[#756d47] hover:text-[#2e3d30]",
        link: "text-[#87381e] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
