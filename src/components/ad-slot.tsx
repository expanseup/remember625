import { cn } from "@/lib/utils";

export function AdSlot({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "border-navy/15 text-gray-text/60 flex min-h-20 items-center justify-center border border-dashed bg-white/35 text-xs tracking-[0.14em]",
        className,
      )}
      aria-label="광고 영역"
    >
      광고 영역
    </aside>
  );
}
