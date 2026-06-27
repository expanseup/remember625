import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

function getAdminSecret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return "dev-admin";
  const match = fs.readFileSync(envPath, "utf8").match(/^ADMIN_SECRET=(.+)$/m);
  return match?.[1].trim() || "dev-admin";
}

test("quiz to public letter campaign flow", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("지금까지 진행된 호국 퀴즈 참여 횟수입니다."),
  ).toBeVisible();
  await page.getByRole("link", { name: "문제 시작하기" }).first().click();
  await expect(
    page.getByRole("heading", { name: "호국 퀴즈 시작하기" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "문제 시작하기" }).click();

  const questionCount = 10;
  for (let index = 0; index < questionCount; index += 1) {
    await page.getByRole("radio").first().click();
    await expect(
      page.getByText(/정답입니다|아쉽지만 오답입니다/),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: index === questionCount - 1 ? "결과 확인하기" : "다음 문제",
      })
      .click();
  }

  await expect(page).toHaveURL(/\/quiz\/result\//);
  await expect(
    page.getByRole("heading", { name: "결과 공유하기" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "공유하기" })).toBeVisible();
  await expect(page.getByLabel("공유 카드 미리보기")).toBeVisible();
  await page
    .getByRole("link", { name: "참전용사분들께 감사편지 남기기" })
    .click();
  await page.getByLabel("닉네임").fill("기억하는 사람");
  await page
    .getByLabel("감사편지")
    .fill(
      "참전용사님께, 오늘 퀴즈를 풀며 지금 우리가 누리는 평화로운 일상이 많은 분들의 희생과 헌신 덕분임을 배웠습니다. 오래 기억하고 감사하겠습니다.",
    );
  await page.getByRole("button", { name: "감사편지 남기기" }).click();
  await expect(page).toHaveURL(/\/letter\//);
  await expect(page.getByText("잊지 않겠습니다")).toBeVisible();
  await page.getByRole("link", { name: "감사의 벽 보기" }).click();
  await expect(page.getByText("기억하는 사람")).toBeVisible();
});

test("admin secret opens the moderation dashboard", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("관리자 암호").fill(getAdminSecret());
  await page.getByRole("button", { name: "입장하기" }).click();
  await expect(
    page.getByRole("heading", { name: "운영 대시보드" }),
  ).toBeVisible();
});

test("about page renders without public amount wording", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { name: "기억을 참여로 이어갑니다" }),
  ).toBeVisible();
  await expect(
    page.getByText(/수익금|광고 수익|예상 기부금|기부 예정|정산 금액|금액|₩/),
  ).toHaveCount(0);
});
