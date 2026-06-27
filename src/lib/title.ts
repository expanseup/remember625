export function getQuizTitle(score: number, total = 5) {
  const correct = Math.round((score / Math.max(total, 1)) * 5);
  if (correct <= 1)
    return {
      title: "기억의 시작",
      message: "오늘의 퀴즈를 통해 기억의 첫걸음을 시작했습니다.",
      badge: 0,
    };
  if (correct === 2)
    return {
      title: "호국 새싹",
      message: "해설을 다시 읽으며 기억을 더 깊게 만들어보세요.",
      badge: 1,
    };
  if (correct === 3)
    return {
      title: "기억 지킴이",
      message: "중요한 역사적 사실들을 잘 기억하고 있습니다.",
      badge: 2,
    };
  if (correct === 4)
    return {
      title: "감사 전달자",
      message: "참전용사분들의 희생과 전쟁의 흐름을 깊이 이해하고 있습니다.",
      badge: 3,
    };
  return {
    title: "역사왕",
    message: "훌륭합니다. 오늘 배운 내용을 감사편지로 이어가보세요.",
    badge: 4,
  };
}
