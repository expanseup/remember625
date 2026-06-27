import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-border text-navy placeholder:text-gray-text/70 focus:border-gold focus:ring-gold/20 min-h-12 w-full rounded border bg-white px-4 text-base transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
