import { NextResponse } from "next/server";
import { getTotalQuizAttempts } from "@/lib/repository";

export async function GET() {
  try {
    return NextResponse.json({
      totalQuizAttempts: await getTotalQuizAttempts(),
    });
  } catch {
    return NextResponse.json({ totalQuizAttempts: 0, degraded: true });
  }
}
