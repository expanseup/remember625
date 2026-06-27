import { getQuizTitle } from "@/lib/title";

export function getShareCardComment(score: number, total = 10) {
  const correct = Math.round((score / Math.max(total, 1)) * 5);
  if (correct <= 1) return "오늘의 기억을 시작했어요";
  if (correct === 2) return "차근차근 기억을 쌓고 있어요";
  if (correct === 3) return "중요한 역사를 잘 기억했어요";
  if (correct === 4) return "정말 잘했어요";
  return "완벽한 기억 작전 성공";
}

export function getShareCardText(score: number, total = 10) {
  const result = getQuizTitle(score, total);
  return {
    scoreText: `${score} / ${total}`,
    scoreDetail: `${total}문제 중 ${score}문제 정답`,
    title: result.title,
    comment: getShareCardComment(score, total),
    serviceName: "기억작전 625",
    tagline: "퀴즈로 기억하고, 편지로 감사하기",
    invitation: "당신도 기억에 동참해보세요",
  };
}
