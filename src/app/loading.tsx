import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <div className="text-gray-text flex min-h-[55vh] items-center justify-center gap-3">
      <LoaderCircle className="size-6 animate-spin" /> 화면을 준비하고 있습니다.
    </div>
  );
}
