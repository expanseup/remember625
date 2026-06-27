import Image from "next/image";
import { CATEGORY_META } from "@/lib/constants";
import type { Letter } from "@/lib/types";
import { formatKoreanDate } from "@/lib/utils";

export function LetterFrame({ letter }: { letter: Letter }) {
  return (
    <article
      id="letter-frame"
      className="border-gold/20 text-navy relative isolate mx-auto min-h-[560px] w-full max-w-2xl overflow-hidden border bg-[#f8f3e8] px-[clamp(1.25rem,6vw,4rem)] py-[clamp(2.5rem,7vw,5rem)] shadow-lg shadow-black/10 sm:min-h-[680px] lg:min-h-[760px]"
    >
      <Image
        src="/assets/generated/letter-paper-texture-v2.webp"
        alt="절제된 종이 질감 배경"
        fill
        sizes="672px"
        className="-z-10 object-cover opacity-95"
        priority
      />
      <header className="text-center">
        <p className="text-muted-blue text-xs font-bold tracking-[0.12em]">
          감사의 기록
        </p>
        <h1 className="mt-3 text-[clamp(1.25rem,5vw,1.875rem)] leading-[1.35] font-bold tracking-tight">
          <span className="block">참전용사분들께 보내는</span>
          <span className="block">감사편지</span>
        </h1>
        {letter.relatedCategory && (
          <p className="text-gray-text mt-3 text-sm">
            {CATEGORY_META[letter.relatedCategory].label}를 마치고
          </p>
        )}
      </header>
      <div className="via-gold/60 my-[clamp(1.75rem,6vw,2.5rem)] h-px bg-gradient-to-r from-transparent to-transparent" />
      <p className="text-[clamp(1rem,2.8vw,1.125rem)] leading-8 break-words whitespace-pre-wrap sm:leading-9">
        {letter.content}
      </p>
      <footer className="border-gold/35 mt-12 border-t pt-7 text-right">
        <p className="font-bold">{letter.nickname} 드림</p>
        <time
          dateTime={letter.createdAt}
          className="text-gray-text mt-1 block text-sm"
        >
          {formatKoreanDate(letter.createdAt)}
        </time>
        <p className="text-muted-blue mt-8 text-sm font-bold tracking-[0.18em]">
          잊지 않겠습니다
        </p>
      </footer>
    </article>
  );
}
