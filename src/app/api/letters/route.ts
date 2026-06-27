import { NextRequest, NextResponse } from "next/server";
import { moderateLetter } from "@/lib/moderation";
import { getPublicLetters, getQuizAttempt, saveLetter } from "@/lib/repository";
import { letterSchema } from "@/lib/schemas";
import { createSignedToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const limit = Math.min(
    12,
    Number(request.nextUrl.searchParams.get("limit") || 9),
  );
  return NextResponse.json(await getPublicLetters(page, limit));
}

export async function POST(request: NextRequest) {
  const parsed = letterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message || "편지 내용을 확인해 주세요.",
      },
      { status: 400 },
    );
  }
  try {
    const attempt = await getQuizAttempt(parsed.data.quizAttemptId);
    if (
      !attempt ||
      attempt.sessionId !== parsed.data.sessionId ||
      attempt.category !== parsed.data.relatedCategory
    ) {
      return NextResponse.json(
        { message: "완료한 퀴즈 정보를 확인할 수 없습니다." },
        { status: 403 },
      );
    }
    const result = moderateLetter(parsed.data.content);
    const letter = await saveLetter({
      quizAttemptId: parsed.data.quizAttemptId,
      sessionId: parsed.data.sessionId,
      nickname: parsed.data.nickname,
      content: parsed.data.content,
      aiDraftUsed: parsed.data.aiDraftUsed,
      relatedCategory: parsed.data.relatedCategory,
      moderationStatus: result.approved ? "approved" : "pending",
      isPublic: result.approved,
    });
    const viewToken = createSignedToken({
      type: "letter",
      letterId: letter.id,
      sessionId: letter.sessionId,
      exp: Date.now() + 1000 * 60 * 60 * 24,
    });
    return NextResponse.json({
      letterId: letter.id,
      viewToken,
      pendingReview: !result.approved,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "편지를 저장하지 못했습니다. 내용을 복사해 둔 뒤 다시 시도해 주세요.",
      },
      { status: 500 },
    );
  }
}
