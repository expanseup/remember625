import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { moderateStoredLetter } from "@/lib/repository";
import { adminModerationSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession()))
    return NextResponse.json(
      { message: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  const parsed = adminModerationSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { message: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  const letter = await moderateStoredLetter(
    parsed.data.letterId,
    parsed.data.action,
  );
  if (!letter)
    return NextResponse.json(
      { message: "편지를 찾을 수 없습니다." },
      { status: 404 },
    );
  return NextResponse.json({ letter });
}
