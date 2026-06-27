"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LETTER_TEMPLATES } from "@/lib/ai-letter-template";
import { getAnonymousSessionId } from "@/lib/session";
import type { QuizAttempt } from "@/lib/types";

const formSchema = z.object({
  nickname: z.string().trim().max(12, "닉네임은 12자 이하로 입력해 주세요."),
  content: z
    .string()
    .trim()
    .min(50, "편지는 50자 이상 작성해 주세요."),
});
type FormValues = z.infer<typeof formSchema>;

export function LetterEditor({ attempt }: { attempt: QuizAttempt }) {
  const router = useRouter();
  const [aiDraftUsed, setAiDraftUsed] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nickname: "", content: "" },
  });
  const content = useWatch({ control, name: "content" });

  function useTemplate() {
    setValue("content", LETTER_TEMPLATES[attempt.category], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setAiDraftUsed(true);
  }

  async function submit(values: FormValues) {
    setServerError("");
    try {
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizAttemptId: attempt.id,
          sessionId: getAnonymousSessionId(),
          nickname: values.nickname,
          content: values.content,
          aiDraftUsed,
          relatedCategory: attempt.category,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      router.push(
        `/letter/${data.letterId}?token=${encodeURIComponent(data.viewToken)}`,
      );
    } catch (reason) {
      setServerError(
        reason instanceof Error
          ? reason.message
          : "편지를 저장하지 못했습니다.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="border-navy/10 border-y py-6 sm:py-7"
      noValidate
    >
      <div className="border-gold border-l-2 py-1 pl-4 text-sm leading-6 text-amber-950">
        <p className="flex gap-2 font-semibold">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /> 개인정보 안내
        </p>
        <p className="mt-1 pl-6">
          전화번호, 주소, 학교반, 실명 등 개인정보는 적지 말아 주세요.
        </p>
      </div>
      <div className="mt-7">
        <label htmlFor="nickname" className="mb-2 block text-sm font-bold">
          닉네임{" "}
          <span className="text-gray-text font-normal">선택 · 최대 12자</span>
        </label>
        <Input
          id="nickname"
          placeholder="비워두면 익명으로 표시됩니다"
          maxLength={12}
          {...register("nickname")}
        />
        {errors.nickname && (
          <p className="text-muted-red mt-2 text-sm">
            {errors.nickname.message}
          </p>
        )}
      </div>
      <div className="mt-7">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="content" className="text-sm font-bold">
            감사편지
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full min-[420px]:w-auto"
            onClick={useTemplate}
          >
            <Sparkles className="size-4" /> AI 초안 도움받기
          </Button>
        </div>
        <Textarea
          id="content"
          placeholder="오늘 퀴즈에서 배운 내용을 바탕으로 감사의 마음을 적어보세요."
          {...register("content")}
        />
        <div className="mt-2 flex justify-between gap-4 text-xs">
          <span className="text-muted-red">{errors.content?.message}</span>
          <span className="text-gray-text ml-auto tabular-nums">
            {content?.length ?? 0}자 · 최소 50자
          </span>
        </div>
        <p className="text-gray-text mt-2 text-xs leading-5">
          AI 초안은 출발점입니다. 자신의 말로 다듬어 마음을 완성해 주세요.
        </p>
      </div>
      {serverError && (
        <p
          role="alert"
          className="border-muted-red text-muted-red mt-5 border-l-2 py-1 pl-4 text-sm font-medium"
        >
          {serverError}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="mt-7 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        감사편지 남기기
      </Button>
    </form>
  );
}
