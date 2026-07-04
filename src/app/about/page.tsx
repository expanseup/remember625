import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "서비스 소개" };

export default function AboutPage() {
  const sections = [
    [
      "Remember625란?",
      "6.25 참전용사분들의 희생을 기억하기 위해 만들어진 참여형 웹 캠페인입니다. 사용자는 퀴즈를 통해 역사적 사실을 배우고, 감사편지를 남기며 기억에 동참할 수 있습니다.",
    ],
    [
      "왜 만들었나요?",
      "어렵고 멀게 느껴질 수 있는 역사를 짧은 퀴즈로 만나고, 배운 내용을 감사의 언어로 이어가도록 돕기 위해 만들었습니다.",
    ],
    [
      "참여 방식",
      "문제 시작하기 버튼을 누르면 전체 주제에서 10문제가 무작위로 출제됩니다. 정답 해설을 읽은 뒤 참전용사분들께 감사편지를 남기면 디지털 액자로 완성됩니다.",
    ],
    [
      "운영 공개 원칙",
      "운영 관련 수치는 확인된 항목만 안내합니다. 공개 화면은 총 퀴즈 참여 횟수와 같은 참여 지표를 중심으로 구성하며, 확정되지 않은 재원 규모를 노출하지 않습니다.",
    ],
    [
      "개인정보와 편지",
      "감사편지는 공개될 수 있습니다. 전화번호, 주소, 학교반, 실명 등 개인정보를 적지 말아 주세요. 부적절하거나 반복적인 내용은 공개 전 검토될 수 있습니다.",
    ],
  ];
  return (
    <div className="section-space paper-noise">
      <div className="page-shell max-w-4xl">
        <p className="section-kicker">서비스 소개</p>
        <h1 className="service-title fluid-page-title mt-2">
          기억을 참여로 이어갑니다
        </h1>
        <p className="text-gray-text fluid-lead mt-6 max-w-2xl">
          퀴즈로 배우고 편지로 감사하며, 오늘의 평범한 일상이 어디에서 왔는지
          함께 기억합니다.
        </p>
        <div className="divide-navy/10 border-navy/10 mt-14 divide-y border-y">
          {sections.map(([title, body], index) => (
            <section
              key={title}
              className="grid gap-3 py-8 md:grid-cols-[3rem_minmax(10rem,14rem)_1fr]"
            >
              <span className="text-gold text-sm font-bold">0{index + 1}</span>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-gray-text leading-8">{body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/quiz">문제 시작하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="mailto:expanseup.shop@gmail.com">문의하기</a>
          </Button>
        </div>
        <AdSlot placement="about" className="mt-12" />
      </div>
    </div>
  );
}
