import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { EmptyState } from "@/components/empty-state";
import { PublicLetterCard } from "@/components/public-letter-card";
import { getPublicLetters } from "@/lib/repository";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WallPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const current = Math.max(1, Number(query.page || 1) || 1);
  const data = await getPublicLetters(current, 9);
  const pages = Math.max(1, Math.ceil(data.total / 9));
  return (
    <div className="section-space paper-noise">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">감사의 벽</p>
          <h1 className="service-title fluid-page-title mt-2">감사의 벽</h1>
          <p className="text-gray-text fluid-lead mt-5">
            퀴즈를 마친 사람들이 남긴 감사의 마음입니다.
          </p>
          <Link
            href="/quiz"
            className="text-muted-blue mt-5 inline-flex min-h-11 items-center font-semibold hover:underline"
          >
            나도 퀴즈 참여하기
          </Link>
        </div>
        {data.letters.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="border-navy/10 mt-10 border-t">
              {data.letters.map((letter, index) => (
                <div key={letter.id}>
                  <PublicLetterCard letter={letter} />
                  {index === 4 && <AdSlot className="my-7" />}
                </div>
              ))}
            </div>
            <nav
              className="mt-10 flex flex-wrap justify-center gap-2"
              aria-label="감사의 벽 페이지"
            >
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={`/wall?page=${page}`}
                    aria-current={page === current ? "page" : undefined}
                    className={cn(
                      "flex size-10 items-center justify-center border text-sm font-bold",
                      page === current
                        ? "border-navy bg-navy text-white"
                        : "border-navy/10 hover:border-navy/30 bg-white",
                    )}
                  >
                    {page}
                  </Link>
                ),
              )}
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
