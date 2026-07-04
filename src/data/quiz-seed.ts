import { OFFICIAL_SOURCES } from "@/lib/constants";
import type { QuizCategory, QuizDifficulty, QuizQuestion } from "@/lib/types";

const H = OFFICIAL_SOURCES.history;
const V = OFFICIAL_SOURCES.veterans;
const U = OFFICIAL_SOURCES.unmck;

type SeedCategory = Exclude<QuizCategory, "mixed">;
type Source = (typeof OFFICIAL_SOURCES)[keyof typeof OFFICIAL_SOURCES];

interface QuestionSpec {
  category: SeedCategory;
  question: string;
  correct: string;
  pool: string[];
  explanation: string;
  source?: Source;
}

interface BattleFact {
  name: string;
  period: string;
  place: string;
  feature: string;
  related: string;
  meaning: string;
  source?: Source;
}

interface TimelineFact {
  event: string;
  time: string;
  context: string;
  significance: string;
  clue: string;
  source?: Source;
}

interface PersonFact {
  name: string;
  role: string;
  related: string;
  action: string;
  organization: string;
  period: string;
  significance: string;
  description: string;
  source?: Source;
}

interface UnFact {
  name: string;
  support: string;
  region: string;
  contribution: string;
  service: string;
  remembrance: string;
  classification: string;
  significance: string;
  source?: Source;
}

interface MemorialFact {
  topic: string;
  answer: string;
  concept: string;
  practice: string;
  reason: string;
  caution: string;
  source?: Source;
}

const difficulty: QuizDifficulty = "normal";

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickDistractors(correct: string, pool: readonly string[], salt: string) {
  const candidates = [...new Set(pool)]
    .map((item) => item.trim())
    .filter((item) => item && item !== correct);
  if (candidates.length < 3) {
    throw new Error(`보기 후보가 부족합니다: ${salt}`);
  }
  const start = hashText(salt) % candidates.length;
  const rotated = [...candidates.slice(start), ...candidates.slice(0, start)];
  return rotated.slice(0, 3);
}

function buildOptions(correct: string, pool: readonly string[], salt: string) {
  const options = [correct, ...pickDistractors(correct, pool, salt)];
  const offset = hashText(`${salt}:${correct}`) % options.length;
  const rotated = [...options.slice(offset), ...options.slice(0, offset)];
  return {
    options: rotated,
    correctAnswerIndex: rotated.indexOf(correct),
  };
}

function spec(
  category: SeedCategory,
  question: string,
  correct: string,
  pool: string[],
  explanation: string,
  source = H,
): QuestionSpec {
  return { category, question, correct, pool, explanation, source };
}

function toQuestion(item: QuestionSpec, number: number): QuizQuestion {
  const { options, correctAnswerIndex } = buildOptions(
    item.correct,
    item.pool,
    item.question,
  );
  return {
    id: `${item.category}-${difficulty}-${number}`,
    category: item.category,
    difficulty,
    question: item.question,
    options,
    correctAnswerIndex,
    explanation: item.explanation,
    sourceTitle: item.source?.title ?? H.title,
    sourceUrl: item.source?.url ?? H.url,
  };
}

const battleFacts: BattleFact[] = [
  {
    name: "오산 전투",
    period: "1950년 7월",
    place: "경기 오산·죽미령 일대",
    feature: "미 지상군이 처음 북한군과 교전한 전투",
    related: "스미스 특수임무부대",
    meaning: "유엔군 지상 전력이 전선에 투입되기 시작했음을 보여주는 초기 지연전",
  },
  {
    name: "대전 전투",
    period: "1950년 7월",
    place: "대전 일대",
    feature: "미 제24사단이 전개한 대표적인 초기 지연전",
    related: "윌리엄 딘 소장",
    meaning: "낙동강 방어선 구축을 위한 시간을 벌어 준 전투",
  },
  {
    name: "낙동강 방어선 전투",
    period: "1950년 8~9월",
    place: "낙동강 일대와 부산 교두보",
    feature: "국군과 유엔군이 최후 방어선을 유지한 전투",
    related: "부산 교두보",
    meaning: "전쟁 초기 후퇴 국면을 버티고 반격 기반을 마련한 방어전",
  },
  {
    name: "다부동 전투",
    period: "1950년 8월",
    place: "경북 칠곡 다부동 일대",
    feature: "낙동강 방어선의 핵심 축선에서 벌어진 전투",
    related: "국군 제1사단",
    meaning: "대구 방면 방어에 큰 의미가 있었던 낙동강 방어선 전투",
  },
  {
    name: "포항 전투",
    period: "1950년 8월",
    place: "경북 포항 일대",
    feature: "동해안 축선에서 낙동강 방어선과 맞물려 벌어진 전투",
    related: "동부전선",
    meaning: "북한군의 동해안 남하를 저지하는 데 중요한 전투",
  },
  {
    name: "영천 전투",
    period: "1950년 9월",
    place: "경북 영천 일대",
    feature: "낙동강 방어선 동부 전선에서 벌어진 반격 성격의 전투",
    related: "국군 제2군단",
    meaning: "북한군의 돌파 시도를 막고 전선 안정에 기여한 전투",
  },
  {
    name: "인천상륙작전",
    period: "1950년 9월",
    place: "인천 월미도와 인천항 일대",
    feature: "조수간만의 차가 큰 지역에서 실시된 대규모 상륙작전",
    related: "유엔군 상륙부대",
    meaning: "전쟁의 흐름을 반격 국면으로 바꾼 작전",
  },
  {
    name: "서울 수복 작전",
    period: "1950년 9월 말",
    place: "서울 일대",
    feature: "인천상륙작전 이후 수도를 되찾기 위해 전개된 작전",
    related: "국군과 유엔군",
    meaning: "수도 서울을 되찾으며 반격의 상징이 된 작전",
  },
  {
    name: "38도선 돌파",
    period: "1950년 10월",
    place: "38도선 일대",
    feature: "서울 수복 이후 북진 국면에서 이루어진 진격",
    related: "국군 북진",
    meaning: "전쟁 양상이 한반도 북부로 확대되는 계기가 된 움직임",
  },
  {
    name: "평양 진격",
    period: "1950년 10월",
    place: "평양 일대",
    feature: "국군과 유엔군이 북진 과정에서 평양을 점령한 작전",
    related: "북진 작전",
    meaning: "전쟁 초기 반격이 북부 지역까지 이어졌음을 보여주는 사건",
  },
  {
    name: "운산 전투",
    period: "1950년 10~11월",
    place: "평안북도 운산 일대",
    feature: "중국군의 참전이 본격적으로 드러난 전투",
    related: "중국군 1차 공세",
    meaning: "전쟁 양상이 국제전으로 더 복잡해졌음을 보여준 전투",
  },
  {
    name: "청천강 전투",
    period: "1950년 11월",
    place: "청천강 일대",
    feature: "중국군 공세로 유엔군이 후퇴하게 된 전투",
    related: "중국군 2차 공세",
    meaning: "북진 국면이 후퇴 국면으로 바뀌는 데 영향을 준 전투",
  },
  {
    name: "장진호 전투",
    period: "1950년 11~12월",
    place: "함경남도 장진호 일대",
    feature: "혹한 속에서 미 해병대와 유엔군이 후퇴하며 싸운 전투",
    related: "미 제1해병사단",
    meaning: "흥남 철수와 연결되는 동부전선의 대표적 전투",
  },
  {
    name: "흥남 철수 작전",
    period: "1950년 12월",
    place: "함경남도 흥남항",
    feature: "병력과 많은 피란민을 해상으로 철수시킨 작전",
    related: "흥남부두",
    meaning: "군사 철수와 민간인 구출이 함께 기억되는 작전",
  },
  {
    name: "1·4 후퇴",
    period: "1951년 1월",
    place: "서울과 한강 이남 지역",
    feature: "중국군 공세로 국군과 유엔군이 서울에서 물러난 사건",
    related: "서울 재점령",
    meaning: "전선이 다시 남쪽으로 밀리며 전쟁 장기화를 보여준 사건",
  },
  {
    name: "원주 전투",
    period: "1951년 1~2월",
    place: "강원도 원주 일대",
    feature: "중부전선에서 국군과 유엔군이 방어와 반격을 전개한 전투",
    related: "중부전선 방어",
    meaning: "중공군 공세 이후 전선을 수습하는 과정의 전투",
  },
  {
    name: "횡성 전투",
    period: "1951년 2월",
    place: "강원도 횡성 일대",
    feature: "중국군과 북한군의 공세 속에 벌어진 중부전선 전투",
    related: "중공군 4차 공세",
    meaning: "1951년 초 전선의 불안정성을 보여주는 전투",
  },
  {
    name: "지평리 전투",
    period: "1951년 2월",
    place: "경기 양평 지평리 일대",
    feature: "유엔군이 포위 속에서도 진지를 지켜낸 전투",
    related: "미군과 프랑스 대대",
    meaning: "중공군 공세를 저지하고 반격 전환에 영향을 준 전투",
  },
  {
    name: "서울 재수복",
    period: "1951년 3월",
    place: "서울 일대",
    feature: "1·4 후퇴 이후 국군과 유엔군이 다시 서울을 되찾은 작전",
    related: "유엔군 반격",
    meaning: "전선이 38선 부근으로 다시 이동하는 흐름을 보여준 사건",
  },
  {
    name: "임진강 전투",
    period: "1951년 4월",
    place: "임진강 일대",
    feature: "영국군 글로스터 대대의 분전으로 알려진 전투",
    related: "글로스터 대대",
    meaning: "유엔군 부대의 희생과 지연전이 함께 기억되는 전투",
  },
  {
    name: "가평 전투",
    period: "1951년 4월",
    place: "경기 가평 일대",
    feature: "영연방 부대가 중국군 공세를 막아낸 전투",
    related: "호주·캐나다·뉴질랜드 부대",
    meaning: "서울 방어와 전선 안정에 기여한 유엔군 전투",
  },
  {
    name: "파로호 전투",
    period: "1951년 5월",
    place: "강원도 화천 일대",
    feature: "화천저수지 주변에서 벌어진 반격 작전",
    related: "화천지구 전투",
    meaning: "중부전선에서 공세를 저지하고 전선을 회복하는 데 기여한 전투",
  },
  {
    name: "현리 전투",
    period: "1951년 5월",
    place: "강원도 인제 현리 일대",
    feature: "중공군 공세 속에 국군 부대가 큰 어려움을 겪은 전투",
    related: "동부전선",
    meaning: "지휘와 방어 체계의 중요성을 보여주는 전투",
  },
  {
    name: "도솔산 전투",
    period: "1951년 6월",
    place: "강원도 양구 도솔산 일대",
    feature: "국군 해병대가 고지를 확보한 전투",
    related: "국군 해병대",
    meaning: "동부전선 고지 확보의 중요성을 보여준 전투",
  },
  {
    name: "펀치볼 전투",
    period: "1951년 여름 이후",
    place: "강원도 양구 해안분지 일대",
    feature: "해안분지 주변 고지를 둘러싸고 벌어진 전투",
    related: "해안분지",
    meaning: "고지전과 제한전 양상이 강화된 흐름을 보여주는 전투",
  },
  {
    name: "피의 능선 전투",
    period: "1951년 8~9월",
    place: "강원도 양구 일대",
    feature: "능선 고지를 둘러싸고 치열하게 벌어진 고지전",
    related: "양구 고지전",
    meaning: "전선 교착기 고지 확보 경쟁을 보여주는 전투",
  },
  {
    name: "단장의 능선 전투",
    period: "1951년 9~10월",
    place: "강원도 양구 일대",
    feature: "피의 능선 이후 이어진 대표적 고지전",
    related: "미 제2사단",
    meaning: "전선 교착기 고지전의 치열함을 보여주는 전투",
  },
  {
    name: "저격능선 전투",
    period: "1952년 10월",
    place: "강원도 철원 일대",
    feature: "중부전선 고지를 놓고 벌어진 전투",
    related: "철원 고지전",
    meaning: "정전회담 중에도 고지전이 계속되었음을 보여주는 전투",
  },
  {
    name: "백마고지 전투",
    period: "1952년 10월",
    place: "강원도 철원 백마고지 일대",
    feature: "철원평야를 내려다보는 고지를 둘러싼 전투",
    related: "국군 제9사단",
    meaning: "전선 교착기 국군의 대표적인 고지전으로 기억되는 전투",
  },
  {
    name: "삼각고지 전투",
    period: "1952년 10월",
    place: "강원도 철원 북방 일대",
    feature: "정전회담 중 고지 확보를 위해 벌어진 전투",
    related: "철의 삼각지대",
    meaning: "군사분계선 형성과 연결되는 고지전의 성격을 보여주는 전투",
  },
  {
    name: "폭찹힐 전투",
    period: "1953년",
    place: "서부전선 고지 일대",
    feature: "정전 직전까지 이어진 고지전 가운데 하나",
    related: "미군 고지 방어",
    meaning: "정전 직전에도 전투가 계속되었음을 보여주는 사례",
  },
  {
    name: "올드 발디 전투",
    period: "1952~1953년",
    place: "서부전선 고지 일대",
    feature: "여러 차례 주인이 바뀐 고지를 둘러싼 전투",
    related: "서부전선 고지전",
    meaning: "정전회담기 고지전의 소모적 성격을 보여주는 전투",
  },
  {
    name: "후크고지 전투",
    period: "1952~1953년",
    place: "임진강 인근 서부전선",
    feature: "영연방 부대가 방어에 참여한 고지전",
    related: "영연방 방어전",
    meaning: "유엔군 여러 나라 부대가 전선 방어에 참여했음을 보여주는 전투",
  },
  {
    name: "노리고지 전투",
    period: "1952년",
    place: "강원도 철원 일대",
    feature: "철원 지역의 고지를 놓고 벌어진 전투",
    related: "국군 고지전",
    meaning: "전선 교착기 국군의 고지 확보 노력을 보여주는 전투",
  },
  {
    name: "베티고지 전투",
    period: "1952년",
    place: "중부전선 고지 일대",
    feature: "콜롬비아 대대의 참전으로도 기억되는 전투",
    related: "콜롬비아 대대",
    meaning: "중남미 유엔참전국의 전투 참여를 보여주는 사례",
    source: V,
  },
  {
    name: "금성 전투",
    period: "1953년 7월",
    place: "강원도 금성 일대",
    feature: "정전협정 직전 중부전선에서 벌어진 대규모 전투",
    related: "정전 직전 공세",
    meaning: "정전 직전까지 전투가 계속되었음을 보여주는 전투",
  },
  {
    name: "한강 방어전",
    period: "1950년 6월 말",
    place: "한강 이남 방어선",
    feature: "서울 함락 직후 국군이 시간을 벌기 위해 전개한 방어전",
    related: "초기 지연전",
    meaning: "전쟁 초기 후퇴 속에서도 방어 시간을 확보하려 한 전투",
  },
  {
    name: "춘천·홍천 전투",
    period: "1950년 6월 말",
    place: "강원도 춘천과 홍천 일대",
    feature: "전쟁 초기 북한군의 남하를 지연시킨 전투",
    related: "국군 제6사단",
    meaning: "초기 전선에서 북한군 진격을 늦춘 사례로 기억되는 전투",
  },
  {
    name: "마산 방어전",
    period: "1950년 8월",
    place: "경남 마산 서부전선",
    feature: "낙동강 방어선 남서부에서 벌어진 방어전",
    related: "부산 교두보 남서부",
    meaning: "부산 교두보를 지키기 위한 낙동강 방어선 전투",
  },
  {
    name: "왜관 전투",
    period: "1950년 8월",
    place: "경북 왜관 일대",
    feature: "낙동강 도하를 막기 위해 벌어진 전투",
    related: "낙동강 도하 저지",
    meaning: "대구 방면 방어와 낙동강 방어선 유지에 관련된 전투",
  },
];

const timelineFacts: TimelineFact[] = [
  {
    event: "카이로 선언",
    time: "1943년 12월",
    context: "연합국이 한국의 독립 문제를 국제적으로 언급한 선언",
    significance: "광복 이전 한국 독립 논의의 국제적 배경이 된 사건",
    clue: "제2차 세계대전 중 한국 독립 문제가 언급된 국제 선언",
  },
  {
    event: "광복",
    time: "1945년 8월 15일",
    context: "일제 식민 지배가 끝나고 해방을 맞은 사건",
    significance: "대한민국 현대사의 출발점으로 기억되는 날",
    clue: "대한민국에서 광복절로 기념하는 날",
  },
  {
    event: "미소 분할 점령 시작",
    time: "1945년 8월 이후",
    context: "한반도가 38도선을 기준으로 남북으로 나뉘어 점령된 상황",
    significance: "분단 구조가 형성되는 배경이 된 사건",
    clue: "38도선이 한반도 분단의 기준으로 작용하기 시작한 시기",
  },
  {
    event: "모스크바 3상회의 결정",
    time: "1945년 12월",
    context: "한반도 임시정부 수립과 신탁통치 문제가 논의된 회의",
    significance: "해방 직후 국내 정치 갈등에 큰 영향을 준 사건",
    clue: "신탁통치 논쟁과 관련 깊은 국제 회의",
  },
  {
    event: "제1차 미소공동위원회",
    time: "1946년",
    context: "한반도 임시정부 수립 문제를 논의하기 위해 열린 위원회",
    significance: "미소 협의가 쉽게 진전되지 않았음을 보여준 사건",
    clue: "해방 후 임시정부 수립 논의를 위해 열린 미소 협의",
  },
  {
    event: "유엔 한국임시위원단 설치",
    time: "1947년",
    context: "한국 문제를 유엔에서 다루며 선거 감시 기구가 설치된 사건",
    significance: "한반도 문제의 국제적 논의가 유엔으로 옮겨간 흐름",
    clue: "유엔이 한반도 선거 문제에 관여하기 시작한 사건",
  },
  {
    event: "5·10 총선거",
    time: "1948년 5월 10일",
    context: "대한민국 정부 수립을 위한 제헌국회 선거",
    significance: "대한민국 정부 수립의 제도적 기반이 된 선거",
    clue: "제헌국회를 구성한 선거",
  },
  {
    event: "대한민국 정부 수립",
    time: "1948년 8월 15일",
    context: "대한민국 정부가 공식 수립된 사건",
    significance: "대한민국 국가 체제가 출범한 날",
    clue: "정부 수립 기념과 관련된 1948년의 사건",
  },
  {
    event: "조선민주주의인민공화국 수립",
    time: "1948년 9월",
    context: "북한 지역에서 별도 정권이 수립된 사건",
    significance: "남북에 별도 정부가 들어선 분단 상황을 보여준 사건",
    clue: "1948년 북한 지역에서 일어난 정권 수립 사건",
  },
  {
    event: "주한미군 철수 완료",
    time: "1949년 6월",
    context: "전쟁 전 미 지상군 대부분이 한반도에서 철수한 사건",
    significance: "전쟁 전 한반도 안보 환경과 관련된 변화",
    clue: "전쟁 직전 한반도 군사 환경을 바꾼 미군 관련 사건",
  },
  {
    event: "6.25 전쟁 발발",
    time: "1950년 6월 25일",
    context: "북한군의 남침으로 전쟁이 시작된 사건",
    significance: "6.25 전쟁의 시작을 기억하는 핵심 날짜",
    clue: "Remember625의 숫자와 직접 연결되는 날짜",
  },
  {
    event: "유엔 안전보장이사회 대응",
    time: "1950년 6월 말",
    context: "유엔이 북한군의 공격에 대응하는 결의를 채택한 시기",
    significance: "전쟁이 국제적 대응의 대상이 되었음을 보여준 사건",
    clue: "전쟁 발발 직후 유엔이 대응에 나선 시기",
  },
  {
    event: "서울 함락",
    time: "1950년 6월 28일",
    context: "전쟁 발발 사흘 만에 서울이 북한군에게 점령된 사건",
    significance: "전쟁 초기의 급박한 상황을 보여주는 사건",
    clue: "전쟁 초기에 수도 서울이 점령된 사건",
  },
  {
    event: "오산 전투",
    time: "1950년 7월 5일",
    context: "미 지상군이 처음으로 북한군과 교전한 전투",
    significance: "유엔군 지상 전력이 본격 투입되기 시작했음을 보여준 사건",
    clue: "스미스 특수임무부대와 관련 깊은 초기 전투",
  },
  {
    event: "유엔군사령부 창설",
    time: "1950년 7월",
    context: "유엔군 작전을 지휘하기 위한 군사 지휘 체계가 만들어진 사건",
    significance: "유엔의 집단안보 대응이 군사 지휘 체계로 구체화된 사건",
    clue: "유엔군 작전 지휘 체계가 만들어진 사건",
  },
  {
    event: "대전 전투",
    time: "1950년 7월",
    context: "미 제24사단이 대전 일대에서 전개한 지연전",
    significance: "낙동강 방어선 구축을 위한 시간을 벌어 준 전투",
    clue: "윌리엄 딘 소장과 관련 깊은 초기 전투",
  },
  {
    event: "낙동강 방어선 형성",
    time: "1950년 8월",
    context: "국군과 유엔군이 부산 교두보를 중심으로 방어선을 구축한 사건",
    significance: "전쟁 초기 최후 방어선으로 기능한 사건",
    clue: "부산 교두보와 관련 깊은 방어선 형성",
  },
  {
    event: "인천상륙작전",
    time: "1950년 9월 15일",
    context: "유엔군이 인천에 상륙해 반격을 시작한 작전",
    significance: "전쟁 흐름을 크게 바꾼 작전",
    clue: "전세를 반전시킨 대표적 상륙작전",
  },
  {
    event: "서울 수복",
    time: "1950년 9월 말",
    context: "인천상륙작전 이후 국군과 유엔군이 서울을 되찾은 사건",
    significance: "수도 회복의 상징적 의미가 큰 사건",
    clue: "인천상륙작전 뒤 수도를 되찾은 사건",
  },
  {
    event: "국군의 38도선 돌파",
    time: "1950년 10월 1일",
    context: "서울 수복 이후 국군이 38도선을 넘어 북진한 사건",
    significance: "전쟁 양상이 북진 국면으로 전환되었음을 보여준 사건",
    clue: "국군의 날과도 연결되어 기억되는 북진 사건",
  },
  {
    event: "평양 점령",
    time: "1950년 10월",
    context: "국군과 유엔군이 북진 과정에서 평양에 진입한 사건",
    significance: "북진이 빠르게 전개되었음을 보여준 사건",
    clue: "1950년 10월 북진 작전의 주요 장면",
  },
  {
    event: "중국군 참전",
    time: "1950년 10월경",
    context: "중국군이 전쟁에 본격 개입하기 시작한 사건",
    significance: "전쟁이 장기화되고 전선이 다시 흔들리는 계기가 된 사건",
    clue: "유엔군 북진 이후 전쟁 양상을 바꾼 외부 개입",
  },
  {
    event: "중국군 2차 공세",
    time: "1950년 11월 말",
    context: "중국군의 대규모 공세로 유엔군이 후퇴한 시기",
    significance: "북진 국면이 후퇴 국면으로 바뀌는 데 영향을 준 사건",
    clue: "청천강 전투와 장진호 전투의 배경이 된 공세",
  },
  {
    event: "흥남 철수",
    time: "1950년 12월",
    context: "동부전선 병력과 피란민이 흥남항을 통해 철수한 작전",
    significance: "군사 작전과 민간인 구출이 함께 기억되는 사건",
    clue: "크리스마스 전후 흥남항에서 진행된 대규모 철수",
  },
  {
    event: "1·4 후퇴",
    time: "1951년 1월 4일",
    context: "중국군 공세로 국군과 유엔군이 서울에서 물러난 사건",
    significance: "전선이 다시 남쪽으로 이동했음을 보여주는 사건",
    clue: "날짜가 이름에 들어간 1951년의 후퇴 사건",
  },
  {
    event: "지평리 전투",
    time: "1951년 2월",
    context: "유엔군이 중공군 공세를 막아낸 전투",
    significance: "반격 전환의 계기로 평가되는 전투",
    clue: "경기 양평에서 포위 방어로 기억되는 전투",
  },
  {
    event: "서울 재수복",
    time: "1951년 3월",
    context: "국군과 유엔군이 1·4 후퇴 이후 다시 서울을 되찾은 사건",
    significance: "전선이 38선 부근으로 다시 이동하는 흐름을 보여준 사건",
    clue: "1951년 봄 서울을 다시 회복한 사건",
  },
  {
    event: "중공군 춘계 공세",
    time: "1951년 4월",
    context: "중국군과 북한군이 봄에 전개한 대규모 공세",
    significance: "임진강 전투와 가평 전투의 배경이 된 공세",
    clue: "1951년 봄 유엔군 전선에 큰 압박을 준 공세",
  },
  {
    event: "소련 대표의 정전 논의 제안",
    time: "1951년 6월",
    context: "야코프 말리크가 정전 논의 필요성을 공개적으로 언급한 사건",
    significance: "정전회담으로 이어지는 외교적 흐름을 보여준 사건",
    clue: "정전회담 개시 직전 국제무대에서 나온 제안",
  },
  {
    event: "정전회담 시작",
    time: "1951년 7월 10일",
    context: "개성에서 정전 문제를 논의하는 회담이 시작된 사건",
    significance: "전쟁을 멈추기 위한 협상이 본격화된 사건",
    clue: "전투가 계속되는 가운데 시작된 정전 협상",
  },
  {
    event: "고지전 확대",
    time: "1951년 하반기",
    context: "전선이 교착되며 제한된 고지를 둘러싼 전투가 늘어난 시기",
    significance: "전쟁 후반부의 전투 양상을 보여주는 흐름",
    clue: "피의 능선과 단장의 능선 전투가 나타난 시기",
  },
  {
    event: "정전회담 장소 이전",
    time: "1951년 10월",
    context: "정전회담 장소가 개성에서 판문점으로 옮겨진 사건",
    significance: "판문점이 정전 논의의 상징적 장소가 되는 계기",
    clue: "판문점이 정전 협상의 중심이 된 변화",
  },
  {
    event: "전쟁포로 송환 문제 대립",
    time: "1952년",
    context: "정전회담에서 포로 송환 방식이 큰 쟁점이 된 시기",
    significance: "정전협상이 길어진 중요한 이유 가운데 하나",
    clue: "정전회담 장기화와 관련 깊은 포로 문제",
  },
  {
    event: "백마고지 전투",
    time: "1952년 10월",
    context: "철원 일대 고지를 놓고 벌어진 전투",
    significance: "정전회담 중에도 고지전이 계속되었음을 보여주는 전투",
    clue: "국군 제9사단과 관련 깊은 철원 고지전",
  },
  {
    event: "스탈린 사망",
    time: "1953년 3월",
    context: "소련 지도자 스탈린이 사망한 사건",
    significance: "정전 논의의 국제정치적 분위기 변화와 함께 언급되는 사건",
    clue: "정전협상 막바지 국제 정세 변화와 관련된 사건",
  },
  {
    event: "반공포로 석방",
    time: "1953년 6월",
    context: "이승만 정부가 반공포로를 석방한 사건",
    significance: "정전 직전 협상 국면에 영향을 준 사건",
    clue: "정전협정 직전 포로 문제와 관련된 사건",
  },
  {
    event: "정전협정 체결",
    time: "1953년 7월 27일",
    context: "판문점에서 전투 행위를 멈추는 협정이 체결된 사건",
    significance: "전투는 멈췄지만 평화조약이 아닌 정전 상태가 시작된 사건",
    clue: "유엔군 참전의 날과도 연결되는 날짜",
  },
  {
    event: "군사분계선 설정",
    time: "1953년 7월",
    context: "정전협정에 따라 군사분계선과 비무장지대가 설정된 사건",
    significance: "오늘날 한반도 분단 현실과 직접 연결되는 조치",
    clue: "정전협정과 함께 정해진 한반도 군사 경계",
  },
  {
    event: "중립국감독위원회 설치",
    time: "1953년 7월",
    context: "정전협정 이행을 감독하기 위한 중립국 기구가 설치된 사건",
    significance: "정전 체제를 관리하기 위한 국제적 감시 장치가 마련된 사건",
    clue: "정전협정 이행을 감시하기 위해 마련된 중립국 기구",
  },
  {
    event: "한미상호방위조약 서명",
    time: "1953년 10월",
    context: "대한민국과 미국이 상호방위를 약속한 조약에 서명한 사건",
    significance: "전후 한국 안보 체제 형성과 관련 깊은 사건",
    clue: "정전 이후 한국 안보 체제와 관련된 조약",
  },
];

const personFacts: PersonFact[] = [
  {
    name: "더글러스 맥아더",
    role: "유엔군 총사령관",
    related: "인천상륙작전",
    action: "인천상륙작전을 지휘하며 반격 작전을 이끌었습니다",
    organization: "유엔군사령부",
    period: "전쟁 초기",
    significance: "유엔군의 초기 지휘와 반격 작전의 상징적 인물",
    description: "인천상륙작전과 가장 밀접하게 연결되는 유엔군 지휘관",
  },
  {
    name: "매슈 리지웨이",
    role: "미 제8군 사령관 및 유엔군 지휘관",
    related: "1951년 유엔군 반격",
    action: "미 제8군을 재정비하고 전선을 안정시키는 데 기여했습니다",
    organization: "미 제8군",
    period: "1950년 말 이후",
    significance: "후퇴 국면의 유엔군을 재정비한 인물",
    description: "워커 장군 후임으로 미 제8군을 이끈 지휘관",
  },
  {
    name: "마크 클라크",
    role: "유엔군 총사령관",
    related: "정전협정",
    action: "유엔군 총사령관 자격으로 정전협정에 서명했습니다",
    organization: "유엔군사령부",
    period: "1953년",
    significance: "정전협정 체결 장면과 연결되는 유엔군 지휘관",
    description: "1953년 정전협정에 유엔군 측 대표로 서명한 인물",
  },
  {
    name: "월턴 워커",
    role: "미 제8군 사령관",
    related: "낙동강 방어선",
    action: "전쟁 초기 미 제8군을 지휘하며 부산 교두보 방어를 이끌었습니다",
    organization: "미 제8군",
    period: "1950년",
    significance: "낙동강 방어선 유지와 관련 깊은 지휘관",
    description: "전쟁 초기 부산 교두보 방어와 관련 깊은 미군 지휘관",
  },
  {
    name: "제임스 밴 플리트",
    role: "미 제8군 사령관",
    related: "전선 교착기 작전",
    action: "1951년 이후 미 제8군을 지휘했습니다",
    organization: "미 제8군",
    period: "1951년 이후",
    significance: "고지전과 정전회담기 전선 운영과 관련된 지휘관",
    description: "리지웨이 이후 미 제8군 지휘를 맡은 인물",
  },
  {
    name: "윌리엄 딘",
    role: "미 제24사단장",
    related: "대전 전투",
    action: "대전 전투에서 부대를 지휘했고 이후 포로가 되었습니다",
    organization: "미 제24사단",
    period: "1950년 7월",
    significance: "초기 지연전의 어려움을 보여주는 인물",
    description: "대전 전투와 밀접하게 관련된 미군 지휘관",
  },
  {
    name: "해리 트루먼",
    role: "미국 대통령",
    related: "유엔군 파병 결정",
    action: "전쟁 발발 직후 미국과 유엔의 대응을 이끌었습니다",
    organization: "미국 정부",
    period: "1950년",
    significance: "6.25 전쟁의 국제적 대응과 관련 깊은 정치 지도자",
    description: "전쟁 발발 당시 미국 대통령",
  },
  {
    name: "드와이트 아이젠하워",
    role: "미국 대통령",
    related: "정전협정 체결기",
    action: "미국 대통령으로서 정전 협상 막바지 국면을 맞았습니다",
    organization: "미국 정부",
    period: "1953년",
    significance: "정전협정 체결 당시 미국 행정부를 대표하는 인물",
    description: "정전협정 체결 무렵 미국 대통령",
  },
  {
    name: "트뤼그베 리",
    role: "유엔 사무총장",
    related: "유엔의 초기 대응",
    action: "전쟁 발발 당시 유엔 사무총장으로 활동했습니다",
    organization: "유엔",
    period: "1950년",
    significance: "유엔 차원의 대응과 연결되는 국제기구 인물",
    description: "6.25 전쟁 발발 당시 유엔 사무총장",
  },
  {
    name: "야코프 말리크",
    role: "소련의 유엔 대표",
    related: "정전 논의 제안",
    action: "1951년 정전 논의 필요성을 공개적으로 언급했습니다",
    organization: "유엔 안전보장이사회",
    period: "1951년",
    significance: "정전회담으로 이어지는 외교적 흐름과 관련된 인물",
    description: "정전 논의 제안과 연결되는 소련 외교관",
  },
  {
    name: "이승만",
    role: "대한민국 대통령",
    related: "전쟁기 대한민국 정부",
    action: "전쟁기 대한민국 정부를 이끌었습니다",
    organization: "대한민국 정부",
    period: "1950~1953년",
    significance: "전쟁기 한국 정치와 외교를 이해할 때 중요한 인물",
    description: "6.25 전쟁 당시 대한민국 대통령",
  },
  {
    name: "김일성",
    role: "북한 지도자",
    related: "6.25 전쟁 발발",
    action: "북한 정권의 지도자로 전쟁 발발과 관련된 핵심 인물입니다",
    organization: "북한 정권",
    period: "1950년",
    significance: "전쟁 발발 원인을 이해할 때 등장하는 북한 지도자",
    description: "전쟁 발발 당시 북한 지도자",
  },
  {
    name: "이오시프 스탈린",
    role: "소련 지도자",
    related: "전쟁 전 국제정세",
    action: "전쟁 전후 한반도 문제의 국제정치적 배경과 관련됩니다",
    organization: "소련",
    period: "1950년 전후",
    significance: "냉전 구조 속 한반도 문제를 이해할 때 중요한 인물",
    description: "전쟁 전후 소련의 최고 지도자",
  },
  {
    name: "마오쩌둥",
    role: "중국 지도자",
    related: "중국군 참전",
    action: "중국의 참전 결정과 관련된 최고 지도자였습니다",
    organization: "중국",
    period: "1950년",
    significance: "중국군 참전의 정치적 배경과 연결되는 인물",
    description: "중국군 참전 당시 중국의 최고 지도자",
  },
  {
    name: "펑더화이",
    role: "중국군 지휘관",
    related: "중국군 공세",
    action: "중국 인민지원군을 지휘했습니다",
    organization: "중국 인민지원군",
    period: "1950년 이후",
    significance: "중국군 참전 이후 전선 변화를 이해할 때 중요한 지휘관",
    description: "중국 인민지원군 지휘관으로 알려진 인물",
  },
  {
    name: "백선엽",
    role: "국군 지휘관",
    related: "다부동 전투",
    action: "전쟁 초기 국군 제1사단 지휘와 관련 깊습니다",
    organization: "국군 제1사단",
    period: "1950년",
    significance: "낙동강 방어선과 국군 지휘를 이해할 때 자주 언급되는 인물",
    description: "다부동 전투와 관련 깊은 국군 지휘관",
  },
  {
    name: "정일권",
    role: "국군 지휘관",
    related: "전쟁 초기 국군 지휘",
    action: "전쟁기 국군 고위 지휘관으로 활동했습니다",
    organization: "대한민국 국군",
    period: "1950년대",
    significance: "전쟁기 국군 지휘 체계와 관련된 인물",
    description: "6.25 전쟁기 국군 고위 지휘관",
  },
  {
    name: "손원일",
    role: "대한민국 해군 창설 주역",
    related: "대한민국 해군",
    action: "대한민국 해군 창설과 발전에 중요한 역할을 했습니다",
    organization: "대한민국 해군",
    period: "전쟁 전후",
    significance: "해군 전력과 국가 방위 기반을 이해할 때 중요한 인물",
    description: "초대 해군참모총장으로 알려진 인물",
  },
  {
    name: "김홍일",
    role: "국군 지휘관",
    related: "한강 방어전",
    action: "전쟁 초기 방어 작전과 관련된 지휘관으로 알려져 있습니다",
    organization: "대한민국 국군",
    period: "1950년",
    significance: "전쟁 초기 지연전과 방어 작전을 이해할 때 언급되는 인물",
    description: "한강 방어전과 관련해 언급되는 국군 지휘관",
  },
  {
    name: "에드워드 알몬드",
    role: "미 제10군단장",
    related: "인천상륙작전과 장진호 전투",
    action: "미 제10군단을 지휘했습니다",
    organization: "미 제10군단",
    period: "1950년",
    significance: "동부전선과 상륙작전 지휘를 이해할 때 등장하는 인물",
    description: "미 제10군단 지휘관",
  },
  {
    name: "올리버 스미스",
    role: "미 제1해병사단장",
    related: "장진호 전투",
    action: "장진호 전투에서 미 해병대를 지휘했습니다",
    organization: "미 제1해병사단",
    period: "1950년 겨울",
    significance: "장진호 전투와 흥남 철수의 군사적 맥락을 이해할 때 중요한 인물",
    description: "장진호 전투와 관련 깊은 미 해병대 지휘관",
  },
  {
    name: "랄프 몽클라르",
    role: "프랑스 대대 지휘관",
    related: "프랑스 대대 참전",
    action: "프랑스 유엔군 부대의 참전과 관련된 지휘관입니다",
    organization: "프랑스 대대",
    period: "1950년대",
    significance: "프랑스의 유엔군 참전을 이해할 때 등장하는 인물",
    description: "프랑스 대대와 관련 깊은 지휘관",
    source: V,
  },
  {
    name: "타흐신 야즈즈",
    role: "터키 여단 지휘관",
    related: "터키 여단 참전",
    action: "터키 여단을 지휘한 인물로 알려져 있습니다",
    organization: "터키 여단",
    period: "1950년대",
    significance: "터키의 전투지원과 유엔군 참전을 이해할 때 등장하는 인물",
    description: "터키 여단과 관련 깊은 지휘관",
    source: V,
  },
  {
    name: "찰스 그린",
    role: "호주군 지휘관",
    related: "호주군 참전",
    action: "호주군 부대 지휘와 관련된 인물로 알려져 있습니다",
    organization: "호주군",
    period: "1950년",
    significance: "호주의 유엔군 참전을 이해할 때 등장하는 인물",
    description: "호주군 참전 초기와 관련된 지휘관",
    source: V,
  },
  {
    name: "딘 헤스",
    role: "미 공군 장교",
    related: "전쟁고아 구호",
    action: "전쟁 중 고아 구호 활동과 관련해 기억되는 인물입니다",
    organization: "미 공군",
    period: "전쟁 중",
    significance: "전쟁 속 인도주의 활동을 함께 기억하게 하는 인물",
    description: "전쟁고아 구호 활동과 관련해 알려진 미 공군 인물",
    source: V,
  },
  {
    name: "에밀 카폰",
    role: "미군 군종신부",
    related: "참전용사 희생과 돌봄",
    action: "포로와 장병을 돌본 군종신부로 기억됩니다",
    organization: "미군",
    period: "전쟁 중",
    significance: "전쟁 속 헌신과 인도주의적 돌봄을 보여주는 인물",
    description: "참전 장병을 돌본 군종신부로 기억되는 인물",
    source: V,
  },
];

const unFacts: UnFact[] = [
  {
    name: "미국",
    support: "전투지원",
    region: "북아메리카",
    contribution: "가장 큰 규모의 유엔군 전력을 보낸 나라",
    service: "육·해·공군과 해병대 등 대규모 전력",
    remembrance: "유엔군사령부와 주요 작전 지휘로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "유엔군 대응의 중심 전력을 담당한 나라",
    source: V,
  },
  {
    name: "영국",
    support: "전투지원",
    region: "유럽",
    contribution: "영연방 부대의 핵심 전력을 보낸 나라",
    service: "육군·해군 전력",
    remembrance: "임진강 전투의 글로스터 대대와 함께 기억됩니다",
    classification: "전투지원 16개국",
    significance: "영연방 참전의 중요한 축을 담당한 나라",
    source: V,
  },
  {
    name: "캐나다",
    support: "전투지원",
    region: "북아메리카",
    contribution: "가평 전투에서 활약한 부대를 보낸 나라",
    service: "육군·해군·공군 전력",
    remembrance: "가평 전투의 방어전으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "영연방 부대의 일원으로 전선 안정에 기여한 나라",
    source: V,
  },
  {
    name: "튀르키예",
    support: "전투지원",
    region: "유럽·아시아",
    contribution: "터키 여단을 파견한 나라",
    service: "여단급 지상군",
    remembrance: "군우리 전투 등에서의 참전으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "형제의 나라로도 자주 기억되는 유엔참전국",
    source: V,
  },
  {
    name: "호주",
    support: "전투지원",
    region: "오세아니아",
    contribution: "가평 전투와 공중·해상 작전에 참여한 나라",
    service: "육군·해군·공군 전력",
    remembrance: "가평 전투의 영연방 방어전으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "오세아니아 지역의 대표적 전투지원국",
    source: V,
  },
  {
    name: "필리핀",
    support: "전투지원",
    region: "아시아",
    contribution: "전투대대를 파견한 아시아 유엔참전국",
    service: "필리핀 전투대대",
    remembrance: "아시아 국가의 전투지원 사례로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "아시아에서 대한민국을 도운 전투지원국",
    source: V,
  },
  {
    name: "태국",
    support: "전투지원",
    region: "아시아",
    contribution: "육·해·공군 전력을 파견한 나라",
    service: "지상군과 해·공군 지원",
    remembrance: "아시아 유엔참전국의 꾸준한 지원으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "아시아 국가 가운데 전투 전력을 보낸 나라",
    source: V,
  },
  {
    name: "네덜란드",
    support: "전투지원",
    region: "유럽",
    contribution: "육군 대대와 해군 함정을 보낸 나라",
    service: "반 호이츠 대대와 해군 함정",
    remembrance: "유럽 국가의 전투지원으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "지상과 해상에서 유엔군 작전에 참여한 나라",
    source: V,
  },
  {
    name: "콜롬비아",
    support: "전투지원",
    region: "남아메리카",
    contribution: "중남미에서 전투부대를 보낸 나라",
    service: "육군 대대와 해군 함정",
    remembrance: "남아메리카 유엔참전국으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "중남미 지역의 대표적 전투지원국",
    source: V,
  },
  {
    name: "그리스",
    support: "전투지원",
    region: "유럽",
    contribution: "지상군과 수송기 전력을 보낸 나라",
    service: "그리스 대대와 공군 수송 전력",
    remembrance: "유럽 유엔참전국의 전투지원으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "지상과 공중 지원에 참여한 나라",
    source: V,
  },
  {
    name: "뉴질랜드",
    support: "전투지원",
    region: "오세아니아",
    contribution: "포병부대를 중심으로 파견한 나라",
    service: "포병부대와 해군 전력",
    remembrance: "가평 전투 등 영연방 부대 활동과 함께 기억됩니다",
    classification: "전투지원 16개국",
    significance: "오세아니아 지역의 전투지원국",
    source: V,
  },
  {
    name: "에티오피아",
    support: "전투지원",
    region: "아프리카",
    contribution: "아프리카에서 전투부대를 보낸 나라",
    service: "강뉴 대대",
    remembrance: "아프리카 유엔참전국으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "먼 지역에서도 대한민국을 도운 전투지원국",
    source: V,
  },
  {
    name: "벨기에",
    support: "전투지원",
    region: "유럽",
    contribution: "룩셈부르크 병력과 함께 대대를 구성해 파견한 나라",
    service: "벨기에-룩셈부르크 대대",
    remembrance: "소규모 국가의 연합 참전 사례로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "유럽의 전투지원과 연합 부대 구성을 보여주는 나라",
    source: V,
  },
  {
    name: "프랑스",
    support: "전투지원",
    region: "유럽",
    contribution: "프랑스 대대를 파견한 나라",
    service: "프랑스 대대",
    remembrance: "지평리 전투 등에서의 활약으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "유럽 국가의 전투지원과 유엔군 연합 작전을 보여주는 나라",
    source: V,
  },
  {
    name: "남아프리카공화국",
    support: "전투지원",
    region: "아프리카",
    contribution: "공군 전투비행대를 파견한 나라",
    service: "공군 제2비행대",
    remembrance: "공중작전 지원으로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "아프리카 지역의 항공 전투지원국",
    source: V,
  },
  {
    name: "룩셈부르크",
    support: "전투지원",
    region: "유럽",
    contribution: "벨기에 대대와 함께 소규모 병력을 보낸 나라",
    service: "벨기에-룩셈부르크 대대 소속 병력",
    remembrance: "작은 나라의 참전과 연대로 기억됩니다",
    classification: "전투지원 16개국",
    significance: "국가 규모와 관계없이 연대에 참여한 사례",
    source: V,
  },
  {
    name: "스웨덴",
    support: "의료지원",
    region: "유럽",
    contribution: "부산에 야전병원을 운영한 나라",
    service: "스웨덴 적십자 야전병원",
    remembrance: "부상자 치료와 의료지원으로 기억됩니다",
    classification: "의료지원 6개국",
    significance: "전쟁 속 생명을 돌본 의료지원국",
    source: V,
  },
  {
    name: "인도",
    support: "의료지원",
    region: "아시아",
    contribution: "의무부대를 파견한 나라",
    service: "제60공수야전의무대",
    remembrance: "전선과 후방의 의료 활동으로 기억됩니다",
    classification: "의료지원 6개국",
    significance: "아시아 지역의 의료지원국",
    source: V,
  },
  {
    name: "덴마크",
    support: "의료지원",
    region: "유럽",
    contribution: "병원선을 보내 의료를 지원한 나라",
    service: "유틀란디아 병원선",
    remembrance: "해상 병원선의 인도주의 지원으로 기억됩니다",
    classification: "의료지원 6개국",
    significance: "해상 의료지원의 대표 사례",
    source: V,
  },
  {
    name: "노르웨이",
    support: "의료지원",
    region: "유럽",
    contribution: "이동외과병원을 운영한 나라",
    service: "노르웨이 이동외과병원",
    remembrance: "전상자 치료 활동으로 기억됩니다",
    classification: "의료지원 6개국",
    significance: "전쟁 의료체계 지원의 대표 사례",
    source: V,
  },
  {
    name: "이탈리아",
    support: "의료지원",
    region: "유럽",
    contribution: "적십자 병원을 통해 의료를 지원한 나라",
    service: "이탈리아 적십자 병원",
    remembrance: "의료진의 헌신으로 기억됩니다",
    classification: "의료지원 6개국",
    significance: "유럽 의료지원국으로 대한민국을 도운 나라",
    source: V,
  },
  {
    name: "독일",
    support: "의료지원",
    region: "유럽",
    contribution: "의료 지원 활동으로 대한민국을 도운 나라",
    service: "독일 의료지원단",
    remembrance: "전후 복구와 의료지원의 맥락에서 기억됩니다",
    classification: "의료지원 6개국",
    significance: "전쟁의 상처를 돌보는 의료지원국",
    source: V,
  },
  {
    name: "유엔참전국 22개국",
    support: "전투지원과 의료지원",
    region: "세계 여러 지역",
    contribution: "대한민국을 돕기 위해 전투 또는 의료 지원에 참여한 나라들의 총칭",
    service: "16개 전투지원국과 6개 의료지원국",
    remembrance: "국제 연대와 희생의 상징으로 기억됩니다",
    classification: "총 22개국",
    significance: "대한민국의 자유와 평화를 위한 국제적 연대",
    source: V,
  },
  {
    name: "전투지원 16개국",
    support: "전투지원",
    region: "세계 여러 지역",
    contribution: "전투부대 또는 전투 전력을 파견한 유엔참전국 분류",
    service: "지상군·해군·공군 전력",
    remembrance: "전선에서 함께 싸운 나라들로 기억됩니다",
    classification: "16개국",
    significance: "유엔군 전투 작전의 다국적 성격을 보여주는 분류",
    source: V,
  },
  {
    name: "의료지원 6개국",
    support: "의료지원",
    region: "세계 여러 지역",
    contribution: "병원·의무대·의료진을 보내 부상자를 치료한 나라들의 분류",
    service: "야전병원·병원선·의무부대",
    remembrance: "생명을 살린 인도주의 활동으로 기억됩니다",
    classification: "6개국",
    significance: "전투뿐 아니라 치료와 돌봄도 참전의 중요한 형태였음을 보여주는 분류",
    source: V,
  },
];

const memorialFacts: MemorialFact[] = [
  {
    topic: "현충일",
    answer: "6월 6일에 순국선열과 호국영령을 추모하는 날",
    concept: "국가를 위해 희생한 분들을 기리는 국가기념일",
    practice: "조기를 게양하고 추모의 마음을 갖는 것",
    reason: "희생과 헌신이 오늘의 공동체를 지탱했음을 기억하기 위해",
    caution: "추모의 의미를 장난처럼 소비하는 태도",
  },
  {
    topic: "6.25 전쟁 발발일",
    answer: "1950년 6월 25일",
    concept: "6.25 전쟁이 시작된 날짜",
    practice: "전쟁의 시작과 참전용사의 희생을 함께 기억하는 것",
    reason: "전쟁의 비극과 자유의 소중함을 잊지 않기 위해",
    caution: "확인되지 않은 전쟁 정보를 사실처럼 퍼뜨리는 태도",
  },
  {
    topic: "유엔군 참전의 날",
    answer: "7월 27일",
    concept: "유엔참전용사의 희생과 공헌을 기리는 날",
    practice: "유엔참전국과 참전용사의 공헌을 함께 기억하는 것",
    reason: "대한민국을 도운 국제 연대를 기억하기 위해",
    caution: "참전국의 공헌을 단순한 숫자로만 소비하는 태도",
    source: V,
  },
  {
    topic: "턴 투워드 부산",
    answer: "11월 11일 11시에 부산을 향해 묵념하는 국제추모행사",
    concept: "재한유엔기념공원을 향한 국제적 추모",
    practice: "정해진 시간에 추모의 마음으로 묵념하는 것",
    reason: "유엔전몰장병이 잠든 부산을 함께 기억하기 위해",
    caution: "추모 시간을 홍보 이벤트처럼 소비하는 태도",
    source: U,
  },
  {
    topic: "재한유엔기념공원",
    answer: "부산에 있는 유엔군 전몰장병 추모 공간",
    concept: "유엔군 희생을 기리는 국제적 추모 공간",
    practice: "방문하거나 소개할 때 엄숙하고 차분한 태도를 지키는 것",
    reason: "대한민국을 위해 희생한 유엔군 전몰장병을 기억하기 위해",
    caution: "추모 공간을 가벼운 놀이 장소처럼 대하는 태도",
    source: U,
  },
  {
    topic: "정전협정",
    answer: "전투를 멈추기 위한 협정",
    concept: "평화조약이 아니라 전투 중지를 정한 합의",
    practice: "정전과 종전을 구분해 설명하는 것",
    reason: "한반도 상황을 정확히 이해하기 위해",
    caution: "정전협정을 전쟁 종료나 평화조약과 같은 뜻으로 단정하는 태도",
  },
  {
    topic: "군사분계선",
    answer: "정전협정에 따라 설정된 남북 군사 경계선",
    concept: "정전 체제의 핵심 경계",
    practice: "분단 현실과 정전 체제를 함께 이해하는 것",
    reason: "오늘날 한반도 안보 환경과 연결되기 때문",
    caution: "군사분계선을 단순한 지도상의 선으로만 가볍게 여기는 태도",
  },
  {
    topic: "비무장지대",
    answer: "군사분계선을 기준으로 설정된 완충 지대",
    concept: "정전 이후 군사적 충돌을 줄이기 위한 공간",
    practice: "역사·안보·평화의 의미를 함께 생각하는 것",
    reason: "전쟁의 상처와 평화의 과제를 동시에 보여주기 때문",
    caution: "위험성과 역사적 의미를 무시하고 소비하는 태도",
  },
  {
    topic: "유엔참전국",
    answer: "대한민국을 돕기 위해 전투 또는 의료 지원에 참여한 나라들",
    concept: "국제 연대와 집단안보의 사례",
    practice: "각 나라의 공헌을 확인된 자료로 차분히 소개하는 것",
    reason: "자유와 평화를 지키기 위한 국제적 희생을 기억하기 위해",
    caution: "참전국 수나 역할을 확인 없이 잘못 전달하는 태도",
    source: V,
  },
  {
    topic: "전투지원국",
    answer: "전투부대나 전투 전력을 파견한 유엔참전국",
    concept: "유엔군 전투 작전에 직접 참여한 나라들",
    practice: "전투지원과 의료지원을 구분해 설명하는 것",
    reason: "각 참전국의 역할을 정확히 기억하기 위해",
    caution: "모든 참전국이 같은 방식으로 참전했다고 단정하는 태도",
    source: V,
  },
  {
    topic: "의료지원국",
    answer: "병원·의무대·의료진 등으로 부상자 치료를 도운 나라들",
    concept: "전쟁 속 인도주의 지원",
    practice: "치료와 돌봄 역시 중요한 참전 형태로 기억하는 것",
    reason: "전쟁에서 생명을 살리는 지원도 큰 희생과 헌신이기 때문",
    caution: "의료지원의 의미를 전투지원보다 가볍게 보는 태도",
    source: V,
  },
  {
    topic: "참전용사 감사편지",
    answer: "감사와 존중을 담아 개인정보 없이 작성하는 편지",
    concept: "기억을 개인의 말로 이어가는 참여 방식",
    practice: "전화번호, 주소, 학교반, 실명 등 개인정보를 적지 않는 것",
    reason: "공개될 수 있는 글에서 작성자와 타인의 안전을 지키기 위해",
    caution: "실명과 연락처를 공개 편지에 적는 태도",
    source: V,
  },
  {
    topic: "역사 퀴즈 해설",
    answer: "정답만이 아니라 배경과 의미를 함께 알려주는 설명",
    concept: "참여형 역사 학습의 핵심 요소",
    practice: "틀린 문제의 해설을 읽고 다시 기억하는 것",
    reason: "퀴즈가 단순 점수 경쟁이 아니라 학습이 되기 위해",
    caution: "정답 여부만 보고 해설을 무시하는 태도",
  },
  {
    topic: "공개 참여 지표",
    answer: "총 퀴즈 참여 횟수처럼 확인 가능한 참여 수치",
    concept: "캠페인 참여를 투명하게 보여주는 방식",
    practice: "정확히 확인 가능한 지표만 공개하는 것",
    reason: "과장된 수치나 오해를 줄이기 위해",
    caution: "확정되지 않은 금액이나 효과를 과장해 보여주는 태도",
  },
  {
    topic: "광고 수익 운영 원칙",
    answer: "일반 사용자 화면에 정확하지 않은 금액을 노출하지 않는 것",
    concept: "참여 지표 중심의 캠페인 운영",
    practice: "광고 클릭을 유도하지 않고 중립적으로 안내하는 것",
    reason: "기부와 수익에 대한 오해를 막기 위해",
    caution: "광고를 클릭하면 바로 기부된다고 표현하는 태도",
  },
  {
    topic: "역사 자료 확인",
    answer: "공식 자료와 신뢰할 수 있는 출처를 먼저 확인하는 것",
    concept: "역사 정보의 검증",
    practice: "출처가 불명확한 내용은 단정하지 않는 것",
    reason: "역사적 사실을 정확하고 책임 있게 전달하기 위해",
    caution: "출처 없는 이야기를 사실처럼 공유하는 태도",
  },
  {
    topic: "참전용사 증언",
    answer: "개인의 경험을 통해 전쟁을 이해하게 해 주는 기록",
    concept: "구술사와 기억의 기록",
    practice: "증언을 존중하고 맥락과 함께 읽는 것",
    reason: "통계나 연표만으로 알기 어려운 전쟁 경험을 전하기 위해",
    caution: "증언을 자극적인 이야기로만 소비하는 태도",
    source: V,
  },
  {
    topic: "전쟁기 민간인 피란",
    answer: "전쟁이 군인뿐 아니라 민간인의 삶에도 큰 상처를 남긴 사실",
    concept: "전쟁 피해와 피란의 역사",
    practice: "전쟁을 승패만이 아니라 사람들의 삶과 함께 기억하는 것",
    reason: "전쟁의 비극을 더 넓게 이해하기 위해",
    caution: "민간인의 고통을 가볍게 여기거나 희화화하는 태도",
  },
  {
    topic: "흥남 철수의 기억",
    answer: "군사 철수와 피란민 구출이 함께 기억되는 사건",
    concept: "전쟁 속 구호와 피란",
    practice: "작전의 군사적 의미와 인도주의적 의미를 함께 살피는 것",
    reason: "전쟁 속 생명 보호의 의미를 기억하기 위해",
    caution: "피란민의 경험을 단순한 에피소드로만 소비하는 태도",
  },
  {
    topic: "고지전의 의미",
    answer: "전선 교착기 제한된 고지를 둘러싼 치열한 전투",
    concept: "전쟁 후반부의 교착과 소모전",
    practice: "백마고지 같은 전투를 전선 변화와 함께 이해하는 것",
    reason: "정전회담 중에도 전투가 계속되었음을 알기 위해",
    caution: "고지전을 게임식 점령 경쟁처럼 표현하는 태도",
  },
  {
    topic: "인천상륙작전의 기억",
    answer: "전세를 바꾼 반격 작전으로 기억되는 사건",
    concept: "상륙작전과 전쟁 흐름의 전환",
    practice: "작전의 성공뿐 아니라 위험한 조건도 함께 이해하는 것",
    reason: "전쟁의 흐름이 어떻게 바뀌었는지 배우기 위해",
    caution: "작전을 과장된 전쟁 놀이처럼 표현하는 태도",
  },
  {
    topic: "낙동강 방어선의 의미",
    answer: "부산 교두보를 지키며 반격 기반을 마련한 방어선",
    concept: "전쟁 초기 최후 방어선",
    practice: "방어전의 긴박함과 희생을 함께 기억하는 것",
    reason: "초기 전쟁 흐름을 이해하는 핵심 장면이기 때문",
    caution: "방어선을 단순한 지도 암기 대상으로만 보는 태도",
  },
  {
    topic: "가평 전투의 기억",
    answer: "영연방 부대가 중공군 공세를 막아낸 전투",
    concept: "유엔참전국의 전선 방어",
    practice: "호주·캐나다·뉴질랜드 등 참전국의 공헌을 함께 기억하는 것",
    reason: "여러 나라의 희생이 전선 안정에 기여했기 때문",
    caution: "한 나라의 공헌만 강조해 다른 참전국을 지우는 태도",
    source: V,
  },
  {
    topic: "임진강 전투의 기억",
    answer: "영국군 글로스터 대대의 분전으로 알려진 전투",
    concept: "유엔군 지연전과 희생",
    practice: "전투의 결과보다 희생과 역할을 차분히 이해하는 것",
    reason: "유엔참전용사의 헌신을 구체적으로 기억하기 위해",
    caution: "부대의 희생을 과장된 영웅담으로만 소비하는 태도",
    source: V,
  },
  {
    topic: "정확한 날짜 기억",
    answer: "사건의 의미와 함께 날짜를 기억하는 것",
    concept: "역사 연표 학습",
    practice: "6월 25일, 7월 27일 같은 날짜의 의미를 구분하는 것",
    reason: "기념일과 역사 사건을 혼동하지 않기 위해",
    caution: "날짜만 외우고 역사적 맥락을 무시하는 태도",
  },
  {
    topic: "참전국 국기와 상징",
    answer: "참전국을 존중하기 위한 상징으로 다루어야 하는 요소",
    concept: "국제 추모와 예우",
    practice: "국기와 국가명을 정확히 표기하는 것",
    reason: "참전국과 참전용사에 대한 기본 예우이기 때문",
    caution: "참전국 이름을 장난스럽게 바꾸거나 틀리게 쓰는 태도",
    source: V,
  },
  {
    topic: "전쟁 사진 활용",
    answer: "자극적인 장면보다 교육적 맥락을 우선해야 하는 자료",
    concept: "역사 이미지의 책임 있는 사용",
    practice: "폭력적 이미지를 과도하게 강조하지 않는 것",
    reason: "참전용사와 피해자의 경험을 존중하기 위해",
    caution: "피와 폭발 장면을 관심 끌기용으로 사용하는 태도",
  },
  {
    topic: "퀴즈 결과 공유",
    answer: "점수보다 기억에 동참했다는 의미를 전하는 공유",
    concept: "참여 확산과 역사 기억",
    practice: "다른 사람도 퀴즈와 편지에 참여하도록 차분히 권하는 것",
    reason: "기억의 참여가 더 많은 사람에게 이어질 수 있기 때문",
    caution: "점수 경쟁만 부추기거나 다른 사람을 조롱하는 태도",
  },
  {
    topic: "감사의 벽",
    answer: "승인된 감사편지를 함께 볼 수 있는 공개 공간",
    concept: "공개 편지와 공동의 기억",
    practice: "개인정보와 부적절한 표현 없이 마음을 남기는 것",
    reason: "감사의 마음을 안전하게 공유하기 위해",
    caution: "욕설이나 혐오 표현을 공개 편지에 쓰는 태도",
  },
  {
    topic: "보훈의 의미",
    answer: "희생과 공헌을 기억하고 예우하는 태도",
    concept: "기억과 존중의 실천",
    practice: "일상에서 감사와 존중을 표현하는 것",
    reason: "공동체가 지켜 온 가치와 희생을 잊지 않기 위해",
    caution: "보훈을 특정 시기에만 하는 형식으로 여기는 태도",
  },
  {
    topic: "평화의 의미",
    answer: "전쟁의 기억을 바탕으로 지켜야 할 일상의 가치",
    concept: "기억을 통한 평화 의식",
    practice: "전쟁을 미화하지 않고 평화의 책임을 생각하는 것",
    reason: "전쟁의 고통을 반복하지 않기 위해",
    caution: "전쟁을 재미있는 승부처럼 소비하는 태도",
  },
  {
    topic: "청소년 역사 참여",
    answer: "퀴즈와 편지처럼 부담 없이 역사 기억에 참여하는 방식",
    concept: "다음 세대의 기억 계승",
    practice: "짧은 참여라도 정확한 정보와 존중을 지키는 것",
    reason: "역사는 다음 세대가 이어 갈 때 지속되기 때문",
    caution: "역사를 밈이나 농담으로만 소비하는 태도",
  },
  {
    topic: "공식 출처 표기",
    answer: "자료의 제목과 주소를 함께 남기는 것",
    concept: "검증 가능한 역사 정보",
    practice: "문제와 해설에 공식 출처를 연결하는 것",
    reason: "사용자가 직접 확인하고 더 배울 수 있도록 돕기 위해",
    caution: "출처 없이 단정적인 설명만 남기는 태도",
  },
  {
    topic: "민감한 역사 표현",
    answer: "자극적 표현을 피하고 사실과 맥락을 차분히 설명하는 것",
    concept: "역사 콘텐츠의 책임",
    practice: "정치적 조롱이나 혐오 표현을 배제하는 것",
    reason: "희생과 고통을 다루는 주제이기 때문",
    caution: "역사적 상처를 이용해 갈등을 부추기는 태도",
  },
  {
    topic: "참전용사 호칭",
    answer: "존중을 담아 참전용사분들로 표현하는 태도",
    concept: "감사와 예우의 언어",
    practice: "편지와 화면 문구에서 존중의 표현을 사용하는 것",
    reason: "희생과 헌신에 대한 기본 예의를 지키기 위해",
    caution: "낮춤말이나 조롱 섞인 표현을 사용하는 태도",
  },
  {
    topic: "퀴즈 난이도 운영",
    answer: "누구나 도전할 수 있는 중간 수준으로 유지하는 것",
    concept: "참여형 캠페인의 접근성",
    practice: "너무 쉽거나 너무 어려운 세부 암기를 줄이는 것",
    reason: "더 많은 사람이 역사 기억에 참여할 수 있도록 하기 위해",
    caution: "소수만 풀 수 있는 지나친 세부 숫자 문제만 내는 태도",
  },
  {
    topic: "문제 해설의 말투",
    answer: "차분하고 교육적인 문장으로 설명하는 것",
    concept: "존중 기반의 역사 학습",
    practice: "정답과 오답을 과격하게 표현하지 않는 것",
    reason: "역사와 참전용사를 다루는 캠페인이기 때문",
    caution: "오답자를 조롱하거나 자극적 표현을 쓰는 태도",
  },
  {
    topic: "유엔기념공원 방문 태도",
    answer: "추모 공간에 맞는 조용하고 존중하는 태도",
    concept: "공간 예절과 추모",
    practice: "사진을 찍더라도 추모 분위기를 해치지 않는 것",
    reason: "전몰장병이 잠든 장소이기 때문",
    caution: "큰 소리나 장난으로 공간의 의미를 흐리는 태도",
    source: U,
  },
  {
    topic: "역사 콘텐츠 공유",
    answer: "확인된 사실과 존중의 문맥을 함께 공유하는 것",
    concept: "디지털 시대의 역사 기억",
    practice: "짧은 카드라도 출처와 의미를 생각하는 것",
    reason: "잘못된 정보가 빠르게 퍼질 수 있기 때문",
    caution: "눈길을 끌기 위해 사실을 과장하는 태도",
  },
  {
    topic: "Remember625의 참여 방식",
    answer: "퀴즈로 배우고 감사편지로 마음을 남기는 방식",
    concept: "참여형 보훈 캠페인",
    practice: "퀴즈 해설을 읽고 진심 어린 편지를 작성하는 것",
    reason: "정보 학습이 감사의 실천으로 이어지도록 하기 위해",
    caution: "편지를 장난성 문구로 채우는 태도",
  },
  {
    topic: "정전 이후의 기억",
    answer: "전투가 멈춘 뒤에도 기억과 예우가 계속되어야 한다는 인식",
    concept: "전후 세대의 책임",
    practice: "기념일이 아니어도 참전용사의 희생을 기억하는 것",
    reason: "평화로운 일상이 많은 희생 위에 이어졌기 때문",
    caution: "정전 이후 세대와 무관한 일로만 여기는 태도",
  },
  {
    topic: "감사 표현의 핵심",
    answer: "과장보다 진심과 존중을 담는 것",
    concept: "감사편지 작성 원칙",
    practice: "배운 사실과 느낀 마음을 자신의 말로 쓰는 것",
    reason: "진심 어린 표현이 기억을 오래 이어 주기 때문",
    caution: "AI 초안을 그대로 복사만 하고 의미를 생각하지 않는 태도",
  },
];

const unique = <T,>(items: T[]) => [...new Set(items)];

function pool<T>(items: readonly T[], pick: (item: T) => string) {
  return unique(items.map(pick));
}

function buildBattleSpecs() {
  const periods = pool(battleFacts, (item) => item.period);
  const places = pool(battleFacts, (item) => item.place);
  const features = pool(battleFacts, (item) => item.feature);
  const related = pool(battleFacts, (item) => item.related);
  const meanings = pool(battleFacts, (item) => item.meaning);

  return battleFacts.flatMap((item) => [
    spec(
      "battle",
      `${item.name}가 벌어진 곳으로 가장 알맞은 곳은 어디인가요?`,
      item.place,
      places,
      `${item.name}는 ${item.place}에서 전개되었습니다. ${item.meaning}입니다.`,
      item.source,
    ),
    spec(
      "battle",
      `${item.name}가 전개된 시기로 가장 알맞은 것은 언제인가요?`,
      item.period,
      periods,
      `${item.name}는 ${item.period}에 전개되었습니다. ${item.feature}입니다.`,
      item.source,
    ),
    spec(
      "battle",
      `${item.name}의 특징으로 알맞은 것은 무엇인가요?`,
      item.feature,
      features,
      `${item.name}는 ${item.feature}로 설명할 수 있습니다.`,
      item.source,
    ),
    spec(
      "battle",
      `${item.name}와 관련 깊은 인물·부대·표현은 무엇인가요?`,
      item.related,
      related,
      `${item.name}는 ${item.related}와 관련 깊게 기억됩니다.`,
      item.source,
    ),
    spec(
      "battle",
      `${item.name}가 전쟁 흐름에서 갖는 의미로 가장 알맞은 것은 무엇인가요?`,
      item.meaning,
      meanings,
      `${item.name}는 ${item.meaning}로 이해할 수 있습니다.`,
      item.source,
    ),
  ]);
}

function buildTimelineSpecs() {
  const events = pool(timelineFacts, (item) => item.event);
  const times = pool(timelineFacts, (item) => item.time);
  const contexts = pool(timelineFacts, (item) => item.context);
  const significances = pool(timelineFacts, (item) => item.significance);
  const clues = pool(timelineFacts, (item) => item.clue);

  return timelineFacts.flatMap((item) => [
    spec(
      "chronology",
      `${item.event}와 가장 관련 깊은 시기는 언제인가요?`,
      item.time,
      times,
      `${item.event}는 ${item.time}와 관련됩니다. ${item.context}입니다.`,
      item.source,
    ),
    spec(
      "chronology",
      `다음 배경 설명이 가리키는 사건은 무엇인가요? ${item.context}`,
      item.event,
      events,
      `${item.time}에는 ${item.event}가 있었습니다. ${item.significance}입니다.`,
      item.source,
    ),
    spec(
      "chronology",
      `${item.event}의 배경이나 내용으로 알맞은 것은 무엇인가요?`,
      item.context,
      contexts,
      `${item.event}는 ${item.context}로 설명할 수 있습니다.`,
      item.source,
    ),
    spec(
      "chronology",
      `${item.event}의 의미로 가장 알맞은 것은 무엇인가요?`,
      item.significance,
      significances,
      `${item.event}는 ${item.significance}입니다.`,
      item.source,
    ),
    spec(
      "chronology",
      `다음 설명에 해당하는 사건은 무엇인가요? ${item.clue}`,
      item.event,
      events.concat(clues),
      `${item.clue}에 해당하는 사건은 ${item.event}입니다.`,
      item.source,
    ),
  ]);
}

function buildPersonSpecs() {
  const names = pool(personFacts, (item) => item.name);
  const roles = pool(personFacts, (item) => item.role);
  const related = pool(personFacts, (item) => item.related);
  const actions = pool(personFacts, (item) => item.action);
  const organizations = pool(personFacts, (item) => item.organization);
  const periods = pool(personFacts, (item) => item.period);
  const significances = pool(personFacts, (item) => item.significance);
  const descriptions = pool(personFacts, (item) => item.description);

  return personFacts.flatMap((item) => [
    spec(
      "person",
      `${item.role}으로 ${item.related}와 관련 깊은 인물은 누구인가요?`,
      item.name,
      names,
      `이 설명은 ${item.name}에 해당합니다. 역할은 ${item.role}이며 ${item.related}와 관련 깊습니다.`,
      item.source,
    ),
    spec(
      "person",
      `${item.name}의 역할로 알맞은 것은 무엇인가요?`,
      item.role,
      roles,
      `${item.name}의 역할은 ${item.role}로 설명할 수 있습니다.`,
      item.source,
    ),
    spec(
      "person",
      `인물 ${item.name}: 가장 관련 깊은 사건이나 주제는 무엇인가요?`,
      item.related,
      related,
      `${item.name}의 관련 주제는 ${item.related}입니다.`,
      item.source,
    ),
    spec(
      "person",
      `인물 ${item.name}: 설명으로 알맞은 것은 무엇인가요?`,
      item.action,
      actions,
      `이 설명은 ${item.name}에 해당합니다. ${item.action}`,
      item.source,
    ),
    spec(
      "person",
      `인물 ${item.name}: 관련 깊은 조직이나 소속은 무엇인가요?`,
      item.organization,
      organizations,
      `관련 조직이나 소속은 ${item.organization}입니다. ${item.name}의 활동을 이해할 때 함께 살펴볼 수 있습니다.`,
      item.source,
    ),
    spec(
      "person",
      `인물 ${item.name}: 6.25 전쟁사에서 주로 언급되는 시기는 언제인가요?`,
      item.period,
      periods,
      `이 인물은 전쟁사에서 ${item.period}의 맥락으로 살펴볼 수 있습니다.`,
      item.source,
    ),
    spec(
      "person",
      `인물 ${item.name}: 기억할 때 가장 알맞은 의미는 무엇인가요?`,
      item.significance,
      significances,
      `이 인물을 기억할 때 핵심 의미는 ${item.significance}입니다.`,
      item.source,
    ),
    spec(
      "person",
      `다음 설명에 해당하는 인물은 누구인가요? ${item.description}`,
      item.name,
      names.concat(descriptions),
      `${item.description}은 ${item.name}입니다.`,
      item.source,
    ),
  ]);
}

function buildUnSpecs() {
  const names = pool(unFacts, (item) => item.name);
  const supports = unique([
    ...pool(unFacts, (item) => item.support),
    "전후 문화교류만",
    "참전하지 않음",
    "광고 후원",
  ]);
  const regions = pool(unFacts, (item) => item.region);
  const contributions = pool(unFacts, (item) => item.contribution);
  const services = pool(unFacts, (item) => item.service);
  const remembrances = pool(unFacts, (item) => item.remembrance);
  const classifications = pool(unFacts, (item) => item.classification);
  const significances = pool(unFacts, (item) => item.significance);

  return unFacts.flatMap((item) => [
    spec(
      "un",
      `${item.contribution}로 설명되는 유엔참전국 또는 분류는 무엇인가요?`,
      item.name,
      names,
      `다음 설명은 ${item.name}에 해당합니다. ${item.contribution}입니다.`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}의 6.25 전쟁 지원 형태로 알맞은 것은 무엇인가요?`,
      item.support,
      supports,
      `${item.name}의 지원 형태는 ${item.support}이며, 유엔참전국 기록에서 이 분류로 확인할 수 있습니다.`,
      item.source,
    ),
    spec(
      "un",
      `유엔참전국 ${item.name}: 속한 지역으로 가장 알맞은 곳은 어디인가요?`,
      item.region,
      regions,
      `${item.name}의 지역 구분은 ${item.region}입니다. 여러 지역의 나라들이 대한민국을 도왔습니다.`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}의 참전 내용으로 알맞은 것은 무엇인가요?`,
      item.contribution,
      contributions,
      `${item.name}의 참전 내용은 ${item.contribution}입니다.`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}과 가장 관련 깊은 전력·부대·지원 방식은 무엇인가요?`,
      item.service,
      services,
      `${item.name}과 관련 깊은 전력·부대·지원 방식은 ${item.service}입니다.`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}을 기억할 때 알맞은 설명은 무엇인가요?`,
      item.remembrance,
      remembrances,
      `${item.name}을 기억할 때는 ${item.remembrance}`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}의 참전 분류로 알맞은 것은 무엇인가요?`,
      item.classification,
      classifications,
      `${item.name}의 참전 분류는 ${item.classification}입니다.`,
      item.source,
    ),
    spec(
      "un",
      `${item.name}의 참전 의미로 알맞은 것은 무엇인가요?`,
      item.significance,
      significances,
      `${item.name}의 참전 의미는 ${item.significance}입니다.`,
      item.source,
    ),
  ]);
}

function buildMemorialSpecs() {
  const topics = pool(memorialFacts, (item) => item.topic);
  const answers = pool(memorialFacts, (item) => item.answer);
  const practices = pool(memorialFacts, (item) => item.practice);
  const reasons = pool(memorialFacts, (item) => item.reason);
  const cautions = pool(memorialFacts, (item) => item.caution);

  return memorialFacts.flatMap((item) => [
    spec(
      "memorial",
      `${item.topic}에 대한 설명으로 가장 알맞은 것은 무엇인가요?`,
      item.answer,
      answers,
      `${item.topic}은 ${item.answer}입니다.`,
      item.source,
    ),
    spec(
      "memorial",
      `${item.concept}와 가장 관련 깊은 주제는 무엇인가요?`,
      item.topic,
      topics,
      `${item.concept}와 관련 깊은 주제는 ${item.topic}입니다.`,
      item.source,
    ),
    spec(
      "memorial",
      `${item.topic}을 실천하거나 기억하는 태도로 알맞은 것은 무엇인가요?`,
      item.practice,
      practices,
      `${item.topic}에서는 ${item.practice}이 중요합니다.`,
      item.source,
    ),
    spec(
      "memorial",
      `${item.topic}을 기억해야 하는 이유로 가장 알맞은 것은 무엇인가요?`,
      item.reason,
      reasons,
      `${item.topic}을 기억하는 이유는 ${item.reason}입니다.`,
      item.source,
    ),
    spec(
      "memorial",
      `${item.topic}과 관련해 피해야 할 태도는 무엇인가요?`,
      item.caution,
      cautions.concat(practices),
      `${item.topic}에서는 ${item.caution}를 피해야 합니다.`,
      item.source,
    ),
  ]);
}

function buildQuizSeed() {
  const specs = [
    ...buildBattleSpecs().slice(0, 200),
    ...buildPersonSpecs().slice(0, 200),
    ...buildTimelineSpecs().slice(0, 200),
    ...buildUnSpecs().slice(0, 200),
    ...buildMemorialSpecs().slice(0, 200),
  ];
  const counts: Record<SeedCategory, number> = {
    battle: 0,
    person: 0,
    chronology: 0,
    un: 0,
    memorial: 0,
  };
  return specs.map((item) => toQuestion(item, (counts[item.category] += 1)));
}

export const QUIZ_SEED: QuizQuestion[] = buildQuizSeed();
