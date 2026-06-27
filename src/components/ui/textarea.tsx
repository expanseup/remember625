import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "border-border text-navy placeholder:text-gray-text/70 focus:border-gold focus:ring-gold/20 min-h-72 w-full resize-y rounded border bg-white px-4 py-4 text-base leading-8 transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
