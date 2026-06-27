import { NextRequest, NextResponse } from "next/server";
import { getQuestion } from "@/lib/repository";
import { checkAnswerSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const parsed = checkAnswerSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { message: "답안 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  const question = await getQuestion(parsed.data.questionId);
  if (!question)
    return NextResponse.json(
      { message: "문제를 찾을 수 없습니다." },
      { status: 404 },
    );
  return NextResponse.json({
    isCorrect: parsed.data.selectedIndex === question.correctAnswerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    explanation: question.explanation,
    sourceTitle: question.sourceTitle,
    sourceUrl: question.sourceUrl,
  });
}
