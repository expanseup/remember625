# Remember625

퀴즈로 기억하고, 편지로 감사하는 6.25 참전용사 감사 캠페인입니다. 사용자는 10문제 역사 퀴즈를 풀고 해설을 읽은 뒤 감사편지를 남길 수 있습니다.

## 주요 기능

- 5개 주제 전체에서 무작위로 출제되는 단일 중간 난이도의 1000문제 퀴즈 풀
- 답안 선택 직후 정답·오답과 공식 자료 기반 해설 제공
- 서버 재채점 및 `session_id + client_run_id` 중복 완료 방지
- 점수별 칭호와 결과 공유 카드 UI
- 랜덤 퀴즈 감사편지 초안, 입력 검증, 개인정보·욕설·반복 문구 검수
- 디지털 감사 액자와 승인된 편지만 표시하는 감사의 벽
- 총 퀴즈 참여 횟수 공개
- 환경변수 암호와 HttpOnly 쿠키를 사용하는 관리자 검수 화면
- 실제 광고 코드 없이 중립적인 광고 placeholder 제공
- Supabase 미설정 시 로컬 개발용 메모리 저장소 사용

## 기술 스택

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui 방식 컴포넌트, Supabase PostgreSQL, Zod, React Hook Form, Vitest, Playwright를 사용합니다.

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell에서는 다음 명령으로 환경변수 파일을 만들 수 있습니다.

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Supabase 환경변수가 없으면 퀴즈는 내장 seed로 실행되고 완료 기록과 편지는 서버 프로세스 메모리에 저장됩니다. 개발 서버를 재시작하면 이 데이터는 초기화됩니다.

## 환경변수

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
```

- `SUPABASE_SERVICE_ROLE_KEY`와 `ADMIN_SECRET`은 서버에서만 사용합니다.
- 운영 환경에서는 네 환경변수를 모두 설정합니다.
- 개발 환경에서 `ADMIN_SECRET`이 없을 때만 `/admin` 암호로 `dev-admin`을 사용할 수 있습니다.
- `session_id`는 익명 사용 흐름과 중복 방지용이며 인증 수단이 아닙니다.

## Supabase 설정

1. Supabase Dashboard의 SQL Editor에서 [`supabase/setup.sql`](supabase/setup.sql) 전체를 한 번 실행합니다.
2. Dashboard의 Project Settings → API Keys에서 Project URL, publishable/anon key, secret/service_role key를 확인해 `.env.local`에 설정합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_OR_SERVICE_ROLE_KEY
```

3. 개발 서버를 재시작하고 퀴즈를 완료한 뒤 Table Editor의 `quiz_attempts`에 행이 생성되는지 확인합니다.

`setup.sql`은 테이블과 인덱스, RLS 설정, 1000개 퀴즈 seed를 한 번에 적용합니다. 기존 퀴즈 문제는 초기화되므로 운영 데이터가 있는 프로젝트에서는 다시 실행하지 마세요.

Seed만 다시 적재하려면 다음 중 한 방법을 사용합니다.

```bash
# 서비스 역할 키로 직접 적재
npm run db:seed

# SQL 파일을 다시 생성한 뒤 SQL Editor에서 실행
npm run db:seed:sql
```

생성되는 [`supabase/seed.sql`](supabase/seed.sql)은 기존 `quiz_questions`를 비운 뒤 전체 seed를 넣습니다. 운영 데이터가 있는 환경에서는 실행 전 백업과 범위를 확인해야 합니다.

RLS를 활성화하고 anon/authenticated 역할의 테이블 직접 접근을 제거했습니다. 공개 읽기와 쓰기는 Next.js Route Handler를 거치며 service role key는 클라이언트 번들에 포함되지 않습니다.

## 이미지 에셋

OpenAI built-in image generation skill로 다음 에셋을 생성해 [`public/assets/generated`](public/assets/generated)에 적용했습니다.

- 투명 무궁화·방패 로고 심벌
- 남색 Hero 배경
- 디지털 편지 액자 배경
- 통일된 칭호 배지 시트
- 세로형 결과 공유 카드 배경
- 감사의 벽 빈 상태 일러스트

에셋은 PNG/WebP로 최적화했으며 `next/image`, alt 텍스트, 배경색 fallback을 사용합니다. 한글 로고 텍스트는 이미지 왜곡을 막기 위해 HTML로 렌더링합니다.

## 광고 및 운영 정책

- 공개 지표는 총 퀴즈 완료 횟수만 표시합니다.
- 광고 수익, 예상 수익, 기부 예정 금액 또는 정산 금액을 공개 화면에 표시하지 않습니다.
- 광고 영역은 실제 광고 코드가 없는 `AdSlot` placeholder입니다.
- 광고 클릭이나 새로고침을 유도하는 문구를 사용하지 않습니다.
- 개인정보·욕설·URL·과도한 반복이 감지된 편지는 비공개 검토 상태로 저장합니다.
- 관리자는 삭제보다 승인·숨김·거절 상태 변경을 우선합니다.

## 검증

```bash
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Playwright는 데스크톱 Chromium과 iPhone 13 viewport에서 메인 → 퀴즈 10문제 → 결과 → 편지 → 감사의 벽 흐름을 확인합니다.

## 배포 전 체크리스트

- Supabase schema와 1000개 seed 적용
- 운영 환경변수와 강한 `ADMIN_SECRET` 설정
- service role key가 `NEXT_PUBLIC_` 변수에 포함되지 않았는지 확인
- 공식 출처 링크와 퀴즈 문항 최종 역사 검수
- 문의 이메일 `contact@example.com`을 실제 운영 주소로 교체
- 광고를 연동할 경우 버튼과 시각적으로 분리하고 클릭 유도 문구 금지
- `typecheck`, `lint`, 단위 테스트, E2E, production build 통과
