import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "group/alert relative grid w-full gap-1.5 rounded-2xl border px-4 py-4 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-5 transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-[#e3d9ce] border-[#bfa086]/40 text-[#2e3d30] shadow-sm *:[svg]:text-[#756d47]",
        destructive:
          "bg-[#87381e]/5 border-[#87381e]/30 text-[#87381e] *:data-[slot=alert-description]:text-[#87381e]/90 *:[svg]:text-[#87381e]",
        success:
          "bg-[#2e3d30] border-[#2e3d30] text-[#e3d9ce] shadow-md *:data-[slot=alert-description]:text-[#e3d9ce]/80 *:[svg]:text-[#bfa086]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-['Spartan'] font-semibold uppercase tracking-[0.15em] text-[10px] sm:text-xs mb-1 group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:opacity-80",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm font-light text-balance opacity-90 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:opacity-80 [&_p:not(:last-child)]:mb-4 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-3 right-3", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
