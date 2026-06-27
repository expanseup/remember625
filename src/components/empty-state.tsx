import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-14 text-center">
      <div
        className="text-muted-blue mb-7 flex size-20 items-center justify-center rounded-full bg-white/55"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          className="size-11"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M9 16.5h30v19H9z" />
          <path d="m10 18 14 11 14-11" />
          <path d="M24 12.5c1.4-2 3.7-1.6 4.2.2.5 1.9-1.1 3.4-4.2 4.1" />
          <path d="M24 12.5c-1.4-2-3.7-1.6-4.2.2-.5 1.9 1.1 3.4 4.2 4.1" />
        </svg>
      </div>
      <h2 className="text-xl font-bold">아직 공개된 감사편지가 없습니다.</h2>
      <p className="text-gray-text mt-2">첫 번째 마음을 남겨보세요.</p>
      <Button asChild className="mt-6">
        <Link href="/quiz">퀴즈 시작하기</Link>
      </Button>
    </div>
  );
}
