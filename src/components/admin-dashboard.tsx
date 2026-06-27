"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_META } from "@/lib/constants";
import type { Letter, QuizCategory } from "@/lib/types";
import { formatKoreanDate, truncate } from "@/lib/utils";

interface Stats {
  totalQuizAttempts: number;
  totalLetters: number;
  publicLetters: number;
  reviewLetters: number;
  byCategory: Partial<Record<QuizCategory, number>>;
  recentLetters: Letter[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/stats", { cache: "no-store" });
    if (response.status === 401) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    const data = await response.json();
    setStats(data);
    setNeedsLogin(false);
    setLoading(false);
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/stats", { cache: "no-store" }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (active) {
        setStats(data);
        setNeedsLogin(false);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }
    setSecret("");
    await load();
  }

  async function moderate(
    letterId: string,
    action: "approve" | "hide" | "reject",
  ) {
    const response = await fetch("/api/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letterId, action }),
    });
    if (response.ok) await load();
  }

  if (loading && !stats)
    return (
      <div className="text-gray-text flex min-h-[55vh] items-center justify-center gap-3">
        <LoaderCircle className="size-6 animate-spin" /> 관리자 화면을 불러오는
        중입니다.
      </div>
    );
  if (needsLogin)
    return (
      <div className="mx-auto max-w-md py-24">
        <div className="border-navy/10 border-y py-7">
          <ShieldCheck className="text-muted-blue size-10" />
          <h1 className="mt-5 text-2xl font-black">관리자 인증</h1>
          <p className="text-gray-text mt-2 text-sm">
            운영용 환경변수에 설정한 암호를 입력해 주세요.
          </p>
          <form onSubmit={login} className="mt-7">
            <label htmlFor="secret" className="mb-2 block text-sm font-bold">
              관리자 암호
            </label>
            <Input
              id="secret"
              type="password"
              autoComplete="current-password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
            />
            {error && <p className="text-muted-red mt-3 text-sm">{error}</p>}
            <Button className="mt-5 w-full" disabled={loading}>
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              입장하기
            </Button>
          </form>
        </div>
      </div>
    );
  if (!stats) return null;
  const cards = [
    ["총 퀴즈 참여", stats.totalQuizAttempts],
    ["총 감사편지", stats.totalLetters],
    ["공개 편지", stats.publicLetters],
    ["숨김·검토", stats.reviewLetters],
  ];
  return (
    <div className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-blue text-sm font-semibold">
            ADMINISTRATION
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            운영 대시보드
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          새로고침
        </Button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="border-navy/10 border-t py-5"
          >
            <p className="text-gray-text text-sm">{label}</p>
            <strong className="mt-2 block text-3xl tabular-nums">
              {value}
            </strong>
          </div>
        ))}
      </div>
      <div className="border-navy/10 mt-6 border-y py-6">
        <h2 className="font-bold">카테고리별 참여</h2>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {(Object.keys(CATEGORY_META) as QuizCategory[]).map((key) => (
            <div key={key} className="flex justify-between gap-6">
              <dt className="text-gray-text">{CATEGORY_META[key].label}</dt>
              <dd className="font-bold tabular-nums">
                {stats.byCategory[key] ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-bold">최근 편지</h2>
        <div className="border-navy/10 mt-4 border-t">
          {stats.recentLetters.length === 0 ? (
            <p className="text-gray-text p-8 text-center">
              저장된 편지가 없습니다.
            </p>
          ) : (
            stats.recentLetters.map((letter) => (
              <article
                key={letter.id}
                className="border-navy/8 border-b py-5 last:border-0"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-blue font-bold">
                    {letter.moderationStatus}
                  </span>
                  <span className="text-gray-text">
                    {letter.nickname} · {formatKoreanDate(letter.createdAt)}
                  </span>
                </div>
                <p className="text-navy/75 mt-3 text-sm leading-6">
                  {truncate(letter.content, 180)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moderate(letter.id, "approve")}
                  >
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moderate(letter.id, "hide")}
                  >
                    숨기기
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => moderate(letter.id, "reject")}
                  >
                    거절
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
