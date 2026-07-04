import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { Button } from "@/components/ui/button";
import { PublicLetterCard } from "@/components/public-letter-card";
import { TotalQuizCounter } from "@/components/total-quiz-counter";
import { CATEGORY_META } from "@/lib/constants";
import { getPublicLetters, getTotalQuizAttempts } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [total, recent] = await Promise.all([
    getTotalQuizAttempts(),
    getPublicLetters(1, 3),
  ]);
  const randomQuiz = CATEGORY_META.mixed;
  const steps = [
    ["호국 퀴즈 풀기", "10개의 짧은 문제에 답합니다."],
    ["해설로 역사 배우기", "정답과 함께 배경을 알아봅니다."],
    ["감사편지 작성하기", "배운 내용을 마음으로 이어갑니다."],
    ["기억의 벽에 남기기", "감사의 마음을 함께 나눕니다."],
  ] as const;

  return (
    <>
      <section className="paper-noise border-navy/10 border-b">
        <div className="page-shell grid gap-12 py-[clamp(4.5rem,11vw,7.5rem)] lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="section-kicker">6.25 참전용사 감사 캠페인</p>
            <h1 className="service-title fluid-hero-title mt-4">
              Remember625
            </h1>
            <p className="text-navy mt-6 max-w-3xl text-[clamp(1.25rem,3.5vw,1.8rem)] leading-[1.42] font-semibold tracking-[-0.035em]">
              퀴즈로 기억하고, 편지로 감사하는 참여형 캠페인
            </p>
            <p className="text-gray-text fluid-lead balanced-copy mt-5 max-w-2xl">
              6.25 전쟁과 참전용사의 희생을 짧은 퀴즈로 배우고, 감사편지로
              마음을 전해보세요.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/quiz">
                  문제 시작하기
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/wall">감사의 벽 보기</Link>
              </Button>
            </div>
          </div>
          <div className="quiet-divider border-y py-7 lg:mb-2">
            <p className="text-gray-text text-sm">공개 참여 지표</p>
            <p className="text-navy mt-3 text-[clamp(2.5rem,7vw,4.25rem)] leading-none font-black tracking-[-0.06em] tabular-nums">
              <TotalQuizCounter value={total} />
              <span className="ml-1 text-[0.35em] font-bold tracking-[-0.02em]">
                번
              </span>
            </p>
            <p className="text-gray-text mt-3 leading-7">
              지금까지 진행된 호국 퀴즈 참여 횟수입니다.
            </p>
            <dl className="quiet-divider mt-7 grid grid-cols-3 gap-4 border-t pt-5 text-sm">
              <div>
                <dt className="text-gray-text">문제</dt>
                <dd className="text-navy mt-1 font-bold">10문제</dd>
              </div>
              <div>
                <dt className="text-gray-text">난이도</dt>
                <dd className="text-navy mt-1 font-bold">중간</dd>
              </div>
              <div>
                <dt className="text-gray-text">방식</dt>
                <dd className="text-navy mt-1 font-bold">랜덤</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="grid gap-4 md:grid-cols-[1fr_22rem] md:items-end">
            <div>
              <p className="section-kicker">참여 흐름</p>
              <h2 className="service-title mt-2 text-3xl">
                참여는 이렇게 진행됩니다
              </h2>
            </div>
            <p className="text-gray-text max-w-sm text-sm leading-6">
              읽고, 풀고, 남기는 흐름만 간단하게 구성했습니다.
            </p>
          </div>
          <ol className="quiet-divider mt-10 border-y md:grid md:grid-cols-2 md:border-b-0 lg:grid-cols-4">
            {steps.map(([title, description], index) => (
              <li
                key={title}
                className="quiet-divider grid gap-3 border-b py-6 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:items-start md:block md:border-r md:px-6 md:last:border-r-0 lg:min-h-40"
              >
                <span className="text-muted-blue text-sm font-bold tabular-nums">
                  0{index + 1}
                </span>
                <div className="md:mt-5">
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-gray-text mt-1 text-sm leading-6">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-navy/10 border-y bg-[#f4f1e8]">
        <div className="page-shell grid gap-8 py-[clamp(3rem,8vw,4.5rem)] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="section-kicker">오늘의 퀴즈</p>
            <h2 className="service-title mt-2 text-3xl">{randomQuiz.label}</h2>
            <p className="text-gray-text balanced-copy mt-3 max-w-xl leading-7">
              {randomQuiz.description} 약 3분 동안 풀고, 각 문제의 해설을 바로
              확인할 수 있습니다.
            </p>
            <dl className="text-navy/78 mt-7 grid gap-3 text-sm min-[520px]:grid-cols-3">
              <div className="border-navy/10 border-t pt-3">
                <dt className="text-gray-text">문제 수</dt>
                <dd className="mt-1 font-bold">10문제</dd>
              </div>
              <div className="border-navy/10 border-t pt-3">
                <dt className="text-gray-text">난이도</dt>
                <dd className="mt-1 font-bold">중간</dd>
              </div>
              <div className="border-navy/10 border-t pt-3">
                <dt className="text-gray-text">출제 방식</dt>
                <dd className="mt-1 font-bold">전체 랜덤</dd>
              </div>
            </dl>
          </div>
          <Button asChild size="lg" className="w-full min-[520px]:w-auto">
            <Link href="/quiz">문제 시작하기</Link>
          </Button>
        </div>
      </section>

      <section className="section-space paper-noise border-navy/10 border-t">
        <div className="page-shell">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="section-kicker">감사의 마음</p>
              <h2 className="service-title mt-2 text-3xl">
                최근 도착한 감사의 마음
              </h2>
            </div>
            <Link
              href="/wall"
              className="text-muted-blue inline-flex min-h-11 items-center gap-2 font-semibold hover:underline"
            >
              모두 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
          {recent.letters.length > 0 ? (
            <div className="border-navy/10 mt-8 border-t">
              {recent.letters.map((letter) => (
                <PublicLetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          ) : (
            <p className="border-navy/10 text-gray-text mt-8 border-y py-8 text-center">
              첫 감사편지가 기다리고 있습니다.
            </p>
          )}
          <AdSlot placement="main" className="mt-10" />
        </div>
      </section>
    </>
  );
}
