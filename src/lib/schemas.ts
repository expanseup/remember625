import { z } from "zod";
import { DEFAULT_QUIZ_DIFFICULTY, QUIZ_QUESTION_COUNT } from "@/lib/constants";
import { categories, difficulties } from "@/lib/types";

export const categorySchema = z.enum(categories);
export const difficultySchema = z.enum(difficulties);

export const checkAnswerSchema = z.object({
  questionId: z.string().min(1).max(100),
  selectedIndex: z.number().int().min(0).max(3),
});

export const quizSubmitSchema = z.object({
  sessionId: z.string().uuid(),
  clientRunId: z.string().uuid(),
  category: categorySchema,
  difficulty: difficultySchema.default(DEFAULT_QUIZ_DIFFICULTY),
  answers: z.array(checkAnswerSchema).length(QUIZ_QUESTION_COUNT),
});

export const letterSchema = z.object({
  quizAttemptId: z.string().min(1),
  sessionId: z.string().uuid(),
  nickname: z
    .string()
    .trim()
    .max(12)
    .optional()
    .transform((value) => value || "익명"),
  content: z.string().trim().min(50, "편지는 50자 이상 작성해 주세요."),
  aiDraftUsed: z.boolean().default(false),
  relatedCategory: categorySchema,
});

export const adminLoginSchema = z.object({
  secret: z.string().min(1).max(200),
});
export const adminModerationSchema = z.object({
  letterId: z.string().min(1),
  action: z.enum(["approve", "hide", "reject"]),
});
