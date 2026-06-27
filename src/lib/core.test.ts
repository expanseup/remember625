import { describe, expect, it } from "vitest";
import { QUIZ_SEED } from "@/data/quiz-seed";
import { moderateLetter } from "@/lib/moderation";
import { letterSchema } from "@/lib/schemas";
import { getShareCardComment, getShareCardText } from "@/lib/share-card";
import { getQuizTitle } from "@/lib/title";

describe("quiz seed", () => {
  it("contains one thousand medium questions with balanced categories", () => {
    expect(QUIZ_SEED).toHaveLength(1000);
    const groups = new Map<string, number>();
    for (const item of QUIZ_SEED) {
      expect(item.difficulty).toBe("normal");
      groups.set(item.category, (groups.get(item.category) ?? 0) + 1);
    }
    expect([...groups.values()]).toEqual(Array(5).fill(200));
  });
  it("keeps every question sourced, unique, four-choice and answerable", () => {
    const questionTexts = new Set<string>();
    for (const item of QUIZ_SEED) {
      expect(questionTexts.has(item.question)).toBe(false);
      questionTexts.add(item.question);
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctAnswerIndex).toBeLessThan(4);
      expect(item.explanation.length).toBeGreaterThan(20);
      expect(item.sourceTitle).toBeTruthy();
      expect(item.sourceUrl).toMatch(/^https:\/\//);
    }
  });
});

describe("titles and moderation", () => {
  it("assigns the requested title thresholds", () => {
    expect(getQuizTitle(0).title).toBe("기억의 시작");
    expect(getQuizTitle(2).title).toBe("호국 새싹");
    expect(getQuizTitle(3).title).toBe("기억 지킴이");
    expect(getQuizTitle(4).title).toBe("감사 전달자");
    expect(getQuizTitle(5).title).toBe("역사왕");
  });
  it("builds share card copy from the same score thresholds", () => {
    expect(getShareCardComment(1)).toBe("오늘의 기억을 시작했어요");
    expect(getShareCardComment(8)).toBe("정말 잘했어요");
    expect(getShareCardText(10).title).toBe("역사왕");
    expect(getShareCardText(10).scoreText).toBe("10 / 10");
    expect(getShareCardText(10).scoreDetail).toBe("10문제 중 10문제 정답");
  });
  it("holds personal information and abusive content for review", () => {
    expect(
      moderateLetter(
        "감사합니다. 제 전화번호는 010-1234-5678입니다. 오래 기억하겠습니다.",
      ).approved,
    ).toBe(false);
    expect(
      moderateLetter(
        "참전용사님의 희생과 헌신을 기억하며 지금의 평화로운 일상을 소중히 여기겠습니다. 진심으로 감사합니다.",
      ).approved,
    ).toBe(true);
  });
});

describe("letter validation", () => {
  it("accepts letters longer than 800 characters", () => {
    const result = letterSchema.safeParse({
      quizAttemptId: "attempt-id",
      sessionId: "11111111-1111-4111-8111-111111111111",
      nickname: "익명",
      content: "감사합니다. ".repeat(100),
      aiDraftUsed: false,
      relatedCategory: "memorial",
    });

    expect(result.success).toBe(true);
  });
});
