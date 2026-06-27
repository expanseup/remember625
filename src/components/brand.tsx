import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center gap-2.5"
      aria-label="기억작전 625 홈"
    >
      <span
        className={cn(
          "border-gold/45 bg-navy text-gold flex shrink-0 items-center justify-center rounded-full border",
          compact ? "size-7" : "size-9",
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className={cn(compact ? "size-4" : "size-5")}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        >
          <path d="M12 3.8 17.8 6v5.4c0 3.8-2.2 6.7-5.8 8.8-3.6-2.1-5.8-5-5.8-8.8V6z" />
          <path d="M12 8.1c.9-1.2 2.4-1 2.8.2.4 1.3-.8 2.4-2.8 2.9" />
          <path d="M12 8.1c-.9-1.2-2.4-1-2.8.2-.4 1.3.8 2.4 2.8 2.9" />
          <path d="M12 11.2v4.2" />
        </svg>
      </span>
      <span
        className={cn(
          "font-bold tracking-[-0.04em]",
          compact ? "text-[15px]" : "text-lg",
          inverted ? "text-white" : "text-navy",
        )}
      >
        기억작전 <span className="text-gold">625</span>
      </span>
    </Link>
  );
}
