import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";
import type { Letter } from "@/lib/types";
import { formatKoreanDate, truncate } from "@/lib/utils";

export function PublicLetterCard({ letter }: { letter: Letter }) {
  return (
    <article className="border-navy/8 group border-b py-6 transition-colors hover:bg-white/45">
      <div className="text-gray-text mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-blue font-semibold">
          {letter.relatedCategory
            ? CATEGORY_META[letter.relatedCategory].label
            : "감사편지"}
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={letter.createdAt}>
          {formatKoreanDate(letter.createdAt)}
        </time>
      </div>
      <p className="text-navy/82 text-[16px] leading-8 whitespace-pre-line">
        {truncate(letter.content, 150)}
      </p>
      <div className="mt-4 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold">{letter.nickname}</span>
        <Link
          href={`/letter/${letter.id}`}
          className="text-muted-blue font-semibold opacity-80 transition-opacity group-hover:opacity-100 hover:underline"
        >
          자세히 보기
        </Link>
      </div>
    </article>
  );
}
