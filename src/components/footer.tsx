import Link from "next/link";
import { Brand } from "@/components/brand";

export function Footer() {
  return (
    <footer className="border-navy/10 bg-[#f2f1ec] border-t text-navy/70">
      <div className="page-shell grid gap-8 py-9 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Brand compact />
          <p className="mt-3 max-w-xl text-sm leading-6">
            퀴즈로 역사를 배우고 감사편지로 기억을 이어가는 6.25 참전용사 감사
            캠페인입니다.
          </p>
          <p className="mt-2 text-xs text-navy/45">
            편지에 전화번호, 주소, 학교반 등 개인정보를 적지 말아 주세요.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
          aria-label="하단 메뉴"
        >
          <Link href="/about" className="hover:text-navy">
            서비스 소개
          </Link>
          <Link href="/wall" className="hover:text-navy">
            감사의 벽
          </Link>
          <a
            href="mailto:expanseup.shop@gmail.com"
            className="hover:text-navy"
          >
            문의
          </a>
        </nav>
      </div>
    </footer>
  );
}
