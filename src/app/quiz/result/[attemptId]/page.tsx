import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { ResultSummary } from "@/components/result-summary";
import { ShareResultCard } from "@/components/share-result-card";
import { Button } from "@/components/ui/button";
import { getQuizAttempt } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await getQuizAttempt(attemptId);
  if (!attempt) notFound();
  return (
    <div className="section-space paper-noise">
      <div className="page-shell">
        <div className="grid items-start gap-11 md:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <ResultSummary attempt={attempt} />
          <div className="md:pt-3">
            <p className="section-kicker">다음 단계</p>
            <h1 className="service-title mt-2 text-[clamp(2.15rem,6vw,3.35rem)]">
              기억을 감사로 이어가 보세요
            </h1>
            <p className="text-gray-text fluid-lead balanced-copy mt-5 max-w-lg">
              오늘 알게 된 역사와 느낀 마음을 참전용사분들께 보내는 감사편지로
              남길 수 있습니다.
            </p>
            <ShareResultCard attempt={attempt} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/letter/write?attemptId=${attempt.id}`}>
                  참전용사분들께 감사편지 남기기
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/quiz">다시 풀기</Link>
              </Button>
            </div>
            <Link
              href="/"
              className="text-gray-text hover:text-navy mt-5 inline-flex min-h-11 items-center text-sm font-medium hover:underline"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
        <AdSlot placement="result" className="mt-14" />
      </div>
    </div>
  );
}
