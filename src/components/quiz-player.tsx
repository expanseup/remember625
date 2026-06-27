"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_META,
  DEFAULT_QUIZ_CATEGORY,
  DEFAULT_QUIZ_DIFFICULTY,
} from "@/lib/constants";
import {
  clearQuizRunId,
  getAnonymousSessionId,
  getOrCreateQuizRunId,
} from "@/lib/session";
import type { PublicQuizQuestion, QuizAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Feedback {
  isCorrect: boolean;
  correctAnswerIndex: number;
  explanation: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export function QuizPlayer() {
  const router = useRouter();
  const category = DEFAULT_QUIZ_CATEGORY;
  const difficulty = DEFAULT_QUIZ_DIFFICULTY;
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const answersRef = useRef<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    answersRef.current = [];
    fetch("/api/quiz", {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => setQuestions(data.questions))
      .catch((reason) => {
        if (reason.name !== "AbortError")
          setError(reason.message || "문제를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const question = questions[index];

  async function chooseAnswer(optionIndex: number) {
    if (!question || selected !== null) return;
    setSelected(optionIndex);
    setError("");
    try {
      const response = await fetch("/api/quiz/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selectedIndex: optionIndex,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setFeedback(data);
      answersRef.current = [
        ...answersRef.current,
        { questionId: question.id, selectedIndex: optionIndex },
      ];
    } catch (reason) {
      setSelected(null);
      setError(
        reason instanceof Error
          ? reason.message
          : "정답을 확인하지 못했습니다.",
      );
    }
  }

  async function next() {
    if (!feedback) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      setError("");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getAnonymousSessionId(),
          clientRunId: getOrCreateQuizRunId(),
          category,
          difficulty,
          answers: answersRef.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      clearQuizRunId();
      router.replace(`/quiz/result/${data.attemptId}`);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "결과를 저장하지 못했습니다.",
      );
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="text-gray-text flex min-h-[55vh] flex-col items-center justify-center gap-3">
        <LoaderCircle className="size-7 animate-spin" />
        <p>문제를 준비하고 있습니다.</p>
      </div>
    );
  if (!question)
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <AlertCircle className="text-muted-red mx-auto size-9" />
        <h1 className="mt-5 text-2xl font-bold">문제를 불러오지 못했습니다.</h1>
        <p className="text-gray-text mt-2">
          {error || "잠시 후 다시 시도해 주세요."}
        </p>
        <Button asChild className="mt-6">
          <Link href="/quiz">퀴즈 시작으로 돌아가기</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl py-6 sm:py-10 lg:py-14">
      <div className="flex flex-col gap-2 text-sm min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
        <div className="text-gray-text flex flex-wrap gap-2">
          <span className="text-navy font-semibold">
            {CATEGORY_META.mixed.label}
          </span>
          <span aria-hidden="true">·</span>
          <span>{CATEGORY_META[question.category].label}</span>
        </div>
        <span className="text-muted-blue font-semibold tabular-nums">
          문제 {index + 1} / {questions.length}
        </span>
      </div>
      <div
        className="bg-navy/8 mt-4 h-1 overflow-hidden"
        aria-label={`퀴즈 진행률 ${index + 1}/${questions.length}`}
      >
        <div
          className="bg-navy h-full transition-all duration-500"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <section
        key={question.id}
        className="animate-fade-up border-navy/10 mt-8 border-t pt-7 sm:mt-10 sm:pt-8"
      >
        <p className="section-kicker">문제 {index + 1}</p>
        <h1 className="mt-3 text-[clamp(1.45rem,5vw,2rem)] leading-[1.45] font-bold tracking-[-0.03em]">
          {question.question}
        </h1>
        <div
          className="border-navy/10 mt-8 divide-y divide-navy/10 border-y"
          role="radiogroup"
          aria-label="정답 선택"
        >
          {question.options.map((option, optionIndex) => {
            const isChosen = selected === optionIndex;
            const isCorrect = feedback?.correctAnswerIndex === optionIndex;
            const isWrongChosen = feedback && isChosen && !feedback.isCorrect;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={selected !== null}
                onClick={() => chooseAnswer(optionIndex)}
                className={cn(
                  "focus-visible:ring-gold flex min-h-16 w-full items-center gap-3 px-1 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none sm:gap-4 sm:px-3",
                  !feedback &&
                    "hover:bg-white/55",
                  isCorrect &&
                    "bg-emerald-50/70 text-emerald-950",
                  isWrongChosen && "bg-red-50/80 text-red-950",
                  feedback &&
                    !isCorrect &&
                    !isWrongChosen &&
                    "text-navy/45",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                    isCorrect
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isWrongChosen
                        ? "border-muted-red bg-muted-red text-white"
                        : "border-navy/15",
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="size-4" />
                  ) : isWrongChosen ? (
                    <XCircle className="size-4" />
                  ) : (
                    optionIndex + 1
                  )}
                </span>
                <span className="font-medium">{option}</span>
                {isCorrect && feedback && (
                  <span className="ml-auto shrink-0 text-xs font-bold">
                    정답
                  </span>
                )}
                {isWrongChosen && (
                  <span className="ml-auto shrink-0 text-xs font-bold">
                    선택한 답
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div
            className={cn(
              "mt-7 border-l-2 py-1 pl-4",
              feedback.isCorrect
                ? "border-emerald-600"
                : "border-muted-red",
            )}
          >
            <p className="font-bold">
              {feedback.isCorrect ? "정답입니다" : "아쉽지만 오답입니다"}
            </p>
            <p className="text-navy/75 mt-2 leading-7">
              {feedback.explanation}
            </p>
            {feedback.sourceUrl && (
              <a
                href={feedback.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-blue mt-3 inline-block text-xs font-medium hover:underline"
              >
                출처: {feedback.sourceTitle}
              </a>
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="text-muted-red mt-5 text-sm font-medium">
            {error}
          </p>
        )}
        <Button
          className="mt-7 w-full"
          size="lg"
          disabled={!feedback || submitting}
          onClick={next}
        >
          {submitting && <LoaderCircle className="size-4 animate-spin" />}
          {index === questions.length - 1 ? "결과 확인하기" : "다음 문제"}
        </Button>
      </section>
    </div>
  );
}
