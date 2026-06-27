import { NextRequest, NextResponse } from "next/server";
import { QUIZ_QUESTION_COUNT } from "@/lib/constants";
import { getQuestion, saveQuizAttempt } from "@/lib/repository";
import { quizSubmitSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const parsed = quizSubmitSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { message: "퀴즈 제출 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  if (
    new Set(parsed.data.answers.map((answer) => answer.questionId)).size !==
    QUIZ_QUESTION_COUNT
  ) {
    return NextResponse.json(
      { message: "중복된 문제가 포함되어 있습니다." },
      { status: 400 },
    );
  }
  try {
    const questions = await Promise.all(
      parsed.data.answers.map((answer) => getQuestion(answer.questionId)),
    );
    if (
      questions.some(
        (question) =>
          !question ||
          (parsed.data.category !== "mixed" &&
            question.category !== parsed.data.category) ||
          question.difficulty !== parsed.data.difficulty,
      )
    ) {
      return NextResponse.json(
        { message: "퀴즈 문제를 검증할 수 없습니다." },
        { status: 400 },
      );
    }
    const score = parsed.data.answers.reduce(
      (sum, answer, index) =>
        sum +
        (questions[index]?.correctAnswerIndex === answer.selectedIndex ? 1 : 0),
      0,
    );
    const answers = parsed.data.answers.map((answer, index) => ({
      ...answer,
      category: questions[index]?.category,
    }));
    const attempt = await saveQuizAttempt({
      sessionId: parsed.data.sessionId,
      clientRunId: parsed.data.clientRunId,
      category: parsed.data.category,
      difficulty: parsed.data.difficulty,
      score,
      totalQuestions: QUIZ_QUESTION_COUNT,
      answers,
    });
    return NextResponse.json({
      attemptId: attempt.id,
      score,
      totalQuestions: QUIZ_QUESTION_COUNT,
    });
  } catch {
    return NextResponse.json(
      { message: "결과를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
