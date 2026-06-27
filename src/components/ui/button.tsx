import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white shadow-sm shadow-navy/10 hover:-translate-y-0.5 hover:bg-deep-navy hover:shadow-lg hover:shadow-navy/15",
        gold: "bg-gold text-deep-navy shadow-sm shadow-gold/15 hover:-translate-y-0.5 hover:bg-[#e0c27d]",
        outline:
          "border border-navy/18 bg-white/45 text-navy hover:-translate-y-0.5 hover:border-navy/35 hover:bg-white",
        ghost: "text-navy hover:bg-navy/5",
        danger: "bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        default: "h-12",
        sm: "h-11 px-4",
        lg: "h-14 px-7 text-base",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
