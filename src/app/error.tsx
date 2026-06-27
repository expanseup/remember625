"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell py-24 text-center">
      <h2 className="text-3xl font-bold">화면을 불러오지 못했습니다.</h2>
      <p className="text-gray-text mt-3">잠시 후 다시 시도해 주세요.</p>
      <Button className="mt-7" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
