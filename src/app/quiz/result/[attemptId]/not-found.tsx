import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="page-shell py-24 text-center">
      <h1 className="text-3xl font-bold">퀴즈 결과를 찾을 수 없습니다.</h1>
      <p className="text-gray-text mt-3">
        주소가 올바른지 확인하거나 새로운 퀴즈를 시작해 주세요.
      </p>
      <Button asChild className="mt-7">
        <Link href="/quiz">퀴즈 시작하기</Link>
      </Button>
    </div>
  );
}
