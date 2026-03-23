"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-['Spartan'] text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-[#87381e] focus-visible:ring-3 focus-visible:ring-[#87381e]/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[#87381e] aria-invalid:ring-3 aria-invalid:ring-[#87381e]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#2e3d30] text-[#e3d9ce] hover:bg-[#87381e] hover:shadow-md",
        outline:
          "border-[#bfa086] bg-transparent text-[#2e3d30] hover:bg-[#bfa086] hover:text-[#2e3d30]",
        secondary:
          "bg-[#bfa086] text-[#2e3d30] hover:bg-[#756d47] hover:text-[#e3d9ce]",
        ghost:
          "bg-transparent text-[#2e3d30] hover:bg-[#a39f86]/20 hover:text-[#2e3d30]",
        destructive:
          "bg-[#87381e] text-[#e3d9ce] hover:bg-[#87381e]/90 focus-visible:border-[#87381e]/40 focus-visible:ring-[#87381e]/20",
        link: "text-[#87381e] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-12 px-8 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        xs: "h-8 px-4 text-[9px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 px-6 text-[10px] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 px-10 text-sm has-data-[icon=inline-end]:pr-8 has-data-[icon=inline-start]:pl-8",
        icon: "size-12",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
