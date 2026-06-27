const BLOCKED_WORDS = ["죽어", "혐오", "병신", "씨발", "꺼져", "멍청이"];
const URL_PATTERN = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|kr|org))/i;
const PHONE_PATTERN = /(?:01[016789]|0\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{4}/;
const ADDRESS_PATTERN = /(?:로|길|동|읍|면)\s*\d{1,4}(?:-\d{1,4})?/;
const CLASS_PATTERN = /\d{1,2}\s*학년\s*\d{1,2}\s*반/;

export function moderateLetter(content: string) {
  const reasons: string[] = [];
  const normalized = content.toLowerCase().replace(/\s/g, "");
  if (BLOCKED_WORDS.some((word) => normalized.includes(word)))
    reasons.push("부적절한 표현");
  if (URL_PATTERN.test(content)) reasons.push("외부 링크");
  if (PHONE_PATTERN.test(content)) reasons.push("전화번호로 보이는 정보");
  if (ADDRESS_PATTERN.test(content) || CLASS_PATTERN.test(content))
    reasons.push("개인정보로 보이는 정보");
  if (/(.)\1{7,}/u.test(content)) reasons.push("과도한 반복");

  const chars = content.replace(/\s/g, "");
  if (chars.length > 80 && new Set(chars).size / chars.length < 0.08)
    reasons.push("반복성 문구");
  return { approved: reasons.length === 0, reasons };
}
