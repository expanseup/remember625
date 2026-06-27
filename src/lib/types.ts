export const categories = [
  "mixed",
  "battle",
  "person",
  "chronology",
  "un",
  "memorial",
] as const;
export const difficulties = ["normal"] as const;
export type QuizCategory = (typeof categories)[number];
export type QuizDifficulty = (typeof difficulties)[number];

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceTitle?: string | null;
  sourceUrl?: string | null;
}

export type PublicQuizQuestion = Omit<QuizQuestion, "correctAnswerIndex">;

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  category?: QuizCategory;
}

export interface QuizAttempt {
  id: string;
  sessionId: string;
  clientRunId: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  score: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  completedAt: string;
  createdAt: string;
}

export type ModerationStatus = "approved" | "pending" | "hidden" | "rejected";

export interface Letter {
  id: string;
  quizAttemptId: string | null;
  sessionId: string;
  nickname: string;
  content: string;
  aiDraftUsed: boolean;
  relatedCategory: QuizCategory | null;
  moderationStatus: ModerationStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
