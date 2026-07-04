import Link from "next/link";
import Image from "next/image";
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
      aria-label="Remember625 홈"
    >
      <span
        className={cn(
          "border-gold/30 bg-navy flex shrink-0 items-center justify-center overflow-hidden rounded-full border",
          compact ? "size-7" : "size-9",
        )}
        aria-hidden="true"
      >
        <Image
          src="/assets/generated/logo-remember625-symbol.webp"
          alt=""
          width={compact ? 24 : 32}
          height={compact ? 24 : 32}
          sizes={compact ? "24px" : "32px"}
          className="size-[86%] object-contain"
          priority
        />
      </span>
      <span
        className={cn(
          "font-bold tracking-[-0.04em]",
          compact ? "text-[15px]" : "text-lg",
          inverted ? "text-white" : "text-navy",
        )}
      >
        Remember<span className="text-gold">625</span>
      </span>
    </Link>
  );
}
