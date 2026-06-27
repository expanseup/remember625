import type { Metadata } from "next";
import { QuizSetupForm } from "@/components/quiz-setup-form";

export const metadata: Metadata = { title: "호국 퀴즈 시작하기" };

export default function QuizPage() {
  return (
    <div className="section-space paper-noise">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">호국 퀴즈</p>
          <h1 className="service-title fluid-page-title mt-2">
            호국 퀴즈 시작하기
          </h1>
          <p className="text-gray-text fluid-lead mt-4">
            선택 과정 없이 바로 시작합니다. 전체 주제에서 10문제가 랜덤으로
            출제됩니다.
          </p>
        </div>
        <div className="mt-10 sm:mt-12">
          <QuizSetupForm />
        </div>
      </div>
    </div>
  );
}
