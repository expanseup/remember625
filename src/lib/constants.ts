import type { QuizCategory, QuizDifficulty } from "@/lib/types";

export const QUIZ_QUESTION_COUNT = 10;

export const CATEGORY_META: Record<
  QuizCategory,
  { label: string; description: string }
> = {
  mixed: {
    label: "랜덤 퀴즈",
    description: `전체 주제에서 ${QUIZ_QUESTION_COUNT}문제가 무작위로 출제됩니다.`,
  },
  battle: {
    label: "전투 퀴즈",
    description: "주요 전투와 전쟁의 흐름을 다룹니다.",
  },
  person: {
    label: "인물 퀴즈",
    description: "참전용사와 역사 속 인물들을 기억합니다.",
  },
  chronology: {
    label: "연대 퀴즈",
    description: "6.25 전쟁과 근현대사의 중요한 날짜를 다룹니다.",
  },
  un: {
    label: "유엔참전국 퀴즈",
    description: "대한민국을 도운 유엔참전국을 알아봅니다.",
  },
  memorial: {
    label: "보훈 상식 퀴즈",
    description: "보훈, 추모, 기억과 관련된 상식을 다룹니다.",
  },
};

export const QUIZ_TOPIC_CATEGORIES: Exclude<QuizCategory, "mixed">[] = [
  "battle",
  "person",
  "chronology",
  "un",
  "memorial",
];

export const DEFAULT_QUIZ_CATEGORY: QuizCategory = "mixed";
export const DEFAULT_QUIZ_DIFFICULTY: QuizDifficulty = "normal";

export const OFFICIAL_SOURCES = {
  history: {
    title: "국사편찬위원회 우리역사넷 - 6·25전쟁",
    url: "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_50&levelId=kc_i501100",
  },
  veterans: {
    title: "국가보훈부 유엔참전용사 디지털 아카이브",
    url: "https://unarchives.mpva.go.kr/",
  },
  unmck: {
    title: "재한유엔기념공원",
    url: "https://www.unmck.or.kr/",
  },
};
