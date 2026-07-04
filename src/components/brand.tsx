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
          "flex shrink-0 items-center justify-center",
          compact ? "size-8" : "size-10",
        )}
        aria-hidden="true"
      >
        <Image
          src="/assets/generated/logo-remember625-symbol.webp"
          alt=""
          width={compact ? 32 : 40}
          height={compact ? 32 : 40}
          sizes={compact ? "32px" : "40px"}
          className="size-full object-contain"
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
