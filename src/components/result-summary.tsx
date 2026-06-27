import { CATEGORY_META } from "@/lib/constants";
import { getQuizTitle } from "@/lib/title";
import type { QuizAttempt } from "@/lib/types";

export function ResultSummary({ attempt }: { attempt: QuizAttempt }) {
  const result = getQuizTitle(attempt.score, attempt.totalQuestions);
  return (
    <section className="quiet-divider border-y py-7 sm:py-8">
      <p className="section-kicker">퀴즈 결과</p>
      <div className="mt-5 flex items-end gap-2">
        <strong className="text-navy text-[clamp(3rem,9vw,4rem)] leading-none font-black tracking-[-0.06em] tabular-nums">
          {attempt.score}
        </strong>
        <span className="text-gray-text pb-2 text-xl">
          / {attempt.totalQuestions}
        </span>
      </div>
      <p className="text-gray-text mt-3 text-sm">
        {attempt.score}문제를 맞혔습니다.
      </p>
      <div className="quiet-divider mt-7 border-t pt-5">
        <p className="text-muted-blue text-sm font-semibold">오늘의 칭호</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em]">
          {result.title}
        </h2>
        <p className="text-gray-text balanced-copy mt-3 leading-7">
          {result.message}
        </p>
      </div>
      <dl className="quiet-divider mt-6 grid gap-3 border-t pt-5 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-text">카테고리</dt>
          <dd className="font-semibold">{CATEGORY_META[attempt.category].label}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-text">문제 수</dt>
          <dd className="font-semibold">{attempt.totalQuestions}문제</dd>
        </div>
      </dl>
    </section>
  );
}
