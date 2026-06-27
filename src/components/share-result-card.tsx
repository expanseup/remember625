"use client";

import { Download, LoaderCircle, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getShareCardText } from "@/lib/share-card";
import type { QuizAttempt } from "@/lib/types";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: { font: string; color: string; maxWidth?: number },
) {
  context.font = options.font;
  context.fillStyle = options.color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x, y, options.maxWidth);
}

function drawDivider(
  context: CanvasRenderingContext2D,
  y: number,
  width = 420,
  color = "rgba(214,181,109,0.64)",
) {
  const center = CARD_WIDTH / 2;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(center - width / 2, y);
  context.lineTo(center - 18, y);
  context.moveTo(center + 18, y);
  context.lineTo(center + width / 2, y);
  context.stroke();
  context.fillStyle = color;
  context.beginPath();
  context.arc(center, y, 4, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawPetal(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
) {
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  context.fill();
}

function drawLaurel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: -1 | 1,
  scale = 1,
) {
  context.save();
  context.translate(x, y);
  context.scale(direction * scale, scale);
  context.strokeStyle = "rgba(229,198,129,0.62)";
  context.fillStyle = "rgba(229,198,129,0.7)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 28);
  context.quadraticCurveTo(16, 8, 44, -10);
  context.stroke();
  for (let index = 0; index < 4; index += 1) {
    const leafX = 10 + index * 8;
    const leafY = 21 - index * 8;
    drawPetal(context, leafX, leafY, 3.5, 8, -0.72);
  }
  context.restore();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("공유 카드 배경을 불러오지 못했습니다."));
    image.src = src;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > canvasRatio) {
    sourceWidth = sourceHeight * canvasRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = sourceWidth / canvasRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("공유 이미지를 만들지 못했습니다."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

async function createShareImageBlob(copy: ReturnType<typeof getShareCardText>) {
  if (document.fonts?.ready) await document.fonts.ready;
  const backgroundImage = await loadImage("/assets/generated/share-card-bg.webp");

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("공유 이미지를 만들 수 없는 브라우저입니다.");

  drawCoverImage(context, backgroundImage, CARD_WIDTH, CARD_HEIGHT);

  context.save();
  context.fillStyle = "rgba(3,10,20,0.24)";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  context.restore();

  const textGlow = context.createRadialGradient(540, 788, 0, 540, 788, 520);
  textGlow.addColorStop(0, "rgba(246,212,150,0.16)");
  textGlow.addColorStop(0.38, "rgba(246,212,150,0.055)");
  textGlow.addColorStop(1, "rgba(246,212,150,0)");
  context.fillStyle = textGlow;
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  drawCenteredText(context, copy.serviceName, CARD_WIDTH / 2, 286, {
    font: '500 54px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F2D9A4",
    maxWidth: 760,
  });
  drawDivider(context, 354, 300, "rgba(229,198,129,0.52)");

  drawLaurel(context, CARD_WIDTH / 2 - 164, 482, -1, 0.58);
  drawLaurel(context, CARD_WIDTH / 2 + 164, 482, 1, 0.58);
  drawCenteredText(context, "퀴즈 결과", CARD_WIDTH / 2, 482, {
    font: '500 50px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F8E3B9",
    maxWidth: 680,
  });

  context.save();
  context.shadowColor = "rgba(229,198,129,0.42)";
  context.shadowBlur = 18;
  const scoreGradient = context.createLinearGradient(350, 690, 740, 900);
  scoreGradient.addColorStop(0, "#F8F5EF");
  scoreGradient.addColorStop(0.38, "#F2D9A4");
  scoreGradient.addColorStop(1, "#D6B56D");
  context.font = '500 250px "Times New Roman", "Noto Serif KR", Batang, serif';
  context.fillStyle = scoreGradient;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(copy.scoreText.replace(/\s/g, ""), CARD_WIDTH / 2, 748, 760);
  context.restore();

  drawCenteredText(context, copy.scoreDetail, CARD_WIDTH / 2, 926, {
    font: '500 44px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F2D9A4",
    maxWidth: 780,
  });

  context.save();
  drawRoundedRect(context, 258, 1008, 564, 108, 54);
  context.strokeStyle = "rgba(229,198,129,0.82)";
  context.lineWidth = 2.5;
  context.stroke();
  context.restore();
  drawLaurel(context, 354, 1062, -1, 0.62);
  drawCenteredText(context, copy.title, CARD_WIDTH / 2 + 28, 1062, {
    font: '600 54px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F8E3B9",
    maxWidth: 440,
  });

  drawCenteredText(context, copy.comment, CARD_WIDTH / 2, 1248, {
    font: '600 62px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F0BD86",
    maxWidth: 760,
  });
  drawDivider(context, 1324, 420, "rgba(229,198,129,0.5)");

  drawCenteredText(context, copy.tagline, CARD_WIDTH / 2, 1410, {
    font: '500 41px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F8E3B9",
    maxWidth: 830,
  });
  drawCenteredText(context, copy.invitation, CARD_WIDTH / 2, 1490, {
    font: '500 40px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F8E3B9",
    maxWidth: 830,
  });

  drawDivider(context, 1588, 420, "rgba(229,198,129,0.44)");
  drawCenteredText(context, "잊지 않겠습니다", CARD_WIDTH / 2, 1714, {
    font: '600 66px "Noto Serif KR", Batang, Georgia, serif',
    color: "#F0BD86",
    maxWidth: 780,
  });
  drawCenteredText(context, "·  ·  ·   ★   ·  ·  ·", CARD_WIDTH / 2, 1800, {
    font: "500 30px Georgia, serif",
    color: "rgba(229,198,129,0.86)",
    maxWidth: 520,
  });

  return canvasToBlob(canvas);
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "remember625-result.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShareResultCard({ attempt }: { attempt: QuizAttempt }) {
  const copy = useMemo(
    () => getShareCardText(attempt.score, attempt.totalQuestions),
    [attempt.score, attempt.totalQuestions],
  );
  const [status, setStatus] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  async function share() {
    setIsSharing(true);
    setStatus("");
    try {
      const blob = await createShareImageBlob(copy);
      const file = new File([blob], "remember625-result.png", {
        type: "image/png",
      });
      const shareData = {
        files: [file],
        title: "기억작전 625 퀴즈 결과",
        text: `${copy.serviceName}에서 ${copy.scoreDetail}을 기록했습니다. ${copy.invitation}`,
      } satisfies ShareData;

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setStatus("공유 화면을 열었습니다.");
      } else {
        downloadBlob(blob);
        setStatus("공유 이미지를 저장했습니다.");
      }
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "공유 이미지를 만들지 못했습니다.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <section className="mt-9">
      <div className="flex flex-col gap-5 min-[520px]:flex-row min-[520px]:items-end min-[520px]:justify-between">
        <div>
          <p className="section-kicker">공유 카드</p>
          <h2 className="service-title mt-2 text-2xl">결과 공유하기</h2>
          <p className="text-gray-text balanced-copy mt-2 max-w-md text-sm leading-6">
            인스타 스토리에 올리기 좋은 세로형 결과 카드를 만듭니다.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full min-[520px]:w-auto"
          onClick={share}
          disabled={isSharing}
        >
          {isSharing ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Share2 className="size-4" />
          )}
          공유하기
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-center">
        <div
          className="relative aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-[1.9rem] bg-[#061226] p-5 text-[#f8e3b9] shadow-2xl shadow-navy/18 ring-1 ring-navy/10"
          aria-label="공유 카드 미리보기"
          style={{
            backgroundImage:
              "linear-gradient(rgba(3,10,20,0.24), rgba(3,10,20,0.24)), url('/assets/generated/share-card-bg.webp')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(214,181,109,0.18),transparent_28%)]" />
          <div className="relative flex h-full flex-col items-center text-center font-serif">
            <div className="mt-5 flex flex-col items-center">
              <p className="mt-9 text-[18px] leading-none tracking-[-0.04em] text-[#f8e3b9]">
                {copy.serviceName}
              </p>
              <div className="mt-3 flex w-24 items-center justify-center gap-2">
                <span className="h-px flex-1 bg-[#d6b56d]/55" />
                <span className="size-1 rounded-full bg-[#d6b56d]/80" />
                <span className="h-px flex-1 bg-[#d6b56d]/55" />
              </div>
              <p className="mt-5 text-[15px] tracking-[-0.03em] text-[#f8e3b9]">
                퀴즈 결과
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[4.1rem] leading-none tracking-[-0.08em] text-[#f2d9a4] drop-shadow-[0_0_12px_rgba(214,181,109,0.45)]">
                {copy.scoreText.replace(/\s/g, "")}
              </p>
              <p className="mt-3 text-[13px] tracking-[-0.04em] text-[#f2d9a4]">
                {copy.scoreDetail}
              </p>
            </div>

            <div className="mt-5 rounded-full border border-[#d6b56d]/85 px-7 py-2.5 text-[18px] tracking-[-0.04em]">
              {copy.title}
            </div>

            <p className="mt-6 text-[21px] tracking-[-0.05em] text-[#f0bd86]">
              {copy.comment}
            </p>
            <div className="mt-3 flex w-24 items-center justify-center gap-2">
              <span className="h-px flex-1 bg-[#d6b56d]/45" />
              <span className="size-1 rounded-full bg-[#d6b56d]/70" />
              <span className="h-px flex-1 bg-[#d6b56d]/45" />
            </div>
            <div className="mt-4 space-y-1 text-[13px] leading-5 tracking-[-0.05em]">
              <p>{copy.tagline}</p>
              <p>{copy.invitation}</p>
            </div>

            <div className="mt-auto mb-5">
              <div className="mb-4 flex w-24 items-center justify-center gap-2">
                <span className="h-px flex-1 bg-[#d6b56d]/45" />
                <span className="size-1 rounded-full bg-[#d6b56d]/70" />
                <span className="h-px flex-1 bg-[#d6b56d]/45" />
              </div>
              <p className="text-[23px] tracking-[-0.06em] text-[#f0bd86]">
                잊지 않겠습니다
              </p>
              <p className="mt-1.5 text-[11px] tracking-[0.28em] text-[#d6b56d]/75">
                ··· ★ ···
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-text balanced-copy text-sm leading-6 min-[520px]:max-w-48">
          지원되는 모바일 브라우저에서는 공유 시트가 열립니다. 지원하지 않는
          환경에서는 PNG 이미지로 저장됩니다.
        </p>
      </div>

      {status && (
        <p
          role="status"
          className="text-muted-blue mt-3 flex items-center gap-2 text-sm font-medium"
        >
          <Download className="size-4" aria-hidden="true" />
          {status}
        </p>
      )}
    </section>
  );
}
