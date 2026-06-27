import Link from "next/link";
import { TopicIcon } from "@/components/topic-icon";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, QUIZ_TOPIC_CATEGORIES } from "@/lib/constants";

export function QuizSetupForm() {
  return (
    <div className="max-w-3xl">
      <div className="quiet-divider border-y py-8">
        <div className="flex items-start gap-4">
          <span
            className="border-navy/12 text-muted-blue flex size-10 shrink-0 items-center justify-center rounded-xl border bg-white/45"
            aria-hidden="true"
          >
            <TopicIcon category="mixed" className="size-5" />
          </span>
          <div>
            <h2 className="text-navy text-xl font-bold">랜덤 퀴즈</h2>
            <p className="text-gray-text balanced-copy mt-2 leading-7">
              주제와 문제를 모두 무작위로 구성합니다. 전투, 인물, 연대,
              유엔참전국, 보훈 상식에서 10문제가 출제됩니다.
            </p>
          </div>
        </div>
        <div
          className="mt-8 grid gap-x-6 gap-y-3 min-[520px]:grid-cols-2 md:grid-cols-3"
          aria-label="출제 범위"
        >
          {QUIZ_TOPIC_CATEGORIES.map((category) => (
            <div
              key={category}
              className="text-navy/80 flex min-h-9 items-center gap-2.5 text-sm font-semibold"
            >
              <TopicIcon
                category={category}
                className="text-muted-blue size-4 shrink-0"
              />
              {CATEGORY_META[category].label.replace(" 퀴즈", "")}
            </div>
          ))}
        </div>
        <p className="text-gray-text mt-2 text-sm leading-6">
          모든 퀴즈는 핵심만 다루는 중간 수준입니다. 10문제를 풀고 바로 해설을
          확인할 수 있습니다.
        </p>
        <Button asChild size="lg" className="mt-7 w-full sm:w-auto sm:min-w-48">
          <Link href="/quiz/play">문제 시작하기</Link>
        </Button>
      </div>
    </div>
  );
}
