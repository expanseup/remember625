import { NextResponse } from "next/server";
import { getRandomQuestions } from "@/lib/repository";
import { QUIZ_QUESTION_COUNT } from "@/lib/constants";

export async function GET() {
  try {
    const questions = await getRandomQuestions();
    if (questions.length < QUIZ_QUESTION_COUNT)
      return NextResponse.json(
        { message: "준비된 문제가 부족합니다." },
        { status: 503 },
      );
    return NextResponse.json({
      questions: questions.map((question) => ({
        id: question.id,
        category: question.category,
        difficulty: question.difficulty,
        question: question.question,
        options: question.options,
        explanation: question.explanation,
        sourceTitle: question.sourceTitle,
        sourceUrl: question.sourceUrl,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
