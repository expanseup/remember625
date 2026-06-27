import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="page-shell py-24 text-center">
      <h1 className="text-3xl font-bold">편지를 볼 수 없습니다.</h1>
      <p className="text-gray-text mt-3">
        존재하지 않거나 공개되지 않은 편지입니다.
      </p>
      <Button asChild className="mt-7">
        <Link href="/wall">감사의 벽으로</Link>
      </Button>
    </div>
  );
}
