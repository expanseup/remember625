import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/repository";

export async function GET() {
  if (!(await hasAdminSession()))
    return NextResponse.json(
      { message: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  return NextResponse.json(await getAdminStats());
}
