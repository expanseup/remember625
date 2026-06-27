import { notFound } from "next/navigation";
import { LetterEditor } from "@/components/letter-editor";
import { CATEGORY_META } from "@/lib/constants";
import { getQuizAttempt } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function LetterWritePage({
  searchParams,
}: {
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const { attemptId } = await searchParams;
  if (!attemptId) notFound();
  const attempt = await getQuizAttempt(attemptId);
  if (!attempt) notFound();
  return (
    <div className="section-space paper-noise">
      <div className="page-shell grid gap-10 md:grid-cols-[.8fr_1.2fr] lg:gap-14">
        <div>
          <p className="section-kicker">감사편지</p>
          <h1 className="service-title fluid-page-title mt-2">
            배운 기억을
            <br />
            마음으로 전해주세요
          </h1>
          <p className="text-gray-text mt-5 leading-8 md:max-w-xs lg:max-w-none">
            오늘 퀴즈에서 배운 내용을 바탕으로 참전용사분들께 감사의 마음을
            남겨보세요.
          </p>
          <dl className="border-navy/10 mt-8 border-y py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-text">퀴즈</dt>
              <dd className="text-navy font-semibold">
                {CATEGORY_META[attempt.category].label}
              </dd>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <dt className="text-gray-text">결과</dt>
              <dd>
                {attempt.score} / {attempt.totalQuestions}
              </dd>
            </div>
          </dl>
        </div>
        <LetterEditor attempt={attempt} />
      </div>
    </div>
  );
}
