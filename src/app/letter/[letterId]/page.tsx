import Link from "next/link";
import { notFound } from "next/navigation";
import { LetterFrame } from "@/components/letter-frame";
import { Button } from "@/components/ui/button";
import { getLetter } from "@/lib/repository";
import { verifySignedToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export default async function LetterPage({
  params,
  searchParams,
}: {
  params: Promise<{ letterId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ letterId }, query] = await Promise.all([params, searchParams]);
  const letter = await getLetter(letterId);
  if (!letter) notFound();
  const access = verifySignedToken(query.token, "letter");
  const ownsToken =
    access?.letterId === letter.id && access.sessionId === letter.sessionId;
  if (
    (!letter.isPublic || letter.moderationStatus !== "approved") &&
    !ownsToken
  )
    notFound();
  return (
    <div className="bg-deep-navy py-[clamp(3rem,8vw,5rem)]">
      <div className="page-shell">
        <div className="mx-auto mb-8 max-w-2xl text-white">
          <p className="text-gold text-xs font-bold tracking-[0.12em]">
            감사편지
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,6vw,2.25rem)] leading-[1.25] font-bold tracking-[-0.04em]">
            감사편지가 완성되었습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            남겨주신 마음은 감사의 벽에 함께 기록됩니다.
          </p>
        </div>
        <LetterFrame letter={letter} />
        {letter.moderationStatus !== "approved" && (
          <p className="border-gold/25 mx-auto mt-5 max-w-2xl rounded-xl border bg-white/8 p-4 text-center text-sm text-white/75">
            이 편지는 개인정보 또는 표현 검토 후 감사의 벽에 공개됩니다.
          </p>
        )}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/wall">감사의 벽 보기</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/25 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/quiz">다른 퀴즈 풀기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
