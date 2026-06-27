import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { adminLoginSchema } from "@/lib/schemas";
import { createSignedToken, isValidAdminSecret } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  const parsed = adminLoginSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success || !isValidAdminSecret(parsed.data.secret)) {
    return NextResponse.json(
      { message: "관리자 암호가 올바르지 않습니다." },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createSignedToken({ type: "admin", exp: Date.now() + 1000 * 60 * 60 * 8 }),
    {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    },
  );
  return response;
}
